import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { type Express } from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from 'dotenv';
import { registerRoutes } from '../server/routes';
import { serveStatic } from '../server/vite';

// Load environment variables
dotenv.config();

// Choose storage type
const STORAGE_TYPE = process.env.STORAGE_TYPE || 'simple';

// Cache the Express app instance
let app: Express | null = null;

async function getApp(): Promise<Express> {
  if (app) {
    return app;
  }

  // Initialize Express app
  const expressApp = express();
  expressApp.use(cookieParser());
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: false }));

  // Session configuration for serverless
  // Use MongoDB store if MongoDB is available, otherwise use memory store
  const sessionConfig: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // Always use secure cookies in production (Vercel uses HTTPS)
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax', // Use 'lax' for same-origin requests
    },
  };

  // If using MongoDB, use MongoDB session store
  if (STORAGE_TYPE === 'mongodb' && process.env.MONGODB_URI) {
    try {
      // Connect to MongoDB first to ensure connection is ready
      const { connectToDatabase } = await import('../server/mongodb');
      await connectToDatabase();
      
      sessionConfig.store = MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        touchAfter: 24 * 3600, // lazy session update
      });
      console.log("✅ Using MongoDB session store");
    } catch (error: any) {
      console.warn("⚠️  Could not setup MongoDB session store, using memory store:", error.message);
    }
  }

  expressApp.use(session(sessionConfig));

  // Ensure MongoDB connection is established (if not already done above)
  if (STORAGE_TYPE === 'mongodb') {
    try {
      const { connectToDatabase } = await import('../server/mongodb');
      await connectToDatabase();
      console.log("✅ MongoDB connected for serverless function");
    } catch (error: any) {
      console.error("❌ Failed to connect to MongoDB:", error.message);
      // Don't exit in serverless - let the request handle the error
    }
  }

  // Auto-create admin user if needed (only on first run)
  try {
    const storageModule = STORAGE_TYPE === 'mongodb' 
      ? await import('../server/storage.mongodb')
      : await import('../server/storage.simple');
    const storage = storageModule.storage;
    const bcrypt = await import('bcryptjs');
    const adminUser = await storage.getUserByUsername('admin');
    if (!adminUser) {
      const hashedPassword = await bcrypt.default.hash('Atharv@1136', 10);
      await storage.createUser({
        username: 'admin',
        password: hashedPassword,
      });
      console.log('✅ Admin user created automatically');
    }
  } catch (error) {
    console.warn('⚠️  Could not auto-create admin user:', error);
  }

  // Register all routes
  await registerRoutes(expressApp);

  // In Vercel, static files are served by Vercel's static hosting
  // Only serve static files if we're running locally
  if (process.env.VERCEL !== '1') {
    serveStatic(expressApp);
  } else {
    // For Vercel, serve index.html for non-API routes
    expressApp.use('*', (req, res) => {
      // If it's not an API route, it should be handled by Vercel's static hosting
      // But if we get here, serve a simple response
      if (!req.path.startsWith('/api')) {
        res.status(404).json({ message: 'Not found' });
      }
    });
  }

  // Error handler
  expressApp.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ message });
  });

  app = expressApp;
  return app;
}

// Vercel serverless function handler
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    
    // Ensure MongoDB connection is ready before handling request
    if (process.env.STORAGE_TYPE === 'mongodb' && process.env.MONGODB_URI) {
      try {
        const { connectToDatabase } = await import('../server/mongodb');
        await connectToDatabase();
        console.log('✅ MongoDB connection ready');
      } catch (dbError: any) {
        console.error('❌ MongoDB connection error in handler:', dbError.message);
        console.error('Stack:', dbError.stack);
        // Continue anyway - getApp() will handle reconnection
      }
    }

    const expressApp = await getApp();
    
    // Convert Vercel request/response to Express format
    return new Promise<void>((resolve, reject) => {
      // Set timeout for the request (Vercel has 10s timeout for Hobby, 60s for Pro)
      const timeout = setTimeout(() => {
        if (!res.headersSent) {
          res.status(504).json({ 
            message: 'Request timeout',
            error: 'The request took too long to process'
          });
        }
        reject(new Error('Request timeout'));
      }, 9000); // 9 seconds to leave buffer for Vercel's 10s limit

      // Handle the request through Express
      expressApp(req as any, res as any, (err: any) => {
        clearTimeout(timeout);
        if (err) {
          console.error('❌ Express error:', err.message || err);
          console.error('Stack:', err.stack);
          if (!res.headersSent) {
            res.status(err.status || err.statusCode || 500).json({ 
              message: err.message || 'Internal Server Error',
              error: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
          }
          resolve(); // Don't reject, just resolve to prevent unhandled rejection
        } else {
          resolve();
        }
      });
    });
  } catch (error: any) {
    console.error('❌ Serverless function error:', error.message || error);
    console.error('Stack:', error.stack);
    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Internal Server Error',
        error: error.message || 'An unexpected error occurred'
      });
    }
  }
}


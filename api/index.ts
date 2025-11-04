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

  try {
    console.log('🔄 Initializing Express app...');
    
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
        console.log('🔄 Setting up MongoDB session store...');
        // Connect to MongoDB first to ensure connection is ready
        const { connectToDatabase } = await import('../server/mongodb');
        await connectToDatabase();
        
        sessionConfig.store = MongoStore.create({
          mongoUrl: process.env.MONGODB_URI!,
          touchAfter: 24 * 3600, // lazy session update
        });
        console.log("✅ Using MongoDB session store");
      } catch (error: any) {
        console.warn("⚠️  Could not setup MongoDB session store, using memory store:", error.message);
        console.warn("   Stack:", error.stack);
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
        console.error("   Stack:", error.stack);
        // Don't exit in serverless - let the request handle the error
      }
    }

    // Auto-create admin user if needed (only on first run)
    try {
      console.log('🔄 Checking for admin user...');
      const storageModule = STORAGE_TYPE === 'mongodb' 
        ? await import('../server/storage.mongodb')
        : await import('../server/storage.simple');
      const storage = storageModule.storage;
      const bcrypt = await import('bcryptjs');
      const adminUser = await storage.getUserByUsername('admin');
      if (!adminUser) {
        console.log('🔄 Creating admin user...');
        const hashedPassword = await bcrypt.default.hash('Atharv@1136', 10);
        await storage.createUser({
          username: 'admin',
          password: hashedPassword,
        });
        console.log('✅ Admin user created automatically');
      } else {
        console.log('✅ Admin user already exists');
      }
    } catch (error: any) {
      console.warn('⚠️  Could not auto-create admin user:', error.message);
      console.warn('   Stack:', error.stack);
    }

    // Register all routes
    console.log('🔄 Registering routes...');
    await registerRoutes(expressApp);
    console.log('✅ Routes registered');

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
      console.error('❌ Express error handler:', err.message || err);
      console.error('   Stack:', err.stack);
      const status = err.status || err.statusCode || 500;
      const message = err.message || 'Internal Server Error';
      if (!res.headersSent) {
        res.status(status).json({ message });
      }
    });

    app = expressApp;
    console.log('✅ Express app initialized successfully');
    return app;
  } catch (error: any) {
    console.error('❌ Failed to initialize Express app:', error.message || error);
    console.error('   Stack:', error.stack);
    throw error;
  }
}

// Vercel serverless function handler
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Wrapper to ensure we always send a response
  const sendErrorResponse = (status: number, message: string, error?: any) => {
    if (!res.headersSent) {
      try {
        res.status(status).json({ 
          message,
          ...(process.env.NODE_ENV === 'development' && error ? { error: error.message, stack: error.stack } : {})
        });
      } catch (e) {
        console.error('Failed to send error response:', e);
      }
    }
  };

  try {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url || req.path}`);
    console.log('Environment check:', {
      STORAGE_TYPE: process.env.STORAGE_TYPE || 'not set',
      MONGODB_URI: process.env.MONGODB_URI ? 'set' : 'not set',
      SESSION_SECRET: process.env.SESSION_SECRET ? 'set' : 'not set',
      VERCEL: process.env.VERCEL || 'not set'
    });
    
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

    let expressApp: Express;
    try {
      expressApp = await getApp();
    } catch (appError: any) {
      console.error('❌ Failed to get Express app:', appError.message);
      console.error('Stack:', appError.stack);
      return sendErrorResponse(500, 'Failed to initialize application', appError);
    }
    
    // Convert Vercel request/response to Express format
    return new Promise<void>((resolve) => {
      let resolved = false;
      
      // Set timeout for the request (Vercel has 10s timeout for Hobby, 60s for Pro)
      const timeout = setTimeout(() => {
        if (!resolved && !res.headersSent) {
          resolved = true;
          sendErrorResponse(504, 'Request timeout');
          resolve();
        }
      }, 9000); // 9 seconds to leave buffer for Vercel's 10s limit

      // Handle the request through Express
      try {
        expressApp(req as any, res as any, (err: any) => {
          clearTimeout(timeout);
          if (resolved) return;
          
          if (err) {
            console.error('❌ Express error:', err.message || err);
            console.error('Stack:', err.stack);
            if (!res.headersSent) {
              sendErrorResponse(
                err.status || err.statusCode || 500,
                err.message || 'Internal Server Error',
                err
              );
            }
          }
          resolved = true;
          resolve();
        });
      } catch (expressError: any) {
        clearTimeout(timeout);
        if (!resolved && !res.headersSent) {
          resolved = true;
          console.error('❌ Express handler error:', expressError.message);
          console.error('Stack:', expressError.stack);
          sendErrorResponse(500, 'Request processing failed', expressError);
        }
        resolve();
      }
    });
  } catch (error: any) {
    console.error('❌ Serverless function error:', error.message || error);
    console.error('Stack:', error.stack);
    sendErrorResponse(500, 'Internal Server Error', error);
  }
}


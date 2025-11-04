import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI not found in environment variables");
  throw new Error('MONGODB_URI environment variable is required');
}

let cachedConnection: mongoose.Connection | null = null;

export async function connectToDatabase(): Promise<mongoose.Connection> {
  if (mongoose.connection.readyState === 1) {
    cachedConnection = mongoose.connection;
    return mongoose.connection;
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    if (!uri) {
      throw new Error('MONGODB_URI is not defined');
    }
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 1,
      minPoolSize: 0,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    
    cachedConnection = mongoose.connection;
    return mongoose.connection;
  } catch (error: any) {
    console.error("❌ MongoDB Connection Error:", error.message);
    throw error;
  }
}


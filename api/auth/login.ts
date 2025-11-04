import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { getStorage } from '../lib/storage';
import { getId } from '../lib/utils';
import { connectToDatabase } from '../lib/mongodb';


export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Connect to MongoDB if using it
    if (process.env.STORAGE_TYPE === 'mongodb') {
      await connectToDatabase();
    }

    const storage = await getStorage();
    const user = await storage.getUserByUsername(username);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userId = getId(user);
    
    // Set session cookie (encode JSON for cookie)
    const sessionData = encodeURIComponent(JSON.stringify({ userId, username: user.username }));
    res.setHeader('Set-Cookie', `session=${sessionData}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`);

    res.json({ message: "Login successful", user: { id: userId, username: user.username } });
  } catch (error: any) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
}


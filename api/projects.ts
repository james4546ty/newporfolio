import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getStorage } from '../lib/storage';
import { normalizeItem } from '../lib/utils';
import { connectToDatabase } from '../lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    if (process.env.STORAGE_TYPE === 'mongodb') {
      await connectToDatabase();
    }

    const storage = await getStorage();
    const projects = await storage.getAllProjects();
    
    res.json(projects.map((project: any) => normalizeItem(project)));
  } catch (error: any) {
    console.error('❌ Error fetching projects:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
}


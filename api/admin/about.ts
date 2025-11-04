import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getStorage } from '../lib/storage';
import { normalizeItem } from '../lib/utils';
import { requireAuth } from '../lib/auth';
import { connectToDatabase } from '../lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const auth = await requireAuth(req, res);
    if (!auth) return;

    if (process.env.STORAGE_TYPE === 'mongodb') {
      await connectToDatabase();
    }

    const storage = await getStorage();
    const aboutData = {
      bio: req.body.bio,
      education: req.body.education,
      languages: req.body.languages,
      skills: Array.isArray(req.body.skills) ? req.body.skills : [],
      tools: Array.isArray(req.body.tools) ? req.body.tools : [],
    };
    
    const about = await storage.upsertAboutData(aboutData);
    res.json(normalizeItem(about));
  } catch (error: any) {
    console.error('❌ Error updating about:', error);
    res.status(400).json({ message: error.message || 'Internal server error' });
  }
}


import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getStorage } from '../lib/storage';
import { normalizeItem } from '../lib/utils';
import { requireAuth } from '../lib/auth';
import { connectToDatabase } from '../lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = await requireAuth(req, res);
  if (!auth) return;

  if (process.env.STORAGE_TYPE === 'mongodb') {
    await connectToDatabase();
  }

  const storage = await getStorage();

  if (req.method === 'POST') {
    try {
      const projectData = {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        alt: req.body.alt,
        technologies: req.body.technologies || [],
        liveUrl: req.body.liveUrl || null,
        githubUrl: req.body.githubUrl,
        primaryColor: req.body.primaryColor || 'blue',
        displayOrder: parseInt(req.body.displayOrder) || 0,
      };

      const project = await storage.createProject(projectData);
      res.json(normalizeItem(project));
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Failed to create project' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}


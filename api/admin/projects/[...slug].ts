import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getStorage } from '../../lib/storage';
import { normalizeItem } from '../../lib/utils';
import { requireAuth } from '../../lib/auth';
import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = await requireAuth(req, res);
  if (!auth) return;

  if (process.env.STORAGE_TYPE === 'mongodb') {
    await connectToDatabase();
  }

  const storage = await getStorage();
  const slug = req.query.slug as string[] | undefined;
  const id = slug && slug.length > 0 ? slug[0] : undefined;

  if (req.method === 'POST' && !id) {
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
  } else if (req.method === 'PUT' && id) {
    try {
      const updateData: any = {
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

      const project = await storage.updateProject(id, updateData);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(normalizeItem(project));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  } else if (req.method === 'DELETE' && id) {
    try {
      const success = await storage.deleteProject(id);
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ message: "Project deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}


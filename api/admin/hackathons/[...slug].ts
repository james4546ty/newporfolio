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
      const hackathonData = {
        name: req.body.name,
        role: req.body.role,
        organizer: req.body.organizer,
        side: req.body.side || "left",
        delay: parseInt(req.body.delay) || 0,
        certificateUrl: req.body.certificateUrl || null,
        displayOrder: parseInt(req.body.displayOrder) || 0,
      };

      const hackathon = await storage.createHackathon(hackathonData);
      res.json(normalizeItem(hackathon));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  } else if (req.method === 'PUT' && id) {
    try {
      const updateData: any = {
        name: req.body.name,
        role: req.body.role,
        organizer: req.body.organizer,
        side: req.body.side || 'left',
        delay: parseInt(req.body.delay) || 0,
        certificateUrl: req.body.certificateUrl || null,
        displayOrder: parseInt(req.body.displayOrder) || 0,
      };

      const hackathon = await storage.updateHackathon(id, updateData);
      if (!hackathon) {
        return res.status(404).json({ message: "Hackathon not found" });
      }
      res.json(normalizeItem(hackathon));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  } else if (req.method === 'DELETE' && id) {
    try {
      const success = await storage.deleteHackathon(id);
      if (!success) {
        return res.status(404).json({ message: "Hackathon not found" });
      }
      res.json({ message: "Hackathon deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}


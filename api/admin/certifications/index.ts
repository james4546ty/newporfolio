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
      const certImageUrl = req.body.certImageUrl || "";
      if (!certImageUrl) {
        return res.status(400).json({ message: "Certificate image URL is required" });
      }

      const certData = {
        company: req.body.company,
        title: req.body.title,
        issued: req.body.issued,
        platform: req.body.platform,
        icon: req.body.icon || "fas fa-certificate",
        cardColor: req.body.cardColor || "bg-blue-500",
        buttonColor: req.body.buttonColor || "bg-blue-600",
        titleColor: req.body.titleColor || "text-white",
        textColor: req.body.textColor || "text-white",
        certImageUrl,
        credentialUrl: req.body.credentialUrl || null,
        displayOrder: parseInt(req.body.displayOrder) || 0,
      };

      const cert = await storage.createCertification(certData);
      res.json(normalizeItem(cert));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}


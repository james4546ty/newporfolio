import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAuth } from '../lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const auth = await requireAuth(req, res);
  if (!auth) return;

  res.json({ user: { id: auth.userId, username: auth.username } });
}


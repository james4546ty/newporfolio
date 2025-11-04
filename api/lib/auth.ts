import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getStorage } from './storage';

export interface AuthenticatedRequest extends VercelRequest {
  userId?: string;
  username?: string;
}

export async function requireAuth(
  req: VercelRequest,
  res: VercelResponse
): Promise<{ userId: string; username: string } | null> {
  // Parse session from cookie
  const sessionCookie = req.cookies?.session;
  
  if (!sessionCookie) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }

  try {
    const session = JSON.parse(decodeURIComponent(sessionCookie));
    if (!session.userId || !session.username) {
      res.status(401).json({ message: "Unauthorized" });
      return null;
    }
    return { userId: session.userId, username: session.username };
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }
}


import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { requireAuth, type AuthenticatedRequest } from "./auth";

// Load environment variables (in case routes.ts is loaded before index.ts)
dotenv.config();

// Choose storage based on environment variable
const STORAGE_TYPE = process.env.STORAGE_TYPE || 'simple';

// Lazy load storage to avoid top-level await issues in serverless
let storageCache: any = null;

async function getStorage() {
  if (storageCache) {
    return storageCache;
  }

  try {
    console.log(`\n📦 routes.ts: Loading storage module`);
    console.log(`   STORAGE_TYPE from env: ${process.env.STORAGE_TYPE || 'undefined'}`);
    console.log(`   Using STORAGE_TYPE: ${STORAGE_TYPE}`);

    const storageModule = STORAGE_TYPE === 'mongodb' 
      ? await import("./storage.mongodb")
      : await import("./storage.simple");
    storageCache = storageModule.storage;

    console.log(`✅ routes.ts: Storage module loaded (type: ${STORAGE_TYPE})`);
    console.log(`   Storage methods available:`, {
      getUserByUsername: typeof storageCache.getUserByUsername === 'function',
      createUser: typeof storageCache.createUser === 'function',
      getAllProjects: typeof storageCache.getAllProjects === 'function'
    });

    return storageCache;
  } catch (error: any) {
    console.error('❌ Error loading storage module:', error);
    throw error;
  }
}

// Remove the Proxy - we'll use getStorage() directly everywhere

// Helper function to normalize data from both storage types
function normalizeItem(item: any) {
  if (!item) return null;
  if ('toObject' in item && typeof item.toObject === 'function') {
    // MongoDB document
    return { ...item.toObject(), id: item._id.toString() };
  }
  // Simple storage (already has id)
  return item;
}

function getId(item: any): string {
  if ('_id' in item) {
    return item._id.toString();
  }
  return item.id || item._id?.toString() || '';
}

// Configure multer for file uploads
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storageConfig,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only image files and PDFs are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize storage first (cache it for subsequent requests)
  await getStorage();

  // Health check
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // Authentication routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      console.log('🔐 Login attempt:', { username, passwordProvided: !!password });
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      // Get storage instance (it's already cached, so this is fast)
      const storageInstance = await getStorage();
      const user = await storageInstance.getUserByUsername(username);
      console.log('👤 User lookup result:', user ? 'Found user' : 'User not found');
      
      if (!user) {
        console.log('❌ User not found:', username);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log('🔑 Comparing password...');
      const isValid = await bcrypt.compare(password, user.password);
      console.log('🔑 Password comparison result:', isValid);
      
      if (!isValid) {
        console.log('❌ Invalid password for user:', username);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const userId = getId(user);
      console.log('✅ Login successful for user:', username, 'ID:', userId);
      
      (req.session as any).userId = userId;
      (req.session as any).username = user.username;
      req.session.save((err) => {
        if (err) {
          console.error('❌ Session save error:', err);
        }
      });

      res.json({ message: "Login successful", user: { id: userId, username: user.username } });
    } catch (error: any) {
      console.error('❌ Login error:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", requireAuth, (req: AuthenticatedRequest, res: Response) => {
    res.json({ user: { id: req.userId, username: req.username } });
  });

  // Public data routes (no auth required)
  app.get("/api/about", async (req: Request, res: Response) => {
    try {
      const storageInstance = await getStorage();
      const about = await storageInstance.getAboutData();
      if (!about) {
        return res.json(null);
      }
      // Handle both MongoDB (has _id) and simple storage (has id)
      const aboutData = 'toObject' in about 
        ? { ...about.toObject(), id: about._id.toString() }
        : { ...about };
      res.json(aboutData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/certifications", async (req: Request, res: Response) => {
    try {
      const storageInstance = await getStorage();
      const certs = await storageInstance.getAllCertifications();
      res.json(certs.map(cert => {
        if ('toObject' in cert) {
          return { ...cert.toObject(), id: cert._id.toString() };
        }
        return cert;
      }));
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/hackathons", async (req: Request, res: Response) => {
    try {
      const storageInstance = await getStorage();
      const hackathons = await storageInstance.getAllHackathons();
      res.json(hackathons.map(hack => {
        if ('toObject' in hack) {
          return { ...hack.toObject(), id: hack._id.toString() };
        }
        return hack;
      }));
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/projects", async (req: Request, res: Response) => {
    try {
      const storageInstance = await getStorage();
      const projects = await storageInstance.getAllProjects();
      res.json(projects.map(project => {
        if ('toObject' in project) {
          return { ...project.toObject(), id: project._id.toString() };
        }
        return project;
      }));
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin routes (require authentication)
  
  // About management
  app.put("/api/admin/about", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const storageInstance = await getStorage();
      const aboutData = {
        bio: req.body.bio,
        education: req.body.education,
        languages: req.body.languages,
        skills: Array.isArray(req.body.skills) ? req.body.skills : [],
        tools: Array.isArray(req.body.tools) ? req.body.tools : [],
      };
      const about = await storageInstance.upsertAboutData(aboutData);
      res.json(normalizeItem(about));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Certification management
  app.post(
    "/api/admin/certifications",
    requireAuth,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        // Accept Cloudinary URL from request body
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

        const storageInstance = await getStorage();
        const cert = await storageInstance.createCertification(certData);
        res.json(normalizeItem(cert));
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    }
  );

  app.put(
    "/api/admin/certifications/:id",
    requireAuth,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const id = req.params.id;
        const updateData: any = {
          company: req.body.company,
          title: req.body.title,
          issued: req.body.issued,
          platform: req.body.platform,
          icon: req.body.icon || 'fas fa-certificate',
          cardColor: req.body.cardColor || 'bg-blue-500',
          buttonColor: req.body.buttonColor || 'bg-blue-600',
          titleColor: req.body.titleColor || 'text-white',
          textColor: req.body.textColor || 'text-white',
          credentialUrl: req.body.credentialUrl || null,
          displayOrder: parseInt(req.body.displayOrder) || 0,
        };

        // Accept Cloudinary URL from request body
        if (req.body.certImageUrl) {
          updateData.certImageUrl = req.body.certImageUrl;
        } else {
          return res.status(400).json({ message: "Certificate image URL is required" });
        }

        const storageInstance = await getStorage();
        const cert = await storageInstance.updateCertification(id, updateData);
        if (!cert) {
          return res.status(404).json({ message: "Certification not found" });
        }
        res.json(normalizeItem(cert));
      } catch (error: any) {
        res.status(400).json({ message: error.message });
      }
    }
  );

  app.delete("/api/admin/certifications/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const storageInstance = await getStorage();
      const id = req.params.id;
      const success = await storageInstance.deleteCertification(id);
      if (!success) {
        return res.status(404).json({ message: "Certification not found" });
      }
      res.json({ message: "Certification deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Hackathon management
  app.post("/api/admin/hackathons", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
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

      const storageInstance = await getStorage();
      const hackathon = await storageInstance.createHackathon(hackathonData);
      res.json(normalizeItem(hackathon));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/admin/hackathons/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = req.params.id;
      const updateData: any = {
        name: req.body.name,
        role: req.body.role,
        organizer: req.body.organizer,
        side: req.body.side,
        delay: parseInt(req.body.delay) || 0,
        certificateUrl: req.body.certificateUrl || null,
        displayOrder: parseInt(req.body.displayOrder) || 0,
      };

      const storageInstance = await getStorage();
      const hackathon = await storageInstance.updateHackathon(id, updateData);
      if (!hackathon) {
        return res.status(404).json({ message: "Hackathon not found" });
      }
      res.json(normalizeItem(hackathon));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/hackathons/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = req.params.id;
      const storageInstance = await getStorage();
      const success = await storageInstance.deleteHackathon(id);
      if (!success) {
        return res.status(404).json({ message: "Hackathon not found" });
      }
      res.json({ message: "Hackathon deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Project management
  app.post("/api/admin/projects", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      console.log('Received project data:', req.body);
      
      // Validate required fields
      if (!req.body.title || !req.body.description || !req.body.imageUrl || !req.body.alt || !req.body.githubUrl) {
        return res.status(400).json({ 
          message: 'Missing required fields: title, description, imageUrl, alt, and githubUrl are required' 
        });
      }

      const projectData = {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        alt: req.body.alt,
        technologies: Array.isArray(req.body.technologies) ? req.body.technologies : [],
        liveUrl: req.body.liveUrl || null,
        githubUrl: req.body.githubUrl,
        primaryColor: req.body.primaryColor || 'blue',
        displayOrder: parseInt(req.body.displayOrder) || 0,
      };

      console.log('Creating project with data:', projectData);
      const storageInstance = await getStorage();
      const project = await storageInstance.createProject(projectData);
      console.log('Project created successfully:', project);
      res.json(normalizeItem(project));
    } catch (error: any) {
      console.error('Error creating project:', error);
      res.status(400).json({ message: error.message || 'Failed to create project' });
    }
  });

  app.put("/api/admin/projects/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = req.params.id;
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

      const storageInstance = await getStorage();
      const project = await storageInstance.updateProject(id, updateData);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(normalizeItem(project));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/projects/:id", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = req.params.id;
      const storageInstance = await getStorage();
      const success = await storageInstance.deleteProject(id);
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ message: "Project deleted" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Create admin user (one-time setup, should be protected in production)
  app.post("/api/admin/create-user", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const storageInstance = await getStorage();
      const existingUser = await storageInstance.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storageInstance.createUser({
        username,
        password: hashedPassword,
      });

      res.json({ message: "User created", user: { id: getId(user), username: user.username } });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

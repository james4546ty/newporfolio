// Simple in-memory storage for testing admin panel without database
// This is temporary - switch to MongoDB when ready

interface User {
  id: string;
  username: string;
  password: string;
}

interface AboutData {
  id: string;
  bio: string;
  education: string;
  languages: string;
  skills: string[];
  tools: string[];
  updatedAt: Date;
}

interface Certification {
  id: string;
  company: string;
  title: string;
  issued: string;
  platform: string;
  icon: string;
  cardColor: string;
  buttonColor: string;
  titleColor: string;
  textColor: string;
  certImageUrl: string;
  credentialUrl?: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Hackathon {
  id: string;
  name: string;
  role: string;
  organizer: string;
  side: 'left' | 'right';
  delay: number;
  certificateUrl?: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  alt: string;
  technologies: Array<{ name: string; color: string }>;
  liveUrl?: string;
  githubUrl: string;
  primaryColor: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStorage {
  getUser(id: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  createUser(user: { username: string; password: string }): Promise<User>;

  getAboutData(): Promise<AboutData | null>;
  upsertAboutData(data: {
    bio: string;
    education: string;
    languages: string;
    skills: string[];
    tools: string[];
  }): Promise<AboutData>;

  getAllCertifications(): Promise<Certification[]>;
  getCertification(id: string): Promise<Certification | null>;
  createCertification(cert: Partial<Certification>): Promise<Certification>;
  updateCertification(id: string, cert: Partial<Certification>): Promise<Certification | null>;
  deleteCertification(id: string): Promise<boolean>;

  getAllHackathons(): Promise<Hackathon[]>;
  getHackathon(id: string): Promise<Hackathon | null>;
  createHackathon(hackathon: Partial<Hackathon>): Promise<Hackathon>;
  updateHackathon(id: string, hackathon: Partial<Hackathon>): Promise<Hackathon | null>;
  deleteHackathon(id: string): Promise<boolean>;

  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | null>;
  createProject(project: Partial<Project>): Promise<Project>;
  updateProject(id: string, project: Partial<Project>): Promise<Project | null>;
  deleteProject(id: string): Promise<boolean>;
}

export class SimpleStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private aboutData: AboutData | null = null;
  private certifications: Map<string, Certification> = new Map();
  private hackathons: Map<string, Hackathon> = new Map();
  private projects: Map<string, Project> = new Map();
  private userIdCounter = 1;
  private certIdCounter = 1;
  private hackIdCounter = 1;
  private projectIdCounter = 1;

  // User methods
  async getUser(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(u => u.username === username);
    return user || null;
  }

  async createUser(user: { username: string; password: string }): Promise<User> {
    const id = String(this.userIdCounter++);
    const newUser: User = { id, ...user };
    this.users.set(id, newUser);
    return newUser;
  }

  // About methods
  async getAboutData(): Promise<AboutData | null> {
    return this.aboutData;
  }

  async upsertAboutData(data: {
    bio: string;
    education: string;
    languages: string;
    skills: string[];
    tools: string[];
  }): Promise<AboutData> {
    if (this.aboutData) {
      this.aboutData = { ...this.aboutData, ...data, updatedAt: new Date() };
    } else {
      this.aboutData = {
        id: '1',
        ...data,
        updatedAt: new Date(),
      };
    }
    return this.aboutData;
  }

  // Certification methods
  async getAllCertifications(): Promise<Certification[]> {
    return Array.from(this.certifications.values())
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getCertification(id: string): Promise<Certification | null> {
    return this.certifications.get(id) || null;
  }

  async createCertification(cert: Partial<Certification>): Promise<Certification> {
    const id = String(this.certIdCounter++);
    const newCert: Certification = {
      id,
      company: cert.company || '',
      title: cert.title || '',
      issued: cert.issued || '',
      platform: cert.platform || '',
      icon: cert.icon || 'fas fa-certificate',
      cardColor: cert.cardColor || 'bg-blue-500',
      buttonColor: cert.buttonColor || 'bg-white',
      titleColor: cert.titleColor || 'text-white',
      textColor: cert.textColor || 'text-blue-100',
      certImageUrl: cert.certImageUrl || '',
      credentialUrl: cert.credentialUrl,
      displayOrder: cert.displayOrder || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.certifications.set(id, newCert);
    return newCert;
  }

  async updateCertification(id: string, cert: Partial<Certification>): Promise<Certification | null> {
    const existing = this.certifications.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...cert, updatedAt: new Date() };
    this.certifications.set(id, updated);
    return updated;
  }

  async deleteCertification(id: string): Promise<boolean> {
    return this.certifications.delete(id);
  }

  // Hackathon methods
  async getAllHackathons(): Promise<Hackathon[]> {
    return Array.from(this.hackathons.values())
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getHackathon(id: string): Promise<Hackathon | null> {
    return this.hackathons.get(id) || null;
  }

  async createHackathon(hackathon: Partial<Hackathon>): Promise<Hackathon> {
    const id = String(this.hackIdCounter++);
    const newHack: Hackathon = {
      id,
      name: hackathon.name || '',
      role: hackathon.role || '',
      organizer: hackathon.organizer || '',
      side: hackathon.side || 'left',
      delay: hackathon.delay || 0,
      certificateUrl: hackathon.certificateUrl,
      displayOrder: hackathon.displayOrder || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.hackathons.set(id, newHack);
    return newHack;
  }

  async updateHackathon(id: string, hackathon: Partial<Hackathon>): Promise<Hackathon | null> {
    const existing = this.hackathons.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...hackathon, updatedAt: new Date() };
    this.hackathons.set(id, updated);
    return updated;
  }

  async deleteHackathon(id: string): Promise<boolean> {
    return this.hackathons.delete(id);
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values())
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  async getProject(id: string): Promise<Project | null> {
    return this.projects.get(id) || null;
  }

  async createProject(project: Partial<Project>): Promise<Project> {
    const id = String(this.projectIdCounter++);
    const newProject: Project = {
      id,
      title: project.title || '',
      description: project.description || '',
      imageUrl: project.imageUrl || '',
      alt: project.alt || '',
      technologies: project.technologies || [],
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl || '',
      primaryColor: project.primaryColor || 'blue',
      displayOrder: project.displayOrder || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, newProject);
    return newProject;
  }

  async updateProject(id: string, project: Partial<Project>): Promise<Project | null> {
    const existing = this.projects.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...project, updatedAt: new Date() };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }
}

export const storage = new SimpleStorage();


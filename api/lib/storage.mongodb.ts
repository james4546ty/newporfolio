import mongoose from 'mongoose';
import { connectToDatabase } from './mongodb';
import {
  User,
  type IUser,
} from './models/user.model';
import {
  AboutData,
  type IAboutData,
} from './models/about.model';
import {
  Certification,
  type ICertification,
} from './models/certification.model';
import {
  Hackathon,
  type IHackathon,
} from './models/hackathon.model';
import {
  Project,
  type IProject,
} from './models/project.model';

export interface IStorage {
  getUser(id: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  createUser(user: { username: string; password: string }): Promise<IUser>;
  getAboutData(): Promise<IAboutData | null>;
  upsertAboutData(data: {
    bio: string;
    education: string;
    languages: string;
    skills: string[];
    tools: string[];
  }): Promise<IAboutData>;
  getAllCertifications(): Promise<ICertification[]>;
  getCertification(id: string): Promise<ICertification | null>;
  createCertification(cert: Partial<ICertification>): Promise<ICertification>;
  updateCertification(id: string, cert: Partial<ICertification>): Promise<ICertification | null>;
  deleteCertification(id: string): Promise<boolean>;
  getAllHackathons(): Promise<IHackathon[]>;
  getHackathon(id: string): Promise<IHackathon | null>;
  createHackathon(hackathon: Partial<IHackathon>): Promise<IHackathon>;
  updateHackathon(id: string, hackathon: Partial<IHackathon>): Promise<IHackathon | null>;
  deleteHackathon(id: string): Promise<boolean>;
  getAllProjects(): Promise<IProject[]>;
  getProject(id: string): Promise<IProject | null>;
  createProject(project: Partial<IProject>): Promise<IProject>;
  updateProject(id: string, project: Partial<IProject>): Promise<IProject | null>;
  deleteProject(id: string): Promise<boolean>;
}

export class MongoDBStorage implements IStorage {
  async getUser(id: string): Promise<IUser | null> {
    await connectToDatabase();
    return await User.findById(id);
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    await connectToDatabase();
    return await User.findOne({ username: username.trim() });
  }

  async createUser(user: { username: string; password: string }): Promise<IUser> {
    await connectToDatabase();
    const newUser = new User(user);
    return await newUser.save();
  }

  async getAboutData(): Promise<IAboutData | null> {
    await connectToDatabase();
    return await AboutData.findOne();
  }

  async upsertAboutData(data: {
    bio: string;
    education: string;
    languages: string;
    skills: string[];
    tools: string[];
  }): Promise<IAboutData> {
    await connectToDatabase();
    const existing = await this.getAboutData();
    if (existing) {
      Object.assign(existing, data, { updatedAt: new Date() });
      return await existing.save();
    } else {
      const aboutData = new AboutData(data);
      return await aboutData.save();
    }
  }

  async getAllCertifications(): Promise<ICertification[]> {
    await connectToDatabase();
    return await Certification.find().sort({ displayOrder: 1 });
  }

  async getCertification(id: string): Promise<ICertification | null> {
    await connectToDatabase();
    return await Certification.findById(id);
  }

  async createCertification(cert: Partial<ICertification>): Promise<ICertification> {
    await connectToDatabase();
    const newCert = new Certification(cert);
    return await newCert.save();
  }

  async updateCertification(id: string, cert: Partial<ICertification>): Promise<ICertification | null> {
    await connectToDatabase();
    return await Certification.findByIdAndUpdate(id, { ...cert, updatedAt: new Date() }, { new: true });
  }

  async deleteCertification(id: string): Promise<boolean> {
    await connectToDatabase();
    const result = await Certification.findByIdAndDelete(id);
    return result !== null;
  }

  async getAllHackathons(): Promise<IHackathon[]> {
    await connectToDatabase();
    return await Hackathon.find().sort({ displayOrder: 1 });
  }

  async getHackathon(id: string): Promise<IHackathon | null> {
    await connectToDatabase();
    return await Hackathon.findById(id);
  }

  async createHackathon(hackathon: Partial<IHackathon>): Promise<IHackathon> {
    await connectToDatabase();
    const newHackathon = new Hackathon(hackathon);
    return await newHackathon.save();
  }

  async updateHackathon(id: string, hackathon: Partial<IHackathon>): Promise<IHackathon | null> {
    await connectToDatabase();
    return await Hackathon.findByIdAndUpdate(id, { ...hackathon, updatedAt: new Date() }, { new: true });
  }

  async deleteHackathon(id: string): Promise<boolean> {
    await connectToDatabase();
    const result = await Hackathon.findByIdAndDelete(id);
    return result !== null;
  }

  async getAllProjects(): Promise<IProject[]> {
    await connectToDatabase();
    return await Project.find().sort({ displayOrder: 1 });
  }

  async getProject(id: string): Promise<IProject | null> {
    await connectToDatabase();
    return await Project.findById(id);
  }

  async createProject(project: Partial<IProject>): Promise<IProject> {
    await connectToDatabase();
    const newProject = new Project(project);
    return await newProject.save();
  }

  async updateProject(id: string, project: Partial<IProject>): Promise<IProject | null> {
    await connectToDatabase();
    return await Project.findByIdAndUpdate(id, { ...project, updatedAt: new Date() }, { new: true });
  }

  async deleteProject(id: string): Promise<boolean> {
    await connectToDatabase();
    const result = await Project.findByIdAndDelete(id);
    return result !== null;
  }
}

export const storage = new MongoDBStorage();


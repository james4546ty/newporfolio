import dotenv from 'dotenv';

dotenv.config();

const STORAGE_TYPE = process.env.STORAGE_TYPE || 'simple';

let storageCache: any = null;

export async function getStorage() {
  if (storageCache) {
    return storageCache;
  }

  try {
    const storageModule = STORAGE_TYPE === 'mongodb' 
      ? await import('./storage.mongodb')
      : await import('./storage.simple');
    storageCache = storageModule.storage;
    return storageCache;
  } catch (error: any) {
    console.error('❌ Error loading storage module:', error);
    throw error;
  }
}


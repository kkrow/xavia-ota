import { StorageInterface } from './StorageInterface';
import { getLogger } from '../logger';

const logger = getLogger('StorageFactory');

export class StorageFactory {
  private static instance: StorageInterface;

  static getStorage(): StorageInterface {
    if (!StorageFactory.instance) {
      const storageType = process.env.BLOB_STORAGE_TYPE;
      if (storageType === 'supabase') {
        const { SupabaseStorage } = require('./SupabaseStorage') as typeof import('./SupabaseStorage');
        StorageFactory.instance = new SupabaseStorage();
      } else if (storageType === 'local') {
        const { LocalStorage } = require('./LocalStorage') as typeof import('./LocalStorage');
        StorageFactory.instance = new LocalStorage();
      } else if (storageType === 'gcs') {
        const { GCSStorage } = require('./GCSStorage') as typeof import('./GCSStorage');
        StorageFactory.instance = new GCSStorage();
      } else if (storageType === 's3') {
        const { S3Storage } = require('./S3Storage') as typeof import('./S3Storage');
        StorageFactory.instance = new S3Storage();
      } else {
        logger.error('Unsupported storage type', { storageType });
        throw new Error('Unsupported storage type');
      }
    }
    return StorageFactory.instance;
  }
}

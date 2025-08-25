import { type Bip, type Author, type Stats, type InsertBip } from "@shared/schema";
import { FileStorage } from "./file-storage";

export interface IStorage {
  getBips(): Promise<Bip[]>;
  getBip(number: number): Promise<Bip | undefined>;
  getBipsByAuthor(author: string): Promise<Bip[]>;
  getAuthors(): Promise<Author[]>;
  getStats(): Promise<Stats>;
  cacheBips(bips: Bip[]): Promise<void>;
  updateBip(bip: Bip): Promise<void>;
  getCacheTimestamp(): Promise<number | undefined>;
  setCacheTimestamp(timestamp: number): Promise<void>;
}

// Use FileStorage by default - Firestore for production
function createStorage(): IStorage {
  const useFirestore = process.env.USE_FIRESTORE === 'true' || process.env.NODE_ENV === 'production';

  if (useFirestore) {
    console.log('🔥 Using Firestore storage for persistent data');
    try {
      // Dynamically import Firestore to avoid loading dependencies when not needed
      const { FirestoreStorage } = require('./firestore-storage');
      return new FirestoreStorage();
    } catch (error) {
      console.warn('⚠️ Firestore not available, falling back to file storage:', error.message);
      return new FileStorage();
    }
  } else {
    console.log('📁 Using file storage (development)');
    return new FileStorage();
  }
}

// Export singleton instance
export const storage = createStorage();

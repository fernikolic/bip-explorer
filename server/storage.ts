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

// Use FileStorage by default - Firestore is opt-in via USE_FIRESTORE=true
function createStorage(): IStorage {
  const useFirestore = process.env.USE_FIRESTORE === 'true';

  if (useFirestore) {
    console.log('🔥 Firestore mode enabled - make sure Firebase credentials are configured');
    // Dynamically import Firestore to avoid loading dependencies when not needed
    const { FirestoreStorage } = require('./firestore-storage');
    return new FirestoreStorage();
  } else {
    console.log('📁 Using file storage (default)');
    return new FileStorage();
  }
}

// Export singleton instance
export const storage = createStorage();

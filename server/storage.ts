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

// Use FileStorage for persistent caching
export const storage = new FileStorage();

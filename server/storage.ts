import { type Bip, type Author, type Stats, type InsertBip } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private bips: Map<number, Bip> = new Map();
  private authors: Map<string, Author> = new Map();
  private cacheTimestamp: number | undefined;

  async getBips(): Promise<Bip[]> {
    return Array.from(this.bips.values()).sort((a, b) => a.number - b.number);
  }

  async getBip(number: number): Promise<Bip | undefined> {
    return this.bips.get(number);
  }

  async getBipsByAuthor(author: string): Promise<Bip[]> {
    return Array.from(this.bips.values()).filter(bip => 
      bip.authors.some(a => a.toLowerCase().includes(author.toLowerCase()))
    );
  }

  async getAuthors(): Promise<Author[]> {
    return Array.from(this.authors.values());
  }

  async getStats(): Promise<Stats> {
    const bips = Array.from(this.bips.values());
    const uniqueAuthors = new Set<string>();
    
    bips.forEach(bip => {
      bip.authors.forEach(author => uniqueAuthors.add(author));
    });

    return {
      totalBips: bips.length,
      finalBips: bips.filter(b => b.status === 'Final').length,
      activeBips: bips.filter(b => b.status === 'Active' || b.status === 'Draft').length,
      draftBips: bips.filter(b => b.status === 'Draft').length,
      contributors: uniqueAuthors.size,
      standardsTrack: bips.filter(b => b.type === 'Standards Track').length,
      informational: bips.filter(b => b.type === 'Informational').length,
      process: bips.filter(b => b.type === 'Process').length,
    };
  }

  async cacheBips(bips: Bip[]): Promise<void> {
    this.bips.clear();
    this.authors.clear();
    
    const authorMap = new Map<string, Set<number>>();

    bips.forEach(bip => {
      this.bips.set(bip.number, bip);
      
      bip.authors.forEach(author => {
        if (!authorMap.has(author)) {
          authorMap.set(author, new Set());
        }
        authorMap.get(author)!.add(bip.number);
      });
    });

    // Build author objects
    authorMap.forEach((bipNumbers, authorName) => {
      this.authors.set(authorName, {
        name: authorName,
        bipCount: bipNumbers.size,
        bips: Array.from(bipNumbers).sort((a, b) => a - b),
      });
    });
  }

  async getCacheTimestamp(): Promise<number | undefined> {
    return this.cacheTimestamp;
  }

  async setCacheTimestamp(timestamp: number): Promise<void> {
    this.cacheTimestamp = timestamp;
  }

  async updateBip(bip: Bip): Promise<void> {
    this.bips.set(bip.number, bip);
  }
}

export const storage = new MemStorage();

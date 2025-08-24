import { type Bip, type Author, type Stats } from "@shared/schema";
import { IStorage } from "./storage";
import * as fs from "fs/promises";
import * as path from "path";

const CACHE_DIR = path.join(process.cwd(), ".cache");
const BIPS_FILE = path.join(CACHE_DIR, "bips.json");
const AUTHORS_FILE = path.join(CACHE_DIR, "authors.json");
const TIMESTAMP_FILE = path.join(CACHE_DIR, "timestamp.json");

export class FileStorage implements IStorage {
  private bips: Map<number, Bip> = new Map();
  private authors: Map<string, Author> = new Map();
  private initialized = false;

  private async ensureCacheDir() {
    try {
      await fs.access(CACHE_DIR);
    } catch {
      await fs.mkdir(CACHE_DIR, { recursive: true });
    }
  }

  private async initialize() {
    if (this.initialized) return;
    
    await this.ensureCacheDir();
    
    try {
      // Try to load cached data
      const [bipsData, authorsData] = await Promise.all([
        fs.readFile(BIPS_FILE, 'utf-8').catch(() => '[]'),
        fs.readFile(AUTHORS_FILE, 'utf-8').catch(() => '[]')
      ]);
      
      const bips: Bip[] = JSON.parse(bipsData);
      const authors: Author[] = JSON.parse(authorsData);
      
      // Populate maps
      bips.forEach(bip => this.bips.set(bip.number, bip));
      authors.forEach(author => this.authors.set(author.name, author));
      
      console.log(`Loaded ${bips.length} BIPs from cache`);
    } catch (error) {
      console.log('No cached data found or cache corrupted, starting fresh');
    }
    
    this.initialized = true;
  }

  async getBips(): Promise<Bip[]> {
    await this.initialize();
    return Array.from(this.bips.values()).sort((a, b) => a.number - b.number);
  }

  async getBip(number: number): Promise<Bip | undefined> {
    await this.initialize();
    return this.bips.get(number);
  }

  async getBipsByAuthor(author: string): Promise<Bip[]> {
    await this.initialize();
    return Array.from(this.bips.values()).filter(bip => 
      bip.authors.some(a => a.toLowerCase().includes(author.toLowerCase()))
    );
  }

  async getAuthors(): Promise<Author[]> {
    await this.initialize();
    return Array.from(this.authors.values());
  }

  async getStats(): Promise<Stats> {
    await this.initialize();
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
    await this.initialize();
    
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

    // Persist to disk
    await this.ensureCacheDir();
    await Promise.all([
      fs.writeFile(BIPS_FILE, JSON.stringify(bips, null, 2)),
      fs.writeFile(AUTHORS_FILE, JSON.stringify(Array.from(this.authors.values()), null, 2))
    ]);
    
    console.log(`Cached ${bips.length} BIPs to disk`);
  }

  async getCacheTimestamp(): Promise<number | undefined> {
    await this.ensureCacheDir();
    try {
      const data = await fs.readFile(TIMESTAMP_FILE, 'utf-8');
      const { timestamp } = JSON.parse(data);
      return timestamp;
    } catch {
      return undefined;
    }
  }

  async setCacheTimestamp(timestamp: number): Promise<void> {
    await this.ensureCacheDir();
    await fs.writeFile(TIMESTAMP_FILE, JSON.stringify({ timestamp }));
  }

  async updateBip(bip: Bip): Promise<void> {
    await this.initialize();
    this.bips.set(bip.number, bip);
    
    // Update the persisted file
    const bips = Array.from(this.bips.values());
    await fs.writeFile(BIPS_FILE, JSON.stringify(bips, null, 2));
  }
}
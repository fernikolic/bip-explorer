import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Bip, bipSchema } from "@shared/schema";
import { generateELI5 } from "./openai";

const GITHUB_API_BASE = "https://api.github.com/repos/bitcoin/bips";
const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes

interface GitHubFile {
  name: string;
  download_url: string;
  sha: string;
}

async function fetchBipsFromGitHub(): Promise<Bip[]> {
  try {
    // Get list of BIP files
    const response = await fetch(`${GITHUB_API_BASE}/contents`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const files: GitHubFile[] = await response.json();
    const bipFiles = files.filter(file => 
      file.name.startsWith('bip-') && 
      (file.name.endsWith('.mediawiki') || file.name.endsWith('.md'))
    );

    const bips: Bip[] = [];
    
    // Process files in batches to avoid rate limiting
    for (let i = 0; i < bipFiles.length; i += 5) {
      const batch = bipFiles.slice(i, i + 5);
      const batchPromises = batch.map(async (file) => {
        try {
          const contentResponse = await fetch(file.download_url);
          if (!contentResponse.ok) return null;
          
          const content = await contentResponse.text();
          const bip = await parseBipContent(content, file.name);
          return bip;
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          return null;
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      bips.push(...batchResults.filter(Boolean) as Bip[]);
      
      // Add small delay between batches
      if (i + 5 < bipFiles.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return bips;
  } catch (error) {
    console.error('Error fetching BIPs from GitHub:', error);
    throw error;
  }
}

async function parseBipContent(content: string, filename: string): Promise<Bip | null> {
  try {
    const isMarkdown = filename.endsWith('.md');
    
    let metadata: any = {};
    let abstract = '';
    let fullContent = content;

    if (isMarkdown) {
      // Parse Markdown front matter
      const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (frontMatterMatch) {
        const frontMatter = frontMatterMatch[1];
        frontMatter.split('\n').forEach(line => {
          const [key, ...valueParts] = line.split(':');
          if (key && valueParts.length > 0) {
            const value = valueParts.join(':').trim();
            metadata[key.trim().toLowerCase()] = value;
          }
        });
      }
      
      // Extract abstract
      const abstractMatch = content.match(/## Abstract\s*\n\n([\s\S]*?)(?=\n## |\n# |$)/);
      if (abstractMatch) {
        abstract = abstractMatch[1].trim();
      }
    } else {
      // Parse MediaWiki format
      const lines = content.split('\n');
      let inPreamble = false;
      
      for (const line of lines) {
        if (line.includes('<pre>') || line.includes('BIP:')) {
          inPreamble = true;
          continue;
        }
        if (line.includes('</pre>') && inPreamble) {
          break;
        }
        if (inPreamble && line.includes(':')) {
          const [key, ...valueParts] = line.split(':');
          if (key && valueParts.length > 0) {
            const value = valueParts.join(':').trim();
            metadata[key.trim().toLowerCase()] = value;
          }
        }
      }
      
      // Extract abstract
      const abstractMatch = content.match(/==Abstract==\s*\n([\s\S]*?)(?=\n== |\n= |$)/);
      if (abstractMatch) {
        abstract = abstractMatch[1].trim();
      }
    }

    // Parse BIP number from filename
    const numberMatch = filename.match(/bip-(\d+)/);
    if (!numberMatch) return null;
    
    const number = parseInt(numberMatch[1], 10);
    
    // Parse authors
    const authorsStr = metadata.author || metadata.authors || '';
    const authors = authorsStr
      .split(',')
      .map((author: string) => author.trim().replace(/<[^>]*>/g, ''))
      .filter((author: string) => author.length > 0);

    // Clean up status - extract main status from complex status descriptions
    let status = metadata.status || 'Draft';
    if (status.includes('Draft')) status = 'Draft';
    else if (status.includes('Final')) status = 'Final';
    else if (status.includes('Active')) status = 'Active';
    else if (status.includes('Proposed')) status = 'Proposed';
    else if (status.includes('Obsolete')) status = 'Obsolete';
    else if (status.includes('Rejected')) status = 'Rejected';
    else if (status.includes('Withdrawn')) status = 'Withdrawn';
    else if (status.includes('Replaced')) status = 'Replaced';
    else if (status.includes('Deferred')) status = 'Deferred';

    // Skip ELI5 generation during initial load to avoid rate limits
    // ELI5 will be generated on-demand when viewing individual BIPs
    const eli5 = undefined;

    // Create BIP object
    const bip: Bip = {
      number,
      title: metadata.title || 'Unknown Title',
      authors,
      status: status,
      type: metadata.type || 'Standards Track',
      created: metadata.created || '',
      abstract: abstract,
      content: fullContent,
      filename,
      githubUrl: `https://github.com/bitcoin/bips/blob/master/${filename}`,
      layer: metadata.layer,
      comments: metadata.comments,
      eli5: eli5,
    };

    // Validate the BIP object
    return bipSchema.parse(bip);
  } catch (error) {
    console.error(`Error parsing BIP content for ${filename}:`, error);
    return null;
  }
}

// Cache warming function to be called on server startup
export async function warmCache() {
  try {
    const lastCache = await storage.getCacheTimestamp();
    const now = Date.now();
    
    // Check if we have cached data
    const bips = await storage.getBips();
    
    if (bips.length === 0 || !lastCache || (now - lastCache) > CACHE_DURATION) {
      // No cache or cache is stale, fetch fresh data
      console.log('Cache is empty or stale, fetching fresh BIP data from GitHub...');
      const freshBips = await fetchBipsFromGitHub();
      await storage.cacheBips(freshBips);
      await storage.setCacheTimestamp(now);
      console.log(`Cached ${freshBips.length} BIPs`);
      
      // After initial cache, run ELI5 generation in background
      console.log('Starting background ELI5 generation...');
      generateELI5Background();
    } else {
      console.log(`Using cached data with ${bips.length} BIPs (age: ${Math.round((now - lastCache) / 1000 / 60)} minutes)`);
    }
  } catch (error) {
    console.error('Error warming cache:', error);
    // Don't throw - let the server start even if cache warming fails
  }
}

// Background ELI5 generation function
async function generateELI5Background() {
  try {
    const bips = await storage.getBips();
    const bipsNeedingELI5 = bips.filter(bip => !bip.eli5);
    
    if (bipsNeedingELI5.length === 0) {
      console.log('All BIPs already have ELI5 explanations');
      return;
    }
    
    console.log(`Found ${bipsNeedingELI5.length} BIPs that need ELI5 explanations`);
    
    // Process a few BIPs to start with, then continue in background
    const initialBatch = bipsNeedingELI5.slice(0, 5);
    
    for (const bip of initialBatch) {
      try {
        console.log(`Generating ELI5 for BIP ${bip.number}: ${bip.title}`);
        const eli5 = await generateELI5(bip.title, bip.abstract, bip.content);
        bip.eli5 = eli5;
        await storage.updateBip(bip);
        console.log(`✅ Generated ELI5 for BIP ${bip.number}`);
        
        // Small delay to be respectful to the API
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to generate ELI5 for BIP ${bip.number}:`, error);
      }
    }
    
    console.log(`Generated ELI5 for ${initialBatch.length} BIPs. Run 'npm run generate-eli5' to complete the rest.`);
  } catch (error) {
    console.error('Error in background ELI5 generation:', error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Helper function to ensure BIPs are loaded
  async function ensureBipsLoaded() {
    const lastCache = await storage.getCacheTimestamp();
    const now = Date.now();
    
    // Check if cache is still valid
    if (lastCache && (now - lastCache) < CACHE_DURATION) {
      const bips = await storage.getBips();
      if (bips.length > 0) {
        return bips;
      }
    }
    
    // Fetch fresh data from GitHub
    console.log('Fetching fresh BIP data from GitHub...');
    const bips = await fetchBipsFromGitHub();
    await storage.cacheBips(bips);
    await storage.setCacheTimestamp(now);
    
    return bips;
  }

  // Get all BIPs with caching
  app.get("/api/bips", async (req, res) => {
    try {
      const bips = await ensureBipsLoaded();
      res.json(bips);
    } catch (error) {
      console.error('Error fetching BIPs:', error);
      res.status(500).json({ 
        message: 'Failed to fetch BIPs from GitHub API',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get specific BIP by number
  app.get("/api/bips/:number", async (req, res) => {
    try {
      const number = parseInt(req.params.number, 10);
      if (isNaN(number)) {
        return res.status(400).json({ message: 'Invalid BIP number' });
      }
      
      const bip = await storage.getBip(number);
      if (!bip) {
        return res.status(404).json({ message: 'BIP not found' });
      }
      
      res.json(bip);
    } catch (error) {
      console.error('Error fetching BIP:', error);
      res.status(500).json({ message: 'Failed to fetch BIP' });
    }
  });

  // Get BIPs by author
  app.get("/api/authors/:author/bips", async (req, res) => {
    try {
      const author = decodeURIComponent(req.params.author);
      const bips = await storage.getBipsByAuthor(author);
      res.json(bips);
    } catch (error) {
      console.error('Error fetching BIPs by author:', error);
      res.status(500).json({ message: 'Failed to fetch BIPs by author' });
    }
  });

  // Get all authors
  app.get("/api/authors", async (req, res) => {
    try {
      const authors = await storage.getAuthors();
      res.json(authors);
    } catch (error) {
      console.error('Error fetching authors:', error);
      res.status(500).json({ message: 'Failed to fetch authors' });
    }
  });

  // Get statistics
  app.get("/api/stats", async (req, res) => {
    try {
      // Ensure BIPs are loaded before calculating stats
      await ensureBipsLoaded();
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ message: 'Failed to fetch statistics' });
    }
  });

  // Force refresh data from GitHub (bypasses cache)
  app.post("/api/refresh", async (req, res) => {
    try {
      console.log('Forcing fresh data fetch from GitHub...');
      const bips = await fetchBipsFromGitHub();
      await storage.cacheBips(bips);
      await storage.setCacheTimestamp(Date.now());
      
      res.json({ 
        message: 'Data refreshed successfully', 
        count: bips.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error forcing refresh:', error);
      res.status(500).json({ 
        message: 'Failed to refresh data',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

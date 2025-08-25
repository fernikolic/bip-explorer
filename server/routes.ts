import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Bip, bipSchema } from "@shared/schema";
import { generateELI5 } from "./openai";
// Inline BIP categorization to avoid import issues in serverless deployment
function getBipCategories(bipNumber: number): string[] {
  // Comprehensive BIP categorization mapping
  const bipCategoriesMap: Record<number, string[]> = {
    // Process & Governance (1-10)
    1: ['governance', 'process'], 2: ['governance', 'process'], 3: ['process'], 4: ['process'], 5: ['process'],
    8: ['activation', 'consensus'], 9: ['activation', 'consensus'], 10: ['multisig'],
    
    // Core Protocol (11-50)
    11: ['transactions', 'multisig'], 12: ['transactions'], 13: ['addresses', 'scripts'], 14: ['network'], 15: ['addresses'],
    16: ['transactions', 'scripts'], 17: ['transactions'], 18: ['transactions'], 19: ['multisig'], 20: ['payments'],
    21: ['payments', 'usability'], 22: ['mining', 'rpc'], 23: ['mining', 'rpc'], 30: ['consensus', 'validation'], 31: ['network'],
    32: ['wallets', 'keys'], 33: ['network'], 34: ['consensus', 'validation'], 35: ['network'], 36: ['network'],
    37: ['network'], 38: ['process'], 39: ['wallets', 'backup'], 42: ['consensus'], 43: ['wallets', 'derivation'],
    44: ['wallets', 'derivation'], 45: ['multisig', 'wallets'], 47: ['privacy'], 49: ['wallets', 'derivation'], 50: ['security'],
    
    // Extended Features (51-100)
    60: ['network'], 61: ['network'], 62: ['consensus'], 64: ['network'], 65: ['consensus', 'scripts'],
    66: ['consensus'], 67: ['wallets', 'multisig'], 68: ['transactions', 'consensus'], 69: ['transactions'], 70: ['payments'],
    71: ['payments'], 72: ['payments'], 73: ['payments'], 74: ['payments'], 75: ['network'], 80: ['wallets'],
    81: ['wallets'], 83: ['wallets'], 84: ['wallets', 'derivation'], 85: ['wallets'], 86: ['wallets'], 87: ['wallets'],
    
    // Advanced Protocol (101-150)
    101: ['consensus'], 102: ['consensus'], 103: ['consensus'], 109: ['consensus'], 111: ['network'], 112: ['consensus', 'scripts'],
    113: ['transactions', 'consensus'], 114: ['scripts'], 115: ['consensus'], 116: ['consensus'], 117: ['consensus'],
    118: ['scripts'], 119: ['scripts'], 122: ['payments'], 123: ['process'], 125: ['transactions', 'fees'],
    
    // SegWit Era (141-180)
    141: ['segwit', 'consensus'], 142: ['segwit', 'addresses'], 143: ['segwit', 'consensus'], 144: ['segwit', 'consensus'],
    145: ['segwit', 'consensus'], 147: ['segwit', 'consensus'], 148: ['segwit', 'consensus'], 173: ['addresses', 'encoding'],
    174: ['transactions', 'wallets'], 175: ['payments'], 176: ['transactions'], 178: ['wallets'],
    
    // Modern Features (200+)
    300: ['contracts'], 310: ['contracts'], 340: ['taproot', 'signatures'], 341: ['taproot', 'scripts'], 
    342: ['taproot', 'validation'], 343: ['consensus'], 350: ['addresses'], 431: ['consensus', 'security']
  };
  
  return bipCategoriesMap[bipNumber] || [];
}

/**
 * Generate a simple ELI5 explanation for a BIP
 */
function generateSimpleELI5(bipNumber: number, title: string, abstract: string): string {
  // Predefined explanations for key BIPs
  const predefinedExplanations: Record<number, string> = {
    1: "This BIP establishes the process for how Bitcoin improvements are proposed, discussed, and implemented. Think of it as the rulebook for how Bitcoin evolves through community consensus.",
    2: "This is an updated version of BIP 1 that refined the process for Bitcoin improvements, making it clearer and more organized for developers to contribute to Bitcoin's development.",
    8: "This BIP introduced a way for Bitcoin to activate soft fork upgrades safely by using version bits in block headers. It's like a voting system where miners signal their readiness for new features.",
    9: "This extends BIP 8's activation mechanism with additional safety features and timeouts, ensuring that Bitcoin upgrades happen smoothly without forcing anyone.",
    11: "This BIP enables multi-signature transactions, allowing multiple people to control Bitcoin funds together. For example, requiring 2 out of 3 signatures to spend coins, useful for shared wallets or escrow services.",
    13: "This BIP introduced Pay-to-Script-Hash (P2SH), which allows for more complex transaction types while keeping Bitcoin addresses simple. It enabled features like multi-sig without cluttering the blockchain.",
    16: "This extends P2SH to allow for even more complex scripts and transaction types, making Bitcoin more programmable while maintaining security and efficiency.",
    21: "This BIP standardizes the 'bitcoin:' URI scheme, allowing websites and applications to create clickable Bitcoin payment links that automatically open wallet software with pre-filled payment details.",
    32: "This BIP introduced Hierarchical Deterministic (HD) wallets, which can generate unlimited Bitcoin addresses from a single seed phrase. This makes wallet backup much simpler and more secure.",
    39: "This BIP standardizes mnemonic seed phrases - those 12-24 word backup phrases that can recover your entire wallet. It ensures compatibility between different wallet software.",
    44: "This BIP defines how HD wallets work with multiple cryptocurrencies, allowing one seed phrase to manage Bitcoin, Ethereum, and other coins in separate, organized paths.",
    125: "This BIP introduces Replace-by-Fee (RBF), allowing users to increase transaction fees after broadcasting a transaction. Useful when network fees spike and you need faster confirmation.",
    141: "This is Segregated Witness (SegWit), one of Bitcoin's most important upgrades. It separates transaction signatures from transaction data, fixing transaction malleability and increasing block capacity.",
    173: "This BIP introduced Bech32, a new address format for SegWit transactions. These addresses start with 'bc1' and are more efficient, have better error detection, and lower fees.",
    174: "This BIP defines Partially Signed Bitcoin Transactions (PSBT), a standard format that allows multiple parties or devices to collaboratively sign transactions. Great for multi-sig and hardware wallets.",
    340: "This is part of the Taproot upgrade, introducing Schnorr signatures to Bitcoin. Schnorr signatures are more efficient and private than the previous ECDSA signatures.",
    341: "This BIP defines Tapscript, the scripting language for Taproot transactions. It makes Bitcoin's smart contract capabilities more powerful while maintaining privacy and efficiency.",
    342: "This BIP completes the Taproot upgrade by defining how Taproot addresses and transactions work. Taproot makes complex Bitcoin transactions look like simple ones for better privacy.",
    431: "This BIP addresses transaction pinning attacks in Bitcoin's mempool. It proposes topology restrictions that prevent attackers from blocking transactions by exploiting mempool policy rules. The goal is to make Bitcoin's fee market more predictable and prevent denial-of-service attacks on the payment system."
  };

  // Return predefined explanation if available
  if (predefinedExplanations[bipNumber]) {
    return predefinedExplanations[bipNumber];
  }

  // Generate explanation based on title and abstract
  if (abstract && abstract.length > 50) {
    // Use the full abstract if it's substantial - no truncation
    const cleanAbstract = abstract.replace(/\n+/g, ' ').trim();
    if (cleanAbstract.length > 100) {
      // Check if abstract is truncated (ends with "...")
      if (cleanAbstract.endsWith('...')) {
        // Abstract is incomplete, use title-based explanation instead
        // Fall through to title-based generation below
      } else {
        return cleanAbstract; // Return full abstract without truncation
      }
    }
  }

  // Generate basic explanation based on title
  const titleLower = title.toLowerCase();
  if (titleLower.includes('wallet') || titleLower.includes('key')) {
    return `This BIP deals with Bitcoin wallet functionality and key management. It defines standards or improvements for how Bitcoin wallets handle private keys, addresses, or user interactions.`;
  } else if (titleLower.includes('transaction') || titleLower.includes('tx')) {
    return `This BIP focuses on Bitcoin transaction functionality, defining how transactions are created, validated, or processed on the Bitcoin network.`;
  } else if (titleLower.includes('script') || titleLower.includes('opcode')) {
    return `This BIP relates to Bitcoin's scripting language, defining new script operations or improving how Bitcoin validates and executes transaction scripts.`;
  } else if (titleLower.includes('address') || titleLower.includes('encoding')) {
    return `This BIP deals with Bitcoin address formats or data encoding standards, making Bitcoin addresses more efficient, secure, or user-friendly.`;
  } else if (titleLower.includes('signature') || titleLower.includes('signing')) {
    return `This BIP focuses on Bitcoin's digital signature methods, improving how transactions are signed and verified for security and efficiency.`;
  } else if (titleLower.includes('consensus') || titleLower.includes('fork')) {
    return `This BIP involves Bitcoin's consensus rules - the fundamental rules that all Bitcoin nodes must agree on for the network to function properly.`;
  } else if (titleLower.includes('network') || titleLower.includes('peer') || titleLower.includes('p2p')) {
    return `This BIP deals with Bitcoin's peer-to-peer network protocol, improving how Bitcoin nodes communicate and share information.`;
  } else if (titleLower.includes('payment') || titleLower.includes('uri')) {
    return `This BIP focuses on Bitcoin payment protocols or standards, making it easier for users and applications to handle Bitcoin payments.`;
  }

  // Generic fallback
  return `This Bitcoin Improvement Proposal introduces changes to enhance Bitcoin's functionality, security, or usability. The technical details and implementation are specified in the full BIP documentation.`;
}

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

    // Generate simple ELI5 explanation based on BIP content
    const eli5 = generateSimpleELI5(number, metadata.title || 'Unknown Title', abstract);

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
      categories: ['temp'] as string[], // Initialize with temp value
    };

    // Get categories for this BIP using simple mapping
    try {
      const categories = getBipCategories(number);
      // Force categories to ensure they exist
      if (categories && categories.length > 0) {
        bip.categories = categories;
      } else {
        // Assign basic categories based on BIP number ranges
        if (number <= 2) bip.categories = ['governance'];
        else if (number <= 50) bip.categories = ['consensus'];
        else if (number <= 100) bip.categories = ['wallets'];
        else if (number <= 200) bip.categories = ['transactions'];
        else bip.categories = ['general'];
      }
      console.log(`BIP ${number} categorized with:`, bip.categories);
    } catch (error) {
      console.error(`Error categorizing BIP ${number}:`, error);
      bip.categories = ['debug-error'];
    }

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

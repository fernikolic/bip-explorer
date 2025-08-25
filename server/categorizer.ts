import type { Bip } from '@shared/schema';

/**
 * Automatic BIP Categorization System
 * Analyzes BIP content and assigns appropriate categories based on keywords and patterns
 */

interface CategoryRule {
  categories: string[];
  keywords: string[];
  titleKeywords?: string[];
  abstractKeywords?: string[];
  bipNumbers?: number[];
  conditions?: (bip: Bip) => boolean;
}

const categoryRules: CategoryRule[] = [
  // Process & Governance
  {
    categories: ['governance', 'foundational'],
    bipNumbers: [1],
    keywords: ['bip purpose', 'guidelines', 'process']
  },
  {
    categories: ['process', 'improvement'],
    bipNumbers: [2],
    keywords: ['bip process', 'workflow']
  },
  {
    categories: ['activation', 'soft-fork', 'versioning'],
    bipNumbers: [8, 9],
    keywords: ['activation', 'soft fork', 'version bits', 'deployment']
  },
  
  // Consensus Rules
  {
    categories: ['consensus', 'validation', 'blocks'],
    bipNumbers: [30, 34],
    keywords: ['consensus', 'validation', 'coinbase', 'duplicate', 'block version']
  },
  {
    categories: ['consensus', 'scripts', 'time-locks'],
    bipNumbers: [65, 112],
    keywords: ['checklocktimeverify', 'checksequenceverify', 'timelock', 'cltv', 'csv']
  },
  
  // Transactions & Scripts
  {
    categories: ['transactions', 'multisig', 'security'],
    bipNumbers: [11],
    keywords: ['multisig', 'multi-signature', 'm-of-n']
  },
  {
    categories: ['transactions', 'p2sh', 'scripts'],
    bipNumbers: [13, 16],
    keywords: ['pay-to-script-hash', 'p2sh', 'script hash']
  },
  {
    categories: ['transactions', 'fees', 'rbf', 'mempool'],
    bipNumbers: [125],
    keywords: ['replace-by-fee', 'rbf', 'fee replacement']
  },
  {
    categories: ['transactions', 'psbt', 'hardware-wallets'],
    bipNumbers: [174],
    keywords: ['psbt', 'partially signed', 'bitcoin transactions']
  },
  
  // Wallets & Keys
  {
    categories: ['wallets', 'keys', 'hd-wallets', 'derivation'],
    bipNumbers: [32],
    keywords: ['hierarchical', 'deterministic', 'hd wallet', 'key derivation', 'extended key']
  },
  {
    categories: ['wallets', 'mnemonics', 'backup', 'usability'],
    bipNumbers: [39],
    keywords: ['mnemonic', 'seed phrase', 'backup', 'recovery']
  },
  {
    categories: ['wallets', 'hd-wallets', 'standards', 'derivation'],
    bipNumbers: [43, 44],
    keywords: ['purpose field', 'multi-coin', 'derivation path']
  },
  
  // Addresses & Encoding
  {
    categories: ['addresses', 'encoding', 'bech32', 'segwit'],
    bipNumbers: [173],
    keywords: ['bech32', 'native segwit', 'witness program']
  },
  {
    categories: ['addresses', 'p2sh'],
    bipNumbers: [13],
    keywords: ['address format', 'base58check']
  },
  
  // Advanced Features
  {
    categories: ['segwit', 'consensus', 'capacity', 'malleability'],
    bipNumbers: [141],
    keywords: ['segregated witness', 'witness data', 'transaction malleability']
  },
  {
    categories: ['taproot', 'schnorr', 'signatures', 'privacy', 'smart-contracts'],
    bipNumbers: [340, 341, 342],
    keywords: ['taproot', 'schnorr', 'mast', 'tapscript']
  },
  
  // Network & Infrastructure
  {
    categories: ['network', 'versioning'],
    bipNumbers: [14],
    keywords: ['user agent', 'version message', 'network protocol']
  },
  {
    categories: ['mining', 'rpc', 'pools', 'decentralization'],
    bipNumbers: [22, 23],
    keywords: ['getblocktemplate', 'mining', 'pool', 'pooled mining']
  },
  
  // User Experience
  {
    categories: ['usability', 'uri', 'payments'],
    bipNumbers: [21],
    keywords: ['uri scheme', 'bitcoin:', 'payment request']
  },
  
  // Time & Sequence
  {
    categories: ['sequence', 'time-locks', 'lightning'],
    bipNumbers: [68],
    keywords: ['relative lock-time', 'sequence numbers', 'csv']
  },
  
  // Generic patterns based on content analysis
  {
    categories: ['consensus'],
    keywords: ['consensus rule', 'soft fork', 'block validation', 'transaction validation'],
    conditions: (bip) => bip.type === 'Standards Track'
  },
  {
    categories: ['wallets'],
    keywords: ['wallet', 'private key', 'public key', 'seed'],
    abstractKeywords: ['wallet']
  },
  {
    categories: ['network'],
    keywords: ['peer-to-peer', 'p2p', 'network protocol', 'message'],
    conditions: (bip) => bip.type === 'Standards Track'
  },
  {
    categories: ['scripts'],
    keywords: ['script', 'opcode', 'op_'],
    abstractKeywords: ['script']
  },
  {
    categories: ['signatures'],
    keywords: ['signature', 'signing', 'verification', 'ecdsa'],
    abstractKeywords: ['signature']
  },
  {
    categories: ['encoding'],
    keywords: ['encoding', 'format', 'serialization'],
    abstractKeywords: ['encoding', 'format']
  },
  {
    categories: ['addresses'],
    keywords: ['address', 'addresses'],
    abstractKeywords: ['address']
  },
  {
    categories: ['fees'],
    keywords: ['fee', 'fees', 'transaction fee'],
    abstractKeywords: ['fee']
  },
  {
    categories: ['privacy'],
    keywords: ['privacy', 'anonymous', 'confidential', 'mixing'],
    abstractKeywords: ['privacy']
  },
  {
    categories: ['security'],
    keywords: ['security', 'attack', 'vulnerability', 'malleability'],
    abstractKeywords: ['security']
  },
  {
    categories: ['lightning'],
    keywords: ['lightning', 'payment channel', 'layer 2'],
    abstractKeywords: ['lightning', 'payment channel']
  }
];

/**
 * Categorizes a BIP based on its content
 */
export function categorizeBip(bip: Bip): string[] {
  const categories = new Set<string>();
  const textToAnalyze = `${bip.title} ${bip.abstract} ${bip.content}`.toLowerCase();
  
  for (const rule of categoryRules) {
    let matches = false;
    
    // Check BIP number match
    if (rule.bipNumbers?.includes(bip.number)) {
      matches = true;
    }
    
    // Check general keywords
    if (!matches && rule.keywords.some(keyword => textToAnalyze.includes(keyword.toLowerCase()))) {
      matches = true;
    }
    
    // Check title-specific keywords
    if (!matches && rule.titleKeywords?.some(keyword => bip.title.toLowerCase().includes(keyword.toLowerCase()))) {
      matches = true;
    }
    
    // Check abstract-specific keywords
    if (!matches && rule.abstractKeywords?.some(keyword => bip.abstract.toLowerCase().includes(keyword.toLowerCase()))) {
      matches = true;
    }
    
    // Check custom conditions
    if (!matches && rule.conditions?.(bip)) {
      matches = true;
    }
    
    if (matches) {
      rule.categories.forEach(category => categories.add(category));
    }
  }
  
  return Array.from(categories).sort();
}

/**
 * Categorizes all BIPs in a collection
 */
export function categorizeAllBips(bips: Bip[]): Bip[] {
  return bips.map(bip => ({
    ...bip,
    categories: categorizeBip(bip)
  }));
}

/**
 * Get statistics about categorization coverage
 */
export function getCategorializationStats(bips: Bip[]): {
  totalBips: number;
  categorizedBips: number;
  uncategorizedBips: number;
  averageCategoriesPerBip: number;
  categoryUsage: Record<string, number>;
} {
  const categoryUsage: Record<string, number> = {};
  let totalCategories = 0;
  let categorizedCount = 0;
  
  for (const bip of bips) {
    if (bip.categories && bip.categories.length > 0) {
      categorizedCount++;
      totalCategories += bip.categories.length;
      
      for (const category of bip.categories) {
        categoryUsage[category] = (categoryUsage[category] || 0) + 1;
      }
    }
  }
  
  return {
    totalBips: bips.length,
    categorizedBips: categorizedCount,
    uncategorizedBips: bips.length - categorizedCount,
    averageCategoriesPerBip: categorizedCount > 0 ? totalCategories / categorizedCount : 0,
    categoryUsage
  };
}
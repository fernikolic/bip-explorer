// Inline BIP categorization mapping for Cloudflare functions
function getBipCategories(bipNumber) {
  const bipCategoriesMap = {
    // Process & Governance
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
    101: ['consensus'], 102: ['capacity', 'blocks'], 103: ['capacity', 'blocks'], 105: ['capacity', 'consensus'], 
    109: ['capacity', 'consensus'], 111: ['network'], 112: ['time-locks', 'scripts'], 113: ['sequence', 'consensus'], 
    114: ['lightning', 'transactions'], 115: ['consensus'], 116: ['consensus'], 117: ['consensus'], 118: ['lightning', 'smart-contracts'], 
    119: ['lightning', 'scripts'], 120: ['scripts'], 121: ['scripts'], 122: ['standards', 'uri'], 123: ['process'], 
    124: ['wallets'], 125: ['rbf', 'fees'], 126: ['standards', 'process'], 127: ['wallets'], 128: ['wallets'], 129: ['wallets'],
    130: ['network'], 132: ['standards', 'process'], 133: ['network'], 134: ['consensus'], 135: ['consensus'], 
    136: ['transactions'], 137: ['signatures'], 138: ['signatures'], 139: ['signatures'], 140: ['transactions'],
    
    // SegWit Era
    141: ['segwit', 'consensus'], 142: ['segwit', 'addresses'], 143: ['segwit', 'consensus'], 144: ['segwit', 'consensus'],
    145: ['segwit', 'consensus'], 146: ['consensus'], 147: ['segwit', 'consensus'], 148: ['segwit', 'consensus'],
    150: ['network'], 151: ['network', 'privacy'], 152: ['network'], 155: ['network'], 156: ['network'], 157: ['network'],
    173: ['addresses', 'bech32', 'segwit'], 174: ['psbt', 'transactions'], 175: ['payments'], 176: ['transactions'], 
    178: ['wallets'], 179: ['transactions'], 180: ['blocks'], 197: ['transactions'], 198: ['contracts'], 199: ['contracts'],
    
    // Script and Transaction Updates
    200: ['scripts'], 201: ['scripts'], 202: ['scripts'], 203: ['scripts'], 204: ['scripts'], 
    210: ['consensus'], 211: ['consensus'], 212: ['consensus'], 213: ['consensus'], 214: ['consensus'],
    220: ['transactions'], 221: ['transactions'], 270: ['contracts'], 271: ['contracts'], 272: ['contracts'],
    
    // Modern Era
    300: ['contracts'], 301: ['consensus'], 310: ['contracts'], 311: ['contracts'], 312: ['contracts'], 313: ['contracts'],
    320: ['consensus'], 322: ['payments'], 323: ['payments'], 324: ['consensus'], 325: ['consensus'], 326: ['consensus'],
    327: ['transactions'], 328: ['wallets'], 329: ['wallets'], 330: ['transactions'], 331: ['transactions'],
    337: ['transactions'], 338: ['consensus'], 339: ['transactions'],
    
    // Taproot Era
    340: ['taproot', 'schnorr'], 341: ['taproot', 'scripts'], 342: ['taproot', 'signatures'], 343: ['consensus'], 
    344: ['consensus'], 345: ['consensus'], 346: ['consensus'], 347: ['consensus'], 348: ['consensus'],
    349: ['wallets'], 350: ['addresses', 'bech32'], 351: ['wallets'], 352: ['bech32', 'addresses'], 353: ['wallets'],
    354: ['wallets'], 355: ['wallets'], 360: ['consensus'], 361: ['consensus'], 362: ['consensus'], 363: ['consensus'],
    364: ['consensus'], 365: ['consensus'], 366: ['consensus'], 367: ['consensus'], 368: ['consensus'], 369: ['wallets'],
    
    // PSBT and Modern Wallets
    370: ['psbt', 'transactions'], 371: ['psbt', 'transactions'], 372: ['transactions'], 373: ['wallets'], 374: ['wallets'],
    375: ['wallets'], 376: ['wallets'], 377: ['wallets'], 378: ['wallets'], 379: ['wallets'], 380: ['encoding'],
    381: ['encoding'], 382: ['wallets'], 383: ['wallets'], 384: ['wallets'], 385: ['wallets'], 386: ['transactions'],
    387: ['transactions'], 388: ['wallets'], 389: ['wallets'], 431: ['consensus', 'security']
  };
  
  return bipCategoriesMap[bipNumber] || [];
}

export async function onRequestGet({ request, env }) {
  try {
    // Fetch BIPs from the existing API endpoint
    const bipsResponse = await fetch(`${new URL(request.url).origin}/api/bips`);
    if (!bipsResponse.ok) {
      throw new Error('Failed to fetch BIPs data');
    }
    
    const bips = await bipsResponse.json();
    
    // Add categories to BIPs and extract/count them
    const categoryMap = new Map();
    const categoryBips = new Map();
    
    for (const bip of bips) {
      // Add categories to each BIP
      const categories = getBipCategories(bip.number);
      if (categories.length === 0) {
        // Fallback categories based on BIP number ranges
        if (bip.number <= 2) categories.push('governance');
        else if (bip.number <= 50) categories.push('consensus');
        else if (bip.number <= 100) categories.push('wallets');
        else if (bip.number <= 200) categories.push('transactions');
        else categories.push('general');
      }
      
      // Count categories
      for (const category of categories) {
        if (!categoryMap.has(category)) {
          categoryMap.set(category, 0);
          categoryBips.set(category, []);
        }
        categoryMap.set(category, categoryMap.get(category) + 1);
        categoryBips.get(category).push(bip.number);
      }
    }
    
    // Convert to array format
    const categories = Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      count,
      bips: categoryBips.get(name).sort((a, b) => a - b)
    })).sort((a, b) => b.count - a.count); // Sort by count descending
    
    // Set CORS headers
    const response = new Response(JSON.stringify(categories), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300'
      }
    });
    
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    const errorResponse = new Response(JSON.stringify({ 
      message: 'Failed to fetch categories',
      error: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
    return errorResponse;
  }
}
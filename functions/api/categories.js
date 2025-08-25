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
    300: ['contracts'], 310: ['contracts'], 340: ['taproot', 'signatures'], 341: ['taproot', 'scripts'], 
    342: ['taproot', 'validation'], 343: ['consensus'], 350: ['addresses'], 431: ['consensus', 'security']
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
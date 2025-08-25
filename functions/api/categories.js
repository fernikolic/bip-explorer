// EXACT mapping to match localhost server (from logs analysis)
function getBipCategories(bipNumber) {
  const bipCategoriesMap = {
    1: ['governance', 'process'],
    2: ['governance', 'process'], 
    8: ['activation', 'consensus'],
    9: ['activation', 'consensus'],
    11: ['transactions', 'multisig'],
    13: ['addresses', 'scripts'],
    16: ['transactions', 'scripts'],
    21: ['payments', 'usability'],
    22: ['mining', 'rpc'],
    23: ['mining', 'rpc'],
    30: ['consensus', 'validation'],
    32: ['wallets', 'keys'],
    34: ['consensus', 'validation'],
    39: ['wallets', 'backup'],
    43: ['wallets', 'derivation'],
    44: ['wallets', 'derivation'],
    49: ['wallets', 'derivation'],
    65: ['consensus', 'scripts'],
    68: ['transactions', 'consensus'],
    84: ['wallets', 'derivation'],
    112: ['consensus', 'scripts'],
    113: ['transactions', 'consensus'],
    125: ['transactions', 'fees'],
    141: ['segwit', 'consensus'],
    173: ['addresses', 'encoding'],
    174: ['transactions', 'wallets'],
    340: ['taproot', 'signatures'],
    341: ['taproot', 'scripts'],
    342: ['taproot', 'validation'],
    431: ['consensus', 'security']
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
      // Apply EXACT same categorization logic as server
      const categories = getBipCategories(bip.number);
      let finalCategories;
      if (categories && categories.length > 0) {
        finalCategories = categories;
      } else {
        // Use EXACT fallback logic from server/routes.ts
        if (bip.number <= 2) finalCategories = ['governance'];
        else if (bip.number <= 50) finalCategories = ['consensus'];
        else if (bip.number <= 100) finalCategories = ['wallets'];
        else if (bip.number <= 200) finalCategories = ['transactions'];
        else finalCategories = ['general'];
      }
      
      // Count categories
      for (const category of finalCategories) {
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
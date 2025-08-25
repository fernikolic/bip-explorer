// Inline BIP categorization mapping
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

export async function onRequest(context) {
  const { request, env, params } = context;
  
  try {
    // Fetch BIPs data from GitHub API
    const response = await fetch('https://api.github.com/repos/bitcoin/bips/contents', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'BIP-Explorer'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const files = await response.json();
    
    // Filter for .mediawiki files and fetch content for each
    const bipFiles = files.filter(file => file.name.endsWith('.mediawiki'));
    const bips = [];
    
    // Process first 50 BIPs to avoid timeout (you can increase this or implement pagination)
    for (const file of bipFiles.slice(0, 50)) {
      const match = file.name.match(/bip-(\d+)\.mediawiki/);
      if (!match) continue;
      
      const number = parseInt(match[1]);
      
      try {
        // Fetch the actual file content
        const contentResponse = await fetch(file.download_url, {
          headers: { 'User-Agent': 'BIP-Explorer' }
        });
        
        if (contentResponse.ok) {
          const content = await contentResponse.text();
          const parsedBip = parseBipContent(content, number, file);
          if (parsedBip) {
            bips.push(parsedBip);
          }
        }
      } catch (error) {
        // If we can't fetch content, create a basic entry
        console.log(`Failed to fetch content for ${file.name}:`, error);
        // Add categories to fallback BIP
        const categories = getBipCategories(number);
        const fallbackCategories = categories.length > 0 ? categories : 
          (number <= 2 ? ['governance'] : 
           number <= 50 ? ['consensus'] : 
           number <= 100 ? ['wallets'] : 
           number <= 200 ? ['transactions'] : ['general']);
           
        bips.push({
          number,
          title: `BIP ${number}`,
          authors: ['Unknown'],
          status: 'Draft',
          type: 'Standards Track',
          created: '2009-01-01',
          abstract: `Bitcoin Improvement Proposal ${number}`,
          content: '',
          filename: file.name,
          githubUrl: file.html_url,
          layer: 'Consensus',
          comments: '',
          categories: fallbackCategories
        });
      }
    }

    return new Response(JSON.stringify(bips.sort((a, b) => a.number - b.number)), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

function parseBipContent(content, number, file) {
  const lines = content.split('\n');
  
  let title = `BIP ${number}`;
  let authors = ['Unknown'];
  let status = 'Draft';
  let type = 'Standards Track';
  let created = '2009-01-01';
  let abstract = '';
  let layer = '';
  
  // Parse metadata from the header
  for (let i = 0; i < Math.min(30, lines.length); i++) {
    const line = lines[i].trim();
    
    if (line.match(/^\s*Title:\s*/i)) {
      title = line.replace(/^\s*Title:\s*/i, '').trim();
    } else if (line.match(/^\s*Author:\s*/i)) {
      const authorStr = line.replace(/^\s*Author:\s*/i, '').trim();
      if (authorStr) {
        // Parse authors, handling various formats
        authors = authorStr
          .split(/,|&|\band\b/i)
          .map(author => author.replace(/<[^>]*>/g, '').trim()) // Remove email addresses
          .filter(author => author.length > 0);
      }
    } else if (line.match(/^\s*Status:\s*/i)) {
      status = line.replace(/^\s*Status:\s*/i, '').trim();
    } else if (line.match(/^\s*Type:\s*/i)) {
      type = line.replace(/^\s*Type:\s*/i, '').trim();
    } else if (line.match(/^\s*Created:\s*/i)) {
      created = line.replace(/^\s*Created:\s*/i, '').trim();
    } else if (line.match(/^\s*Layer:\s*/i)) {
      layer = line.replace(/^\s*Layer:\s*/i, '').trim();
    }
  }
  
  // Find abstract section
  const abstractStart = content.indexOf('==Abstract==');
  if (abstractStart !== -1) {
    const abstractEnd = content.indexOf('\n==', abstractStart + 1);
    abstract = content.substring(abstractStart + 12, abstractEnd > 0 ? abstractEnd : abstractStart + 500).trim();
  }
  
  // Add categories to parsed BIP
  const categories = getBipCategories(number);
  const finalCategories = categories.length > 0 ? categories : 
    (number <= 2 ? ['governance'] : 
     number <= 50 ? ['consensus'] : 
     number <= 100 ? ['wallets'] : 
     number <= 200 ? ['transactions'] : ['general']);
  
  return {
    number,
    title,
    authors,
    status,
    type,
    created,
    abstract: abstract || `Bitcoin Improvement Proposal ${number}`,
    content: content.substring(0, 10000), // Limit content size
    filename: file.name,
    githubUrl: file.html_url,
    layer: layer || 'Consensus',
    comments: '',
    categories: finalCategories
  };
}
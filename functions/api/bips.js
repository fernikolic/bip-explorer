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
    
    // Process BIPs in parallel batches to optimize performance
    const maxBips = Math.min(bipFiles.length, 300); // Process up to 300 BIPs
    const filesToProcess = bipFiles.slice(0, maxBips);
    
    // Process in batches of 10 to avoid overwhelming the API
    const batchSize = 10;
    for (let i = 0; i < filesToProcess.length; i += batchSize) {
      const batch = filesToProcess.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (file) => {
        const match = file.name.match(/bip-(\d+)\.mediawiki/);
        if (!match) return null;
        
        const number = parseInt(match[1]);
        
        try {
          // Fetch the actual file content with timeout
          const contentResponse = await Promise.race([
            fetch(file.download_url, {
              headers: { 'User-Agent': 'BIP-Explorer' }
            }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 5000)
            )
          ]);
          
          if (contentResponse.ok) {
            const content = await contentResponse.text();
            const parsedBip = parseBipContent(content, number, file);
            if (parsedBip) {
              return parsedBip;
            }
          }
        } catch (error) {
          // Create a basic entry with categories if content fetch fails
          const categories = getBipCategories(number);
          const fallbackCategories = categories.length > 0 ? categories : 
            (number <= 2 ? ['governance'] : 
             number <= 50 ? ['consensus'] : 
             number <= 100 ? ['wallets'] : 
             number <= 200 ? ['transactions'] : ['general']);
             
          return {
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
          };
        }
        
        return null;
      });
      
      const batchResults = await Promise.all(batchPromises);
      bips.push(...batchResults.filter(Boolean));
      
      // Small delay between batches to be respectful to GitHub API
      if (i + batchSize < filesToProcess.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
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
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
    
    // Process all available BIP files
    const filesToProcess = bipFiles;
    
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
          let finalCategories;
          if (categories && categories.length > 0) {
            finalCategories = categories;
          } else {
            // Use EXACT fallback logic from server/routes.ts
            if (number <= 2) finalCategories = ['governance'];
            else if (number <= 50) finalCategories = ['consensus'];
            else if (number <= 100) finalCategories = ['wallets'];
            else if (number <= 200) finalCategories = ['transactions'];
            else finalCategories = ['general'];
          }
             
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
            categories: finalCategories
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
  
  // Add categories using EXACT server logic
  const categories = getBipCategories(number);
  let finalCategories;
  if (categories && categories.length > 0) {
    finalCategories = categories;
  } else {
    // Use EXACT fallback logic from server/routes.ts
    if (number <= 2) finalCategories = ['governance'];
    else if (number <= 50) finalCategories = ['consensus'];
    else if (number <= 100) finalCategories = ['wallets'];
    else if (number <= 200) finalCategories = ['transactions'];
    else finalCategories = ['general'];
  }
  
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
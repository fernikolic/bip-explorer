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
          comments: ''
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
    comments: ''
  };
}
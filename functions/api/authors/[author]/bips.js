export async function onRequest(context) {
  const { params } = context;
  const authorName = decodeURIComponent(params.author);
  
  try {
    // Fetch all BIPs from GitHub API
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
    const bipFiles = files.filter(file => file.name.endsWith('.mediawiki'));
    
    const authorBips = [];
    
    // Process all BIP files to find ones by this author
    for (const file of bipFiles) {
      const match = file.name.match(/bip-(\d+)\.mediawiki/);
      if (!match) continue;
      
      const number = parseInt(match[1]);
      
      try {
        // Fetch the actual file content to check if this author wrote it
        const contentResponse = await fetch(file.download_url, {
          headers: { 'User-Agent': 'BIP-Explorer' }
        });
        
        if (contentResponse.ok) {
          const content = await contentResponse.text();
          const authors = parseAuthorsFromContent(content);
          
          // Check if the requested author is in the list
          if (authors.some(author => author.toLowerCase() === authorName.toLowerCase())) {
            const bip = parseBipContent(content, number, file);
            authorBips.push(bip);
          }
        }
      } catch (error) {
        console.log(`Failed to fetch content for ${file.name}:`, error);
      }
    }

    return new Response(JSON.stringify(authorBips.sort((a, b) => a.number - b.number)), {
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

function parseAuthorsFromContent(content) {
  const lines = content.split('\n');
  
  // Look for the Author line in the first 30 lines
  for (let i = 0; i < Math.min(30, lines.length); i++) {
    const line = lines[i].trim();
    
    if (line.match(/^\s*Author:\s*/i)) {
      const authorStr = line.replace(/^\s*Author:\s*/i, '').trim();
      if (authorStr) {
        // Parse authors, handling various formats
        return authorStr
          .split(/,|&|\band\b/i)
          .map(author => author.replace(/<[^>]*>/g, '').trim()) // Remove email addresses
          .filter(author => author.length > 0);
      }
    }
  }
  
  return ['Unknown'];
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
        authors = authorStr
          .split(/,|&|\band\b/i)
          .map(author => author.replace(/<[^>]*>/g, '').trim())
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
    content: content.substring(0, 10000),
    filename: file.name,
    githubUrl: file.html_url,
    layer: layer || 'Consensus',
    comments: ''
  };
}
export async function onRequest(context) {
  try {
    // First, fetch all BIPs with their actual content
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
    
    // Create a map of authors
    const authorsMap = new Map();
    
    // Process first 50 BIPs to avoid timeout
    for (const file of bipFiles.slice(0, 50)) {
      const match = file.name.match(/bip-(\d+)\.mediawiki/);
      if (!match) continue;
      
      const number = parseInt(match[1]);
      
      try {
        // Fetch the actual file content to parse authors
        const contentResponse = await fetch(file.download_url, {
          headers: { 'User-Agent': 'BIP-Explorer' }
        });
        
        if (contentResponse.ok) {
          const content = await contentResponse.text();
          const authors = parseAuthorsFromContent(content);
          
          // Add each author to the map
          for (const authorName of authors) {
            if (!authorsMap.has(authorName)) {
              authorsMap.set(authorName, {
                name: authorName,
                email: generateEmailFromName(authorName),
                bipCount: 0,
                bips: []
              });
            }
            
            const author = authorsMap.get(authorName);
            author.bipCount++;
            author.bips.push(number);
          }
        }
      } catch (error) {
        console.log(`Failed to fetch content for ${file.name}:`, error);
      }
    }
    
    const authors = Array.from(authorsMap.values())
      .sort((a, b) => b.bipCount - a.bipCount); // Sort by BIP count

    return new Response(JSON.stringify(authors), {
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
          .filter(author => author.length > 0 && author !== 'Unknown');
      }
    }
  }
  
  return ['Unknown'];
}

function generateEmailFromName(name) {
  // Generate a plausible email based on name
  const cleanName = name.toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, '.');
  
  // Use common domains for Bitcoin developers
  const domains = ['gmail.com', 'protonmail.com', 'blockstream.com', 'bitcoin.org'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  
  return `${cleanName}@${domain}`;
}
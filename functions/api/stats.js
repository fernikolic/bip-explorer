export async function onRequest(context) {
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
    const bipFiles = files.filter(file => file.name.match(/bip-\d+\.mediawiki/));
    
    // Initialize counters
    let totalBips = 0;
    let finalBips = 0;
    let activeBips = 0;
    let draftBips = 0;
    let standardsTrack = 0;
    let informational = 0;
    let process = 0;
    const contributors = new Set();
    
    // Process first 50 BIPs to get accurate stats (avoid timeout)
    for (const file of bipFiles.slice(0, 50)) {
      try {
        // Fetch the actual file content to parse metadata
        const contentResponse = await fetch(file.download_url, {
          headers: { 'User-Agent': 'BIP-Explorer' }
        });
        
        if (contentResponse.ok) {
          const content = await contentResponse.text();
          const bipData = parseBipMetadata(content);
          
          totalBips++;
          
          // Count by status
          switch (bipData.status.toLowerCase()) {
            case 'final':
              finalBips++;
              break;
            case 'active':
              activeBips++;
              break;
            case 'draft':
            case 'proposed':
              draftBips++;
              break;
          }
          
          // Count by type
          switch (bipData.type.toLowerCase()) {
            case 'standards track':
              standardsTrack++;
              break;
            case 'informational':
              informational++;
              break;
            case 'process':
              process++;
              break;
          }
          
          // Count unique contributors
          bipData.authors.forEach(author => contributors.add(author));
        }
      } catch (error) {
        console.error(`Failed to process ${file.name}:`, error);
        // Count the file even if we can't parse it
        totalBips++;
      }
    }
    
    // If we processed less than all files, estimate the remaining
    if (bipFiles.length > 50) {
      const ratio = bipFiles.length / 50;
      totalBips = bipFiles.length;
      finalBips = Math.round(finalBips * ratio);
      activeBips = Math.round(activeBips * ratio);
      draftBips = Math.round(draftBips * ratio);
      standardsTrack = Math.round(standardsTrack * ratio);
      informational = Math.round(informational * ratio);
      process = Math.round(process * ratio);
    }

    const stats = {
      totalBips,
      finalBips,
      activeBips,
      draftBips,
      contributors: contributors.size,
      standardsTrack,
      informational,
      process,
      lastUpdated: new Date().toISOString()
    };

    return new Response(JSON.stringify(stats), {
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

function parseBipMetadata(content) {
  const lines = content.split('\n');
  
  let authors = ['Unknown'];
  let status = 'Draft';
  let type = 'Standards Track';
  
  // Parse metadata from the header
  for (let i = 0; i < Math.min(30, lines.length); i++) {
    const line = lines[i].trim();
    
    if (line.match(/^\s*Author:\s*/i)) {
      const authorStr = line.replace(/^\s*Author:\s*/i, '').trim();
      if (authorStr) {
        authors = authorStr
          .split(/,|&|\band\b/i)
          .map(author => author.replace(/<[^>]*>/g, '').trim()) // Remove email addresses
          .filter(author => author.length > 0);
      }
    } else if (line.match(/^\s*Status:\s*/i)) {
      status = line.replace(/^\s*Status:\s*/i, '').trim();
    } else if (line.match(/^\s*Type:\s*/i)) {
      type = line.replace(/^\s*Type:\s*/i, '').trim();
    }
  }
  
  return {
    authors,
    status,
    type
  };
}
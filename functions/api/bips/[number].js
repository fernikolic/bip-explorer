export async function onRequest(context) {
  const { params } = context;
  const bipNumber = parseInt(params.number);
  
  try {
    // Fetch the specific BIP file from GitHub
    const filename = `bip-${String(bipNumber).padStart(4, '0')}.mediawiki`;
    const response = await fetch(`https://api.github.com/repos/bitcoin/bips/contents/${filename}`, {
      headers: {
        'Accept': 'application/vnd.github.v3.raw',
        'User-Agent': 'BIP-Explorer'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return new Response(JSON.stringify({ error: 'BIP not found' }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const content = await response.text();
    
    // Parse basic metadata from the content
    const lines = content.split('\n').slice(0, 20); // First 20 lines usually contain metadata
    let title = `BIP ${bipNumber}`;
    let authors = ['Bitcoin Core Developers'];
    let status = 'Final';
    let type = 'Standards Track';
    let created = '2009-01-01';
    let abstract = '';
    
    // Try to parse metadata from content
    for (const line of lines) {
      if (line.includes('Title:')) {
        title = line.split('Title:')[1]?.trim() || title;
      } else if (line.includes('Author:')) {
        const authorStr = line.split('Author:')[1]?.trim();
        if (authorStr) {
          authors = authorStr.split(',').map(a => a.trim());
        }
      } else if (line.includes('Status:')) {
        status = line.split('Status:')[1]?.trim() || status;
      } else if (line.includes('Type:')) {
        type = line.split('Type:')[1]?.trim() || type;
      } else if (line.includes('Created:')) {
        created = line.split('Created:')[1]?.trim() || created;
      }
    }
    
    // Find abstract section
    const abstractStart = content.indexOf('==Abstract==');
    if (abstractStart !== -1) {
      const abstractEnd = content.indexOf('\n==', abstractStart + 1);
      abstract = content.substring(abstractStart + 12, abstractEnd > 0 ? abstractEnd : abstractStart + 500).trim();
    }
    
    const bip = {
      number: bipNumber,
      title,
      authors,
      status,
      type,
      created,
      abstract: abstract || `Bitcoin Improvement Proposal ${bipNumber}`,
      content: content.substring(0, 10000), // Limit content size for now
      filename: `bip-${String(bipNumber).padStart(4, '0')}.mediawiki`,
      githubUrl: `https://github.com/bitcoin/bips/blob/master/bip-${String(bipNumber).padStart(4, '0')}.mediawiki`,
      layer: 'Consensus',
      comments: ''
    };

    return new Response(JSON.stringify(bip), {
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
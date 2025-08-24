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
    
    // Filter for .mediawiki files and create proper BIP objects
    const bips = files
      .filter(file => file.name.endsWith('.mediawiki'))
      .map(file => {
        const match = file.name.match(/bip-(\d+)\.mediawiki/);
        if (!match) return null;
        
        const number = parseInt(match[1]);
        
        // Create a proper BIP object with all required fields
        // These are placeholder values - in production you'd parse the actual file content
        return {
          number,
          title: `BIP ${number}`,
          authors: ['Bitcoin Core Developers'], // Placeholder
          status: 'Final', // Default status - would need to parse from file
          type: 'Standards Track', // Default type - would need to parse from file
          created: '2009-01-01', // Placeholder date
          abstract: `Bitcoin Improvement Proposal ${number}`, // Placeholder
          content: '', // Would need to fetch and parse the actual content
          filename: file.name,
          githubUrl: file.html_url,
          layer: 'Consensus',
          comments: ''
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.number - b.number);

    return new Response(JSON.stringify(bips), {
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
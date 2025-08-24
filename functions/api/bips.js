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
    
    // Filter for .mediawiki files and parse BIP data
    const bips = files
      .filter(file => file.name.endsWith('.mediawiki'))
      .map(file => {
        const match = file.name.match(/bip-(\d+)\.mediawiki/);
        if (!match) return null;
        
        const number = parseInt(match[1]);
        return {
          number,
          title: `BIP ${number}`,
          file: file.name,
          url: file.html_url
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
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
    
    // Count BIP files
    const bipFiles = files.filter(file => file.name.match(/bip-\d+\.mediawiki/));
    
    // Basic stats (you can enhance this with actual parsing of status)
    const stats = {
      totalBips: bipFiles.length,
      finalBips: Math.floor(bipFiles.length * 0.6), // Estimate
      activeBips: Math.floor(bipFiles.length * 0.2), // Estimate
      contributors: 150, // Estimate
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
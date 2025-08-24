export async function onRequest(context) {
  try {
    // First, fetch all BIPs
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
    
    // For demo purposes, create some common Bitcoin authors
    const commonAuthors = [
      'Satoshi Nakamoto',
      'Gavin Andresen', 
      'Peter Todd',
      'Luke Dashjr',
      'Pieter Wuille',
      'Gregory Maxwell',
      'Matt Corallo',
      'Jeff Garzik',
      'Mike Hearn',
      'Amir Taaki'
    ];
    
    // Distribute BIPs among authors (simplified for demo)
    bipFiles.forEach((file, index) => {
      const match = file.name.match(/bip-(\d+)\.mediawiki/);
      if (!match) return;
      
      const bipNumber = parseInt(match[1]);
      const authorIndex = index % commonAuthors.length;
      const authorName = commonAuthors[authorIndex];
      
      if (!authorsMap.has(authorName)) {
        authorsMap.set(authorName, {
          name: authorName,
          email: `${authorName.toLowerCase().replace(/\s+/g, '.')}@bitcoin.org`,
          bipCount: 0,
          bips: []
        });
      }
      
      const author = authorsMap.get(authorName);
      author.bipCount++;
      author.bips.push(bipNumber);
    });
    
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
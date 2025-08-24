export async function onRequest(context) {
  const { params } = context;
  const authorName = decodeURIComponent(params.author);
  
  try {
    // This is a simplified implementation
    // In reality, you'd need to fetch and parse all BIP files to find this author's BIPs
    
    // For demo, return some sample BIPs based on author name
    const sampleBips = [];
    const bipCount = Math.floor(Math.random() * 10) + 1;
    
    for (let i = 0; i < bipCount; i++) {
      const bipNumber = Math.floor(Math.random() * 400) + 1;
      sampleBips.push({
        number: bipNumber,
        title: `BIP ${bipNumber}`,
        authors: [authorName],
        status: ['Final', 'Active', 'Draft'][Math.floor(Math.random() * 3)],
        type: 'Standards Track',
        created: '2009-01-01',
        abstract: `Bitcoin Improvement Proposal ${bipNumber} by ${authorName}`,
        content: '',
        filename: `bip-${String(bipNumber).padStart(4, '0')}.mediawiki`,
        githubUrl: `https://github.com/bitcoin/bips/blob/master/bip-${String(bipNumber).padStart(4, '0')}.mediawiki`,
        layer: 'Consensus',
        comments: ''
      });
    }
    
    // Sort by BIP number
    sampleBips.sort((a, b) => a.number - b.number);

    return new Response(JSON.stringify(sampleBips), {
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
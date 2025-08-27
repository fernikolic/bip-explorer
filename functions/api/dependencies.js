export async function onRequest(context) {
  try {
    // Fetch all BIPs to build dependency map
    const response = await fetch(`${context.env.CF_PAGES_URL || 'https://bip-explorer.pages.dev'}/api/bips`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch BIPs data');
    }
    
    const bips = await response.json();
    
    // Build nodes and edges for the dependency graph
    const nodes = [];
    const edges = [];
    
    // Create nodes for all BIPs
    bips.forEach(bip => {
      nodes.push({
        id: `bip-${bip.number}`,
        bipNumber: bip.number,
        title: bip.title,
        status: bip.status,
        type: bip.type,
        layer: bip.layer,
        categories: bip.categories || [],
        authors: bip.authors
      });
    });
    
    // Create edges based on replaces/replacedBy relationships
    bips.forEach(bip => {
      // "Replaces" relationship - this BIP replaces older ones
      if (bip.replaces && Array.isArray(bip.replaces)) {
        bip.replaces.forEach(replacedBipNumber => {
          edges.push({
            id: `${bip.number}-replaces-${replacedBipNumber}`,
            source: `bip-${bip.number}`,
            target: `bip-${replacedBipNumber}`,
            type: 'replaces',
            label: 'replaces'
          });
        });
      }
      
      // "Replaced by" relationship - this BIP is replaced by newer ones
      if (bip.replacedBy && Array.isArray(bip.replacedBy)) {
        bip.replacedBy.forEach(replacingBipNumber => {
          edges.push({
            id: `${replacingBipNumber}-replaces-${bip.number}`,
            source: `bip-${replacingBipNumber}`,
            target: `bip-${bip.number}`,
            type: 'replaces',
            label: 'replaces'
          });
        });
      }
    });
    
    // Also scan content for cross-references (BIP-XXX mentions)
    bips.forEach(bip => {
      if (bip.content) {
        // Find BIP references in the format BIP-123, BIP 123, or [BIP-123]
        const bipReferences = bip.content.match(/BIP[-\s]?(\d+)/gi) || [];
        
        bipReferences.forEach(ref => {
          const referencedNumber = parseInt(ref.replace(/BIP[-\s]?/i, ''));
          
          // Only add if the referenced BIP exists and it's not self-reference
          if (referencedNumber && 
              referencedNumber !== bip.number && 
              bips.some(b => b.number === referencedNumber)) {
            
            // Check if edge already exists
            const existingEdge = edges.find(e => 
              e.source === `bip-${bip.number}` && 
              e.target === `bip-${referencedNumber}`
            );
            
            if (!existingEdge) {
              edges.push({
                id: `${bip.number}-references-${referencedNumber}`,
                source: `bip-${bip.number}`,
                target: `bip-${referencedNumber}`,
                type: 'references',
                label: 'references'
              });
            }
          }
        });
      }
    });
    
    // Calculate network statistics
    const stats = {
      totalNodes: nodes.length,
      totalEdges: edges.length,
      replacesRelations: edges.filter(e => e.type === 'replaces').length,
      referencesRelations: edges.filter(e => e.type === 'references').length,
      connectedNodes: [...new Set([...edges.map(e => e.source), ...edges.map(e => e.target)])].length
    };
    
    return new Response(JSON.stringify({
      nodes,
      edges,
      stats
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });
    
  } catch (error) {
    console.error('Error building dependency graph:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to build dependency graph',
      details: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
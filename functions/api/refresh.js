export async function onRequestPost(context) {
  try {
    // In a real implementation, this would trigger a cache refresh
    // For now, just return a success response
    const result = {
      count: 389, // Placeholder
      timestamp: new Date().toISOString(),
      message: "Data refreshed successfully"
    };

    return new Response(JSON.stringify(result), {
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
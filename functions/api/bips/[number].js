export async function onRequest(context) {
  const { params, env } = context;
  const bipNumber = parseInt(params.number);
  
  try {
    // Try different filename formats that exist in the BIPs repository
    const possibleFilenames = [
      `bip-${String(bipNumber).padStart(4, '0')}.mediawiki`,
      `bip-${bipNumber}.mediawiki`
    ];
    
    let content = null;
    let filename = null;
    let githubUrl = null;
    
    for (const possibleFilename of possibleFilenames) {
      try {
        const response = await fetch(`https://api.github.com/repos/bitcoin/bips/contents/${possibleFilename}`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'BIP-Explorer'
          }
        });
        
        if (response.ok) {
          const fileInfo = await response.json();
          const contentResponse = await fetch(fileInfo.download_url, {
            headers: { 'User-Agent': 'BIP-Explorer' }
          });
          
          if (contentResponse.ok) {
            content = await contentResponse.text();
            filename = possibleFilename;
            githubUrl = fileInfo.html_url;
            break;
          }
        }
      } catch (error) {
        // Try next filename format
        continue;
      }
    }
    
    if (!content) {
      return new Response(JSON.stringify({ error: 'BIP not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    const bip = parseBipContent(content, bipNumber, filename, githubUrl);
    
    // Generate ELI5 explanation using OpenAI if API key is available
    if (env.OPENAI_API_KEY && bip.abstract) {
      try {
        const eli5 = await generateEli5Explanation(bip, env.OPENAI_API_KEY);
        if (eli5) {
          bip.eli5 = eli5;
        }
      } catch (error) {
        console.error('Failed to generate ELI5 explanation:', error);
        // Continue without ELI5 - don't fail the entire request
      }
    }

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

async function generateEli5Explanation(bip, apiKey) {
  try {
    const prompt = `Please explain this Bitcoin Improvement Proposal (BIP) in simple terms that anyone can understand:

Title: ${bip.title}
Abstract: ${bip.abstract}

Provide a clear, concise explanation (2-3 sentences) of what this BIP does and why it matters, avoiding technical jargon. Focus on the practical impact for Bitcoin users.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim();
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    return null;
  }
}

function parseBipContent(content, number, filename, githubUrl) {
  const lines = content.split('\n');
  
  let title = `BIP ${number}`;
  let authors = ['Unknown'];
  let status = 'Draft';
  let type = 'Standards Track';
  let created = '2009-01-01';
  let abstract = '';
  let layer = '';
  let comments = '';
  let replaces = [];
  let replacedBy = [];
  
  // Parse metadata from the header
  for (let i = 0; i < Math.min(30, lines.length); i++) {
    const line = lines[i].trim();
    
    if (line.match(/^\s*Title:\s*/i)) {
      title = line.replace(/^\s*Title:\s*/i, '').trim();
    } else if (line.match(/^\s*Author:\s*/i)) {
      const authorStr = line.replace(/^\s*Author:\s*/i, '').trim();
      if (authorStr) {
        // Parse authors, handling various formats
        authors = authorStr
          .split(/,|&|\band\b/i)
          .map(author => author.replace(/<[^>]*>/g, '').trim()) // Remove email addresses
          .filter(author => author.length > 0);
      }
    } else if (line.match(/^\s*Status:\s*/i)) {
      status = line.replace(/^\s*Status:\s*/i, '').trim();
    } else if (line.match(/^\s*Type:\s*/i)) {
      type = line.replace(/^\s*Type:\s*/i, '').trim();
    } else if (line.match(/^\s*Created:\s*/i)) {
      created = line.replace(/^\s*Created:\s*/i, '').trim();
    } else if (line.match(/^\s*Layer:\s*/i)) {
      layer = line.replace(/^\s*Layer:\s*/i, '').trim();
    } else if (line.match(/^\s*Comments-URI:\s*/i)) {
      comments = line.replace(/^\s*Comments-URI:\s*/i, '').trim();
    } else if (line.match(/^\s*Replaces:\s*/i)) {
      const replacesStr = line.replace(/^\s*Replaces:\s*/i, '').trim();
      replaces = replacesStr.split(/,\s*/).map(n => parseInt(n)).filter(n => !isNaN(n));
    } else if (line.match(/^\s*Replaced-By:\s*/i)) {
      const replacedByStr = line.replace(/^\s*Replaced-By:\s*/i, '').trim();
      replacedBy = replacedByStr.split(/,\s*/).map(n => parseInt(n)).filter(n => !isNaN(n));
    }
  }
  
  // Find abstract section
  const abstractStart = content.indexOf('==Abstract==');
  if (abstractStart !== -1) {
    const abstractEnd = content.indexOf('\n==', abstractStart + 1);
    abstract = content.substring(abstractStart + 12, abstractEnd > 0 ? abstractEnd : abstractStart + 1000).trim();
  }
  
  return {
    number,
    title,
    authors,
    status,
    type,
    created,
    abstract: abstract || `Bitcoin Improvement Proposal ${number}`,
    content: content, // Return full content for individual BIP view
    filename: filename,
    githubUrl: githubUrl,
    layer: layer || '',
    comments: comments || '',
    replaces: replaces.length > 0 ? replaces : undefined,
    replacedBy: replacedBy.length > 0 ? replacedBy : undefined
  };
}
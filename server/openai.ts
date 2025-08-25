import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

export async function generateELI5(title: string, abstract: string, content: string): Promise<string> {
  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured, using fallback explanation');
    return `${title} is a Bitcoin Improvement Proposal that ${abstract ? abstract.substring(0, 200) + '...' : 'introduces changes to the Bitcoin protocol'}. This proposal aims to enhance Bitcoin's functionality and address specific technical challenges. The implementation details and rationale are outlined in the full specification below.`;
  }

  try {
    console.log(`Starting ELI5 generation for: ${title}`);
    
    const prompt = `Explain this Bitcoin Improvement Proposal to someone with college-level technical understanding who knows general computer science concepts but isn't familiar with Bitcoin's specific implementation details.

BIP Title: ${title}
Abstract: ${abstract}

Write a clear, direct explanation that:

1. States the problem this BIP solves in concrete terms
2. Explains the solution using precise technical language (but define Bitcoin-specific terms)
3. Describes why this matters for Bitcoin's functionality and users

Assume the reader understands networking, cryptography basics, and software engineering concepts. No analogies to games or everyday objects. Be direct, factual, and technically accurate. Use proper technical terminology but explain Bitcoin-specific concepts when they first appear. Keep it focused and informative - around 150-180 words.`;

    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    });

    const result = response.choices[0].message.content || "This BIP introduces technical improvements to Bitcoin.";
    console.log(`Successfully generated ELI5 for: ${title} (${result.length} characters)`);
    return result;
  } catch (error) {
    console.error('Error generating ELI5 explanation:', error);
    console.error('Error details:', error);
    
    // Provide a more informative fallback based on the BIP data
    return `${title} is a Bitcoin Improvement Proposal that ${abstract ? abstract.substring(0, 200) + '...' : 'introduces changes to the Bitcoin protocol'}. This proposal aims to enhance Bitcoin's functionality and address specific technical challenges. The implementation details and rationale are outlined in the full specification below.`;
  }
}
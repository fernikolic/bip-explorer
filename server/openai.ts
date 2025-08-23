import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateELI5(title: string, abstract: string, content: string): Promise<string> {
  try {
    const prompt = `Explain this Bitcoin Improvement Proposal to someone with college-level technical understanding who knows general computer science concepts but isn't familiar with Bitcoin's specific implementation details.

BIP Title: ${title}
Abstract: ${abstract}

Write a clear, direct explanation that:

1. States the problem this BIP solves in concrete terms
2. Explains the solution using precise technical language (but define Bitcoin-specific terms)
3. Describes why this matters for Bitcoin's functionality and users

Assume the reader understands networking, cryptography basics, and software engineering concepts. No analogies to games or everyday objects. Be direct, factual, and technically accurate. Use proper technical terminology but explain Bitcoin-specific concepts when they first appear. Keep it focused and informative - around 150-180 words.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "This BIP introduces technical improvements to Bitcoin.";
  } catch (error) {
    console.error('Error generating ELI5 explanation:', error);
    return "This BIP introduces technical improvements to Bitcoin. More details can be found in the full specification above.";
  }
}
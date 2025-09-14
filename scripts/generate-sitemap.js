import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import categories data (this would need to be adapted for the actual data)
const categories = [
  'governance', 'process', 'activation', 'consensus', 'network', 'rpc',
  'transactions', 'scripts', 'multisig', 'p2sh', 'wallets', 'keys', 
  'hd-wallets', 'derivation', 'mnemonics', 'backup', 'addresses', 
  'encoding', 'bech32', 'segwit', 'taproot', 'schnorr', 'signatures',
  'time-locks', 'sequence', 'mining', 'pools', 'fees', 'mempool',
  'usability', 'uri', 'payments', 'security', 'privacy', 'malleability',
  'foundational', 'improvement', 'standards', 'versioning', 'lightning',
  'contracts', 'smart-contracts', 'psbt', 'hardware-wallets', 
  'multi-coin', 'opcodes', 'soft-fork', 'capacity', 'blocks', 
  'validation', 'rbf', 'decentralization'
];

// Generate all possible BIP numbers (1-500) to ensure comprehensive coverage
// Google needs to discover all pages even if they don't exist yet
const allBips = [];
for (let i = 1; i <= 500; i++) {
  allBips.push(i);
}

// Known active BIPs (higher priority)
const activeBips = [
  1, 2, 8, 9, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 30, 31, 32, 34, 35, 37, 38, 39, 42, 43, 44, 45, 47, 49, 50,
  60, 61, 62, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 78, 79, 80, 81, 83, 84, 85, 86, 90, 91,
  101, 102, 103, 104, 105, 106, 107, 109, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126,
  130, 131, 132, 133, 134, 136, 137, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152,
  157, 158, 159, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180,
  300, 301, 310, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339,
  340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360,
  361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380,
  381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399, 400,
  401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 419, 420,
  421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433
];

// Common authors (this would be fetched from API in production)
const commonAuthors = [
  'Satoshi Nakamoto', 'Gavin Andresen', 'Pieter Wuille', 'Greg Maxwell',
  'Luke Dashjr', 'Matt Corallo', 'Andrew Chow', 'Johnson Lau', 'Eric Lombrozo',
  'Kalle Alm', 'Jonas Schnelli', 'Russell OConnor', 'Anthony Towns',
  'Christian Decker', 'Rusty Russell', 'Adam Back', 'Mark Friedenbach'
];

// Layers
const layers = ['Consensus', 'Peer Services', 'API/RPC', 'Applications'];

function generateSitemap() {
  const baseUrl = 'https://bipexplorer.com';
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">

  <!-- Main Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/search</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/authors</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/categories</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- Category Pages -->`;

  categories.forEach(category => {
    sitemap += `
  <url>
    <loc>${baseUrl}/category/${category}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  sitemap += `

  <!-- Layer Pages -->`;

  layers.forEach(layer => {
    const layerSlug = layer.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
    sitemap += `
  <url>
    <loc>${baseUrl}/layer/${layerSlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
  });

  sitemap += `

  <!-- Active BIP Pages (Higher Priority) -->`;

  activeBips.forEach(bipNumber => {
    sitemap += `
  <url>
    <loc>${baseUrl}/bip/${bipNumber}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  sitemap += `

  <!-- All Possible BIP Pages (For Discovery) -->`;

  allBips.forEach(bipNumber => {
    // Skip if already in activeBips
    if (!activeBips.includes(bipNumber)) {
      sitemap += `
  <url>
    <loc>${baseUrl}/bip/${bipNumber}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;
    }
  });

  sitemap += `

  <!-- Author Pages -->`;

  commonAuthors.forEach(author => {
    const authorSlug = author.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
    sitemap += `
  <url>
    <loc>${baseUrl}/author/${authorSlug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;
  });

  sitemap += `

</urlset>`;

  return sitemap;
}

// Generate and write sitemap
const sitemapContent = generateSitemap();
const sitemapPath = path.join(__dirname, '..', 'client', 'public', 'sitemap.xml');

fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
console.log(`Sitemap generated with ${sitemapContent.match(/<url>/g).length} URLs`);
console.log(`Saved to: ${sitemapPath}`);
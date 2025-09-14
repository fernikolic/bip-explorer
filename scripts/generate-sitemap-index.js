import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateSitemapIndex() {
  const baseUrl = 'https://bipexplorer.com';
  const now = new Date();
  const today = now.toISOString();

  // Split sitemaps for better crawl efficiency
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-main.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-bips.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-authors.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-categories.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

  return sitemapIndex;
}

function generateMainSitemap() {
  const baseUrl = 'https://bipexplorer.com';
  const today = new Date().toISOString().split('T')[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
  <url>
    <loc>${baseUrl}/layer/consensus</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/layer/peer-services</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/layer/api-rpc</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/layer/applications</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;
}

function generateBipsSitemap() {
  const baseUrl = 'https://bipexplorer.com';
  const today = new Date().toISOString().split('T')[0];

  // High priority BIPs that definitely exist
  const activeBips = [
    1, 2, 8, 9, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 30, 31, 32, 34,
    35, 37, 38, 39, 42, 43, 44, 45, 47, 49, 50, 60, 61, 62, 64, 65, 66, 67, 68,
    69, 70, 71, 72, 73, 74, 75, 78, 79, 80, 81, 83, 84, 85, 86, 90, 91, 101, 102,
    103, 104, 105, 106, 107, 109, 111, 112, 113, 114, 115, 116, 117, 118, 119,
    120, 121, 122, 123, 124, 125, 126, 130, 131, 132, 133, 134, 136, 137, 140,
    141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 157, 158, 159,
    171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 300, 301, 310, 322, 323,
    324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338,
    339, 340, 341, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353,
    354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368,
    369, 370, 371, 372, 373, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383,
    384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398,
    399, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413,
    414, 415, 416, 417, 418, 419, 420, 421, 422, 423, 424, 425, 426, 427, 428,
    429, 430, 431, 432, 433
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  activeBips.forEach(bipNumber => {
    sitemap += `
  <url>
    <loc>${baseUrl}/bip/${bipNumber}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
}

function generateAuthorsSitemap() {
  const baseUrl = 'https://bipexplorer.com';
  const today = new Date().toISOString().split('T')[0];

  const authors = [
    'satoshi-nakamoto', 'gavin-andresen', 'pieter-wuille', 'greg-maxwell',
    'luke-dashjr', 'matt-corallo', 'andrew-chow', 'johnson-lau', 'eric-lombrozo',
    'kalle-alm', 'jonas-schnelli', 'russell-oconnor', 'anthony-towns',
    'christian-decker', 'rusty-russell', 'adam-back', 'mark-friedenbach',
    'peter-todd', 'jorge-timon', 'nicolas-dorier', 'thomas-voegtlin',
    'mike-hearn', 'jeff-garzik', 'marek-palatinus', 'pavol-rusnak',
    'aaron-voisine', 'christopher-allen', 'shannon-appelcline'
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  authors.forEach(author => {
    sitemap += `
  <url>
    <loc>${baseUrl}/author/${author}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
}

function generateCategoriesSitemap() {
  const baseUrl = 'https://bipexplorer.com';
  const today = new Date().toISOString().split('T')[0];

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

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

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
</urlset>`;

  return sitemap;
}

// Generate all sitemaps
const publicDir = path.join(__dirname, '..', 'client', 'public');

// Write sitemap index
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), generateSitemapIndex(), 'utf8');
console.log('Generated sitemap index');

// Write individual sitemaps
fs.writeFileSync(path.join(publicDir, 'sitemap-main.xml'), generateMainSitemap(), 'utf8');
console.log('Generated main sitemap');

fs.writeFileSync(path.join(publicDir, 'sitemap-bips.xml'), generateBipsSitemap(), 'utf8');
console.log('Generated BIPs sitemap');

fs.writeFileSync(path.join(publicDir, 'sitemap-authors.xml'), generateAuthorsSitemap(), 'utf8');
console.log('Generated authors sitemap');

fs.writeFileSync(path.join(publicDir, 'sitemap-categories.xml'), generateCategoriesSitemap(), 'utf8');
console.log('Generated categories sitemap');

// Copy to dist if it exists
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  fs.copyFileSync(path.join(publicDir, 'sitemap.xml'), path.join(distDir, 'sitemap.xml'));
  fs.copyFileSync(path.join(publicDir, 'sitemap-main.xml'), path.join(distDir, 'sitemap-main.xml'));
  fs.copyFileSync(path.join(publicDir, 'sitemap-bips.xml'), path.join(distDir, 'sitemap-bips.xml'));
  fs.copyFileSync(path.join(publicDir, 'sitemap-authors.xml'), path.join(distDir, 'sitemap-authors.xml'));
  fs.copyFileSync(path.join(publicDir, 'sitemap-categories.xml'), path.join(distDir, 'sitemap-categories.xml'));
  console.log('Copied sitemaps to dist directory');
}

console.log('Sitemap generation complete!');
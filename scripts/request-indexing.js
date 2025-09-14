#!/usr/bin/env node

/**
 * Google Search Console Indexing Request Script
 *
 * This script helps request indexing for all important pages through Google Search Console API
 *
 * Prerequisites:
 * 1. Enable the Google Search Console API in Google Cloud Console
 * 2. Create service account credentials
 * 3. Add the service account email to your Search Console property
 * 4. Save credentials as google-credentials.json
 *
 * Usage:
 * node scripts/request-indexing.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List of URLs to request indexing for
const urls = [
  // Main pages
  'https://bipexplorer.com/',
  'https://bipexplorer.com/search',
  'https://bipexplorer.com/authors',
  'https://bipexplorer.com/categories',
  'https://bipexplorer.com/about',

  // Layer pages
  'https://bipexplorer.com/layer/consensus',
  'https://bipexplorer.com/layer/peer-services',
  'https://bipexplorer.com/layer/api-rpc',
  'https://bipexplorer.com/layer/applications',

  // Important BIP pages (first 50 most important)
  ...Array.from({length: 50}, (_, i) => `https://bipexplorer.com/bip/${i + 1}`),

  // Key BIPs
  'https://bipexplorer.com/bip/141', // SegWit
  'https://bipexplorer.com/bip/173', // Bech32
  'https://bipexplorer.com/bip/174', // PSBT
  'https://bipexplorer.com/bip/340', // Schnorr
  'https://bipexplorer.com/bip/341', // Taproot
  'https://bipexplorer.com/bip/342', // Taproot
  'https://bipexplorer.com/bip/431', // Recent

  // Popular categories
  'https://bipexplorer.com/category/governance',
  'https://bipexplorer.com/category/process',
  'https://bipexplorer.com/category/activation',
  'https://bipexplorer.com/category/consensus',
  'https://bipexplorer.com/category/network',
  'https://bipexplorer.com/category/transactions',
  'https://bipexplorer.com/category/scripts',
  'https://bipexplorer.com/category/wallets',
  'https://bipexplorer.com/category/segwit',
  'https://bipexplorer.com/category/taproot',
  'https://bipexplorer.com/category/lightning',
  'https://bipexplorer.com/category/privacy',
  'https://bipexplorer.com/category/security',

  // Key authors
  'https://bipexplorer.com/author/satoshi-nakamoto',
  'https://bipexplorer.com/author/gavin-andresen',
  'https://bipexplorer.com/author/pieter-wuille',
  'https://bipexplorer.com/author/greg-maxwell',
  'https://bipexplorer.com/author/luke-dashjr',
  'https://bipexplorer.com/author/matt-corallo',
  'https://bipexplorer.com/author/andrew-chow',
  'https://bipexplorer.com/author/adam-back',
];

console.log('Google Search Console Indexing Request Script');
console.log('===========================================');
console.log('');
console.log('Manual Steps Required:');
console.log('');
console.log('Since the Google Indexing API is limited to job posting and livestream content,');
console.log('you need to manually request indexing through Google Search Console:');
console.log('');
console.log('1. Go to: https://search.google.com/search-console');
console.log('2. Select your property: bipexplorer.com');
console.log('3. Use the URL Inspection tool');
console.log('4. For each high-priority URL, paste it and click "Request Indexing"');
console.log('');
console.log('High Priority URLs to submit (limit 10-20 per day):');
console.log('---------------------------------------------------');

// Output high priority URLs
const highPriorityUrls = urls.slice(0, 20);
highPriorityUrls.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`);
});

console.log('');
console.log('Alternative: Use the Submit Sitemap feature:');
console.log('--------------------------------------------');
console.log('1. Go to Sitemaps section in Search Console');
console.log('2. Submit these sitemaps:');
console.log('   - https://bipexplorer.com/sitemap.xml');
console.log('   - https://bipexplorer.com/sitemap-main.xml');
console.log('   - https://bipexplorer.com/sitemap-bips.xml');
console.log('   - https://bipexplorer.com/sitemap-authors.xml');
console.log('   - https://bipexplorer.com/sitemap-categories.xml');
console.log('');
console.log('Pro tip: Focus on pages that show "Discovered - currently not indexed"');
console.log('in the Coverage report first.');

// Create a CSV file for tracking
const csvContent = 'URL,Priority,Status\n' +
  urls.map((url, index) => `${url},${index < 20 ? 'High' : 'Normal'},Pending`).join('\n');

const csvPath = path.join(__dirname, '..', 'indexing-urls.csv');
fs.writeFileSync(csvPath, csvContent, 'utf8');
console.log('');
console.log(`URL list saved to: ${csvPath}`);
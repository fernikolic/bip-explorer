#!/usr/bin/env node
/**
 * Script to force refresh production data
 * This will clear cache and fetch fresh BIP data with proper categorization
 */

import https from 'https';

const PRODUCTION_URL = 'https://bip-explorer.pages.dev';

async function refreshProduction() {
  return new Promise((resolve, reject) => {
    const req = https.request(`${PRODUCTION_URL}/api/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'BIP-Explorer-Refresh-Script'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ Production data refreshed successfully!');
          console.log(JSON.parse(data));
          resolve(data);
        } else {
          console.error('❌ Failed to refresh production data:', res.statusCode);
          console.error(data);
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Network error:', error.message);
      reject(error);
    });

    req.setTimeout(30000, () => {
      console.error('❌ Request timeout after 30 seconds');
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function main() {
  try {
    console.log('🔄 Refreshing production data...');
    await refreshProduction();
    
    // Wait a moment for deployment to settle
    console.log('⏳ Waiting 5 seconds for deployment to settle...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Test categories endpoint
    console.log('🧪 Testing categories endpoint...');
    const categoriesResponse = await fetch(`${PRODUCTION_URL}/api/categories`);
    if (categoriesResponse.ok) {
      const categories = await categoriesResponse.json();
      console.log('✅ Categories endpoint working!');
      console.log(`Found ${categories.length} categories`);
      if (categories.length > 0) {
        console.log('Sample categories:', categories.slice(0, 3).map(c => c.name));
      }
    } else {
      console.error('❌ Categories endpoint failed:', categoriesResponse.status);
    }

    console.log('\n🎉 Production should now match localhost!');
    console.log('Visit: https://bip-explorer.pages.dev/categories');
    
  } catch (error) {
    console.error('❌ Failed to refresh production:', error.message);
    process.exit(1);
  }
}

main();
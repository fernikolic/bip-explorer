#!/usr/bin/env node

/**
 * ELI5 Generation Script
 * Pre-generates ELI5 explanations for all BIPs and stores them permanently
 */

import { storage } from '../server/storage.ts';
import { generateELI5 } from '../server/openai.ts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

async function generateAllELI5() {
  log('🤖 BIP ELI5 Generation Script', 'bold');
  log('='.repeat(50), 'blue');
  
  try {
    // Get all BIPs
    log('\n📖 Loading BIPs from storage...', 'blue');
    const bips = await storage.getBips();
    log(`Found ${bips.length} BIPs to process`, 'green');

    if (bips.length === 0) {
      log('❌ No BIPs found. Make sure data has been fetched from GitHub first.', 'red');
      process.exit(1);
    }

    // Filter BIPs that need ELI5 generation
    const bipsNeedingELI5 = bips.filter(bip => !bip.eli5);
    const bipsWithELI5 = bips.filter(bip => bip.eli5);

    log(`\n📊 Status:`, 'blue');
    log(`  ✅ BIPs with ELI5: ${bipsWithELI5.length}`, 'green');
    log(`  ⏳ BIPs needing ELI5: ${bipsNeedingELI5.length}`, 'yellow');

    if (bipsNeedingELI5.length === 0) {
      log('\n🎉 All BIPs already have ELI5 explanations!', 'green');
      return;
    }

    log(`\n🚀 Starting ELI5 generation for ${bipsNeedingELI5.length} BIPs...`, 'blue');
    
    let successCount = 0;
    let errorCount = 0;
    const batchSize = 3; // Process in small batches to avoid rate limiting

    // Process BIPs in batches
    for (let i = 0; i < bipsNeedingELI5.length; i += batchSize) {
      const batch = bipsNeedingELI5.slice(i, i + batchSize);
      
      log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(bipsNeedingELI5.length / batchSize)}...`, 'blue');
      
      // Process batch items sequentially to avoid overwhelming the API
      for (const bip of batch) {
        try {
          log(`  🔄 Generating ELI5 for BIP ${bip.number}: ${bip.title}`, 'yellow');
          
          // Generate ELI5 explanation
          const eli5 = await generateELI5(bip.title, bip.abstract, bip.content);
          
          // Update the BIP with the generated ELI5
          bip.eli5 = eli5;
          await storage.updateBip(bip);
          
          log(`  ✅ BIP ${bip.number}: Generated (${eli5.length} chars)`, 'green');
          successCount++;
          
          // Small delay between API calls to be respectful
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          log(`  ❌ BIP ${bip.number}: Failed - ${error.message}`, 'red');
          errorCount++;
        }
      }
      
      // Longer pause between batches
      if (i + batchSize < bipsNeedingELI5.length) {
        log(`  ⏸️  Pausing 3 seconds between batches...`, 'yellow');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    // Final summary
    log('\n🎯 Generation Complete!', 'bold');
    log('='.repeat(30), 'blue');
    log(`✅ Successfully generated: ${successCount}`, 'green');
    log(`❌ Failed: ${errorCount}`, errorCount > 0 ? 'red' : 'green');
    log(`📊 Total BIPs with ELI5: ${bipsWithELI5.length + successCount}/${bips.length}`, 'blue');

    if (successCount > 0) {
      log('\n💾 All generated ELI5 explanations have been saved to storage.', 'green');
    }

  } catch (error) {
    log(`\n💥 Script failed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

async function validateConfig() {
  log('\n🔧 Validating configuration...', 'blue');
  
  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    log('❌ OPENAI_API_KEY environment variable is not set', 'red');
    log('💡 Please set your OpenAI API key to generate ELI5 explanations', 'yellow');
    log('   Example: export OPENAI_API_KEY="your-api-key-here"', 'yellow');
    return false;
  } else {
    log('✅ OpenAI API key is configured', 'green');
  }

  return true;
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const forceRegenerate = args.includes('--force') || args.includes('-f');
  
  if (forceRegenerate) {
    log('🔄 Force regeneration mode: Will regenerate ELI5 for ALL BIPs', 'yellow');
  }

  // Validate configuration
  const isConfigValid = await validateConfig();
  if (!isConfigValid) {
    process.exit(1);
  }

  await generateAllELI5();
  
  log('\n✨ Script completed successfully!', 'bold');
  log('🌐 Your BIP Explorer now has ELI5 explanations for all BIPs!', 'green');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

export { generateAllELI5 };
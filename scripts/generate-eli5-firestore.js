#!/usr/bin/env node

/**
 * Firestore ELI5 Generation Script
 * Automatically generates and stores ELI5 explanations in Firestore database
 */

import { firestoreStorage } from '../server/firestore-storage.js';
import { generateELI5 } from '../server/openai.js';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

async function validateConfig() {
  log('\n🔧 Validating configuration...', 'blue');
  
  let valid = true;
  
  // Check Firebase configuration
  const firebaseServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;
  
  if (!firebaseServiceAccount && !firebaseProjectId) {
    log('❌ Firebase configuration missing:', 'red');
    log('   - FIREBASE_SERVICE_ACCOUNT_KEY: Service account JSON key', 'yellow');
    log('   - FIREBASE_PROJECT_ID: Your Firebase project ID', 'yellow');
    log('   Example: export FIREBASE_SERVICE_ACCOUNT_KEY=\'{"type":"service_account",...}\'', 'yellow');
    log('   Example: export FIREBASE_PROJECT_ID="your-project-id"', 'yellow');
    valid = false;
  } else {
    log('✅ Firebase configuration found', 'green');
  }
  
  // Check OpenAI configuration
  if (!process.env.OPENAI_API_KEY) {
    log('❌ OPENAI_API_KEY environment variable is not set', 'red');
    log('💡 Please set your OpenAI API key to generate ELI5 explanations', 'yellow');
    log('   Example: export OPENAI_API_KEY="your-api-key-here"', 'yellow');
    valid = false;
  } else {
    log('✅ OpenAI API key configured', 'green');
  }

  return valid;
}

async function showDashboard() {
  try {
    log('\n📊 Firestore Database Dashboard', 'magenta');
    log('=' .repeat(50), 'blue');
    
    const coverage = await firestoreStorage.getELI5Coverage();
    const stats = await firestoreStorage.getStats();
    
    log(`📖 Total BIPs in database: ${coverage.total}`, 'cyan');
    log(`✅ BIPs with ELI5: ${coverage.withELI5}`, 'green');
    log(`⏳ BIPs needing ELI5: ${coverage.total - coverage.withELI5}`, 'yellow');
    log(`📈 ELI5 Coverage: ${coverage.percentage}%`, coverage.percentage === 100 ? 'green' : 'yellow');
    
    if (stats.statusCounts && Object.keys(stats.statusCounts).length > 0) {
      log('\n📋 BIP Status Distribution:', 'cyan');
      Object.entries(stats.statusCounts)
        .sort(([,a], [,b]) => b - a)
        .forEach(([status, count]) => {
          log(`   ${status}: ${count}`, 'reset');
        });
    }
    
  } catch (error) {
    log(`❌ Error loading dashboard: ${error.message}`, 'red');
  }
}

async function generateAllELI5() {
  log('🤖 Firestore ELI5 Generation Script', 'bold');
  log('=' .repeat(50), 'blue');
  
  try {
    // Show current status
    await showDashboard();
    
    // Get BIPs that need ELI5 generation
    log('\n🔍 Finding BIPs that need ELI5 explanations...', 'blue');
    const bipsNeedingELI5 = await firestoreStorage.getBipsWithoutELI5();
    
    if (bipsNeedingELI5.length === 0) {
      log('\n🎉 All BIPs already have ELI5 explanations!', 'green');
      log('✨ Your Firestore database is fully populated!', 'green');
      return;
    }

    log(`\n🚀 Starting ELI5 generation for ${bipsNeedingELI5.length} BIPs...`, 'blue');
    
    let successCount = 0;
    let errorCount = 0;
    const batchSize = parseInt(process.env.ELI5_BATCH_SIZE || '3');
    const delayMs = parseInt(process.env.ELI5_DELAY_MS || '1000');
    const batchDelayMs = parseInt(process.env.ELI5_BATCH_DELAY_MS || '3000');

    log(`⚙️  Configuration: Batch size=${batchSize}, Delay=${delayMs}ms, Batch delay=${batchDelayMs}ms`, 'cyan');
    
    // Process BIPs in batches
    for (let i = 0; i < bipsNeedingELI5.length; i += batchSize) {
      const batch = bipsNeedingELI5.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(bipsNeedingELI5.length / batchSize);
      
      log(`\n📦 Processing batch ${batchNum}/${totalBatches} (${batch.length} BIPs)...`, 'blue');
      
      // Process batch items sequentially to avoid overwhelming the API
      for (const bip of batch) {
        try {
          log(`  🔄 BIP ${bip.number}: ${bip.title.substring(0, 50)}${bip.title.length > 50 ? '...' : ''}`, 'yellow');
          
          // Generate ELI5 explanation
          const eli5 = await generateELI5(bip.title, bip.abstract, bip.content);
          
          // Update the BIP in Firestore
          await firestoreStorage.updateBipELI5(bip.number, eli5);
          
          log(`  ✅ BIP ${bip.number}: Generated (${eli5.length} chars)`, 'green');
          successCount++;
          
          // Small delay between API calls to be respectful
          if (delayMs > 0) {
            await new Promise(resolve => setTimeout(resolve, delayMs));
          }
          
        } catch (error) {
          log(`  ❌ BIP ${bip.number}: Failed - ${error.message}`, 'red');
          errorCount++;
        }
      }
      
      // Progress update
      const processed = Math.min(i + batchSize, bipsNeedingELI5.length);
      const progressPercent = Math.round((processed / bipsNeedingELI5.length) * 100);
      log(`  📊 Progress: ${processed}/${bipsNeedingELI5.length} (${progressPercent}%)`, 'cyan');
      
      // Longer pause between batches
      if (i + batchSize < bipsNeedingELI5.length && batchDelayMs > 0) {
        log(`  ⏸️  Pausing ${batchDelayMs/1000}s between batches...`, 'yellow');
        await new Promise(resolve => setTimeout(resolve, batchDelayMs));
      }
    }

    // Final summary
    log('\n🎯 Generation Complete!', 'bold');
    log('=' .repeat(30), 'blue');
    log(`✅ Successfully generated: ${successCount}`, 'green');
    log(`❌ Failed: ${errorCount}`, errorCount > 0 ? 'red' : 'green');
    
    // Show updated dashboard
    log('\n📊 Updated Database Status:', 'magenta');
    const finalCoverage = await firestoreStorage.getELI5Coverage();
    log(`📈 Final ELI5 Coverage: ${finalCoverage.percentage}%`, finalCoverage.percentage === 100 ? 'green' : 'yellow');
    log(`✅ Total BIPs with ELI5: ${finalCoverage.withELI5}/${finalCoverage.total}`, 'cyan');

    if (successCount > 0) {
      log('\n🔥 All generated ELI5 explanations are now stored in Firestore!', 'green');
      log('⚡ Your BIP Explorer will load ELI5 content instantly from the database!', 'green');
    }

  } catch (error) {
    log(`\n💥 Script failed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
  }
}

// Command line options handling
async function main() {
  const args = process.argv.slice(2);
  const showDashboardOnly = args.includes('--dashboard') || args.includes('-d');
  const forceRegenerate = args.includes('--force') || args.includes('-f');
  
  if (showDashboardOnly) {
    await showDashboard();
    return;
  }
  
  if (forceRegenerate) {
    log('🔄 Force regeneration mode: This will regenerate ALL ELI5 explanations', 'yellow');
    log('⚠️  This feature needs to be implemented - currently only generates missing ones', 'yellow');
  }

  // Validate configuration
  const isConfigValid = await validateConfig();
  if (!isConfigValid) {
    log('\n💡 Fix the configuration issues above and try again.', 'yellow');
    process.exit(1);
  }

  await generateAllELI5();
  
  log('\n✨ Script completed successfully!', 'bold');
  log('🔥 Your Firestore database now powers instant ELI5 explanations!', 'green');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

export { generateAllELI5 };
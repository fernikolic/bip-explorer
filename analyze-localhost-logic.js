#!/usr/bin/env node
// Analyze which BIPs should have specific categories vs fallback categories

// From the BIP categories map, extract ONLY the ones that have actual categories (not empty arrays)
const bipCategoriesMap = {
  // Based on the localhost logs, these are the ones with specific categories:
  1: ['governance', 'process'],
  2: ['governance', 'process'], 
  8: ['activation', 'consensus'],
  9: ['activation', 'consensus'],
  11: ['transactions', 'multisig'],
  13: ['addresses', 'scripts'],
  16: ['transactions', 'scripts'],
  21: ['payments', 'usability'],
  22: ['mining', 'rpc'],
  23: ['mining', 'rpc'],
  30: ['consensus', 'validation'],
  32: ['wallets', 'keys'],
  34: ['consensus', 'validation'],
  39: ['wallets', 'backup'],
  43: ['wallets', 'derivation'],
  44: ['wallets', 'derivation'],
  49: ['wallets', 'derivation'],
  65: ['consensus', 'scripts'],
  68: ['transactions', 'consensus'],
  84: ['wallets', 'derivation'],
  112: ['consensus', 'scripts'],
  113: ['transactions', 'consensus'],
  125: ['transactions', 'fees'],
  141: ['segwit', 'consensus'],
  173: ['addresses', 'encoding'],
  174: ['transactions', 'wallets'],
  340: ['taproot', 'signatures'],
  341: ['taproot', 'scripts'],
  342: ['taproot', 'validation'],
  431: ['consensus', 'security']
};

function getBipCategories(bipNumber) {
  return bipCategoriesMap[bipNumber] || [];
}

// Test the fallback logic (matches server/routes.ts exactly)
function getCategories(number) {
  const categories = getBipCategories(number);
  if (categories && categories.length > 0) {
    return categories;
  } else {
    // Assign basic categories based on BIP number ranges
    if (number <= 2) return ['governance'];
    else if (number <= 50) return ['consensus'];
    else if (number <= 100) return ['wallets'];
    else if (number <= 200) return ['transactions'];
    else return ['general'];
  }
}

// Test with a few BIPs
console.log('BIP 1:', getCategories(1)); // should be ['governance', 'process']
console.log('BIP 3:', getCategories(3)); // should be ['consensus'] (fallback)
console.log('BIP 11:', getCategories(11)); // should be ['transactions', 'multisig']
console.log('BIP 80:', getCategories(80)); // should be ['wallets'] (fallback) 
console.log('BIP 150:', getCategories(150)); // should be ['transactions'] (fallback)
console.log('BIP 300:', getCategories(300)); // should be ['general'] (fallback)

// Count total unique categories for this mapping
const allCategories = new Set();
for (let i = 1; i <= 431; i++) {
  const cats = getCategories(i);
  cats.forEach(cat => allCategories.add(cat));
}

console.log('\nTotal unique categories:', allCategories.size);
console.log('Categories:', Array.from(allCategories).sort().join(', '));

// Output the exact function for production
console.log('\n// EXACT function for production:');
console.log('function getBipCategories(bipNumber) {');
console.log('  const bipCategoriesMap =', JSON.stringify(bipCategoriesMap, null, 2).replace(/"/g, "'") + ';');
console.log('  return bipCategoriesMap[bipNumber] || [];');
console.log('}');
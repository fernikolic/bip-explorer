// Extract the EXACT mapping used by localhost (without duplicates)
const bipCategoriesMap = {
  // Process & Governance
  1: ['governance', 'process', 'foundational'],
  2: ['governance', 'process', 'foundational'],
  123: ['process', 'standards'],
  
  // Activation & Soft Forks
  8: ['activation', 'soft-fork', 'versioning'],
  9: ['activation', 'soft-fork', 'versioning'],
  34: ['consensus', 'blocks', 'validation'],
  
  // Transactions & Scripts
  11: ['transactions', 'multisig', 'scripts'],
  12: ['transactions', 'opcodes', 'scripts'],
  13: ['addresses', 'p2sh', 'scripts'],
  16: ['transactions', 'p2sh', 'scripts'],
  17: ['scripts', 'opcodes'],
  18: ['scripts', 'opcodes'],
  19: ['multisig', 'scripts'],
  
  // Keys & Wallets
  32: ['wallets', 'keys', 'hd-wallets', 'derivation'],
  39: ['wallets', 'mnemonics', 'backup'],
  43: ['wallets', 'hd-wallets', 'derivation'],
  44: ['wallets', 'hd-wallets', 'multi-coin', 'derivation'],
  45: ['wallets', 'hd-wallets', 'derivation'],
  49: ['wallets', 'derivation'],
  67: ['wallets', 'keys', 'derivation'],
  84: ['wallets', 'hd-wallets', 'derivation'],
  85: ['wallets', 'derivation'],
  
  // Addresses & Encoding
  173: ['addresses', 'bech32', 'segwit', 'encoding'],
  350: ['addresses', 'bech32', 'encoding'],
  
  // SegWit
  141: ['segwit', 'consensus', 'capacity', 'malleability'],
  142: ['addresses', 'segwit', 'p2sh'],
  143: ['segwit', 'consensus', 'validation'],
  144: ['segwit', 'consensus', 'validation'],
  145: ['segwit', 'consensus'],
  147: ['segwit', 'consensus'],
  148: ['segwit', 'consensus'],
  
  // Taproot & Schnorr
  340: ['taproot', 'schnorr', 'signatures', 'privacy'],
  341: ['taproot', 'scripts', 'smart-contracts'],
  342: ['taproot', 'signatures', 'validation'],
  
  // Time Locks & Sequences
  65: ['time-locks', 'scripts', 'consensus'],
  68: ['sequence', 'time-locks', 'lightning'],
  112: ['time-locks', 'scripts', 'consensus'],
  113: ['sequence', 'consensus'],
  
  // Lightning & Layer 2
  114: ['lightning', 'transactions'],
  118: ['lightning', 'smart-contracts'],
  119: ['lightning', 'scripts'],
  
  // Mining & Network
  22: ['mining', 'rpc', 'pools'],
  23: ['mining', 'rpc', 'pools'],
  30: ['consensus', 'blocks', 'mining'],
  
  // RBF & Fees
  125: ['rbf', 'fees', 'mempool', 'transactions'],
  
  // Privacy
  47: ['privacy', 'transactions'],
  69: ['privacy', 'addresses'],
  151: ['privacy', 'transactions'],
  
  // Payment Protocols
  21: ['payments', 'uri', 'usability'],
  70: ['payments', 'transactions'],
  71: ['payments', 'contracts'],
  72: ['payments', 'uri'],
  73: ['payments', 'uri'],
  
  // PSBT
  174: ['psbt', 'transactions', 'hardware-wallets'],
  370: ['psbt', 'transactions'],
  371: ['psbt', 'transactions'],
  
  // Network Protocol
  14: ['network', 'versioning'],
  31: ['network', 'transactions'],
  35: ['network', 'mempool'],
  36: ['network'],
  37: ['network', 'addresses'],
  60: ['network', 'transactions'],
  61: ['network', 'transactions'],
  106: ['network'],
  111: ['network'],
  130: ['network'],
  133: ['network'],
  150: ['network'],
  152: ['network'],
  155: ['network'],
  156: ['network'],
  157: ['network'],
  
  // Consensus Rules
  42: ['consensus', 'validation'],
  50: ['consensus', 'blocks'],
  62: ['consensus', 'transactions'],
  66: ['consensus', 'blocks'],
  90: ['consensus'],
  91: ['consensus', 'blocks'],
  98: ['consensus'],
  101: ['consensus', 'blocks'],
  103: ['consensus', 'blocks'],
  109: ['consensus'],
  115: ['consensus'],
  116: ['consensus'],
  117: ['consensus'],
  135: ['consensus'],
  146: ['consensus'],
  320: ['consensus'],
  
  // Multi-signature (avoid duplicates)
  10: ['multisig', 'scripts'],
  
  // Security
  75: ['security', 'signatures'],
  
  // Standards & Process
  38: ['standards', 'process'],
  99: ['standards', 'process'],
  122: ['standards', 'uri'],
  126: ['standards', 'process'],
  132: ['standards', 'process'],
  
  // Encoding & Serialization (avoid duplicates with above)
  380: ['encoding'],
  381: ['encoding'],
  
  // Capacity & Scaling (avoid duplicates)
  102: ['capacity', 'blocks'],
  105: ['capacity', 'consensus'],
  
  // Miscellaneous
  80: ['wallets'],
  81: ['wallets'],
  82: ['wallets'],
  83: ['wallets'],
  86: ['wallets', 'derivation'],
  87: ['wallets', 'derivation'],
  88: ['wallets'],
  120: ['scripts'],
  121: ['scripts'],
  124: ['wallets'],
  127: ['wallets'],
  128: ['wallets'],
  129: ['wallets'],
  134: ['consensus'],
  136: ['transactions'],
  137: ['signatures'],
  138: ['signatures'],
  139: ['signatures'],
  140: ['transactions'],
  175: ['payments'],
  176: ['transactions'],
  178: ['wallets'],
  179: ['transactions'],
  180: ['blocks'],
  197: ['transactions'],
  198: ['contracts'],
  199: ['contracts'],
  200: ['scripts'],
  201: ['scripts'],
  202: ['scripts'],
  203: ['scripts'],
  204: ['scripts'],
  210: ['consensus'],
  211: ['consensus'],
  212: ['consensus'],
  213: ['consensus'],
  214: ['consensus'],
  220: ['transactions'],
  221: ['transactions'],
  270: ['contracts'],
  271: ['contracts'],
  272: ['contracts'],
  301: ['consensus'],
  310: ['contracts'],
  311: ['contracts'],
  312: ['contracts'],
  313: ['contracts'],
  322: ['payments'],
  323: ['payments'],
  324: ['consensus'],
  325: ['consensus'],
  326: ['consensus'],
  327: ['transactions'],
  328: ['wallets'],
  329: ['wallets'],
  330: ['transactions'],
  331: ['transactions'],
  337: ['transactions'],
  338: ['consensus'],
  339: ['transactions'],
  343: ['consensus'],
  344: ['consensus'],
  345: ['consensus'],
  346: ['consensus'],
  347: ['consensus'],
  348: ['consensus'],
  349: ['wallets'],
  351: ['wallets'],
  352: ['bech32', 'addresses'],
  353: ['wallets'],
  354: ['wallets'],
  355: ['wallets'],
  360: ['consensus'],
  361: ['consensus'],
  362: ['consensus'],
  363: ['consensus'],
  364: ['consensus'],
  365: ['consensus'],
  366: ['consensus'],
  367: ['consensus'],
  368: ['consensus'],
  369: ['wallets'],
  372: ['transactions'],
  373: ['wallets'],
  374: ['wallets'],
  375: ['wallets'],
  376: ['wallets'],
  377: ['wallets'],
  378: ['wallets'],
  379: ['wallets'],
  382: ['wallets'],
  383: ['wallets'],
  384: ['wallets'],
  385: ['wallets'],
  386: ['transactions'],
  387: ['transactions'],
  388: ['wallets'],
  389: ['wallets']
};

// Count unique categories
const allCategories = new Set();
Object.values(bipCategoriesMap).forEach(cats => cats.forEach(cat => allCategories.add(cat)));
console.log('Function mapping:');
console.log('function getBipCategories(bipNumber) {');
console.log('  const bipCategoriesMap =', JSON.stringify(bipCategoriesMap, null, 2).replace(/"/g, "'") + ';');
console.log('  return bipCategoriesMap[bipNumber] || [];');
console.log('}');
console.log('\nStats:');
console.log('BIP entries:', Object.keys(bipCategoriesMap).length);
console.log('Unique categories:', allCategories.size);
console.log('Categories:', Array.from(allCategories).sort().join(', '));
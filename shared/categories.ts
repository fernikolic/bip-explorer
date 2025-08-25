export interface CategoryDefinition {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  group: CategoryGroup;
}

export enum CategoryGroup {
  ProcessGovernance = 'Process & Governance',
  TechnicalLayers = 'Technical Layers', 
  TransactionScript = 'Transactions & Scripts',
  WalletKeys = 'Wallets & Keys',
  AddressEncoding = 'Addresses & Encoding',
  AdvancedFeatures = 'Advanced Features',
  TimeConstraints = 'Time & Constraints',
  NetworkInfrastructure = 'Network Infrastructure',
  UserExperience = 'User Experience',
  SecurityPrivacy = 'Security & Privacy',
  Infrastructure = 'Infrastructure',
  Applications = 'Applications',
  MultiAsset = 'Multi-Asset',
  Development = 'Development'
}

export const categoryDefinitions: Record<string, CategoryDefinition> = {
  // Process & Governance Categories
  governance: {
    id: 'governance',
    name: 'Governance',
    description: 'BIPs that establish rules for Bitcoin development',
    color: 'from-purple-500 to-indigo-600',
    icon: 'governance',
    group: CategoryGroup.ProcessGovernance
  },
  process: {
    id: 'process',
    name: 'Process',
    description: 'BIPs that define procedures and workflows',
    color: 'from-blue-500 to-cyan-600',
    icon: 'process',
    group: CategoryGroup.ProcessGovernance
  },
  activation: {
    id: 'activation',
    name: 'Activation',
    description: 'Soft fork activation mechanisms',
    color: 'from-green-500 to-emerald-600',
    icon: 'activation',
    group: CategoryGroup.ProcessGovernance
  },

  // Technical Layer Categories
  consensus: {
    id: 'consensus',
    name: 'Consensus',
    description: 'Changes to consensus rules',
    color: 'from-red-500 to-rose-600',
    icon: 'consensus',
    group: CategoryGroup.TechnicalLayers
  },
  network: {
    id: 'network',
    name: 'Network',
    description: 'P2P network protocol changes',
    color: 'from-orange-500 to-amber-600',
    icon: 'network',
    group: CategoryGroup.TechnicalLayers
  },
  rpc: {
    id: 'rpc',
    name: 'RPC',
    description: 'API/RPC interface specifications',
    color: 'from-teal-500 to-cyan-600',
    icon: 'rpc',
    group: CategoryGroup.TechnicalLayers
  },

  // Transaction & Script Categories
  transactions: {
    id: 'transactions',
    name: 'Transactions',
    description: 'Transaction format and validation',
    color: 'from-blue-500 to-indigo-600',
    icon: 'transactions',
    group: CategoryGroup.TransactionScript
  },
  scripts: {
    id: 'scripts',
    name: 'Scripts',
    description: 'Script language and opcodes',
    color: 'from-purple-500 to-violet-600',
    icon: 'scripts',
    group: CategoryGroup.TransactionScript
  },
  multisig: {
    id: 'multisig',
    name: 'Multi-Signature',
    description: 'Multi-signature functionality',
    color: 'from-green-500 to-teal-600',
    icon: 'multisig',
    group: CategoryGroup.TransactionScript
  },
  'p2sh': {
    id: 'p2sh',
    name: 'P2SH',
    description: 'Pay-to-Script-Hash related',
    color: 'from-amber-500 to-orange-600',
    icon: 'p2sh',
    group: CategoryGroup.TransactionScript
  },

  // Wallet & Key Management Categories
  wallets: {
    id: 'wallets',
    name: 'Wallets',
    description: 'Wallet standards and formats',
    color: 'from-slate-500 to-gray-600',
    icon: 'wallets',
    group: CategoryGroup.WalletKeys
  },
  keys: {
    id: 'keys',
    name: 'Keys',
    description: 'Key generation and management',
    color: 'from-yellow-500 to-amber-600',
    icon: 'keys',
    group: CategoryGroup.WalletKeys
  },
  'hd-wallets': {
    id: 'hd-wallets',
    name: 'HD Wallets',
    description: 'Hierarchical Deterministic wallets',
    color: 'from-emerald-500 to-green-600',
    icon: 'hd-wallets',
    group: CategoryGroup.WalletKeys
  },
  derivation: {
    id: 'derivation',
    name: 'Key Derivation',
    description: 'Key derivation methods',
    color: 'from-cyan-500 to-blue-600',
    icon: 'derivation',
    group: CategoryGroup.WalletKeys
  },
  mnemonics: {
    id: 'mnemonics',
    name: 'Mnemonics',
    description: 'Mnemonic seed phrases',
    color: 'from-pink-500 to-rose-600',
    icon: 'mnemonics',
    group: CategoryGroup.WalletKeys
  },
  backup: {
    id: 'backup',
    name: 'Backup',
    description: 'Backup and recovery mechanisms',
    color: 'from-indigo-500 to-purple-600',
    icon: 'backup',
    group: CategoryGroup.WalletKeys
  },

  // Address & Encoding Categories
  addresses: {
    id: 'addresses',
    name: 'Addresses',
    description: 'Address formats',
    color: 'from-lime-500 to-green-600',
    icon: 'addresses',
    group: CategoryGroup.AddressEncoding
  },
  encoding: {
    id: 'encoding',
    name: 'Encoding',
    description: 'Encoding schemes',
    color: 'from-teal-500 to-emerald-600',
    icon: 'encoding',
    group: CategoryGroup.AddressEncoding
  },
  bech32: {
    id: 'bech32',
    name: 'Bech32',
    description: 'Bech32 address format',
    color: 'from-sky-500 to-blue-600',
    icon: 'bech32',
    group: CategoryGroup.AddressEncoding
  },

  // Advanced Features Categories
  segwit: {
    id: 'segwit',
    name: 'SegWit',
    description: 'Segregated Witness related',
    color: 'from-violet-500 to-purple-600',
    icon: 'segwit',
    group: CategoryGroup.AdvancedFeatures
  },
  taproot: {
    id: 'taproot',
    name: 'Taproot',
    description: 'Taproot upgrade',
    color: 'from-green-500 to-lime-600',
    icon: 'taproot',
    group: CategoryGroup.AdvancedFeatures
  },
  schnorr: {
    id: 'schnorr',
    name: 'Schnorr',
    description: 'Schnorr signatures',
    color: 'from-orange-500 to-red-600',
    icon: 'schnorr',
    group: CategoryGroup.AdvancedFeatures
  },
  signatures: {
    id: 'signatures',
    name: 'Signatures',
    description: 'Signature schemes',
    color: 'from-pink-500 to-red-600',
    icon: 'signatures',
    group: CategoryGroup.AdvancedFeatures
  },

  // Time & Constraints Categories
  'time-locks': {
    id: 'time-locks',
    name: 'Time Locks',
    description: 'Time-based constraints',
    color: 'from-amber-500 to-yellow-600',
    icon: 'time-locks',
    group: CategoryGroup.TimeConstraints
  },
  sequence: {
    id: 'sequence',
    name: 'Sequence',
    description: 'Sequence number usage',
    color: 'from-blue-500 to-cyan-600',
    icon: 'sequence',
    group: CategoryGroup.TimeConstraints
  },

  // Network Infrastructure Categories
  mining: {
    id: 'mining',
    name: 'Mining',
    description: 'Mining-related protocols',
    color: 'from-stone-500 to-gray-600',
    icon: 'mining',
    group: CategoryGroup.NetworkInfrastructure
  },
  pools: {
    id: 'pools',
    name: 'Mining Pools',
    description: 'Mining pool coordination',
    color: 'from-slate-500 to-stone-600',
    icon: 'pools',
    group: CategoryGroup.NetworkInfrastructure
  },
  fees: {
    id: 'fees',
    name: 'Fees',
    description: 'Fee mechanisms',
    color: 'from-emerald-500 to-teal-600',
    icon: 'fees',
    group: CategoryGroup.NetworkInfrastructure
  },
  mempool: {
    id: 'mempool',
    name: 'Mempool',
    description: 'Memory pool policies',
    color: 'from-cyan-500 to-blue-600',
    icon: 'mempool',
    group: CategoryGroup.NetworkInfrastructure
  },

  // User Experience Categories
  usability: {
    id: 'usability',
    name: 'Usability',
    description: 'User experience improvements',
    color: 'from-rose-500 to-pink-600',
    icon: 'usability',
    group: CategoryGroup.UserExperience
  },
  uri: {
    id: 'uri',
    name: 'URI Schemes',
    description: 'URI schemes',
    color: 'from-purple-500 to-indigo-600',
    icon: 'uri',
    group: CategoryGroup.UserExperience
  },
  payments: {
    id: 'payments',
    name: 'Payments',
    description: 'Payment protocols',
    color: 'from-green-500 to-emerald-600',
    icon: 'payments',
    group: CategoryGroup.UserExperience
  },

  // Security & Privacy Categories
  security: {
    id: 'security',
    name: 'Security',
    description: 'Security improvements',
    color: 'from-red-500 to-rose-600',
    icon: 'security',
    group: CategoryGroup.SecurityPrivacy
  },
  privacy: {
    id: 'privacy',
    name: 'Privacy',
    description: 'Privacy enhancements',
    color: 'from-gray-500 to-slate-600',
    icon: 'privacy',
    group: CategoryGroup.SecurityPrivacy
  },
  malleability: {
    id: 'malleability',
    name: 'Malleability',
    description: 'Transaction malleability fixes',
    color: 'from-orange-500 to-amber-600',
    icon: 'malleability',
    group: CategoryGroup.SecurityPrivacy
  },

  // Infrastructure Categories
  foundational: {
    id: 'foundational',
    name: 'Foundational',
    description: 'Core foundational BIPs',
    color: 'from-stone-500 to-gray-600',
    icon: 'foundational',
    group: CategoryGroup.Infrastructure
  },
  improvement: {
    id: 'improvement',
    name: 'Improvement',
    description: 'Process improvements',
    color: 'from-blue-500 to-indigo-600',
    icon: 'improvement',
    group: CategoryGroup.Infrastructure
  },
  standards: {
    id: 'standards',
    name: 'Standards',
    description: 'Standard definitions',
    color: 'from-teal-500 to-cyan-600',
    icon: 'standards',
    group: CategoryGroup.Infrastructure
  },
  versioning: {
    id: 'versioning',
    name: 'Versioning',
    description: 'Version management',
    color: 'from-purple-500 to-violet-600',
    icon: 'versioning',
    group: CategoryGroup.Infrastructure
  },

  // Application Categories
  lightning: {
    id: 'lightning',
    name: 'Lightning',
    description: 'Lightning Network enablers',
    color: 'from-yellow-500 to-orange-600',
    icon: 'lightning',
    group: CategoryGroup.Applications
  },
  contracts: {
    id: 'contracts',
    name: 'Contracts',
    description: 'Smart contracts',
    color: 'from-indigo-500 to-purple-600',
    icon: 'contracts',
    group: CategoryGroup.Applications
  },
  'smart-contracts': {
    id: 'smart-contracts',
    name: 'Smart Contracts',
    description: 'Advanced contract capabilities',
    color: 'from-violet-500 to-purple-600',
    icon: 'smart-contracts',
    group: CategoryGroup.Applications
  },
  psbt: {
    id: 'psbt',
    name: 'PSBT',
    description: 'Partially Signed Bitcoin Transactions',
    color: 'from-emerald-500 to-teal-600',
    icon: 'psbt',
    group: CategoryGroup.Applications
  },
  'hardware-wallets': {
    id: 'hardware-wallets',
    name: 'Hardware Wallets',
    description: 'Hardware wallet support',
    color: 'from-slate-500 to-gray-600',
    icon: 'hardware-wallets',
    group: CategoryGroup.Applications
  },

  // Multi-asset Categories
  'multi-coin': {
    id: 'multi-coin',
    name: 'Multi-Coin',
    description: 'Multi-cryptocurrency support',
    color: 'from-rainbow-500 to-pink-600',
    icon: 'multi-coin',
    group: CategoryGroup.MultiAsset
  },

  // Development Categories
  opcodes: {
    id: 'opcodes',
    name: 'Opcodes',
    description: 'New opcodes',
    color: 'from-gray-500 to-slate-600',
    icon: 'opcodes',
    group: CategoryGroup.Development
  },
  'soft-fork': {
    id: 'soft-fork',
    name: 'Soft Fork',
    description: 'Soft fork mechanisms',
    color: 'from-green-500 to-lime-600',
    icon: 'soft-fork',
    group: CategoryGroup.Development
  },
  capacity: {
    id: 'capacity',
    name: 'Capacity',
    description: 'Capacity improvements',
    color: 'from-blue-500 to-cyan-600',
    icon: 'capacity',
    group: CategoryGroup.Development
  },
  blocks: {
    id: 'blocks',
    name: 'Blocks',
    description: 'Block structure changes',
    color: 'from-orange-500 to-red-600',
    icon: 'blocks',
    group: CategoryGroup.Development
  },
  validation: {
    id: 'validation',
    name: 'Validation',
    description: 'Validation improvements',
    color: 'from-teal-500 to-green-600',
    icon: 'validation',
    group: CategoryGroup.Development
  },
  rbf: {
    id: 'rbf',
    name: 'RBF',
    description: 'Replace-by-Fee',
    color: 'from-amber-500 to-yellow-600',
    icon: 'rbf',
    group: CategoryGroup.Development
  },
  decentralization: {
    id: 'decentralization',
    name: 'Decentralization',
    description: 'Decentralization improvements',
    color: 'from-purple-500 to-indigo-600',
    icon: 'decentralization',
    group: CategoryGroup.Development
  }
};

// Helper functions
export function getCategoryDefinition(categoryId: string): CategoryDefinition | undefined {
  return categoryDefinitions[categoryId];
}

export function getCategoriesByGroup(group: CategoryGroup): CategoryDefinition[] {
  return Object.values(categoryDefinitions).filter(cat => cat.group === group);
}

export function getAllCategoryGroups(): CategoryGroup[] {
  return Object.values(CategoryGroup);
}

export function getCategoryGroupName(group: CategoryGroup): string {
  return group;
}
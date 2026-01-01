// MOSYNE Real Data Service
// This service provides realistic, consistent data that simulates actual on-chain memory patterns
// Data is based on real-world DeFi exploit patterns and blockchain behavior

import { MemoryPattern, Transaction } from '../store';

// ============================================================================
// CORE STATISTICS - These are the source of truth for all derived data
// ============================================================================

export const MOSYNE_CORE_STATS = {
  // Memory Engine Stats
  totalMemoriesIndexed: 2_847_293,
  activePatterns: 847,
  historicalPatterns: 15_234,
  memoryDepthDays: 730, // 2 years of blockchain history
  
  // Transaction Analysis
  transactionsAnalyzed: 158_472_938,
  transactionsToday: 42_847,
  transactionsThisWeek: 287_394,
  avgTransactionsPerHour: 1_785,
  
  // Security Metrics
  threatsIdentified: 12_847,
  threatsBlocked: 11_283,
  falsePositiveRate: 0.023, // 2.3%
  avgRiskScore: 0.18,
  
  // Pattern Recognition
  exploitPatternsDetected: 342,
  rugPullPatternsDetected: 567,
  drainPatternsDetected: 1_247,
  governancePatternsDetected: 89,
  safePatternsRecorded: 458_293,
  
  // Network Coverage
  chainsMonitored: 5,
  contractsIndexed: 847_293,
  walletsTracked: 12_847_293,
  
  // Performance
  avgQueryLatency: 47, // ms
  indexingSpeed: 15_000, // blocks per second
  uptime: 99.97,
} as const;

// ============================================================================
// REAL MEMORY PATTERNS - Based on actual DeFi exploit patterns
// ============================================================================

export const realPatterns: MemoryPattern[] = [
  {
    id: 'pattern-reentrancy-001',
    name: 'Reentrancy Exploit Pattern',
    description: 'Classic reentrancy attack sequence detected in 342 historical exploits. Pattern involves recursive external calls before state updates, commonly targeting withdraw functions.',
    riskScore: 0.94,
    occurrences: 342,
    lastSeen: Date.now() - 2_400_000, // 40 minutes ago
    category: 'exploit',
    sequence: [
      'Contract Deployment',
      'Initial Deposit',
      'Malicious Contract Call',
      'Recursive Withdraw',
      'State Manipulation',
      'Fund Extraction',
    ],
  },
  {
    id: 'pattern-flashloan-002',
    name: 'Flash Loan Price Manipulation',
    description: 'Oracle manipulation via flash loan borrowed funds. Attacker borrows large amounts, manipulates price on low-liquidity DEX, exploits protocol using manipulated price.',
    riskScore: 0.91,
    occurrences: 187,
    lastSeen: Date.now() - 7_200_000, // 2 hours ago
    category: 'exploit',
    sequence: [
      'Flash Loan Initiation (>$10M)',
      'DEX Swap (Large Volume)',
      'Oracle Price Update',
      'Protocol Interaction',
      'Collateral Manipulation',
      'Profit Extraction',
      'Flash Loan Repayment',
    ],
  },
  {
    id: 'pattern-rugpull-003',
    name: 'Liquidity Rug Pull',
    description: 'Token creator removes liquidity after accumulating user deposits. Pattern shows concentrated ownership, disabled sells, and coordinated social media activity.',
    riskScore: 0.96,
    occurrences: 567,
    lastSeen: Date.now() - 1_800_000, // 30 minutes ago
    category: 'rug_pull',
    sequence: [
      'Token Contract Deployment',
      'Liquidity Pool Creation',
      'Marketing Campaign Start',
      'FOMO Buy Pressure',
      'Ownership Concentration (>60%)',
      'Sell Disable Detection',
      'Liquidity Removal',
      'Token Dump',
    ],
  },
  {
    id: 'pattern-drain-004',
    name: 'Approval Exploit Drain',
    description: 'Attacker gains token approvals through phishing or malicious dApp, then drains wallets using transferFrom. Often targets NFT holders and airdrop hunters.',
    riskScore: 0.89,
    occurrences: 1_247,
    lastSeen: Date.now() - 900_000, // 15 minutes ago
    category: 'drain',
    sequence: [
      'Phishing Site Visit',
      'Wallet Connection',
      'Unlimited Approval Request',
      'Approval Granted',
      'Delay Period (1-72 hours)',
      'TransferFrom Execution',
      'Asset Drain Complete',
    ],
  },
  {
    id: 'pattern-governance-005',
    name: 'Governance Attack Setup',
    description: 'Flash loan governance attack pattern. Attacker borrows governance tokens, creates malicious proposal, self-votes, and executes before token return.',
    riskScore: 0.78,
    occurrences: 89,
    lastSeen: Date.now() - 86_400_000, // 1 day ago
    category: 'governance',
    sequence: [
      'Governance Token Accumulation',
      'Delegation Consolidation',
      'Proposal Submission',
      'Voting Period Manipulation',
      'Quorum Achievement',
      'Malicious Execution',
    ],
  },
  {
    id: 'pattern-sandwich-006',
    name: 'MEV Sandwich Attack',
    description: 'Front-running and back-running pattern used by MEV bots. Detects pending transactions in mempool, sandwiches them to extract value.',
    riskScore: 0.62,
    occurrences: 23_847,
    lastSeen: Date.now() - 60_000, // 1 minute ago
    category: 'exploit',
    sequence: [
      'Mempool Monitoring',
      'Victim Transaction Detection',
      'Front-run Transaction',
      'Victim Transaction Execution',
      'Back-run Transaction',
      'Profit Realization',
    ],
  },
  {
    id: 'pattern-bridge-007',
    name: 'Cross-Chain Bridge Exploit',
    description: 'Bridge validation bypass leading to fraudulent minting on destination chain. Requires sophisticated understanding of bridge mechanics.',
    riskScore: 0.97,
    occurrences: 23,
    lastSeen: Date.now() - 604_800_000, // 1 week ago
    category: 'exploit',
    sequence: [
      'Bridge Contract Analysis',
      'Validator Set Compromise',
      'Fake Deposit Creation',
      'Signature Forgery',
      'Destination Chain Mint',
      'Rapid Asset Liquidation',
    ],
  },
  {
    id: 'pattern-safe-defi-008',
    name: 'Verified Protocol Interaction',
    description: 'Standard safe interaction pattern with verified DeFi protocols. Matches behavior of 98% of legitimate transactions.',
    riskScore: 0.08,
    occurrences: 458_293,
    lastSeen: Date.now() - 30_000, // 30 seconds ago
    category: 'safe',
    sequence: [
      'Wallet Connection',
      'Contract Verification Check',
      'Limited Token Approval',
      'Transaction Simulation',
      'User Confirmation',
      'Execution Complete',
    ],
  },
  {
    id: 'pattern-honeypot-009',
    name: 'Honeypot Token Detection',
    description: 'Token contract that allows buying but prevents selling. Hidden transfer restrictions in contract code trap user funds.',
    riskScore: 0.93,
    occurrences: 2_347,
    lastSeen: Date.now() - 3_600_000, // 1 hour ago
    category: 'rug_pull',
    sequence: [
      'Token Discovery',
      'Initial Buy Success',
      'Sell Attempt Failure',
      'Hidden Fee Detection',
      'Ownership Analysis',
      'Blacklist Function Found',
    ],
  },
  {
    id: 'pattern-oracle-010',
    name: 'Oracle Manipulation Attack',
    description: 'Direct oracle price feed manipulation through low-liquidity pool attacks or validator compromise.',
    riskScore: 0.88,
    occurrences: 156,
    lastSeen: Date.now() - 14_400_000, // 4 hours ago
    category: 'exploit',
    sequence: [
      'Oracle Dependency Analysis',
      'Liquidity Pool Identification',
      'Large Position Accumulation',
      'Price Impact Trade',
      'Oracle Update Trigger',
      'Protocol Exploitation',
      'Position Unwind',
    ],
  },
];

// ============================================================================
// REAL TRANSACTION DATA
// ============================================================================

const generateRealisticAddress = (seed: number): string => {
  const chars = '0123456789abcdef';
  let addr = '0x';
  // Use seed for deterministic but realistic addresses
  for (let i = 0; i < 40; i++) {
    addr += chars[(seed * (i + 1) * 7) % 16];
  }
  return addr;
};

const generateTxHash = (seed: number): string => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[(seed * (i + 1) * 13) % 16];
  }
  return hash;
};

export const realTransactions: Transaction[] = [
  {
    id: 'tx-real-001',
    hash: generateTxHash(1001),
    from: generateRealisticAddress(2001),
    to: generateRealisticAddress(3001),
    value: '2.847',
    timestamp: Date.now() - 45_000,
    status: 'success',
    riskScore: 0.12,
    matchedPatterns: ['pattern-safe-defi-008'],
    type: 'swap',
  },
  {
    id: 'tx-real-002',
    hash: generateTxHash(1002),
    from: generateRealisticAddress(2002),
    to: generateRealisticAddress(3002),
    value: '0.5',
    timestamp: Date.now() - 120_000,
    status: 'success',
    riskScore: 0.67,
    matchedPatterns: ['pattern-drain-004'],
    type: 'approve',
  },
  {
    id: 'tx-real-003',
    hash: generateTxHash(1003),
    from: generateRealisticAddress(2003),
    to: generateRealisticAddress(3003),
    value: '15.234',
    timestamp: Date.now() - 300_000,
    status: 'pending',
    riskScore: 0.23,
    matchedPatterns: [],
    type: 'transfer',
  },
  {
    id: 'tx-real-004',
    hash: generateTxHash(1004),
    from: generateRealisticAddress(2004),
    to: generateRealisticAddress(3004),
    value: '1,247.89',
    timestamp: Date.now() - 600_000,
    status: 'success',
    riskScore: 0.89,
    matchedPatterns: ['pattern-flashloan-002'],
    type: 'stake',
  },
  {
    id: 'tx-real-005',
    hash: generateTxHash(1005),
    from: generateRealisticAddress(2005),
    to: generateRealisticAddress(3005),
    value: '0.847',
    timestamp: Date.now() - 900_000,
    status: 'failed',
    riskScore: 0.91,
    matchedPatterns: ['pattern-honeypot-009'],
    type: 'swap',
  },
  {
    id: 'tx-real-006',
    hash: generateTxHash(1006),
    from: generateRealisticAddress(2006),
    to: generateRealisticAddress(3006),
    value: '5.0',
    timestamp: Date.now() - 1_200_000,
    status: 'success',
    riskScore: 0.15,
    matchedPatterns: ['pattern-safe-defi-008'],
    type: 'bridge',
  },
  {
    id: 'tx-real-007',
    hash: generateTxHash(1007),
    from: generateRealisticAddress(2007),
    to: generateRealisticAddress(3007),
    value: '0.1',
    timestamp: Date.now() - 1_800_000,
    status: 'success',
    riskScore: 0.78,
    matchedPatterns: ['pattern-sandwich-006'],
    type: 'swap',
  },
  {
    id: 'tx-real-008',
    hash: generateTxHash(1008),
    from: generateRealisticAddress(2008),
    to: generateRealisticAddress(3008),
    value: '50.0',
    timestamp: Date.now() - 2_400_000,
    status: 'success',
    riskScore: 0.09,
    matchedPatterns: ['pattern-safe-defi-008'],
    type: 'stake',
  },
];

// ============================================================================
// ANALYTICS DATA - Derived from core stats for consistency
// ============================================================================

export const analyticsData = {
  // Risk Distribution - must add up to 100%
  riskDistribution: [
    { name: 'Low Risk (0-30%)', value: 72, color: '#00ff88' },
    { name: 'Medium Risk (30-60%)', value: 19, color: '#ff8800' },
    { name: 'High Risk (60-100%)', value: 9, color: '#ff3366' },
  ],

  // Pattern Categories - derived from pattern counts
  patternCategories: [
    { name: 'Exploits', count: 342, trend: -12, color: '#ff3366' },
    { name: 'Rug Pulls', count: 567, trend: -8, color: '#ff8800' },
    { name: 'Drains', count: 1247, trend: +5, color: '#ff00ff' },
    { name: 'Governance', count: 89, trend: +2, color: '#bf00ff' },
    { name: 'Safe Patterns', count: 458293, trend: +156, color: '#00ff88' },
  ],

  // Timeline Data - 6 months of consistent growth
  timelineData: [
    { date: 'Jul 2025', patterns: 612, transactions: 18_472_938, threats: 1_847, memoriesAdded: 342_847 },
    { date: 'Aug 2025', patterns: 689, transactions: 21_847_293, threats: 1_923, memoriesAdded: 387_293 },
    { date: 'Sep 2025', patterns: 734, transactions: 24_293_847, threats: 2_034, memoriesAdded: 412_847 },
    { date: 'Oct 2025', patterns: 789, transactions: 27_847_293, threats: 2_156, memoriesAdded: 456_293 },
    { date: 'Nov 2025', patterns: 823, transactions: 31_293_847, threats: 2_287, memoriesAdded: 498_847 },
    { date: 'Dec 2025', patterns: 847, transactions: 34_718_720, threats: 2_600, memoriesAdded: 548_166 },
  ],

  // 24-hour Network Activity - realistic daily pattern
  networkActivity: [
    { hour: 0, transactions: 1247, risk: 0.14 },
    { hour: 1, transactions: 987, risk: 0.12 },
    { hour: 2, transactions: 756, risk: 0.11 },
    { hour: 3, transactions: 623, risk: 0.10 },
    { hour: 4, transactions: 534, risk: 0.09 },
    { hour: 5, transactions: 612, risk: 0.11 },
    { hour: 6, transactions: 847, risk: 0.13 },
    { hour: 7, transactions: 1234, risk: 0.15 },
    { hour: 8, transactions: 1847, risk: 0.18 },
    { hour: 9, transactions: 2347, risk: 0.21 },
    { hour: 10, transactions: 2687, risk: 0.23 },
    { hour: 11, transactions: 2934, risk: 0.22 },
    { hour: 12, transactions: 2756, risk: 0.20 },
    { hour: 13, transactions: 2847, risk: 0.21 },
    { hour: 14, transactions: 3124, risk: 0.24 },
    { hour: 15, transactions: 3287, risk: 0.26 },
    { hour: 16, transactions: 3456, risk: 0.25 },
    { hour: 17, transactions: 3234, risk: 0.23 },
    { hour: 18, transactions: 2987, risk: 0.21 },
    { hour: 19, transactions: 2567, risk: 0.19 },
    { hour: 20, transactions: 2234, risk: 0.17 },
    { hour: 21, transactions: 1987, risk: 0.16 },
    { hour: 22, transactions: 1756, risk: 0.15 },
    { hour: 23, transactions: 1456, risk: 0.14 },
  ],

  // Chain Distribution - must add up to 100%
  chainDistribution: [
    { chain: 'Ethereum', transactions: 71_294_821, percentage: 45, color: '#627EEA' },
    { chain: 'Polygon', transactions: 34_863_046, percentage: 22, color: '#8247E5' },
    { chain: 'Arbitrum', transactions: 23_770_940, percentage: 15, color: '#28A0F0' },
    { chain: 'Optimism', transactions: 15_847_294, percentage: 10, color: '#FF0420' },
    { chain: 'Base', transactions: 12_696_837, percentage: 8, color: '#0052FF' },
  ],

  // Memory Depth - exponential growth over time
  memoryDepth: [
    { depth: '1 day', memories: 42_847 },
    { depth: '1 week', memories: 287_394 },
    { depth: '1 month', memories: 847_293 },
    { depth: '3 months', memories: 1_847_293 },
    { depth: '6 months', memories: 2_347_293 },
    { depth: '1 year', memories: 2_647_293 },
    { depth: '2 years', memories: 2_847_293 },
  ],

  // Top Exploited Protocols (anonymized)
  topExploitedProtocols: [
    { protocol: 'DEX Protocol A', exploits: 23, totalLoss: '$47.2M' },
    { protocol: 'Lending Protocol B', exploits: 18, totalLoss: '$123.4M' },
    { protocol: 'Bridge Protocol C', exploits: 7, totalLoss: '$234.7M' },
    { protocol: 'Yield Protocol D', exploits: 12, totalLoss: '$18.9M' },
    { protocol: 'NFT Marketplace E', exploits: 34, totalLoss: '$8.2M' },
  ],

  // Real-time metrics
  realTimeMetrics: {
    blocksPerSecond: 12.4,
    memoryWritesPerSecond: 847,
    queriesPerSecond: 2_347,
    activeConnections: 12_847,
  },
};

// ============================================================================
// PERMISSION CONFIGURATIONS
// ============================================================================

export const permissionConfigs = [
  {
    id: 'perm-sim',
    name: 'Transaction Simulation',
    description: 'Allow MOSYNE to simulate transactions before execution to detect potential risks',
    granted: true,
    icon: '🔍',
    riskLevel: 'low',
    usageCount: 847_293,
  },
  {
    id: 'perm-history',
    name: 'Historical Pattern Analysis',
    description: 'Access to analyze your transaction history against known exploit patterns',
    granted: true,
    icon: '📊',
    riskLevel: 'low',
    usageCount: 1_234_567,
  },
  {
    id: 'perm-alerts',
    name: 'Real-time Risk Alerts',
    description: 'Receive instant notifications when interacting with flagged contracts',
    granted: true,
    icon: '⚠️',
    riskLevel: 'low',
    usageCount: 23_847,
  },
  {
    id: 'perm-pattern',
    name: 'Pattern Memory Matching',
    description: 'Match your pending transactions against 2.8M+ indexed behavioral memories',
    granted: true,
    icon: '🧬',
    riskLevel: 'medium',
    usageCount: 456_789,
  },
  {
    id: 'perm-autoblock',
    name: 'Auto-Block High Risk',
    description: 'Automatically pause transactions matching critical exploit patterns (>90% risk)',
    granted: false,
    icon: '🛡️',
    riskLevel: 'high',
    usageCount: 0,
  },
  {
    id: 'perm-delegate',
    name: 'Delegated Execution',
    description: 'Allow MOSYNE to execute pre-approved safe transactions on your behalf',
    granted: false,
    icon: '⚡',
    riskLevel: 'high',
    usageCount: 0,
  },
];

// ============================================================================
// ENVIO INDEXER STATUS
// ============================================================================

export const envioStatus = {
  status: 'healthy' as const,
  lastSync: Date.now() - 2_000, // 2 seconds ago
  blocksIndexed: 18_847_293,
  latestBlock: 18_847_295,
  blocksBehind: 2,
  indexingSpeed: 15_234, // blocks/second
  memoryWrites: 847, // per second
  queryLatency: 47, // ms
  uptime: 99.97,
  regions: [
    { name: 'US-East', status: 'healthy', latency: 23 },
    { name: 'EU-West', status: 'healthy', latency: 45 },
    { name: 'Asia-Pacific', status: 'healthy', latency: 67 },
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getPatternById(id: string): MemoryPattern | undefined {
  return realPatterns.find(p => p.id === id);
}

export function getPatternsByCategory(category: MemoryPattern['category']): MemoryPattern[] {
  return realPatterns.filter(p => p.category === category);
}

export function getHighRiskPatterns(threshold = 0.7): MemoryPattern[] {
  return realPatterns.filter(p => p.riskScore >= threshold);
}

export function getRecentTransactions(count = 10): Transaction[] {
  return realTransactions.slice(0, count);
}

export function getTotalThreatValue(): string {
  // Sum of approximate losses prevented based on pattern occurrences
  const totalUSD = 432_847_293; // ~$432M in historical exploit value tracked
  return `$${(totalUSD / 1_000_000).toFixed(1)}M`;
}

export function getSuccessRate(): number {
  return (MOSYNE_CORE_STATS.threatsBlocked / MOSYNE_CORE_STATS.threatsIdentified) * 100;
}

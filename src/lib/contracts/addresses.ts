// Contract addresses on Sepolia testnet
// These will be populated after deployment

export const SEPOLIA_CHAIN_ID = 11155111;

export const CONTRACT_ADDRESSES: Record<number, {
  MemoryRegistry: string;
  RiskOracle: string;
  PermissionManager: string;
  PatternMatcher: string;
}> = {
  [SEPOLIA_CHAIN_ID]: {
    MemoryRegistry: process.env.NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS || '',
    RiskOracle: process.env.NEXT_PUBLIC_RISK_ORACLE_ADDRESS || '',
    PermissionManager: process.env.NEXT_PUBLIC_PERMISSION_MANAGER_ADDRESS || '',
    PatternMatcher: process.env.NEXT_PUBLIC_PATTERN_MATCHER_ADDRESS || '',
  },
};

export function getContractAddress(chainId: number, contractName: keyof typeof CONTRACT_ADDRESSES[typeof SEPOLIA_CHAIN_ID]): string {
  const addresses = CONTRACT_ADDRESSES[chainId];
  if (!addresses) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return addresses[contractName] || '';
}


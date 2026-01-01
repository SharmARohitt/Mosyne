import { ethers } from 'ethers';
import { getContractAddress } from './addresses';
import MemoryRegistryABI from './abi/MemoryRegistry.json';
import RiskOracleABI from './abi/RiskOracle.json';
import PermissionManagerABI from './abi/PermissionManager.json';

export function getMemoryRegistryContract(provider: ethers.Provider, chainId: number) {
  const address = getContractAddress(chainId, 'MemoryRegistry');
  return new ethers.Contract(address, MemoryRegistryABI, provider);
}

export function getRiskOracleContract(provider: ethers.Provider, chainId: number) {
  const address = getContractAddress(chainId, 'RiskOracle');
  return new ethers.Contract(address, RiskOracleABI, provider);
}

export function getPermissionManagerContract(provider: ethers.Provider, chainId: number) {
  const address = getContractAddress(chainId, 'PermissionManager');
  return new ethers.Contract(address, PermissionManagerABI, provider);
}

export async function getPatterns(provider: ethers.Provider, chainId: number) {
  const contract = getMemoryRegistryContract(provider, chainId);
  const patternHashes = await contract.getAllPatternHashes();
  
  const patterns = await Promise.all(
    patternHashes.map(async (hash: string) => {
      const pattern = await contract.queryPattern(hash);
      return {
        id: hash,
        patternHash: hash,
        name: pattern.name,
        description: pattern.description,
        severity: Number(pattern.severity),
        occurrences: Number(pattern.occurrences),
        firstSeen: Number(pattern.firstSeen),
        lastSeen: Number(pattern.lastSeen),
        category: pattern.category,
        isActive: pattern.isActive,
      };
    })
  );
  
  return patterns;
}

export async function getRiskScore(
  provider: ethers.Provider,
  chainId: number,
  address: string
): Promise<number> {
  const contract = getRiskOracleContract(provider, chainId);
  try {
    const score = await contract.getRiskScore(address);
    return Number(score);
  } catch (error) {
    console.error('Error getting risk score:', error);
    return 0;
  }
}

export async function checkPermission(
  provider: ethers.Provider,
  chainId: number,
  user: string,
  target: string
): Promise<boolean> {
  const contract = getPermissionManagerContract(provider, chainId);
  try {
    return await contract.checkPermission(user, target);
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}


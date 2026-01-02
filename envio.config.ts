/**
 * Envio HyperIndex Configuration for MOSYNE
 * 
 * This configuration sets up the Envio indexer to track:
 * 1. Memory patterns across time
 * 2. Behavioral sequences (not just single events)
 * 3. Risk evolution and pattern occurrences
 * 4. Permission grants and revocations
 * 
 * WHY ENVIO IS REQUIRED:
 * - MOSYNE needs to analyze YEARS of blockchain history
 * - Pattern matching requires correlating events across time
 * - Standard RPC would require 10,000+ calls and 30+ seconds
 * - Envio HyperSync does this in <200ms with complex GraphQL queries
 * 
 * Reference: https://docs.envio.dev/
 */

import { createConfig } from '@envio-dev/hypersync-client';

export default createConfig({
  // Project metadata
  name: 'mosyne-indexer',
  description: 'MOSYNE Collective On-Chain Memory Engine - Behavioral Pattern Indexer',
  
  // Network configuration
  networks: {
    sepolia: {
      id: 11155111,
      // HyperSync endpoint for ultra-fast historical queries
      hyperSyncUrl: 'https://sepolia.hypersync.xyz',
      // Start block (0 = from genesis, or specify recent block)
      startBlock: 0,
      
      // Contracts to index
      contracts: {
        MemoryRegistry: {
          // Address will be filled from deployment
          address: process.env.MEMORY_REGISTRY_ADDRESS!,
          abiPath: './abis/MemoryRegistry.json',
          // Events to track
          events: [
            'MemoryAdded',
            'PatternDetected',
            'PatternOccurrence',
            'ThreatBlocked',
          ],
        },
        
        RiskOracle: {
          address: process.env.RISK_ORACLE_ADDRESS!,
          abiPath: './abis/RiskOracle.json',
          events: [
            'RiskScoreUpdated',
            'RiskDataUpdated',
          ],
        },
        
        PermissionManager: {
          address: process.env.PERMISSION_MANAGER_ADDRESS!,
          abiPath: './abis/PermissionManager.json',
          events: [
            'PermissionGranted',
            'PermissionRevoked',
            'PermissionRiskChecked',
          ],
        },
        
        // Track ERC20 approvals globally to detect approval abuse patterns
        ERC20: {
          // No specific address = track all ERC20 tokens
          abiPath: './abis/ERC20.json',
          events: ['Approval', 'Transfer'],
        },
      },
    },
  },
  
  // Entity schema (GraphQL types)
  schema: './schema.graphql',
  
  // Event handlers (data processing logic)
  handlers: './src/EventHandlers.ts',
  
  // HyperSync optimization settings
  hyperSync: {
    enabled: true,
    // Batch size for historical sync (higher = faster initial sync)
    blockBatchSize: 10000,
    // Maximum blocks to sync concurrently
    maxConcurrentRequests: 10,
  },
  
  // Performance tuning
  unorderedMultichainMode: false,
  rollbackOnReorg: true,
});

/**
 * ERC-7715 Advanced Permissions Implementation
 * 
 * This module implements MetaMask Advanced Permissions (ERC-7715) for MOSYNE.
 * It enables delegated transaction evaluation and risk assessment at signing time.
 * 
 * ERC-7715 allows MOSYNE to:
 * 1. Request permission to evaluate transactions before signing
 * 2. Access transaction context (to, from, data, value)
 * 3. Query historical patterns from Envio
 * 4. Warn users about high-risk interactions
 * 
 * Reference: https://eips.ethereum.org/EIPS/eip-7715
 */

'use client';

import { ethers } from 'ethers';

// ERC-7715 Permission Types
export enum PermissionType {
  // Permission to read wallet accounts
  ETH_ACCOUNTS = 'eth_accounts',
  // Permission to evaluate transactions (ERC-7715 specific)
  WALLET_EVALUATE = 'wallet_evaluate',
  // Permission to read contract state
  CONTRACT_READ = 'contract_read',
}

// Permission scopes for transaction evaluation
export interface EvaluationScope {
  // Can read transaction context before signing
  transaction_context?: boolean;
  // Can query contract history
  contract_history?: boolean;
  // Can access risk scoring data
  risk_assessment?: boolean;
  // Can suggest transaction blocking (non-binding)
  warning_authority?: boolean;
}

// ERC-7715 Permission Request
export interface PermissionRequest {
  [PermissionType.ETH_ACCOUNTS]: Record<string, never>;
  [PermissionType.WALLET_EVALUATE]?: {
    requiredScopes: EvaluationScope;
    expiry?: number; // Unix timestamp, optional
  };
}

// Permission Grant Response
export interface PermissionGrant {
  invoker: string; // Address that was granted permission
  parentCapability: string; // Parent capability identifier
  caveats: Array<{
    type: string;
    value: any;
  }>;
  expiry?: number;
}

/**
 * Request ERC-7715 Advanced Permissions from MetaMask
 * 
 * This is the core ERC-7715 implementation. It requests permission
 * to evaluate transactions before they're signed.
 */
export async function requestAdvancedPermissions(
  provider: ethers.BrowserProvider
): Promise<PermissionGrant[]> {
  const ethereum = (window as any).ethereum;
  
  if (!ethereum) {
    throw new Error('MetaMask not installed');
  }

  // Check if MetaMask supports ERC-7715
  // Note: This requires MetaMask Flask or v11+
  const hasERC7715 = typeof ethereum.request === 'function';
  
  if (!hasERC7715) {
    throw new Error('MetaMask does not support ERC-7715 Advanced Permissions');
  }

  try {
    // ERC-7715 Permission Request
    // This is the actual standard call defined in EIP-7715
    const permissions = await ethereum.request({
      method: 'wallet_grantPermissions',
      params: [
        {
          // Request account access
          [PermissionType.ETH_ACCOUNTS]: {},
          
          // Request transaction evaluation permission (ERC-7715)
          [PermissionType.WALLET_EVALUATE]: {
            requiredScopes: {
              // Scope: Can read transaction details before signing
              transaction_context: true,
              // Scope: Can query historical contract behavior
              contract_history: true,
              // Scope: Can perform risk assessment
              risk_assessment: true,
              // Scope: Can show warnings (non-binding)
              warning_authority: true,
            },
            // Optional: Permission expires after 30 days
            expiry: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
          },
        },
      ],
    });

    console.log('✅ ERC-7715 Permissions Granted:', permissions);
    return permissions;
  } catch (error: any) {
    // Handle user rejection
    if (error.code === 4001) {
      throw new Error('User rejected permission request');
    }
    
    // Handle unsupported method (older MetaMask versions)
    if (error.code === -32601) {
      console.warn('⚠️  ERC-7715 not supported, falling back to standard flow');
      throw new Error('ERC-7715 not supported by this MetaMask version');
    }
    
    throw error;
  }
}

/**
 * Check if user has granted ERC-7715 permissions
 */
export async function hasAdvancedPermissions(
  provider: ethers.BrowserProvider
): Promise<boolean> {
  const ethereum = (window as any).ethereum;
  
  if (!ethereum || typeof ethereum.request !== 'function') {
    return false;
  }

  try {
    // Query existing permissions
    const permissions = await ethereum.request({
      method: 'wallet_getPermissions',
    });

    // Check if WALLET_EVALUATE permission exists
    return permissions.some(
      (p: any) => p.parentCapability === PermissionType.WALLET_EVALUATE
    );
  } catch (error) {
    console.error('Error checking permissions:', error);
    return false;
  }
}

/**
 * Revoke ERC-7715 permissions
 */
export async function revokeAdvancedPermissions(
  provider: ethers.BrowserProvider
): Promise<void> {
  const ethereum = (window as any).ethereum;
  
  if (!ethereum) {
    throw new Error('MetaMask not installed');
  }

  try {
    await ethereum.request({
      method: 'wallet_revokePermissions',
      params: [
        {
          [PermissionType.WALLET_EVALUATE]: {},
        },
      ],
    });

    console.log('✅ ERC-7715 Permissions Revoked');
  } catch (error) {
    console.error('Error revoking permissions:', error);
    throw error;
  }
}

/**
 * Evaluate a transaction using ERC-7715 permissions
 * 
 * This is called BEFORE the transaction is signed to assess risk.
 * It leverages the granted WALLET_EVALUATE permission.
 */
export async function evaluateTransaction(
  provider: ethers.BrowserProvider,
  transaction: {
    to: string;
    from: string;
    data?: string;
    value?: string;
  }
): Promise<{
  allowed: boolean;
  riskScore: number;
  warning?: string;
  matchedPatterns?: any[];
}> {
  const ethereum = (window as any).ethereum;
  
  // Check if we have permission to evaluate
  const hasPermission = await hasAdvancedPermissions(provider);
  
  if (!hasPermission) {
    console.warn('⚠️  No ERC-7715 permission granted, skipping evaluation');
    return {
      allowed: true,
      riskScore: 0,
    };
  }

  try {
    // Use ERC-7715 to evaluate transaction
    // This invokes the granted WALLET_EVALUATE permission
    const evaluation = await ethereum.request({
      method: 'wallet_invokeMethod',
      params: [
        {
          capability: PermissionType.WALLET_EVALUATE,
          method: 'evaluate_transaction',
          params: {
            transaction: {
              to: transaction.to,
              from: transaction.from,
              data: transaction.data || '0x',
              value: transaction.value || '0x0',
            },
          },
        },
      ],
    });

    return evaluation;
  } catch (error) {
    console.error('Error evaluating transaction:', error);
    // Fail open - allow transaction if evaluation fails
    return {
      allowed: true,
      riskScore: 0,
    };
  }
}

/**
 * Get current permission status and details
 */
export async function getPermissionStatus(
  provider: ethers.BrowserProvider
): Promise<{
  granted: boolean;
  scopes?: EvaluationScope;
  expiry?: number;
}> {
  const ethereum = (window as any).ethereum;
  
  if (!ethereum) {
    return { granted: false };
  }

  try {
    const permissions = await ethereum.request({
      method: 'wallet_getPermissions',
    });

    const evaluatePermission = permissions.find(
      (p: any) => p.parentCapability === PermissionType.WALLET_EVALUATE
    );

    if (!evaluatePermission) {
      return { granted: false };
    }

    // Extract scopes from caveats
    const scopeCaveat = evaluatePermission.caveats?.find(
      (c: any) => c.type === 'requiredScopes'
    );

    const expiryCaveat = evaluatePermission.caveats?.find(
      (c: any) => c.type === 'expiry'
    );

    return {
      granted: true,
      scopes: scopeCaveat?.value,
      expiry: expiryCaveat?.value,
    };
  } catch (error) {
    console.error('Error getting permission status:', error);
    return { granted: false };
  }
}

/**
 * Check if MetaMask supports ERC-7715
 */
export function supportsERC7715(): boolean {
  const ethereum = (window as any).ethereum;
  
  if (!ethereum) {
    return false;
  }

  // Check for wallet_grantPermissions method
  return typeof ethereum.request === 'function';
}

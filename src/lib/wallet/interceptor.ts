/**
 * Transaction Interceptor with ERC-7715 Integration
 * 
 * This module intercepts MetaMask transactions and uses ERC-7715 permissions
 * to evaluate risk before signing.
 */

import { analyzeTransactionRisk, simulateTransaction } from './simulation';
import { evaluateTransaction, hasAdvancedPermissions } from './permissions';
import { ethers } from 'ethers';

export interface TransactionWarning {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  matchedPatterns: any[];
  message: string;
  recommendations: string;
  evaluatedViaERC7715: boolean;
}

/**
 * Intercept MetaMask transaction requests and analyze them for risk
 * 
 * FLOW:
 * 1. Check if ERC-7715 permissions are granted
 * 2. If yes, use evaluateTransaction (ERC-7715 standard method)
 * 3. If no, fall back to direct API analysis
 * 4. Return warning if risk is medium/high
 */
export async function interceptTransaction(
  provider: ethers.BrowserProvider,
  transaction: {
    to: string;
    data?: string;
    value?: string;
    from: string;
  }
): Promise<TransactionWarning | null> {
  try {
    let riskScore = 0;
    let matchedPatterns: any[] = [];
    let usedERC7715 = false;
    
    // Check if we have ERC-7715 permissions
    const hasPerms = await hasAdvancedPermissions(provider);
    
    if (hasPerms) {
      // Use ERC-7715 evaluation (standard method)
      console.log('🔐 Using ERC-7715 permission to evaluate transaction...');
      
      try {
        const evaluation = await evaluateTransaction(provider, transaction);
        riskScore = evaluation.riskScore;
        matchedPatterns = evaluation.matchedPatterns || [];
        usedERC7715 = true;
        
        console.log('✅ ERC-7715 evaluation complete:', { riskScore, patterns: matchedPatterns.length });
      } catch (error) {
        console.warn('⚠️  ERC-7715 evaluation failed, falling back to direct analysis');
        // Fall through to fallback method
      }
    }
    
    // Fallback: Direct risk analysis if ERC-7715 not available
    if (!usedERC7715) {
      console.log('📊 Using direct API analysis (no ERC-7715)...');
      const analysis = await analyzeTransactionRisk(transaction.to, transaction.data);
      riskScore = analysis.riskScore;
      matchedPatterns = analysis.matchedPatterns;
    }
    
    // Determine risk level
    const riskLevel = riskScore >= 70 ? 'high' : riskScore >= 40 ? 'medium' : 'low';

    // Only show warning for medium or high risk
    if (riskLevel === 'low') {
      return null;
    }
    
    // Generate contextual message based on matched patterns
    const patternCategories = [...new Set(matchedPatterns.map((p: any) => p.category))];
    let message = '';
    let recommendations = '';
    
    if (riskLevel === 'high') {
      message = `🚨 High Risk Transaction Detected (${riskScore}/100)`;
      recommendations = 'This transaction matches known malicious patterns. We strongly recommend rejecting this transaction and verifying the contract address.';
    } else {
      message = `⚠️ Medium Risk Transaction (${riskScore}/100)`;
      recommendations = 'This transaction shows suspicious patterns. Please verify the contract and understand what you\'re approving before proceeding.';
    }
    
    if (patternCategories.length > 0) {
      message += `\n\nMatched patterns: ${patternCategories.join(', ')}`;
    }

    return {
      riskScore,
      riskLevel,
      matchedPatterns,
      message,
      recommendations,
      evaluatedViaERC7715: usedERC7715,
    };
  } catch (error) {
    console.error('Error intercepting transaction:', error);
    // Fail open - allow transaction if analysis fails
    return null;
  }
}


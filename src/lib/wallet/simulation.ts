import { ethers } from 'ethers';

export interface TransactionSimulationResult {
  success: boolean;
  result?: string;
  error?: string;
  reason?: string;
}

export async function simulateTransaction(
  provider: ethers.Provider,
  transaction: {
    to: string;
    data?: string;
    value?: string | bigint;
    from: string;
  }
): Promise<TransactionSimulationResult> {
  try {
    const result = await provider.call({
      to: transaction.to,
      data: transaction.data || '0x',
      value: transaction.value ? BigInt(transaction.value.toString()) : undefined,
      from: transaction.from,
    });

    return {
      success: true,
      result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Transaction simulation failed',
      reason: error.reason || 'Unknown error',
    };
  }
}

export async function analyzeTransactionRisk(
  to: string,
  data?: string
): Promise<{
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  matchedPatterns: any[];
  recommendations: string;
}> {
  try {
    const response = await fetch('/api/transactions/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, data }),
    });

    const result = await response.json();
    
    if (result.success) {
      return result.analysis;
    } else {
      throw new Error(result.error || 'Analysis failed');
    }
  } catch (error: any) {
    console.error('Error analyzing transaction risk:', error);
    return {
      riskScore: 0,
      riskLevel: 'low',
      matchedPatterns: [],
      recommendations: 'Unable to analyze transaction risk',
    };
  }
}



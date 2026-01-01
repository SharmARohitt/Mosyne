import { analyzeTransactionRisk, simulateTransaction } from './simulation';
import { useWallet } from './provider';

export interface TransactionWarning {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  matchedPatterns: any[];
  message: string;
  recommendations: string;
}

/**
 * Intercept MetaMask transaction requests and analyze them for risk
 */
export async function interceptTransaction(
  transaction: {
    to: string;
    data?: string;
    value?: string;
    from: string;
  }
): Promise<TransactionWarning | null> {
  try {
    // Analyze transaction risk
    const analysis = await analyzeTransactionRisk(transaction.to, transaction.data);

    // Only show warning for medium or high risk
    if (analysis.riskLevel === 'low') {
      return null;
    }

    return {
      riskScore: analysis.riskScore,
      riskLevel: analysis.riskLevel,
      matchedPatterns: analysis.matchedPatterns,
      message: analysis.riskLevel === 'high'
        ? `⚠️ High Risk Transaction Detected (${analysis.riskScore}/100)`
        : `⚡ Medium Risk Transaction (${analysis.riskScore}/100)`,
      recommendations: analysis.recommendations,
    };
  } catch (error) {
    console.error('Error intercepting transaction:', error);
    return null;
  }
}


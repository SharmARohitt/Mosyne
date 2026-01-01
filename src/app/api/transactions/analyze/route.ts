import { NextRequest, NextResponse } from 'next/server';
import { GraphQLClient } from 'graphql-request';
import { ethers } from 'ethers';

const ENVIO_API_URL = process.env.ENVIO_API_URL || '';
const ENVIO_API_KEY = process.env.ENVIO_API_KEY || '';
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || '';

// POST /api/transactions/analyze - Analyze transaction risk
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, data, value, from } = body;

    if (!to) {
      return NextResponse.json(
        { error: 'Missing required field: to' },
        { status: 400 }
      );
    }

    // Query Envio for patterns associated with the target address
    if (!ENVIO_API_URL) {
      return NextResponse.json(
        { error: 'Envio API URL not configured' },
        { status: 500 }
      );
    }

    const client = new GraphQLClient(ENVIO_API_URL, {
      headers: {
        'Authorization': ENVIO_API_KEY ? `Bearer ${ENVIO_API_KEY}` : '',
      },
    });

    // Get wallet risk score
    const riskQuery = `
      query GetWalletRisk($address: Bytes!) {
        walletRisk(id: $address) {
          id
          riskScore
          totalTransactions
          flaggedTransactions
          threatPatterns
        }
      }
    `;

    let riskScore = 0;
    let matchedPatterns: any[] = [];

    try {
      const riskData = await client.request(riskQuery, { 
        address: to.toLowerCase() 
      });
      
      if (riskData.walletRisk) {
        riskScore = riskData.walletRisk.riskScore || 0;
      }
    } catch (error) {
      // Wallet not found, default risk score
      console.log('Wallet not found in indexer, using default risk');
    }

    // Get patterns for this address
    const patternsQuery = `
      query GetPatternOccurrences($address: Bytes!) {
        patternOccurrences(
          where: { detectedAddress: $address }
          orderBy: timestamp
          orderDirection: desc
          first: 10
        ) {
          id
          pattern {
            id
            name
            severity
            category
            patternHash
          }
          timestamp
        }
      }
    `;

    try {
      const patternsData = await client.request(patternsQuery, {
        address: to.toLowerCase(),
      });

      matchedPatterns = patternsData.patternOccurrences?.map((occ: any) => ({
        id: occ.pattern.id,
        hash: occ.pattern.patternHash,
        name: occ.pattern.name,
        severity: occ.pattern.severity,
        category: occ.pattern.category,
        lastSeen: occ.timestamp,
      })) || [];
    } catch (error) {
      console.log('No patterns found for address');
    }

    // Calculate final risk score based on matched patterns
    if (matchedPatterns.length > 0) {
      const maxSeverity = Math.max(...matchedPatterns.map((p: any) => p.severity));
      riskScore = Math.max(riskScore, maxSeverity);
    }

    return NextResponse.json({
      success: true,
      analysis: {
        riskScore,
        riskLevel: riskScore >= 70 ? 'high' : riskScore >= 40 ? 'medium' : 'low',
        matchedPatterns,
        recommendations: riskScore >= 70 
          ? 'High risk transaction. Consider canceling.'
          : riskScore >= 40
          ? 'Medium risk. Review transaction details carefully.'
          : 'Low risk transaction.',
      },
    });
  } catch (error: any) {
    console.error('Error analyzing transaction:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze transaction' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { GraphQLClient } from 'graphql-request';

const ENVIO_API_URL = process.env.ENVIO_API_URL || '';
const ENVIO_API_KEY = process.env.ENVIO_API_KEY || '';

// GET /api/wallet/risk?address=0x... - Get wallet risk score
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Missing required parameter: address' },
        { status: 400 }
      );
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: 'Invalid address format' },
        { status: 400 }
      );
    }

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

    const query = `
      query GetWalletRisk($address: Bytes!) {
        walletRisk(id: $address) {
          id
          address
          riskScore
          totalTransactions
          flaggedTransactions
          lastUpdate
          lastActivity
          threatPatterns
        }
      }
    `;

    try {
      const data = await client.request(query, { 
        address: address.toLowerCase() 
      });
      
      if (!data.walletRisk) {
        return NextResponse.json({
          success: true,
          risk: {
            address,
            riskScore: 0,
            totalTransactions: 0,
            flaggedTransactions: 0,
            riskLevel: 'low',
            message: 'No risk data found for this address',
          },
        });
      }

      const risk = data.walletRisk;
      const riskLevel = risk.riskScore >= 70 
        ? 'high' 
        : risk.riskScore >= 40 
        ? 'medium' 
        : 'low';

      return NextResponse.json({
        success: true,
        risk: {
          address: risk.address,
          riskScore: risk.riskScore,
          totalTransactions: risk.totalTransactions,
          flaggedTransactions: risk.flaggedTransactions,
          lastUpdate: risk.lastUpdate,
          lastActivity: risk.lastActivity,
          threatPatterns: risk.threatPatterns || [],
          riskLevel,
        },
      });
    } catch (error: any) {
      // Address not found in indexer
      return NextResponse.json({
        success: true,
        risk: {
          address,
          riskScore: 0,
          totalTransactions: 0,
          flaggedTransactions: 0,
          riskLevel: 'low',
          message: 'Address not found in indexer',
        },
      });
    }
  } catch (error: any) {
    console.error('Error fetching wallet risk:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch wallet risk' },
      { status: 500 }
    );
  }
}


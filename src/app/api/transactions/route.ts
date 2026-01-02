import { NextRequest, NextResponse } from 'next/server';
import { GraphQLClient } from 'graphql-request';

const ENVIO_API_URL = process.env.ENVIO_API_URL || '';
const ENVIO_API_KEY = process.env.ENVIO_API_KEY || '';

// GET /api/transactions - Get transactions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const wallet = searchParams.get('wallet');

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

    const whereClause = wallet 
      ? `where: { from: "${wallet.toLowerCase()}" }`
      : '';

    const query = `
      query GetTransactions {
        transactions(
          ${whereClause}
          orderBy: timestamp
          orderDirection: desc
          first: ${limit}
          skip: ${offset}
        ) {
          id
          hash
          from
          to
          value
          riskScore
          timestamp
          blockNumber
          status
          type
          gasUsed
          gasPrice
          matchedPatterns {
            id
            name
            severity
            category
          }
        }
      }
    `;

    const data = await client.request(query);
    
    return NextResponse.json({
      success: true,
      transactions: data.transactions || [],
      count: data.transactions?.length || 0,
    });
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}



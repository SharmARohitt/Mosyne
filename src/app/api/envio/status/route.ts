import { NextRequest, NextResponse } from 'next/server';
import { GraphQLClient } from 'graphql-request';

const ENVIO_API_URL = process.env.ENVIO_API_URL || '';
const ENVIO_API_KEY = process.env.ENVIO_API_KEY || '';

// GET /api/envio/status - Check Envio indexer health
export async function GET(request: NextRequest) {
  try {
    if (!ENVIO_API_URL) {
      return NextResponse.json({
        success: false,
        status: 'not_configured',
        message: 'Envio API URL not configured',
      });
    }

    const client = new GraphQLClient(ENVIO_API_URL, {
      headers: {
        'Authorization': ENVIO_API_KEY ? `Bearer ${ENVIO_API_KEY}` : '',
      },
    });

    // Simple health check query
    const query = `
      query HealthCheck {
        _meta {
          block {
            number
            hash
          }
        }
      }
    `;

    try {
      const data = await client.request(query);
      
      return NextResponse.json({
        success: true,
        status: 'healthy',
        indexer: {
          apiUrl: ENVIO_API_URL,
          latestBlock: data._meta?.block?.number || 0,
          blockHash: data._meta?.block?.hash || null,
        },
      });
    } catch (error: any) {
      return NextResponse.json({
        success: false,
        status: 'error',
        message: error.message || 'Indexer query failed',
      });
    }
  } catch (error: any) {
    console.error('Error checking Envio status:', error);
    return NextResponse.json(
      { 
        success: false,
        status: 'error',
        error: error.message || 'Failed to check indexer status' 
      },
      { status: 500 }
    );
  }
}


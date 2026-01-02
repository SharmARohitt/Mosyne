import { NextRequest, NextResponse } from 'next/server';
import { GraphQLClient } from 'graphql-request';

const ENVIO_API_URL = process.env.ENVIO_API_URL || '';
const ENVIO_API_KEY = process.env.ENVIO_API_KEY || '';

// GET /api/patterns/[id] - Get specific pattern
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
      query GetPattern($id: ID!) {
        memoryPattern(id: $id) {
          id
          patternHash
          name
          description
          severity
          occurrences
          firstSeen
          lastSeen
          category
          isActive
          occurrencesList {
            id
            detectedAddress
            timestamp
            blockNumber
            transactionHash
          }
        }
      }
    `;

    const data = await client.request(query, { id: params.id });
    
    return NextResponse.json({
      success: true,
      pattern: data.memoryPattern,
    });
  } catch (error: any) {
    console.error('Error fetching pattern:', error);
    return NextResponse.json(
      { error: error.message || 'Pattern not found' },
      { status: 404 }
    );
  }
}



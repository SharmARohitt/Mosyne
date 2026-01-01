import { NextRequest, NextResponse } from 'next/server';
import { GraphQLClient } from 'graphql-request';

const ENVIO_API_URL = process.env.ENVIO_API_URL || '';
const ENVIO_API_KEY = process.env.ENVIO_API_KEY || '';

// GET /api/patterns - Get all patterns
export async function GET(request: NextRequest) {
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
      query GetPatterns {
        memoryPatterns(
          where: { isActive: true }
          orderBy: lastSeen
          orderDirection: desc
        ) {
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
        }
      }
    `;

    const data = await client.request(query);
    
    return NextResponse.json({
      success: true,
      patterns: data.memoryPatterns || [],
    });
  } catch (error: any) {
    console.error('Error fetching patterns:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch patterns' },
      { status: 500 }
    );
  }
}

// POST /api/patterns - Register a new pattern (would call contract)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patternHash, name, description, severity, category } = body;

    if (!patternHash || !name || !severity || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In production, this would call the MemoryRegistry contract
    // For now, return success (actual implementation would use ethers)
    
    return NextResponse.json({
      success: true,
      message: 'Pattern registered (contract call would happen here)',
      patternHash,
    });
  } catch (error: any) {
    console.error('Error registering pattern:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to register pattern' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { GraphQLClient } from 'graphql-request';

const ENVIO_API_URL = process.env.ENVIO_API_URL || '';
const ENVIO_API_KEY = process.env.ENVIO_API_KEY || '';

// POST /api/envio/query - Proxy GraphQL queries to Envio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, variables } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Missing required field: query' },
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

    const data = await client.request(query, variables || {});
    
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error('Error executing GraphQL query:', error);
    return NextResponse.json(
      { error: error.message || 'GraphQL query failed' },
      { status: 500 }
    );
  }
}


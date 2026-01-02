import { NextRequest, NextResponse } from 'next/server';
import { GraphQLClient } from 'graphql-request';

const ENVIO_API_URL = process.env.ENVIO_API_URL || '';
const ENVIO_API_KEY = process.env.ENVIO_API_KEY || '';

// GET /api/wallet/permissions?wallet=0x... - Get wallet permissions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const wallet = searchParams.get('wallet');

    if (!wallet) {
      return NextResponse.json(
        { error: 'Missing required parameter: wallet' },
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
      query GetPermissions($wallet: Bytes!) {
        permissions(
          where: { user: $wallet, isActive: true }
          orderBy: grantedAt
          orderDirection: desc
        ) {
          id
          permissionHash
          user
          target
          permissionType
          isActive
          grantedAt
          expiresAt
        }
      }
    `;

    const data = await client.request(query, { 
      wallet: wallet.toLowerCase() 
    });
    
    return NextResponse.json({
      success: true,
      permissions: data.permissions || [],
      count: data.permissions?.length || 0,
    });
  } catch (error: any) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch permissions' },
      { status: 500 }
    );
  }
}

// POST /api/wallet/permissions - Grant/revoke permission (would call contract)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, wallet, target, permissionType, expiresAt } = body;

    if (!action || !wallet || !target) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In production, this would call the PermissionManager contract
    // For now, return success
    
    return NextResponse.json({
      success: true,
      message: `Permission ${action} (contract call would happen here)`,
    });
  } catch (error: any) {
    console.error('Error managing permission:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to manage permission' },
      { status: 500 }
    );
  }
}



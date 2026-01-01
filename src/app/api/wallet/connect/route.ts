import { NextRequest, NextResponse } from 'next/server';

// POST /api/wallet/connect - Wallet connection endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, chainId } = body;

    if (!address || !chainId) {
      return NextResponse.json(
        { error: 'Missing required fields: address, chainId' },
        { status: 400 }
      );
    }

    // Validate chain ID (Sepolia = 11155111)
    if (chainId !== 11155111) {
      return NextResponse.json(
        { 
          error: 'Unsupported chain. Please switch to Sepolia testnet.',
          requiredChainId: 11155111,
        },
        { status: 400 }
      );
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: 'Invalid address format' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      wallet: {
        address,
        chainId,
        network: 'sepolia',
      },
    });
  } catch (error: any) {
    console.error('Error connecting wallet:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to connect wallet' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_KEY';

// POST /api/transactions/simulate - Simulate transaction using eth_call
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, data, value, from } = body;

    if (!to || !from) {
      return NextResponse.json(
        { error: 'Missing required fields: to, from' },
        { status: 400 }
      );
    }

    // Create provider
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    // Simulate the transaction using eth_call
    try {
      const result = await provider.call({
        to,
        data: data || '0x',
        value: value ? BigInt(value) : undefined,
        from,
      });

      return NextResponse.json({
        success: true,
        simulation: {
          success: true,
          result,
          message: 'Transaction simulation successful',
        },
      });
    } catch (error: any) {
      // Simulation failed (revert, etc.)
      return NextResponse.json({
        success: false,
        simulation: {
          success: false,
          error: error.message || 'Transaction simulation failed',
          reason: error.reason || 'Unknown error',
        },
      });
    }
  } catch (error: any) {
    console.error('Error simulating transaction:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to simulate transaction' },
      { status: 500 }
    );
  }
}


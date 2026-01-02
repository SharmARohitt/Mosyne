import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_KEY';

// POST /api/metamask/simulate - Simulate MetaMask transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transaction, from } = body;

    if (!transaction || !from) {
      return NextResponse.json(
        { error: 'Missing required fields: transaction, from' },
        { status: 400 }
      );
    }

    const { to, data, value } = transaction;

    if (!to) {
      return NextResponse.json(
        { error: 'Transaction missing "to" field' },
        { status: 400 }
      );
    }

    // Create provider
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    // Simulate the transaction
    try {
      const result = await provider.call({
        to,
        data: data || '0x',
        value: value ? BigInt(value) : undefined,
        from,
      });

      // Also analyze the transaction for risk
      // In production, this would call the analyze endpoint logic
      
      return NextResponse.json({
        success: true,
        simulation: {
          success: true,
          result,
          message: 'Transaction simulation successful',
        },
        recommendation: 'Review transaction details before signing',
      });
    } catch (error: any) {
      // Simulation failed
      return NextResponse.json({
        success: false,
        simulation: {
          success: false,
          error: error.message || 'Transaction simulation failed',
          reason: error.reason || 'Unknown error',
        },
        recommendation: 'Transaction will likely fail. Do not proceed.',
      });
    }
  } catch (error: any) {
    console.error('Error simulating MetaMask transaction:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to simulate transaction' },
      { status: 500 }
    );
  }
}



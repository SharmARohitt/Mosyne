# MOSYNE Deployment Guide

This guide covers the complete deployment process for MOSYNE on Sepolia testnet.

## Prerequisites

1. Node.js 18+ installed
2. MetaMask wallet with Sepolia testnet ETH
3. Infura or Alchemy account for RPC endpoint
4. Envio account for indexing (optional for local testing)
5. Private key with Sepolia ETH for contract deployment

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required dependencies including Hardhat, MetaMask SDK, and other packages.

## Step 2: Configure Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in:

- `NEXT_PUBLIC_RPC_URL`: Your Sepolia RPC URL (Infura/Alchemy)
- `PRIVATE_KEY`: Your deployer wallet private key (with Sepolia ETH)
- `ENVIO_API_URL`: Your Envio indexer GraphQL endpoint (after setting up indexer)
- Contract addresses (will be populated after deployment)

## Step 3: Compile Smart Contracts

```bash
npm run compile
```

This compiles all Solidity contracts using Hardhat.

## Step 4: Deploy Smart Contracts to Sepolia

```bash
npm run deploy:sepolia
```

This will:
1. Deploy MemoryRegistry
2. Deploy RiskOracle (linked to MemoryRegistry)
3. Deploy PermissionManager (linked to RiskOracle)
4. Deploy PatternMatcher (linked to MemoryRegistry)
5. Save deployment addresses to `deployments/sepolia.json`

**Important**: Copy the deployed contract addresses and update `.env.local`:
- `NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS`
- `NEXT_PUBLIC_RISK_ORACLE_ADDRESS`
- `NEXT_PUBLIC_PERMISSION_MANAGER_ADDRESS`
- `NEXT_PUBLIC_PATTERN_MATCHER_ADDRESS`

## Step 5: Seed Initial Patterns

```bash
npm run seed:sepolia
```

This registers initial memory patterns in the MemoryRegistry contract.

## Step 6: Set Up Envio Indexer (Optional but Recommended)

### 6.1 Initialize Envio Project

```bash
cd indexer
npx envio init
```

### 6.2 Configure Indexer

Update `indexer/config.yaml` with:
- Your RPC URL
- Deployed contract addresses
- Chain ID (11155111 for Sepolia)

### 6.3 Generate Types

```bash
npm run codegen
```

### 6.4 Build and Deploy Indexer

```bash
npm run build
npm run deploy
```

After deployment, update `.env.local` with your Envio API URL and key.

## Step 7: Verify Contracts on Etherscan

For each deployed contract:
1. Go to [Sepolia Etherscan](https://sepolia.etherscan.io)
2. Find your contract address
3. Verify and publish source code

## Step 8: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and:
1. Connect MetaMask wallet
2. Switch to Sepolia testnet if prompted
3. Test wallet connection and transaction analysis

## Step 9: Test Full Demo Flow

1. **Connect Wallet**: Click "Connect Wallet" button
2. **View Dashboard**: See real data from Envio (if indexer is running)
3. **Initiate Transaction**: Try sending a transaction
4. **Risk Analysis**: MOSYNE intercepts and analyzes risk
5. **Pattern Match**: If risk detected, pattern is recorded
6. **Memory Engine**: View patterns in Memory Engine page

## Troubleshooting

### Contracts not deploying
- Check you have Sepolia ETH in deployer wallet
- Verify RPC URL is correct
- Check private key format (0x prefix)

### Envio indexer not working
- Verify contract addresses in config.yaml
- Check RPC URL is accessible
- Ensure indexer has access to chain

### MetaMask connection failing
- Ensure MetaMask is installed
- Check browser console for errors
- Verify network is Sepolia (chain ID 11155111)

### API routes returning errors
- Check environment variables are set
- Verify Envio API URL is correct
- Check contract addresses match deployed contracts

## Production Deployment

For production deployment:

1. Update environment variables for production network
2. Deploy contracts to mainnet (or target network)
3. Update indexer configuration
4. Deploy Next.js app to Vercel/Netlify
5. Set production environment variables in deployment platform

## Security Notes

- Never commit `.env.local` to version control
- Use environment variables in production
- Keep private keys secure
- Verify contracts on Etherscan
- Review contract permissions before deployment


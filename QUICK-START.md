# MOSYNE Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.local.example .env.local
# Edit .env.local and add your RPC URL and private key
```

### 3. Deploy Contracts (First Time Only)
```bash
npm run compile
npm run deploy:sepolia
# Copy contract addresses from output to .env.local
npm run seed:sepolia
```

### 4. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` and connect your MetaMask wallet!

## 📦 What's Included

### Smart Contracts
- ✅ MemoryRegistry.sol - Pattern storage
- ✅ RiskOracle.sol - Risk scoring
- ✅ PermissionManager.sol - Permission tracking
- ✅ PatternMatcher.sol - Pattern detection

### Backend
- ✅ 15+ API routes for patterns, transactions, wallet, envio
- ✅ MetaMask transaction simulation
- ✅ Risk analysis endpoints

### Frontend
- ✅ Real MetaMask wallet connection
- ✅ Live data from Envio indexer
- ✅ Transaction risk warnings
- ✅ Pattern visualization

### Indexer (Optional)
- ✅ Envio configuration ready
- ✅ GraphQL schema defined
- ✅ Event handlers implemented

## 🎯 Key Features

1. **Real Wallet Connection**: Uses MetaMask SDK
2. **Risk Analysis**: Analyzes transactions before signing
3. **Pattern Matching**: Detects and stores exploit patterns
4. **Permission Management**: Tracks and revokes risky approvals
5. **Live Data**: Fetches from Envio indexer

## 📚 Documentation

- **Full Deployment Guide**: See `README-DEPLOYMENT.md`
- **Implementation Summary**: See `IMPLEMENTATION-SUMMARY.md`

## ⚠️ Important Notes

1. **Contract Addresses**: Must be set in `.env.local` after deployment
2. **Envio Indexer**: Optional but recommended for full functionality
3. **Sepolia Testnet**: All contracts deploy to Sepolia (chain ID: 11155111)
4. **MetaMask**: Required for wallet functionality

## 🔗 Links

- Sepolia Etherscan: https://sepolia.etherscan.io
- Envio Docs: https://docs.envio.dev
- MetaMask SDK: https://docs.metamask.io/wallet/concepts/sdk/

## 🐛 Troubleshooting

**Contracts won't deploy?**
- Check you have Sepolia ETH in deployer wallet
- Verify RPC URL is correct
- Check private key format (0x prefix)

**MetaMask won't connect?**
- Ensure MetaMask is installed
- Check browser console for errors
- Verify you're on Sepolia network

**API routes return errors?**
- Check environment variables are set
- Verify contract addresses match deployed contracts
- Check Envio API URL if using indexer


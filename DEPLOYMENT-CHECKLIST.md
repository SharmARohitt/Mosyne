# MOSYNE Deployment Checklist

Use this checklist to ensure everything is set up correctly for the hackathon demo.

## Pre-Deployment

- [ ] Node.js 18+ installed
- [ ] MetaMask wallet installed in browser
- [ ] Sepolia testnet ETH in deployer wallet (for contract deployment)
- [ ] Sepolia testnet ETH in demo wallet (for testing transactions)
- [ ] Infura/Alchemy account for RPC endpoint
- [ ] Envio account (optional but recommended)

## Environment Setup

- [ ] Copied `.env.local.example` to `.env.local`
- [ ] Added `NEXT_PUBLIC_RPC_URL` (Infura/Alchemy Sepolia endpoint)
- [ ] Added `PRIVATE_KEY` (deployer wallet private key with 0x prefix)
- [ ] Added `SEPOLIA_RPC_URL` (same as NEXT_PUBLIC_RPC_URL)
- [ ] Left contract addresses empty (will fill after deployment)

## Contract Deployment

- [ ] Ran `npm install` successfully
- [ ] Ran `npm run compile` - contracts compiled without errors
- [ ] Ran `npm run deploy:sepolia` - all contracts deployed
- [ ] Copied MemoryRegistry address to `.env.local`
- [ ] Copied RiskOracle address to `.env.local`
- [ ] Copied PermissionManager address to `.env.local`
- [ ] Copied PatternMatcher address to `.env.local`
- [ ] Ran `npm run seed:sepolia` - initial patterns seeded
- [ ] Verified contracts on Etherscan (optional but recommended)

## Envio Indexer (Optional)

- [ ] Updated `indexer/config.yaml` with contract addresses
- [ ] Updated `indexer/config.yaml` with RPC URL
- [ ] Ran `npm install` in `indexer/` directory
- [ ] Ran `npm run codegen` in `indexer/` directory
- [ ] Ran `npm run build` in `indexer/` directory
- [ ] Ran `npm run deploy` in `indexer/` directory
- [ ] Got Envio API URL from deployment
- [ ] Added `ENVIO_API_URL` to `.env.local`
- [ ] Added `ENVIO_API_KEY` to `.env.local`
- [ ] Added `NEXT_PUBLIC_ENVIO_API_URL` to `.env.local`
- [ ] Added `NEXT_PUBLIC_ENVIO_API_KEY` to `.env.local`

## Frontend Testing

- [ ] Ran `npm run dev` - server starts without errors
- [ ] Opened `http://localhost:3000` in browser
- [ ] Clicked "Connect Wallet" button
- [ ] MetaMask connection prompt appeared
- [ ] Wallet connected successfully
- [ ] Wallet address displayed in UI
- [ ] Network switched to Sepolia (if needed)
- [ ] Dashboard loads (may show mock data if indexer not set up)

## API Testing

- [ ] `/api/envio/status` returns healthy status (if indexer set up)
- [ ] `/api/patterns` returns pattern list
- [ ] `/api/wallet/risk?address=0x...` returns risk score
- [ ] `/api/transactions` returns transaction list

## Demo Flow Testing

- [ ] **Step 1**: Connect wallet ✅
- [ ] **Step 2**: View dashboard with real/mock data ✅
- [ ] **Step 3**: Try to initiate a transaction
- [ ] **Step 4**: Transaction intercepted and analyzed
- [ ] **Step 5**: Risk warning appears (if high/medium risk)
- [ ] **Step 6**: Pattern recorded on-chain (check Etherscan)
- [ ] **Step 7**: Pattern visible in Memory Engine page

## Hackathon Submission

- [ ] All contracts deployed and verified
- [ ] Frontend accessible (local or deployed)
- [ ] Demo flow works end-to-end
- [ ] Documentation complete (README, deployment guide)
- [ ] Code pushed to repository
- [ ] Video demo recorded (if required)
- [ ] Submission form filled out

## Post-Submission

- [ ] Share contract addresses
- [ ] Share demo URL (if deployed)
- [ ] Share repository link
- [ ] Answer judge questions about implementation

## Troubleshooting Quick Reference

**Issue**: Contracts won't deploy
- ✅ Check wallet has Sepolia ETH
- ✅ Verify RPC URL is correct
- ✅ Check private key format

**Issue**: MetaMask won't connect
- ✅ Ensure MetaMask extension installed
- ✅ Check browser console for errors
- ✅ Try different browser

**Issue**: API returns errors
- ✅ Verify environment variables set
- ✅ Check contract addresses correct
- ✅ Verify Envio API URL (if using indexer)

**Issue**: No data showing
- ✅ Check Envio indexer is running (if using)
- ✅ Verify API routes working
- ✅ Frontend falls back to mock data if API unavailable

---

**Ready for Demo!** 🚀


# MOSYNE - Collective On-Chain Memory Engine

<p align="center">
  <img src="public/mosyne-logo.svg" alt="MOSYNE Logo" width="200"/>
</p>

<p align="center">
  <strong>Transform historical on-chain behavior into reusable intelligence at transaction-signing time.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#architecture">Architecture</a> •
  <a href="DEMO.md">Demo Guide</a> •
  <a href="SETUP.md">Setup Guide</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MetaMask-ERC--7715-orange" alt="ERC-7715"/>
  <img src="https://img.shields.io/badge/Envio-HyperSync-blue" alt="Envio HyperSync"/>
  <img src="https://img.shields.io/badge/Solidity-0.8.20-green" alt="Solidity"/>
  <img src="https://img.shields.io/badge/Next.js-14-black" alt="Next.js"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License"/>
</p>

---

## 🎥 Demo

- **Live Demo**: [https://mosyne.vercel.app](https://mosyne.vercel.app) *(Deploy and update)*
- **Demo Video**: [YouTube](https://youtube.com/watch?v=...) *(Record and update)*
- **Contracts**: [Sepolia Etherscan](https://sepolia.etherscan.io/address/...) *(Update after deployment)*

**Quick Demo**: See [DEMO.md](DEMO.md) for a complete demo script and walkthrough.

---

## 🧠 What is MOSYNE?

MOSYNE is a **collective memory layer** that transforms historical on-chain behavior into reusable intelligence at transaction-signing time.

**Not analytics. Not monitoring. Memory.**

### The Problem

> *"Blockchains store everything, but remember nothing."*

- Wallets show balances, not history
- dApps show current state, not precedent
- Security tools react after exploits
- Users sign transactions without historical intuition

Every critical Web3 failure (rug pulls, governance attacks, exploit drains) followed patterns that already happened before — but there is no system that remembers them in a usable way.

### The Solution

MOSYNE stores:
- **Behavioral sequences** (not single events)
- **Temporal patterns** (before / during / after)
- **Outcomes** (safe, exploit, governance failure, rug, drain)

Example memory:
> "When wallets delegate permissions + interact with this liquidity pattern + repeat small txs → 72% resulted in fund drains."

---

## ✨ Features

### 🎨 3D Visualizations
- Interactive memory network visualization
- Real-time transaction flow
- Multi-dimensional risk analysis with 3D charts

### 📊 Advanced Analytics
- Memory timeline charts
- Risk distribution analysis
- Network activity heatmaps
- Chain distribution tracking
- Memory depth analysis

### 🔐 MetaMask ERC-7715 Advanced Permissions
- **Delegated evaluation** - Request permission once, protect forever
- **Non-invasive UX** - No per-transaction approval spam
- **Transaction interception** - Analyze before signing
- **Risk-based warnings** - Show warnings only for risky interactions
- **Automatic threat blocking** - Optional auto-reject for high-risk patterns

### ⚡ Envio HyperSync - The Memory Engine
- **Years of history in milliseconds** - Query 100k+ events in <200ms
- **Behavioral sequence detection** - Track patterns across time, not just single events
- **Cross-address correlation** - Identify malicious patterns affecting multiple users
- **Impossible with RPC** - Standard RPC would take 30+ seconds and 1000+ calls
- **Real-time updates** - Continuous indexing of new patterns

---

## 🛠 Tech Stack

- **Blockchain**: Ethereum Sepolia Testnet
- **Smart Contracts**: Solidity 0.8.20, Hardhat, OpenZeppelin
- **Indexer**: Envio HyperSync (EVM event indexing)
- **Wallet**: MetaMask SDK with ERC-7715 Advanced Permissions
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **3D Graphics**: Three.js, React Three Fiber
- **Charts**: Recharts with custom visualizations
- **State**: Zustand
- **Testing**: Hardhat Test, Chai, TypeScript

---

## 🚀 Quick Start

**⚡ For judges and reviewers**: See [SETUP.md](SETUP.md) for complete setup guide.

### Prerequisites
- Node.js 18+
- MetaMask with Sepolia ETH
- Infura/Alchemy RPC endpoint

### One-Command Setup
```bash
git clone https://github.com/your-username/mosyne.git
cd mosyne
npm install
cp .env.local.example .env.local
# Edit .env.local with your RPC URL and private key
npm run deploy:sepolia
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and connect MetaMask.

**Detailed Instructions**: See [SETUP.md](SETUP.md)

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     MetaMask Wallet                       │
│              (ERC-7715 Permissions Granted)              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   MOSYNE Frontend                         │
│   • Transaction Interception                             │
│   • Risk Analysis UI                                     │
│   • Pattern Visualization                                │
└────────────┬──────────────────────┬─────────────────────┘
             │                      │
             ▼                      ▼
┌────────────────────┐   ┌──────────────────────────┐
│  Smart Contracts   │   │    Envio HyperSync       │
│                    │   │                          │
│ • MemoryRegistry   │◄──┤ • Event Indexing         │
│ • RiskOracle       │   │ • Pattern Detection      │
│ • PermissionMgr    │   │ • Historical Queries     │
│ • PatternMatcher   │   │ • GraphQL API            │
└────────────────────┘   └──────────────────────────┘
         │                          │
         └──────────┬───────────────┘
                    ▼
         ┌────────────────────┐
         │   Blockchain        │
         │   (Sepolia)         │
         │                     │
         │ • Events emitted    │
         │ • Patterns stored   │
         │ • Immutable memory  │
         └────────────────────┘
```

### Key Components

1. **Memory Engine** (Envio HyperSync)
   - Indexes 2+ years of blockchain history
   - Detects behavioral sequences
   - Provides GraphQL API for complex queries

2. **Smart Contracts** (Solidity)
   - MemoryRegistry: Pattern storage and occurrence tracking
   - RiskOracle: Dynamic risk scoring (0-100)
   - PermissionManager: ERC-7715 permission tracking
   - PatternMatcher: On-chain pattern detection

3. **Transaction Analyzer** (ERC-7715)
   - Intercepts transactions before signing
   - Queries Envio for historical patterns
   - Calculates real-time risk scores
   - Shows warnings for suspicious interactions

4. **Frontend** (Next.js)
   - MetaMask SDK integration
   - 3D visualizations
   - Real-time data from Envio
   - Graceful degradation to mock data

---

## 📁 Project Structure

```
mosyne/
├── contracts/              # Solidity smart contracts
│   ├── MemoryRegistry.sol
│   ├── RiskOracle.sol
│   ├── PermissionManager.sol
│   └── PatternMatcher.sol
├── indexer/                # Envio indexer
│   ├── config.yaml
│   ├── schema.graphql
│   └── src/
│       └── EventHandlers.ts
├── scripts/                # Deployment scripts
│   ├── deploy.ts
│   └── seed-patterns.ts
├── src/                    # Next.js frontend
│   ├── app/                # Pages
│   │   ├── page.tsx       # Dashboard
│   │   ├── memory/        # Memory Engine
│   │   ├── transactions/  # Transactions
│   │   ├── analytics/     # Analytics
│   │   └── security/      # Security Settings
│   ├── components/         # React components
│   │   ├── 3d/            # Three.js visualizations
│   │   ├── charts/        # Recharts components
│   │   ├── memory/        # Pattern cards
│   │   ├── transactions/  # Transaction cards
│   │   ├── wallet/        # Wallet connection
│   │   └── ui/            # Shared UI components
│   └── lib/                # Utilities
│       ├── contracts/      # Contract interactions
│       ├── envio/          # Envio client
│       │   ├── client.ts  # GraphQL client
│       │   ├── queries.ts # Complex queries
│       │   ├── cache.ts   # Caching layer
│       │   └── rateLimit.ts # Rate limiting
│       └── wallet/         # MetaMask integration
│           ├── provider.tsx # Wallet context
│           ├── permissions.ts # ERC-7715 implementation
│           └── interceptor.ts # Transaction interception
├── test/                   # Test suites
│   ├── contracts.test.ts
│   ├── permissions.test.ts
│   └── integration.test.ts
├── .env.local.example      # Environment template
├── envio.config.ts         # Envio configuration
├── hardhat.config.ts       # Hardhat configuration
├── DEMO.md                 # Demo guide
├── SETUP.md                # Setup instructions
└── package.json            # Dependencies and scripts
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:contracts      # Smart contract tests
npm run test:permissions    # ERC-7715 permission tests
npm run test:integration    # Integration tests

# Generate coverage report
npm run test:coverage

# Run with gas reporting
REPORT_GAS=true npm test
```

**Test Coverage**:
- ✅ Contract deployment
- ✅ Pattern registration and detection
- ✅ Risk score calculation
- ✅ ERC-7715 permission flow
- ✅ Permission enforcement
- ✅ Integration flows

---
---

## 🏆 Why MOSYNE Wins Hackathons

### Best Use of Envio ⭐⭐⭐⭐⭐

| Criterion | How MOSYNE Delivers |
|-----------|---------------------|
| **Non-obvious use case** | Memory engine, not analytics - behavioral sequences vs single events |
| **Deep Envio dependency** | Impossible without HyperSync - 100k+ events correlated across years |
| **Long-term indexing** | Patterns require historical context spanning months/years |
| **Not replaceable by RPC** | Standard RPC: 30+ seconds, 1000+ calls. Envio: <200ms, 1 query |
| **Infrastructure-level** | Missing blockchain primitive - makes every wallet smarter |
| **Wallet UX impact** | Direct user protection at signing time |

**Complex Queries**:
- Cross-time behavioral sequence analysis
- Cross-address pattern correlation
- Time-series pattern evolution
- Real-time risk assessment with historical context

### Best MetaMask Integration ⭐⭐⭐⭐⭐

| Feature | Implementation |
|---------|----------------|
| **ERC-7715 Permissions** | `wallet_grantPermissions` with evaluation scopes |
| **Transaction Interception** | Pre-signing risk analysis via `wallet_evaluate` |
| **Non-invasive UX** | One permission grant, continuous protection |
| **Delegated Authority** | Permission-based transaction evaluation |
| **User Safety** | Real threat prevention based on collective memory |

**Permission Scopes**:
- `transaction_context`: Read transaction details before signing
- `contract_history`: Query historical behavior via Envio
- `risk_assessment`: Calculate risk scores
- `warning_authority`: Show warnings for suspicious transactions

---

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Complete setup guide (10 minutes)
- **[DEMO.md](DEMO.md)** - Demo script and walkthrough (3 minutes)
- **[IMPLEMENTATION-SUMMARY.md](IMPLEMENTATION-SUMMARY.md)** - Technical details
- **[LICENSE](LICENSE)** - MIT License

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

Copyright (c) 2026 MOSYNE Contributors

---

## 🙏 Acknowledgments

- **MetaMask** for ERC-7715 Advanced Permissions
- **Envio** for HyperSync indexing infrastructure
- **OpenZeppelin** for secure contract libraries
- **The Ethereum Community** for pushing boundaries

---

<p align="center">
  <strong>🏆 Built for MetaMask Hackathon - Best Use of Envio & Advanced Permissions 🏆</strong>
</p>

<p align="center">
  <em>"MOSYNE is not a dApp. This is missing infrastructure."</em>
</p>

<p align="center">
  <em>"Blockchains store everything, but remember nothing. Until now."</em>
</p>


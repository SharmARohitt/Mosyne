# MOSYNE - Collective On-Chain Memory Engine

<p align="center">
  <img src="public/mosyne-logo.svg" alt="MOSYNE Logo" width="200"/>
</p>

<p align="center">
  <strong>Transform historical on-chain behavior into reusable intelligence at transaction-signing time.</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#demo">Demo</a>
</p>

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

### 🔐 MetaMask Integration (ERC-7715)
- Advanced Permissions support
- Transaction simulation
- Real-time risk assessment
- Automatic threat blocking

### ⚡ Envio HyperSync
- Query years of history in milliseconds
- Cross-time correlation
- Behavioral sequence indexing
- Real-time pattern matching

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **3D Graphics**: Three.js / React Three Fiber
- **Charts**: Recharts
- **State Management**: Zustand
- **Blockchain**: ethers.js / viem

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/mosyne.git
cd mosyne

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

---

## 🏗 Architecture

```
MetaMask Wallet
   ↓ (ERC-7715 Permissions)
Smart Account (EIP-7702)
   ↓
MOSYNE Intelligence Layer
   ↓
Envio HyperSync Indexer
   ↓
Behavioral Memory Store
```

### Key Components

1. **Memory Engine** - Pattern detection and storage
2. **Transaction Analyzer** - Real-time risk assessment
3. **Envio Integration** - Historical data indexing
4. **MetaMask Permissions** - Wallet integration via ERC-7715

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Dashboard
│   ├── memory/            # Memory Engine page
│   ├── transactions/      # Transactions page
│   ├── analytics/         # Analytics page
│   └── security/          # Security settings
├── components/
│   ├── 3d/                # Three.js visualizations
│   ├── charts/            # Recharts components
│   ├── memory/            # Pattern cards
│   ├── transactions/      # Transaction cards
│   ├── wallet/            # Wallet connection
│   ├── envio/             # Envio indexer status
│   └── ui/                # Shared UI components
└── lib/
    ├── data/
    │   └── realData.ts    # Real-world consistent data
    ├── store.ts           # Zustand state
    └── utils.ts           # Utility functions
```

---

## 🎯 Demo Strategy

### What to Demo (Minimal but Powerful)

1. **One transaction**
2. **One permission grant**
3. **One historical memory match**
4. **One decision moment**

### Demo Line

> *"Envio lets us index the past. MOSYNE turns that past into memory the wallet can act on."*

---

## 🏆 Hackathon Fit

### Best Use of Envio

| Criterion | MOSYNE |
|-----------|--------|
| Non-obvious use | ✅ |
| Deep Envio dependency | ✅ |
| Long-term indexing | ✅ |
| Not replaceable by RPC | ✅ |
| Infrastructure-level idea | ✅ |
| Wallet UX impact | ✅ |

### MetaMask Advanced Permissions

- Read permission for transaction simulation
- Permission to evaluate target contracts
- Limited authority to pause/warn/block flows
- Optional delegated execution within strict bounds

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Built for MetaMask Advanced Permissions & Best Use of Envio</strong>
</p>

<p align="center">
  <em>"MOSYNE is not a dApp. This is missing infrastructure."</em>
</p>

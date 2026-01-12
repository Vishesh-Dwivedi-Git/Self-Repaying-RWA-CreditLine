# 🏦 Self-Repaying RWA Credit Line

A DeFi protocol enabling **self-repaying loans** backed by yield-bearing Real World Assets (RWAs). Deposit yield-generating collateral (mETH, fBTC), borrow stablecoins, and watch your loan automatically pay itself off using the collateral's yield.

![Solidity](https://img.shields.io/badge/Solidity-%5E0.8.20-blue)
![Hardhat](https://img.shields.io/badge/Hardhat-3.0-yellow)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🎯 Key Features

- **One-Time User Action** – Deposit collateral & borrow in a single transaction
- **Automated Yield Harvesting** – Keeper bot continuously claims and applies yield
- **Self-Repaying Loans** – 80% of yield reduces debt; 20% goes to protocol
- **Gas-Optimized Keeper** – Two-phase scanning minimizes oracle calls
- **Chainlink Price Feeds** – Production-grade asset pricing

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER                                   │
│      Deposit mETH/fBTC + Borrow USDC (one transaction)         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              AutoRepaymentVaultManager.sol                      │
│  • Creates vault with collateral                                │
│  • Issues stablecoin loan                                       │
│  • Tracks all vaults for keeper                                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Keeper monitors
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Optimized Keeper Bot                          │
│  Phase 1: Cheap filters (yield > threshold, time passed)       │
│  Phase 2: Price validation (oracle call only for candidates)   │
│  → processAutoRepayment()                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
Self-Repaying-RWA-CreditLine/
├── Hardhat-Contracts/          # Smart contracts & deployment
│   ├── contracts/
│   │   ├── AutoRepaymentVaultManager.sol   # Core protocol
│   │   ├── MockMETH.sol                    # Mock yield-bearing ETH
│   │   ├── MockFBTC.sol                    # Mock yield-bearing BTC
│   │   ├── MockStablecoin.sol              # Mock USDC
│   │   └── SimplePriceOracle.sol           # Price oracle
│   ├── ignition/modules/
│   │   └── DeployProtocol.cts              # Deployment script
│   └── scripts/                            # Test scripts
│
└── keeper/                     # Automated keeper bot
    └── src/
        └── keeper.ts                       # Two-phase scanning logic
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- npm or yarn
- Redis (optional, for keeper persistence)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/Self-Repaying-RWA-CreditLine.git
cd Self-Repaying-RWA-CreditLine
```

### 2. Setup Contracts

```bash
cd Hardhat-Contracts
npm install
cp .env.example .env
# Edit .env with your private key
```

### 3. Deploy to Mantle Sepolia

```bash
npx hardhat ignition deploy ignition/modules/DeployProtocol.cts --network mantleSepolia
```

### 4. Setup Keeper

```bash
cd ../keeper
npm install
cp .env.example .env
# Edit .env with deployed addresses
npm run start
```

---

## ⚙️ Configuration

### Contracts (.env)

```env
PRIVATE_KEY=your_deployer_private_key
MANTLE_SEPOLIA_RPC_URL=https://rpc.sepolia.mantle.xyz
KEEPER_PRIVATE_KEY=your_keeper_private_key
```

### Keeper (.env)

```env
MANTLE_SEPOLIA_RPC=https://rpc.sepolia.mantle.xyz
KEEPER_PRIVATE_KEY=your_keeper_private_key
VAULT_MANAGER_ADDRESS=0x...deployed_address
ORACLE_ADDRESS=0x...deployed_oracle
```

---

## 📖 How It Works

### User Flow

1. **Deposit & Borrow**: User deposits yield-bearing collateral (mETH/fBTC) and borrows stablecoins in a single transaction
2. **Yield Accrues**: Collateral generates yield over time
3. **Auto-Repayment**: Keeper bot periodically harvests yield and applies it to reduce debt
4. **Loan Paid Off**: Once debt reaches zero, user can withdraw their collateral

### Keeper Logic (Gas-Optimized)

**Phase 1 - Cheap Filters** (no oracle calls):
- Check if vault is active
- Check if debt > 0
- Check if pending yield >= threshold
- Check if time interval has passed

**Phase 2 - Price Validation** (only for candidates):
- Fetch fresh price from Chainlink oracle
- Verify health factor >= 120%
- Execute repayment transaction

---

## 🔒 Protocol Parameters

| Parameter | Value | Description |
|-----------|-------|-------------|
| LTV Ratio | 70% | Max borrow vs collateral value |
| Liquidation Threshold | 85% | Health factor for liquidation |
| Protocol Fee | 20% | Share of yield taken by protocol |
| Min Yield Threshold | 0.001 ETH | Minimum yield to trigger repayment |
| Auto-Check Interval | 1 hour | Min time between vault checks |

---

## 🧪 Testing

```bash
cd Hardhat-Contracts
npx hardhat test
```

---

## 🛠️ Development

### Compile Contracts

```bash
npx hardhat compile
```

### Run Local Node

```bash
npx hardhat node
```

### Deploy Locally

```bash
npx hardhat ignition deploy ignition/modules/DeployProtocol.cts
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

---

<p align="center">
  Built with ❤️ for the DeFi ecosystem
</p>

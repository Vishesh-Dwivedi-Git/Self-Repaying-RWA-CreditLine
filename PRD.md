# Product Requirements Document: Self-Repaying RWA Credit Line

## Document Metadata

```yaml
project: Self-Repaying RWA Credit Line
version: 1.0.0
blockchain: Mantle Network
status: Development
last_updated: 2025-01-12
target_completion: Q3 2025
```

## 1. Executive Summary

### Problem Statement

DeFi lending suffers from three critical issues:

1. **Idle Collateral Syndrome** — Yield-bearing assets (mETH, fBTC) sit unused while locked as collateral
2. **Manual Repayment Burden** — Users must actively manage debt repayment
3. **Crypto-to-RWA Gap** — No seamless bridge between crypto holdings and real-world purchasing power

### Solution Overview

A Mantle-native lending protocol that automatically harvests yield from collateral and applies it to loan repayment. Users deposit yield-bearing assets, borrow stablecoins, and watch their debt reduce automatically over time.

### Key Differentiators

- Automatic yield-to-debt servicing
- Native Mantle ecosystem integration (mETH, fBTC)
- Transparent on-chain fee model (85% user / 15% protocol)
- Dutch auction liquidation mechanism

## 2. Product Vision

**Vision Statement**: Transform DeFi lending from an active burden into a passive wealth-building tool.

### Target Users

| User Type | Use Case | Loan Amount |
|-----------|----------|-------------|
| Long-term HODLers | Access liquidity without selling | $10K–$100K |
| Real Estate Investors | Down payment funding | $50K–$200K |
| Business Owners | Working capital | $25K–$500K |
| Students | Education financing | $10K–$50K |

### Success Metrics

| Metric | Target | Timeframe |
|--------|--------|-----------|
| Total Value Locked (TVL) | $50M | 6 months |
| Loan Completion via Yield | >90% | Ongoing |
| Average Time to Stablecoin | <30 seconds | At launch |

## 3. System Architecture

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
│                    (Next.js 14 Dashboard)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     LAYER 6: GOVERNANCE                         │
│                     Protocol Treasury                           │
│            (Fee collection, parameter management)               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LAYER 5: LIQUIDATION                         │
│                    Liquidation Engine                           │
│          (Health Factor monitoring, Dutch Auctions)             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 LAYER 4: REPAYMENT AUTOMATION                   │
│                     Auto-Repay Engine                           │
│         (Yield-to-stablecoin swap, debt reduction)              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   LAYER 3: LENDING ENGINE                       │
│                       Loan Manager                              │
│            (Debt tracking, LTV calculations)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 LAYER 2: YIELD AGGREGATION                      │
│                       Yield Router                              │
│          (Harvest native staking rewards, convert)              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LAYER 1: COLLATERAL                          │
│                       Vault System                              │
│              (Secure mETH/fBTC custody)                         │
└─────────────────────────────────────────────────────────────────┘
```

### Layer Specifications

| Layer | Component | Primary Function | Inputs | Outputs |
|-------|-----------|------------------|--------|---------|
| 1 | Vault System | Secure asset custody | mETH, fBTC deposits | Collateral balance |
| 2 | Yield Router | Harvest and route yield | Staking rewards | Yield tokens |
| 3 | Loan Manager | Debt state management | Oracle prices, collateral | USDC/USDT |
| 4 | Auto-Repay Engine | Yield-to-debt conversion | Harvested yield | Debt reduction events |
| 5 | Liquidation Engine | Risk management | Health Factor | Auction triggers |
| 6 | Protocol Treasury | Revenue management | Protocol fees | Governance funds |

## 4. Core Protocol Mechanics

### Loan-to-Value (LTV) Parameters

| Asset | Max LTV | Liquidation Threshold | Liquidation Penalty |
|-------|---------|----------------------|---------------------|
| mETH | 70% | 80% | 5% |
| fBTC | 70% | 80% | 5% |

### Health Factor Calculation

```
Health Factor = (Collateral Value × Liquidation Threshold) / Debt Value
```

- **Healthy**: Health Factor > 1.0
- **Liquidation**: Health Factor < 1.0

### Yield Distribution

```
Total Harvested Yield
├── 85% → User Loan Repayment
└── 15% → Protocol Treasury
```

### Example Flow: 10 mETH Deposit

```
1. DEPOSIT
   └── User locks 10 mETH (value: $30,000)

2. BORROW
   └── User receives 21,000 USDC (70% LTV)
   └── Initial Health Factor: 1.14

3. YIELD ACCRUAL (ongoing)
   └── mETH earns ~4% APY natively on Mantle

4. HARVEST (triggered by Keeper)
   └── YieldRouter.harvestYield() called
   └── 0.1 mETH yield claimed

5. CONVERSION
   └── Yield swapped to USDC on Agni/FusionX
   └── 0.085 mETH (85%) → ~255 USDC
   └── 0.015 mETH (15%) → Protocol Treasury

6. REPAYMENT
   └── LendingPool.applyYieldToLoan() called
   └── Debt reduced: 21,000 → 20,745 USDC
   └── New Health Factor: 1.16
   └── DebtReduced event emitted
```

## 5. Smart Contract Architecture

### Directory Structure

```
mantle-msr-protocol/
├── contracts/
│   ├── core/
│   │   ├── LendingPool.sol          # Main user interaction hub
│   │   └── CollateralVault.sol      # Asset custody and accounting
│   ├── yield/
│   │   ├── YieldRouter.sol          # Harvest and conversion logic
│   │   └── YieldSplitter.sol        # 85/15 distribution
│   ├── oracles/
│   │   ├── PriceOracle.sol          # Asset price feeds
│   │   └── YieldOracle.sol          # Yield rate tracking
│   └── liquidation/
│       ├── LiquidationEngine.sol    # Health monitoring
│       └── AuctionHouse.sol         # Dutch auction implementation
├── scripts/
│   ├── deploy.js                    # Deployment automation
│   └── keeper.js                    # Node.js harvest automation
├── frontend/
│   ├── components/
│   │   ├── SafetyGauge.tsx          # Health Factor visualization
│   │   ├── YieldCountdown.tsx       # Next harvest timer
│   │   └── CreditStory.tsx          # Loan history display
│   └── hooks/
│       ├── useLoan.ts               # Loan state management
│       └── useYield.ts              # Yield tracking
├── test/
│   ├── LendingPool.t.sol
│   ├── YieldRouter.t.sol
│   └── Liquidation.t.sol
└── foundry.toml
```

### Contract Interfaces

#### LendingPool.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILendingPool {
    // Events
    event Deposited(address indexed user, address indexed asset, uint256 amount);
    event Borrowed(address indexed user, uint256 amount);
    event DebtReduced(address indexed user, uint256 amount, uint256 newDebt);
    event Withdrawn(address indexed user, address indexed asset, uint256 amount);

    // Core functions
    function depositAndBorrow(
        address asset,
        uint256 depositAmount,
        uint256 borrowAmount
    ) external returns (uint256 loanId);

    function deposit(address asset, uint256 amount) external;
    function borrow(uint256 amount) external;
    function repay(uint256 amount) external;
    function withdraw(address asset, uint256 amount) external;

    // Internal (called by YieldRouter)
    function applyYieldToLoan(address user, uint256 amount) external;

    // View functions
    function calculateHealthFactor(address user) external view returns (uint256);
    function getUserDebt(address user) external view returns (uint256);
    function getUserCollateral(address user, address asset) external view returns (uint256);
}
```

#### YieldRouter.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IYieldRouter {
    // Events
    event YieldHarvested(address indexed asset, uint256 amount);
    event YieldConverted(uint256 yieldAmount, uint256 stableAmount);
    event YieldDistributed(address indexed user, uint256 userAmount, uint256 protocolAmount);

    // Core functions
    function harvestYield(address asset) external returns (uint256 harvestedAmount);
    function convertToStable(address fromAsset, uint256 amount) external returns (uint256 stableAmount);
    function splitAndDistribute(address user, uint256 stableAmount) external;

    // View functions
    function getPendingYield(address user, address asset) external view returns (uint256);
    function getLastHarvestTime(address asset) external view returns (uint256);
}
```

#### LiquidationEngine.sol

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILiquidationEngine {
    // Events
    event LiquidationTriggered(address indexed user, uint256 debtToCover);
    event AuctionStarted(uint256 indexed auctionId, address indexed user, uint256 startPrice);
    event AuctionCompleted(uint256 indexed auctionId, address indexed liquidator, uint256 finalPrice);

    // Core functions
    function checkLiquidation(address user) external view returns (bool isLiquidatable);
    function triggerLiquidation(address user) external returns (uint256 auctionId);
    function bid(uint256 auctionId) external payable;

    // View functions
    function getCurrentAuctionPrice(uint256 auctionId) external view returns (uint256);
    function getAuctionDetails(uint256 auctionId) external view returns (
        address user,
        uint256 debtAmount,
        uint256 collateralAmount,
        uint256 startTime,
        uint256 startPrice
    );
}
```

### Key Function Implementations

#### depositAndBorrow (One-Click Onboarding)

```solidity
function depositAndBorrow(
    address asset,
    uint256 depositAmount,
    uint256 borrowAmount
) external nonReentrant returns (uint256 loanId) {
    // 1. Validate asset is supported (mETH or fBTC)
    require(supportedAssets[asset], "Asset not supported");
    
    // 2. Transfer collateral from user
    IERC20(asset).safeTransferFrom(msg.sender, address(vault), depositAmount);
    
    // 3. Get oracle price
    uint256 collateralValue = oracle.getPrice(asset) * depositAmount / 1e18;
    
    // 4. Validate LTV
    uint256 maxBorrow = collateralValue * MAX_LTV / 100;
    require(borrowAmount <= maxBorrow, "Exceeds max LTV");
    
    // 5. Record loan
    loans[msg.sender].collateral[asset] += depositAmount;
    loans[msg.sender].debt += borrowAmount;
    
    // 6. Mint stablecoins to user
    stablecoin.mint(msg.sender, borrowAmount);
    
    emit Deposited(msg.sender, asset, depositAmount);
    emit Borrowed(msg.sender, borrowAmount);
    
    return loans[msg.sender].id;
}
```

#### harvestYield (Keeper-Triggered)

```solidity
function harvestYield(address asset) external onlyKeeper returns (uint256 harvestedAmount) {
    // 1. Claim native staking rewards from Mantle
    harvestedAmount = IStakingRewards(stakingContracts[asset]).claim();
    
    require(harvestedAmount > 0, "No yield to harvest");
    
    // 2. Convert to stablecoin via DEX
    uint256 stableAmount = _swapOnDex(asset, harvestedAmount, stablecoin);
    
    // 3. Split: 85% user, 15% protocol
    uint256 userAmount = stableAmount * 85 / 100;
    uint256 protocolAmount = stableAmount - userAmount;
    
    // 4. Apply to user loans (proportionally)
    _distributeToLoans(userAmount);
    
    // 5. Send to treasury
    stablecoin.safeTransfer(treasury, protocolAmount);
    
    emit YieldHarvested(asset, harvestedAmount);
    emit YieldDistributed(address(0), userAmount, protocolAmount);
    
    return harvestedAmount;
}
```

#### calculateHealthFactor

```solidity
function calculateHealthFactor(address user) public view returns (uint256) {
    Loan storage loan = loans[user];
    
    if (loan.debt == 0) return type(uint256).max;
    
    // Sum all collateral values
    uint256 totalCollateralValue = 0;
    for (uint i = 0; i < supportedAssetsList.length; i++) {
        address asset = supportedAssetsList[i];
        uint256 collateralAmount = loan.collateral[asset];
        if (collateralAmount > 0) {
            uint256 price = oracle.getPrice(asset);
            totalCollateralValue += price * collateralAmount / 1e18;
        }
    }
    
    // Health Factor = (Collateral * Liquidation Threshold) / Debt
    // Scaled by 1e18 for precision
    return (totalCollateralValue * LIQUIDATION_THRESHOLD * 1e18) / (loan.debt * 100);
}
```

## 6. Technical Stack

### Blockchain Layer

| Component | Technology | Purpose |
|-----------|------------|---------|
| Network | Mantle Mainnet | L2 with native yield |
| Price Feeds | Chainlink + Mantle Native | Oracle redundancy |
| Automation | Gelato/Chainlink Keepers | Harvest triggers |

### Smart Contracts

| Component | Technology | Version |
|-----------|------------|---------|
| Language | Solidity | ^0.8.20 |
| Framework | Foundry | Latest |
| Libraries | OpenZeppelin | 5.x |
| Testing | Forge | Latest |

### Frontend

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js | 14.x |
| Language | TypeScript | 5.x |
| Web3 | Wagmi + Viem | Latest |
| Wallet | RainbowKit | Latest |
| Styling | Tailwind CSS | 3.x |

### Backend Services

| Component | Technology | Purpose |
|-----------|------------|---------|
| API | Express.js | REST endpoints |
| Database | PostgreSQL | User data, analytics |
| Cache | Redis | Performance |
| Indexer | The Graph | Event indexing |

## 7. Liquidation Mechanism

### Dutch Auction Design

```
AUCTION PARAMETERS:
├── Start Price: 105% of debt value
├── Price Decay: Linear decrease
├── Decay Interval: Every 10 minutes
├── Minimum Price: 95% of debt value
└── Duration: 2 hours maximum
```

### Liquidation Flow

```
1. TRIGGER
   └── Health Factor drops below 1.0
   └── Anyone can call triggerLiquidation()

2. AUCTION START
   └── Collateral locked in AuctionHouse
   └── Start price = debt × 1.05

3. PRICE DECAY
   └── Price decreases linearly every 10 minutes
   └── Example: 105% → 102% → 99% → 96%...

4. BID ACCEPTANCE
   └── Liquidator calls bid() with payment
   └── Receives collateral at current auction price

5. SETTLEMENT
   └── Debt cleared from user's loan
   └── Excess collateral returned to user
   └── 5% liquidation bonus to liquidator
```

## 8. Security Architecture

### Multi-Layer Security Model

| Layer | Protection | Implementation |
|-------|------------|----------------|
| Audit | External review | CertiK, Trail of Bits |
| Oracle | Price manipulation | 15-minute TWAP |
| Access | Admin functions | Multi-sig (3/5) |
| Time | Governance changes | 24-hour timelock |
| Reentrancy | Function calls | OpenZeppelin ReentrancyGuard |
| Flash Loans | Attack vector | Single-block collateral lockup |

### Emergency Procedures

```solidity
// Emergency pause capabilities
function pauseDeposits() external onlyMultisig;
function pauseBorrows() external onlyMultisig;
function enableWithdrawOnlyMode() external onlyMultisig;
```

## 9. Risk Management

### Risk Categories and Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Smart Contract Bug | Critical | Multiple audits, bug bounty |
| Oracle Manipulation | High | TWAP, multiple sources |
| Yield Volatility | Medium | Conservative LTV, manual repayment option |
| Network Congestion | Medium | Batch harvesting, priority gas |
| Liquidity Crisis | Medium | Emergency withdrawal mode |

### Conservative Parameters

- Max LTV set at 70% (not 80%) for buffer
- Liquidation threshold at 80%
- 24-hour timelock on parameter changes
- $10M insurance fund target

## 10. User Experience Flows

### First-Time Borrowing

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Connect    │───▶│   Select     │───▶│   Enter      │
│   Wallet     │    │   Collateral │    │   Amount     │
└──────────────┘    └──────────────┘    └──────────────┘
                                               │
                                               ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Receive    │◀───│   Confirm    │◀───│   Review     │
│   USDC       │    │   Transaction│    │   Terms      │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Dashboard Elements

| Component | Data Displayed |
|-----------|----------------|
| Safety Gauge | Health Factor (visual meter) |
| Loan Card | Principal, current debt, time remaining |
| Yield Tracker | This month, all-time, next harvest |
| Price Alert | Liquidation price threshold |

## 11. RWA Integration Strategy

### Bridge Mechanism

```
Crypto Collateral → Yield → Stablecoins → RWA Platform
     (mETH)        (4%)      (USDC)      (Centrifuge)
```

### Planned Partnerships

| Partner | Asset Class | Integration Type |
|---------|-------------|------------------|
| Centrifuge | Real Estate | Direct-to-vault |
| Goldfinch | Credit Lines | API integration |
| Backed Finance | Tokenized Securities | Bridge |

### RWA Use Cases

| Use Case | Collateral | Loan Amount | Projected Payoff |
|----------|------------|-------------|------------------|
| Home Down Payment | 50 mETH | $75,000 | ~15 years |
| Business Equipment | 20 fBTC | $100,000 | ~12 years |
| MBA Tuition | 15 mETH | $45,000 | ~10 years |

## 12. Economic Model

### Revenue Streams

| Stream | Rate | At $100M TVL |
|--------|------|--------------|
| Yield Fee | 15% of harvested yield | $600K/year |
| Liquidation Bonus | 5% of liquidated value | $250K/year |
| Flash Loan Fee | 0.09% per loan | $800K/year |
| **Total Revenue** | | **$1.65M/year** |

### Operating Costs

| Category | Annual Cost |
|----------|-------------|
| Security Audits | $300K |
| Keeper Gas | $150K |
| Infrastructure | $100K |
| Team | $250K |
| **Total Costs** | **$800K** |

### Net Margin

```
Revenue:    $1,650,000
Costs:      $  800,000
──────────────────────
Net:        $  850,000 (51% margin)
```

### $SRWA Token Utility

| Utility | Benefit |
|---------|---------|
| Governance | Vote on fee structures, collateral types |
| Fee Discount | Up to 50% reduction on protocol fees |
| Yield Boost | Additional APY for stakers |
| Revenue Share | Pro-rata treasury distribution |

## 13. Development Roadmap

### Q1 2025: Foundation (Hackathon Phase)

- [ ] Core LendingPool.sol implementation
- [ ] mETH and fBTC vault integration
- [ ] Basic YieldRouter with manual trigger
- [ ] Mantle Sepolia testnet deployment
- [ ] Minimal frontend (deposit/borrow/monitor)

### Q2 2025: Security & Launch

- [ ] CertiK smart contract audit
- [ ] Trail of Bits security review
- [ ] Bug bounty program launch
- [ ] Mainnet deployment
- [ ] Gelato Keeper integration

### Q3 2025: Growth & Expansion

- [ ] $SRWA token launch
- [ ] Centrifuge RWA integration
- [ ] Goldfinch credit line partnership
- [ ] Mobile app release
- [ ] $50M TVL target

### Q4 2025: Scaling

- [ ] Additional collateral types (rETH, sDAI)
- [ ] Cross-chain expansion
- [ ] Institutional product tier
- [ ] $100M TVL target

## 14. Testing Requirements

### Unit Tests

```bash
# Run all tests
forge test

# Run specific contract tests
forge test --match-contract LendingPoolTest
forge test --match-contract YieldRouterTest
forge test --match-contract LiquidationTest

# With gas reporting
forge test --gas-report
```

### Test Coverage Requirements

| Contract | Minimum Coverage |
|----------|------------------|
| LendingPool.sol | 95% |
| YieldRouter.sol | 90% |
| LiquidationEngine.sol | 95% |
| CollateralVault.sol | 90% |

### Integration Test Scenarios

1. Full deposit-borrow-harvest-repay cycle
2. Liquidation trigger and auction completion
3. Multi-user yield distribution
4. Oracle price update handling
5. Emergency pause functionality

## 15. Deployment Information

### Testnet Contracts (Mantle Sepolia)

| Contract | Address |
|----------|---------|
| LendingPool | `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb` |
| YieldRouter | `0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063` |
| Treasury | `0x119840a85d5aF5bf1D1762F925BDADdC4201F984` |

### Deployment Checklist

- [ ] Verify all contracts on Mantlescan
- [ ] Set correct oracle addresses
- [ ] Configure keeper permissions
- [ ] Initialize supported assets
- [ ] Set treasury multi-sig
- [ ] Enable timelock

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| LTV | Loan-to-Value ratio; percentage of collateral that can be borrowed |
| Health Factor | Risk metric; loan is liquidated when this falls below 1.0 |
| mETH | Mantle's native yield-bearing ETH |
| fBTC | Fungible tokenized Bitcoin on Mantle |
| TWAP | Time-Weighted Average Price; oracle manipulation protection |
| Keeper | Automated bot that triggers harvest functions |

## Appendix B: API Reference

### REST Endpoints

```
GET  /api/v1/loans/:address          # Get user's loan details
GET  /api/v1/yield/:address          # Get yield statistics
GET  /api/v1/health/:address         # Get health factor
POST /api/v1/simulate                 # Simulate loan parameters
GET  /api/v1/auctions/active         # List active liquidation auctions
```

### WebSocket Events

```
loan:updated        # Loan state change
yield:harvested     # Harvest completed
health:warning      # Health factor below 1.2
liquidation:started # Auction began
```

## Appendix C: Configuration Constants

```solidity
// Protocol Parameters
uint256 constant MAX_LTV = 70;                    // 70%
uint256 constant LIQUIDATION_THRESHOLD = 80;      // 80%
uint256 constant LIQUIDATION_PENALTY = 5;         // 5%
uint256 constant PROTOCOL_FEE = 15;               // 15%
uint256 constant USER_YIELD_SHARE = 85;           // 85%

// Auction Parameters
uint256 constant AUCTION_START_PREMIUM = 105;     // 105% of debt
uint256 constant AUCTION_DECAY_INTERVAL = 600;    // 10 minutes
uint256 constant AUCTION_DURATION = 7200;         // 2 hours

// Safety Parameters
uint256 constant TWAP_PERIOD = 900;               // 15 minutes
uint256 constant TIMELOCK_DELAY = 86400;          // 24 hours
uint256 constant MIN_COLLATERAL_LOCKUP = 1;       // 1 block

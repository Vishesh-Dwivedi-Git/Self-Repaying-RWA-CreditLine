# 🧭 Frontend Flow & Page Structure

---

## 📍 Route Map

| Route | Page | Condition |
|-------|------|-----------|
| `/` | Landing Page | Always |
| `/app` | Create Vault | If `!vault.isActive` |
| `/app` | Dashboard | If `vault.isActive` |
| `/analytics` | Protocol Stats | Always (public) |

---

## 🏠 Page 1: Landing Page (`/`)

**Purpose**: Marketing + Entry point

### Sections
1. **Hero** - Title, tagline, "Launch App" button
2. **How It Works** - 3-step visual (Deposit → Borrow → Auto-Repay)
3. **Features** - Self-repaying loans, Yield-bearing collateral, Gas-optimized

### Optional Live Stats
```javascript
const stats = {
    totalVaults: await vaultManager.totalVaults(),
    protocolRevenue: await vaultManager.totalProtocolRevenue()
};
```

---

## 📝 Page 2: Create Vault (`/app` - No Active Vault)

**Purpose**: Deposit collateral + Borrow USDC

### UI Layout
```
┌─────────────────────────────────────────────────────────┐
│  CREATE YOUR VAULT                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Collateral                    Preview                  │
│  ┌─────────────────────┐       ┌─────────────────────┐  │
│  │ [mETH ▼] [10.0    ] │       │ Value:    $35,000   │  │
│  │ Balance: 15.2 mETH  │       │ LTV:      70%       │  │
│  └─────────────────────┘       │ Health:   143%      │  │
│                                │ APY:      3%        │  │
│  Borrow Amount                 └─────────────────────┘  │
│  ┌─────────────────────┐                                │
│  │ [═══════●═══] $24.5k│       [Approve mETH]           │
│  │ Max: $24,500 USDC   │       [Create & Borrow]        │
│  └─────────────────────┘                                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Data to Fetch
| Data | Function | Display |
|------|----------|---------|
| User Balance | `meth.balanceOf(user)` | "Balance: 15.2 mETH" |
| Asset Price | `oracle.getLatestPrice(meth)` | For value calculation |
| Max Borrow | `oracle.getAssetValue() * 0.70` | Slider max |

### User Actions
| Step | Button | Contract Call |
|------|--------|---------------|
| 1 | "Approve mETH" | `meth.approve(vaultManager, amount)` |
| 2 | "Create & Borrow" | `vaultManager.depositCollateralAndBorrow(asset, collateral, borrow)` |

---

## 📊 Page 3: Dashboard (`/app` - Has Active Vault)

**Purpose**: Monitor vault health, view auto-repayments

### UI Layout
```
┌─────────────────────────────────────────────────────────┐
│  YOUR VAULT                                    [Close]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│  │ HEALTH       │ │ DEBT         │ │ COLLATERAL   │     │
│  │   175% 🟢    │ │ $24,500      │ │ 10.0 mETH    │     │
│  │   SAFE       │ │ USDC         │ │ ($35,000)    │     │
│  └──────────────┘ └──────────────┘ └──────────────┘     │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ PENDING YIELD                                    │   │
│  │ 0.05 mETH ($175) - Next auto-repay soon ⏳       │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 📈 HEALTH GAUGE                                  │   │
│  │ [🔴====|🟡==========|🟢●==================]      │   │
│  │  85%   120%        150%           200%           │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 📜 ACTIVITY LOG                                  │   │
│  │ ● Jan 12 - Auto-Repay: -$140 USDC               │   │
│  │ ● Jan 10 - Auto-Repay: -$125 USDC               │   │
│  │ ● Jan 5  - Vault Created: 10 mETH → $24.5k      │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Data to Fetch
```javascript
const [collateral, debt, pendingYield, healthFactor, isActive, isReady] = 
    await vaultManager.getVaultInfo(userAddress);
```

| Display | Source |
|---------|--------|
| Health Factor | `healthFactor` (divide by 100 for %) |
| Debt | `debt` (format with 6 decimals for USDC) |
| Collateral | `collateral` (format with 18 decimals) |
| Pending Yield | `pendingYield` |

### Live Events to Listen
```javascript
vaultManager.on("AutoYieldApplied", (user, yield, debtReduced) => {
    showNotification(`🎉 Debt reduced by ${debtReduced}`);
    refreshData();
});
```

### Actions
| Button | Condition | Function |
|--------|-----------|----------|
| "Withdraw & Close" | `debt == 0` | `vaultManager.withdrawCollateral()` |

---

## 📈 Page 4: Analytics (`/analytics`)

**Purpose**: Protocol-wide statistics (public)

### Stats Cards
| Stat | Function | Display |
|------|----------|---------|
| Total Vaults | `vaultManager.totalVaults()` | "156 Vaults" |
| Protocol Revenue | `vaultManager.totalProtocolRevenue()` | "$12,450" |
| Auto-Repayments | `vaultManager.autoRepaymentCount()` | "1,234" |

### Charts
- **TVL Over Time** - Historical collateral value
- **Collateral Split** - Pie chart (mETH vs fBTC)

---

## 🔗 Contract Addresses (Mantle Sepolia)

| Contract | Address |
|----------|---------|
| VaultManager | `0x9e28244544dA3368Bd5aD1Ed0f5A8D75319F7828` |
| Oracle | `0x4e1930cD75171F15B4f46DF32579F382C79CAC7d` |
| mETH | `0x0bE5Db694C48C1788Bc5DAe3F5B1C6B3E85149D7` |
| fBTC | `0x5f7F942d476dD48DCb08A9c4Eeb04A6FE6814DE5` |
| USDC | `0xD4A5876D5C09858701De181035a3BB79322aFCD6` |

---

## 📚 Quick Function Reference

### VaultManager
| Function | Type | Use |
|----------|------|-----|
| `getVaultInfo(address)` | READ | Dashboard data |
| `depositCollateralAndBorrow(asset, collateral, borrow)` | WRITE | Create vault |
| `withdrawCollateral()` | WRITE | Close vault |
| `totalVaults()` | READ | Stats |
| `totalProtocolRevenue()` | READ | Stats |

### Tokens (mETH/fBTC)
| Function | Type | Use |
|----------|------|-----|
| `balanceOf(address)` | READ | User balance |
| `approve(spender, amount)` | WRITE | Before deposit |
| `getPendingYield(address)` | READ | Yield display |

### Oracle
| Function | Type | Use |
|----------|------|-----|
| `getLatestPrice(asset)` | READ | Price display |
| `getAssetValue(asset, amount)` | READ | Value calculation |

---

## 📡 Events to Listen

| Event | When | UI Update |
|-------|------|-----------|
| `VaultCreated` | New vault | Redirect to dashboard |
| `AutoYieldApplied` | Keeper processes | Toast notification, refresh data |
| `VaultClosed` | Debt = 0 | Show celebration 🎉 |

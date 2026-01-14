// Smart Contract Addresses (Mantle Sepolia)
// Deployed with SimplePriceOracle - Jan 14, 2026
export const CONTRACTS = {
    VAULT_MANAGER: "0xbBfeD32470c2F9B01207083ecd4e7C7f4B5d76Ca" as const,
    ORACLE: "0x77057304c6b2B1331E83E0D8Be18961f01eedfc4" as const,
    METH: "0x514F4AF14a671beD0E4378b1CF62Bb28788617Fb" as const,
    FBTC: "0xf257ec0A9A87597433bee54E802C1b309a432A17" as const,
    USDC: "0x9525b1083914d898468232198f53858957BD3511" as const,
} as const;

// Minimal ABIs for contract interactions
export const VAULT_MANAGER_ABI = [
    // Read functions
    {
        name: "getVaultInfo",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "user", type: "address" }],
        outputs: [
            { name: "collateral", type: "uint256" },
            { name: "debt", type: "uint256" },
            { name: "pendingYield", type: "uint256" },
            { name: "healthFactor", type: "uint256" },
            { name: "isActive", type: "bool" },
            { name: "isReady", type: "bool" },
        ],
    },
    {
        name: "totalVaults",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "totalProtocolRevenue",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "autoRepaymentCount",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "vaults",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "user", type: "address" }],
        outputs: [
            { name: "collateralAmount", type: "uint256" },
            { name: "debtAmount", type: "uint256" },
            { name: "lastYieldClaim", "type": "uint256" },
            { name: "collateralAsset", type: "address" },
            { name: "isActive", type: "bool" },
            { name: "lastAutoCheck", type: "uint256" },
        ],
    },
    // Write functions
    {
        name: "depositCollateralAndBorrow",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
            { name: "asset", type: "address" },
            { name: "collateralAmount", type: "uint256" },
            { name: "borrowAmount", type: "uint256" },
        ],
        outputs: [],
    },
    {
        name: "addCollateral",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
            { name: "amount", type: "uint256" },
        ],
        outputs: [],
    },
    {
        name: "withdrawCollateral",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [],
        outputs: [],
    },
    // Events
    {
        name: "VaultCreated",
        type: "event",
        inputs: [
            { name: "user", type: "address", indexed: true },
            { name: "collateral", type: "uint256", indexed: false },
            { name: "debt", type: "uint256", indexed: false },
        ],
    },
    {
        name: "AutoYieldApplied",
        type: "event",
        inputs: [
            { name: "user", type: "address", indexed: true },
            { name: "yieldAmount", type: "uint256", indexed: false },
            { name: "debtReduced", type: "uint256", indexed: false },
        ],
    },
    {
        name: "CollateralAdded",
        type: "event",
        inputs: [
            { name: "user", type: "address", indexed: true },
            { name: "amount", type: "uint256", indexed: false },
        ],
    },
    {
        name: "VaultClosed",
        type: "event",
        inputs: [
            { name: "user", type: "address", indexed: true },
            { name: "collateralReturned", type: "uint256", indexed: false },
        ],
    },
] as const;

export const ORACLE_ABI = [
    {
        name: "getPrice",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "asset", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "getAssetValue",
        type: "function",
        stateMutability: "view",
        inputs: [
            { name: "asset", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        outputs: [{ name: "value", type: "uint256" }],
    },
    {
        name: "prices",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "asset", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
    },
] as const;

export const ERC20_ABI = [
    {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "allowance",
        type: "function",
        stateMutability: "view",
        inputs: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
        ],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "approve",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
            { name: "spender", type: "address" },
            { name: "amount", type: "uint256" },
        ],
        outputs: [{ name: "", type: "bool" }],
    },
    {
        name: "decimals",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "uint8" }],
    },
    {
        name: "symbol",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "string" }],
    },
] as const;

// Token metadata
export const TOKENS = {
    mETH: {
        address: CONTRACTS.METH,
        symbol: "mETH",
        decimals: 18,
        name: "Mantle Staked ETH",
        icon: "Ξ",
        color: "blue",
    },
    fBTC: {
        address: CONTRACTS.FBTC,
        symbol: "fBTC",
        decimals: 18,
        name: "Frax Bitcoin",
        icon: "₿",
        color: "orange",
    },
    USDC: {
        address: CONTRACTS.USDC,
        symbol: "USDC",
        decimals: 6,
        name: "USD Coin",
        icon: "$",
        color: "green",
    },
} as const;

// LTV constants from PRD
export const PROTOCOL_CONSTANTS = {
    MAX_LTV: 70, // 70%
    LIQUIDATION_THRESHOLD: 85, // 85%
    YIELD_TO_REPAYMENT: 85, // 85% of yield goes to repayment
    PROTOCOL_FEE: 15, // 15% protocol fee
} as const;

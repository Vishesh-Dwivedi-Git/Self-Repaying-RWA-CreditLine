// Smart Contract Addresses (Mantle Sepolia)
export const CONTRACTS = {
    VAULT_MANAGER: "0x9e28244544dA3368Bd5aD1Ed0f5A8D75319F7828" as const,
    ORACLE: "0x4e1930cD75171F15B4f46DF32579F382C79CAC7d" as const,
    METH: "0x0bE5Db694C48C1788Bc5DAe3F5B1C6B3E85149D7" as const,
    FBTC: "0x5f7F942d476dD48DCb08A9c4Eeb04A6FE6814DE5" as const,
    USDC: "0xD4A5876D5C09858701De181035a3BB79322aFCD6" as const,
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
        name: "withdrawCollateral",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [],
        outputs: [],
    },
] as const;

export const ORACLE_ABI = [
    {
        name: "getLatestPrice",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "asset", type: "address" }],
        outputs: [{ name: "price", type: "uint256" }],
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

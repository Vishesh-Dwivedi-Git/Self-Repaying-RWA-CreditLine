"use client";

import { useReadContract, useReadContracts } from "wagmi";
import { formatEther, formatUnits } from "viem";
import {
    CONTRACTS,
    VAULT_MANAGER_ABI,
    ORACLE_ABI,
    ERC20_ABI,
    TOKENS,
} from "@/lib/contracts";

// Types
export interface VaultInfo {
    collateral: bigint;
    debt: bigint;
    pendingYield: bigint;
    healthFactor: bigint;
    isActive: boolean;
    isReady: boolean;
}

export interface FormattedVaultInfo {
    collateralRaw: bigint;
    collateral: string;
    collateralUsd: number;
    debtRaw: bigint;
    debt: string;
    pendingYieldRaw: bigint;
    pendingYield: string;
    healthFactor: number;
    isActive: boolean;
    isReady: boolean;
}

// Hook: Get vault info for a user
export function useVaultInfo(address: `0x${string}` | undefined) {
    const { data, isLoading, isError, refetch } = useReadContract({
        address: CONTRACTS.VAULT_MANAGER as `0x${string}`,
        abi: VAULT_MANAGER_ABI,
        functionName: "getVaultInfo",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 10000, // Refetch every 10 seconds
        },
    });

    // Parse the returned tuple
    const vaultInfo: FormattedVaultInfo | null = data
        ? {
            collateralRaw: data[0],
            collateral: formatEther(data[0]),
            collateralUsd: 0, // Will be calculated with price
            debtRaw: data[1],
            debt: formatUnits(data[1], 6), // USDC has 6 decimals
            pendingYieldRaw: data[2],
            pendingYield: formatEther(data[2]),
            healthFactor: Number(data[3]) / 100, // e.g., 14300 → 143%
            isActive: data[4],
            isReady: data[5],
        }
        : null;

    return {
        data: vaultInfo,
        raw: data,
        isLoading,
        isError,
        refetch,
    };
}

// Hook: Get user's collateral asset address
export function useCollateralAsset(address: `0x${string}` | undefined) {
    const { data, isLoading, isError, refetch } = useReadContract({
        address: CONTRACTS.VAULT_MANAGER as `0x${string}`,
        abi: VAULT_MANAGER_ABI,
        functionName: "vaults",
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 30000,
        },
    });

    // Determine if mETH or fBTC based on address
    // vaults returns [collateralAmount, debtAmount, lastYieldClaim, collateralAsset, isActive, lastAutoCheck]
    const assetAddress = data ? (data as any)[3] : undefined;
    const isMeth = !!assetAddress && assetAddress?.toLowerCase() === CONTRACTS.METH.toLowerCase();
    const isFbtc = !!assetAddress && assetAddress?.toLowerCase() === CONTRACTS.FBTC.toLowerCase();

    return {
        assetAddress: assetAddress as `0x${string}` | undefined,
        isMeth,
        isFbtc,
        symbol: isMeth ? "mETH" : isFbtc ? "fBTC" : undefined,
        isLoading,
        isError,
        refetch,
    };
}

// Hook: Check if user has an active vault
export function useHasVault(address: `0x${string}` | undefined) {
    const { data, isLoading } = useVaultInfo(address);
    return {
        hasVault: data?.isActive ?? false,
        isLoading,
    };
}

// Hook: Get ERC20 token balance
export function useTokenBalance(
    tokenAddress: `0x${string}`,
    userAddress: `0x${string}` | undefined
) {
    const { data, isLoading, refetch } = useReadContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: userAddress ? [userAddress] : undefined,
        query: {
            enabled: !!userAddress,
            refetchInterval: 15000,
        },
    });

    return {
        balance: data ?? BigInt(0),
        formatted: data ? formatEther(data) : "0",
        isLoading,
        refetch,
    };
}

// Hook: Get token allowance
export function useTokenAllowance(
    tokenAddress: `0x${string}`,
    ownerAddress: `0x${string}` | undefined,
    spenderAddress: `0x${string}`
) {
    const { data, isLoading, refetch } = useReadContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "allowance",
        args: ownerAddress ? [ownerAddress, spenderAddress] : undefined,
        query: {
            enabled: !!ownerAddress,
            refetchInterval: 5000,
        },
    });

    return {
        allowance: data ?? BigInt(0),
        isLoading,
        refetch,
    };
}

// Hook: Get asset price from Oracle
// Fallback prices when oracle is unavailable (testnet issues)
const FALLBACK_PRICES: Record<string, number> = {
    [CONTRACTS.METH.toLowerCase()]: 3200, // ~$3,200 for mETH (similar to ETH)
    [CONTRACTS.FBTC.toLowerCase()]: 95000, // ~$95,000 for fBTC (similar to BTC)
};

export function useAssetPrice(assetAddress: `0x${string}`) {
    const { data, isLoading, isError, refetch } = useReadContract({
        address: CONTRACTS.ORACLE,
        abi: ORACLE_ABI,
        functionName: "getPrice",
        args: [assetAddress],
        query: {
            refetchInterval: 30000, // Refresh every 30 seconds
        },
    });

    // Price is returned in 18 decimals (standard EVM decimal format)
    // Use fallback price if oracle returns 0 or RPC is unavailable
    const oraclePrice = data ? Number(data) / 1e18 : 0;
    const fallbackPrice = FALLBACK_PRICES[assetAddress.toLowerCase()] || 0;
    const price = oraclePrice > 0 ? oraclePrice : fallbackPrice;

    return {
        priceRaw: data ?? BigInt(0),
        price,
        isLoading,
        isError,
        isFallback: oraclePrice === 0 && fallbackPrice > 0,
        refetch,
    };
}

// Hook: Get asset value in USD
export function useAssetValue(
    assetAddress: `0x${string}`,
    amount: bigint
) {
    const { data, isLoading } = useReadContract({
        address: CONTRACTS.ORACLE,
        abi: ORACLE_ABI,
        functionName: "getAssetValue",
        args: [assetAddress, amount],
        query: {
            enabled: amount > BigInt(0),
            refetchInterval: 30000,
        },
    });

    // Value returned in 6 decimals (USDC)
    const value = data ? Number(formatUnits(data, 6)) : 0;

    return {
        valueRaw: data ?? BigInt(0),
        value,
        isLoading,
    };
}

// Hook: Get protocol stats (public)
export function useProtocolStats() {
    const { data, isLoading } = useReadContracts({
        contracts: [
            {
                address: CONTRACTS.VAULT_MANAGER,
                abi: VAULT_MANAGER_ABI,
                functionName: "totalVaults",
            },
            {
                address: CONTRACTS.VAULT_MANAGER,
                abi: VAULT_MANAGER_ABI,
                functionName: "totalProtocolRevenue",
            },
            {
                address: CONTRACTS.VAULT_MANAGER,
                abi: VAULT_MANAGER_ABI,
                functionName: "autoRepaymentCount",
            },
        ],
        query: {
            refetchInterval: 60000, // Refresh every minute
        },
    });

    return {
        totalVaults: data?.[0]?.result ? Number(data[0].result) : 0,
        totalRevenue: data?.[1]?.result
            ? Number(formatUnits(data[1].result as bigint, 6))
            : 0,
        autoRepayments: data?.[2]?.result ? Number(data[2].result) : 0,
        isLoading,
    };
}

// Hook: Get mETH balance specifically
export function useMethBalance(address: `0x${string}` | undefined) {
    return useTokenBalance(CONTRACTS.METH as `0x${string}`, address);
}

// Hook: Get fBTC balance specifically
export function useFbtcBalance(address: `0x${string}` | undefined) {
    return useTokenBalance(CONTRACTS.FBTC as `0x${string}`, address);
}

// Hook: Get mETH price
export function useMethPrice() {
    return useAssetPrice(CONTRACTS.METH as `0x${string}`);
}

// Hook: Get fBTC price
export function useFbtcPrice() {
    return useAssetPrice(CONTRACTS.FBTC as `0x${string}`);
}

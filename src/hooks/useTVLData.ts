"use client";

import { useReadContracts } from "wagmi";
import { formatEther } from "viem";
import { CONTRACTS, ERC20_ABI, ORACLE_ABI } from "@/lib/contracts";

interface TVLData {
    totalTVL: number;
    methTVL: number;
    fbtcTVL: number;
    methAmount: string;
    fbtcAmount: string;
    methPercentage: number;
    fbtcPercentage: number;
}

export function useTVLData() {
    // Query token balances held by the VaultManager contract
    const { data, isLoading, isError, refetch } = useReadContracts({
        contracts: [
            // mETH balance in VaultManager
            {
                address: CONTRACTS.METH as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "balanceOf",
                args: [CONTRACTS.VAULT_MANAGER as `0x${string}`],
            },
            // fBTC balance in VaultManager
            {
                address: CONTRACTS.FBTC as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "balanceOf",
                args: [CONTRACTS.VAULT_MANAGER as `0x${string}`],
            },
            // mETH price from oracle
            {
                address: CONTRACTS.ORACLE as `0x${string}`,
                abi: ORACLE_ABI,
                functionName: "getPrice",
                args: [CONTRACTS.METH as `0x${string}`],
            },
            // fBTC price from oracle
            {
                address: CONTRACTS.ORACLE as `0x${string}`,
                abi: ORACLE_ABI,
                functionName: "getPrice",
                args: [CONTRACTS.FBTC as `0x${string}`],
            },
        ],
        query: {
            refetchInterval: 30000, // Refresh every 30 seconds
        },
    });

    // Parse results
    const methBalanceRaw = data?.[0]?.result as bigint | undefined;
    const fbtcBalanceRaw = data?.[1]?.result as bigint | undefined;
    const methPriceRaw = data?.[2]?.result as bigint | undefined;
    const fbtcPriceRaw = data?.[3]?.result as bigint | undefined;

    // Debug logging
    console.log("📊 TVL Debug Data:", {
        methBalanceRaw: methBalanceRaw?.toString(),
        fbtcBalanceRaw: fbtcBalanceRaw?.toString(),
        methPriceRaw: methPriceRaw?.toString(),
        fbtcPriceRaw: fbtcPriceRaw?.toString(),
        dataStatus: data?.map(d => ({ status: d.status, error: d.error })),
    });

    // Convert to numbers
    const methAmount = methBalanceRaw ? formatEther(methBalanceRaw) : "0";
    const fbtcAmount = fbtcBalanceRaw ? formatEther(fbtcBalanceRaw) : "0";

    // Prices are in 18 decimals (SimplePriceOracle uses 18 decimals, not 8)
    const methPrice = methPriceRaw ? Number(methPriceRaw) / 1e18 : 0;
    const fbtcPrice = fbtcPriceRaw ? Number(fbtcPriceRaw) / 1e18 : 0;

    console.log("💰 Calculated Values:", {
        methAmount,
        fbtcAmount,
        methPrice,
        fbtcPrice,
    });

    // Calculate USD values
    const methTVL = parseFloat(methAmount) * methPrice;
    const fbtcTVL = parseFloat(fbtcAmount) * fbtcPrice;
    const totalTVL = methTVL + fbtcTVL;

    // Calculate percentages
    const methPercentage = totalTVL > 0 ? (methTVL / totalTVL) * 100 : 0;
    const fbtcPercentage = totalTVL > 0 ? (fbtcTVL / totalTVL) * 100 : 0;

    const tvlData: TVLData = {
        totalTVL,
        methTVL,
        fbtcTVL,
        methAmount,
        fbtcAmount,
        methPercentage,
        fbtcPercentage,
    };

    return {
        data: tvlData,
        isLoading,
        isError,
        refetch,
    };
}

// Format TVL for display
export function formatTVL(value: number): string {
    if (value >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(2)}M`;
    }
    if (value >= 1_000) {
        return `$${(value / 1_000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
}

// Format TVL for chart display (shorter)
export function formatTVLShort(value: number): string {
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
        return `${(value / 1_000).toFixed(0)}K`;
    }
    return `${value.toFixed(0)}`;
}

"use client";

import React, { useState, useMemo } from "react";
import { ChevronRight, Coins, TrendingUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAccount } from "wagmi";
import { useMethBalance, useFbtcBalance, useMethPrice, useFbtcPrice } from "@/hooks/useVaultData";
import { formatEther } from "viem";

interface CollateralAsset {
    symbol: string;
    name: string;
    apy: number;
    balance: string;
    balanceRaw: bigint;
    price: number; // USD price per unit
    icon: string;
}

const LTV_RATIO = 0.70; // 70% Loan-to-Value

interface SelectCollateralProps {
    onContinue: (collateral: { symbol: string; amount: number; usdValue: number; apy: number }) => void;
}

export function SelectCollateral({ onContinue }: SelectCollateralProps) {
    const { address } = useAccount();

    // Fetch live balances and prices
    const { balance: methBalanceRaw, isLoading: methLoading } = useMethBalance(address as `0x${string}`);
    const { balance: fbtcBalanceRaw, isLoading: fbtcLoading } = useFbtcBalance(address as `0x${string}`);
    const { price: methPrice, isLoading: methPriceLoading } = useMethPrice();
    const { price: fbtcPrice, isLoading: fbtcPriceLoading } = useFbtcPrice();

    const isLoading = methLoading || fbtcLoading || methPriceLoading || fbtcPriceLoading;

    // Build collateral assets from live data - no price fallbacks
    const COLLATERAL_ASSETS: CollateralAsset[] = useMemo(() => [
        {
            symbol: "mETH",
            name: "Mantle ETH",
            apy: 3.2,
            balance: formatEther(methBalanceRaw),
            balanceRaw: methBalanceRaw,
            price: methPrice || 0,
            icon: "Ξ"
        },
        {
            symbol: "fBTC",
            name: "Fungible BTC",
            apy: 2.5,
            balance: formatEther(fbtcBalanceRaw),
            balanceRaw: fbtcBalanceRaw,
            price: fbtcPrice || 0,
            icon: "₿"
        },
    ], [methBalanceRaw, fbtcBalanceRaw, methPrice, fbtcPrice]);

    const [selectedAsset, setSelectedAsset] = useState<string>("mETH");
    const [amounts, setAmounts] = useState<Record<string, string>>({ mETH: "", fBTC: "" });

    const handleAmountChange = (symbol: string, value: string) => {
        // Only allow valid numbers
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setAmounts({ ...amounts, [symbol]: value });
            setSelectedAsset(symbol);
        }
    };

    const handleMax = (symbol: string, balance: string) => {
        setAmounts({ ...amounts, [symbol]: balance });
        setSelectedAsset(symbol);
    };

    const getSelectedAmount = () => {
        const amount = parseFloat(amounts[selectedAsset]) || 0;
        const asset = COLLATERAL_ASSETS.find(a => a.symbol === selectedAsset);
        if (!asset) return { amount: 0, usdValue: 0, loanAmount: 0, apy: 0 };

        const usdValue = amount * asset.price;
        const loanAmount = usdValue * LTV_RATIO;
        return { amount, usdValue, loanAmount, apy: asset.apy };
    };

    const { amount, usdValue, loanAmount, apy } = getSelectedAmount();
    const canContinue = amount > 0;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-display font-medium tracking-tight text-white">
                    Select Your Collateral
                </h1>
                <p className="text-gray-400">Choose an asset to deposit and generate a self-repaying loan</p>
            </div>

            {/* Collateral Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {COLLATERAL_ASSETS.map((asset) => (
                    <div
                        key={asset.symbol}
                        onClick={() => setSelectedAsset(asset.symbol)}
                        className={cn(
                            "relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer",
                            "bg-black/60 backdrop-blur-md",
                            selectedAsset === asset.symbol
                                ? "border-white/40 shadow-[inset_0_0_30px_rgba(255,255,255,0.1),0_0_30px_rgba(255,255,255,0.15)]"
                                : "border-white/10 hover:border-white/25"
                        )}
                    >
                        {/* APY Badge */}
                        <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                            <span className="text-xs font-medium text-emerald-400">{asset.apy}% APY</span>
                        </div>

                        {/* Asset Info */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                                {asset.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">{asset.symbol}</h3>
                                <p className="text-sm text-gray-500">{asset.name}</p>
                            </div>
                        </div>

                        {/* Balance */}
                        <div className="text-sm text-gray-400 mb-3">
                            Balance: <span className="text-white font-medium">{parseFloat(asset.balance).toFixed(4)} {asset.symbol}</span>
                            {isLoading && <Loader2 className="inline w-3 h-3 ml-2 animate-spin" />}
                        </div>

                        {/* Amount Input */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="0.00"
                                value={amounts[asset.symbol]}
                                onChange={(e) => handleAmountChange(asset.symbol, e.target.value)}
                                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                            />
                            <button
                                onClick={(e) => { e.stopPropagation(); handleMax(asset.symbol, asset.balance); }}
                                className="px-4 py-3 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                            >
                                Max
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Loan Preview */}
            <div className="max-w-3xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Coins className="w-5 h-5 text-white/60" />
                        <span className="text-gray-400">Loan Preview:</span>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-display font-semibold text-white">
                            ${loanAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} USDC
                        </span>
                        <span className="text-sm text-gray-500 ml-2">(70% LTV)</span>
                    </div>
                </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-center">
                <button
                    disabled={!canContinue}
                    onClick={() => onContinue({ symbol: selectedAsset, amount, usdValue, apy })}
                    className={cn(
                        "px-10 py-4 rounded-full text-lg font-medium flex items-center gap-2 transition-all duration-300",
                        canContinue
                            ? "bg-white text-black hover:bg-gray-200 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                            : "bg-white/10 text-gray-500 cursor-not-allowed"
                    )}
                >
                    Continue
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

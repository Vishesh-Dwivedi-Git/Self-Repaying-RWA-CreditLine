"use client";

import React from "react";
import { ArrowLeft, CheckCircle, RefreshCw, Shield, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollateralData {
    symbol: string;
    amount: number;
    usdValue: number;
    apy: number;
}

interface ConfirmVaultProps {
    collateral: CollateralData;
    onBack: () => void;
    onConfirm: () => void;
}

const LTV_RATIO = 0.70;

export function ConfirmVault({ collateral, onBack, onConfirm }: ConfirmVaultProps) {
    const loanAmount = collateral.usdValue * LTV_RATIO;
    const healthPercent = (1 / LTV_RATIO) * 100; // 142.8% at 70% LTV
    const liquidationThreshold = 85;

    // Calculate auto-repay timeline (months)
    const monthlyYield = (collateral.apy / 100) / 12;
    const monthsToRepay = Math.ceil(Math.log(collateral.usdValue / (collateral.usdValue - loanAmount)) / Math.log(1 + monthlyYield));

    const getHealthStatus = () => {
        if (healthPercent >= 150) return { label: "Safe", color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30" };
        if (healthPercent >= 100) return { label: "Moderate", color: "text-yellow-400", bg: "bg-yellow-500/20", border: "border-yellow-500/30" };
        return { label: "At Risk", color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30" };
    };

    const health = getHealthStatus();

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-display font-medium tracking-tight text-white">
                    Review Your Self-Repaying Vault
                </h1>
                <p className="text-gray-400">Confirm the details below to create your vault</p>
            </div>

            {/* Details Card */}
            <div className="p-8 rounded-3xl bg-black/60 backdrop-blur-md border border-white/10 space-y-6">
                {/* Collateral */}
                <div className="flex justify-between items-center py-4 border-b border-white/10">
                    <span className="text-gray-400">Collateral</span>
                    <div className="text-right">
                        <span className="text-xl font-semibold text-white">{collateral.amount} {collateral.symbol}</span>
                        <span className="text-gray-500 ml-2">= ${collateral.usdValue.toLocaleString()}</span>
                    </div>
                </div>

                {/* Loan Amount */}
                <div className="flex justify-between items-center py-4 border-b border-white/10">
                    <span className="text-gray-400">Loan</span>
                    <div className="text-right">
                        <span className="text-xl font-semibold text-white">${loanAmount.toLocaleString()} USDC</span>
                        <span className="text-gray-500 ml-2">(70% LTV)</span>
                    </div>
                </div>

                {/* Auto-Repay */}
                <div className="flex justify-between items-center py-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-400">Auto-repay</span>
                    </div>
                    <span className="text-white">~{monthsToRepay} months via {collateral.apy}% yield</span>
                </div>

                {/* Health Factor */}
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span className="text-gray-400">Health</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={cn("px-3 py-1 rounded-full text-sm font-medium", health.bg, health.border, "border", health.color)}>
                            {Math.round(healthPercent)}% ({health.label})
                        </div>
                        <span className="text-gray-500 text-sm">Liquidation: &lt;{liquidationThreshold}%</span>
                    </div>
                </div>

                {/* Health Bar */}
                <div className="relative h-3 rounded-full bg-white/10 overflow-hidden">
                    <div
                        className="absolute h-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500"
                        style={{ width: "100%" }}
                    />
                    <div
                        className="absolute h-full w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        style={{ left: `${Math.min(healthPercent / 2, 100)}%` }}
                    />
                    {/* Liquidation marker */}
                    <div
                        className="absolute h-full w-0.5 bg-red-500"
                        style={{ left: `${liquidationThreshold / 2}%` }}
                    />
                </div>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-200/80">
                    Your collateral will be locked until the loan is fully repaid. If the health factor drops below {liquidationThreshold}%,
                    your position may be liquidated.
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
                <button
                    onClick={onBack}
                    className="px-8 py-4 rounded-full text-lg font-medium flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>
                <button
                    onClick={onConfirm}
                    className="px-10 py-4 rounded-full text-lg font-medium flex items-center gap-2 bg-white text-black hover:bg-gray-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                >
                    <CheckCircle className="w-5 h-5" />
                    Create Vault
                </button>
            </div>
        </div>
    );
}

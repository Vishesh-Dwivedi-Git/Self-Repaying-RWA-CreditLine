"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useRouter } from "next/navigation";
import { parseEther, parseUnits, formatEther } from "viem";
import { Navbar } from "@/components/Navbar";
import {
    useMethBalance,
    useFbtcBalance,
    useMethPrice,
    useFbtcPrice,
    useTokenAllowance,
} from "@/hooks/useVaultData";
import { CONTRACTS, ERC20_ABI, VAULT_MANAGER_ABI, PROTOCOL_CONSTANTS } from "@/lib/contracts";
import {
    ArrowLeft,
    ChevronDown,
    Wallet,
    TrendingUp,
    Shield,
    Loader2,
    CheckCircle,
    AlertTriangle,
    Lock,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Token Options
const TOKENS = [
    { symbol: "mETH", name: "Mantle ETH", icon: "Ξ", address: CONTRACTS.METH },
    { symbol: "fBTC", name: "Fungible BTC", icon: "₿", address: CONTRACTS.FBTC },
];

export default function CreateVaultPage() {
    const router = useRouter();
    const { address, isConnected } = useAccount();

    // Token balances and prices
    const { balance: methBalanceRaw, isLoading: methLoading } = useMethBalance(address as `0x${string}`);
    const { balance: fbtcBalanceRaw, isLoading: fbtcLoading } = useFbtcBalance(address as `0x${string}`);
    const { price: methPrice } = useMethPrice();
    const { price: fbtcPrice } = useFbtcPrice();

    // State
    const [selectedToken, setSelectedToken] = useState(TOKENS[0]);
    const [collateralAmount, setCollateralAmount] = useState("");
    const [borrowPercent, setBorrowPercent] = useState(70); // Slider position (0-70%)
    const [showTokenDropdown, setShowTokenDropdown] = useState(false);
    const [step, setStep] = useState<"approve" | "create">("approve");

    // Get current token data
    const currentBalance = selectedToken.symbol === "mETH"
        ? formatEther(methBalanceRaw)
        : formatEther(fbtcBalanceRaw);
    const currentPrice = selectedToken.symbol === "mETH" ? (methPrice || 3500) : (fbtcPrice || 60000);
    const isBalanceLoading = selectedToken.symbol === "mETH" ? methLoading : fbtcLoading;

    // Allowance check
    const { allowance, refetch: refetchAllowance } = useTokenAllowance(
        selectedToken.address as `0x${string}`,
        address as `0x${string}`,
        CONTRACTS.VAULT_MANAGER as `0x${string}`
    );

    // Calculations
    const collateralNum = parseFloat(collateralAmount) || 0;
    const collateralValue = collateralNum * currentPrice;
    const maxBorrow = collateralValue * (PROTOCOL_CONSTANTS.MAX_LTV / 100);
    const borrowAmount = collateralValue * (borrowPercent / 100);
    const healthFactor = borrowAmount > 0 ? (collateralValue / borrowAmount) * 100 : 0;
    const apy = selectedToken.symbol === "mETH" ? 3.2 : 2.5;

    // Check if approved
    const collateralWei = collateralNum > 0 ? parseEther(collateralNum.toString()) : BigInt(0);
    const isApproved = allowance >= collateralWei && collateralWei > BigInt(0);

    // Update step based on approval
    useEffect(() => {
        if (isApproved) {
            setStep("create");
        } else {
            setStep("approve");
        }
    }, [isApproved]);

    // Contract writes
    const { writeContract: approve, data: approveHash, isPending: isApproving } = useWriteContract();
    const { writeContract: createVault, data: createHash, isPending: isCreating } = useWriteContract();

    // Transaction receipts
    const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
        hash: approveHash,
    });
    const { isLoading: isCreateConfirming, isSuccess: isCreateSuccess } = useWaitForTransactionReceipt({
        hash: createHash,
    });

    // Refetch allowance on approve success
    useEffect(() => {
        if (isApproveSuccess) {
            refetchAllowance();
        }
    }, [isApproveSuccess, refetchAllowance]);

    // Redirect on create success
    useEffect(() => {
        if (isCreateSuccess) {
            router.push("/dashboard");
        }
    }, [isCreateSuccess, router]);

    // Handlers
    const handleApprove = () => {
        if (!collateralWei) return;
        approve({
            address: selectedToken.address as `0x${string}`,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [CONTRACTS.VAULT_MANAGER as `0x${string}`, collateralWei],
        });
    };

    const handleCreate = () => {
        if (!collateralWei || borrowAmount <= 0) return;
        const borrowWei = parseUnits(borrowAmount.toFixed(6), 6); // USDC has 6 decimals
        createVault({
            address: CONTRACTS.VAULT_MANAGER as `0x${string}`,
            abi: VAULT_MANAGER_ABI,
            functionName: "depositCollateralAndBorrow",
            args: [selectedToken.address as `0x${string}`, collateralWei, borrowWei],
        });
    };

    const handleMax = () => {
        setCollateralAmount(parseFloat(currentBalance).toFixed(6));
    };

    const canProceed = collateralNum > 0 && borrowAmount > 0;

    // Health status
    const getHealthStatus = () => {
        if (healthFactor >= 150) return { label: "Safe", color: "text-[#C3F53C]", bg: "bg-[#C3F53C]/10" };
        if (healthFactor >= 120) return { label: "Moderate", color: "text-yellow-400", bg: "bg-yellow-500/10" };
        return { label: "At Risk", color: "text-red-400", bg: "bg-red-500/10" };
    };
    const health = getHealthStatus();

    // Not connected state
    if (!isConnected) {
        return (
            <main className="min-h-screen bg-[#050505] text-white">
                <Navbar />
                <div className="pt-40 px-6 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                        <Lock className="w-10 h-10 text-gray-400" />
                    </div>
                    <h1 className="text-3xl font-display font-medium">Connect Wallet</h1>
                    <p className="text-gray-400 max-w-md">
                        Please connect your wallet to create a vault.
                    </p>
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Return Home
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            {/* Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(195,245,60,0.03),transparent_60%)] pointer-events-none" />
            <div className="fixed inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="pt-32 pb-20 px-6 relative z-10">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C3F53C]/20 bg-[#C3F53C]/5 text-[#C3F53C] text-[10px] font-medium uppercase tracking-wider mb-4">
                            <Wallet className="w-3 h-3" />
                            New Vault
                        </div>
                        <h1 className="text-3xl md:text-5xl font-display font-medium text-white tracking-tight mb-4">
                            Create Your Vault
                        </h1>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            Deposit yield-bearing collateral and borrow USDC. Your loan repays itself automatically.
                        </p>
                    </div>

                    {/* Main Grid: Collateral + Preview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* LEFT: Collateral Input */}
                        <div className="space-y-6">
                            {/* Collateral Card */}
                            <div className="p-6 rounded-2xl bg-[#0A0A0A]/80 border border-white/5">
                                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                                    Collateral
                                </h3>

                                {/* Token Selector */}
                                <div className="relative mb-4">
                                    <button
                                        onClick={() => setShowTokenDropdown(!showTokenDropdown)}
                                        className="flex items-center justify-between w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">
                                                {selectedToken.icon}
                                            </div>
                                            <div className="text-left">
                                                <div className="font-medium text-white">{selectedToken.symbol}</div>
                                                <div className="text-xs text-gray-500">{selectedToken.name}</div>
                                            </div>
                                        </div>
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    </button>

                                    {showTokenDropdown && (
                                        <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-[#0A0A0A] border border-white/10 z-10">
                                            {TOKENS.map((token) => (
                                                <button
                                                    key={token.symbol}
                                                    onClick={() => {
                                                        setSelectedToken(token);
                                                        setShowTokenDropdown(false);
                                                    }}
                                                    className={cn(
                                                        "flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/5 transition-colors",
                                                        selectedToken.symbol === token.symbol && "bg-[#C3F53C]/10"
                                                    )}
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-lg">
                                                        {token.icon}
                                                    </div>
                                                    <span className="text-white">{token.symbol}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Amount Input */}
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={collateralAmount}
                                        onChange={(e) => {
                                            if (e.target.value === "" || /^\d*\.?\d*$/.test(e.target.value)) {
                                                setCollateralAmount(e.target.value);
                                            }
                                        }}
                                        placeholder="0.00"
                                        className="flex-1 px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-2xl font-display text-white placeholder-gray-600 focus:outline-none focus:border-[#C3F53C]/50 transition-colors"
                                    />
                                    <button
                                        onClick={handleMax}
                                        className="px-6 py-4 rounded-xl bg-[#C3F53C]/10 text-[#C3F53C] font-medium hover:bg-[#C3F53C]/20 transition-colors"
                                    >
                                        MAX
                                    </button>
                                </div>

                                {/* Balance */}
                                <div className="flex justify-between items-center mt-3 text-sm">
                                    <span className="text-gray-500">Balance:</span>
                                    <span className="text-white font-medium">
                                        {isBalanceLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin inline" />
                                        ) : (
                                            `${parseFloat(currentBalance).toFixed(4)} ${selectedToken.symbol}`
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Borrow Amount Slider */}
                            <div className="p-6 rounded-2xl bg-[#0A0A0A]/80 border border-white/5">
                                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                                    Borrow Amount
                                </h3>

                                <div className="text-3xl font-display text-white mb-4">
                                    ${borrowAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-lg text-gray-500">USDC</span>
                                </div>

                                {/* Slider */}
                                <input
                                    type="range"
                                    min="0"
                                    max="70"
                                    value={borrowPercent}
                                    onChange={(e) => setBorrowPercent(Number(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#C3F53C]"
                                    style={{
                                        background: `linear-gradient(to right, #C3F53C ${borrowPercent / 0.7}%, rgba(255,255,255,0.1) ${borrowPercent / 0.7}%)`
                                    }}
                                />

                                <div className="flex justify-between items-center mt-2 text-sm">
                                    <span className="text-gray-500">0%</span>
                                    <span className="text-[#C3F53C] font-medium">{borrowPercent}% LTV</span>
                                    <span className="text-gray-500">70% Max</span>
                                </div>

                                <div className="mt-4 text-sm text-gray-500">
                                    Max: ${maxBorrow.toLocaleString(undefined, { maximumFractionDigits: 0 })} USDC
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Preview Panel */}
                        <div className="space-y-6">
                            <div className="p-6 rounded-2xl bg-[#0A0A0A]/80 border border-white/5">
                                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-6">
                                    Preview
                                </h3>

                                <div className="space-y-4">
                                    {/* Value */}
                                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                                        <span className="text-gray-400">Value:</span>
                                        <span className="text-xl font-display text-white">
                                            ${collateralValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </span>
                                    </div>

                                    {/* LTV */}
                                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                                        <span className="text-gray-400">LTV:</span>
                                        <span className="text-xl font-display text-white">{borrowPercent}%</span>
                                    </div>

                                    {/* Health */}
                                    <div className="flex justify-between items-center py-3 border-b border-white/5">
                                        <span className="text-gray-400">Health:</span>
                                        <div className="flex items-center gap-2">
                                            <span className={cn("text-xl font-display", health.color)}>
                                                {healthFactor > 0 ? `${healthFactor.toFixed(0)}%` : "—"}
                                            </span>
                                            {healthFactor > 0 && (
                                                <span className={cn("px-2 py-0.5 rounded-full text-xs", health.bg, health.color)}>
                                                    {health.label}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* APY */}
                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-gray-400">APY:</span>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-[#C3F53C]" />
                                            <span className="text-xl font-display text-[#C3F53C]">{apy}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Health Bar */}
                                {healthFactor > 0 && (
                                    <div className="mt-6">
                                        <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
                                            <div
                                                className="absolute h-full bg-gradient-to-r from-red-500 via-yellow-500 to-[#C3F53C]"
                                                style={{ width: "100%" }}
                                            />
                                            <div
                                                className="absolute h-full w-1 bg-white shadow-lg"
                                                style={{ left: `${Math.min(healthFactor / 2, 100)}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-1 text-[10px] text-gray-600">
                                            <span>85%</span>
                                            <span>120%</span>
                                            <span>150%</span>
                                            <span>200%</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                {/* Approve Button */}
                                <button
                                    onClick={handleApprove}
                                    disabled={!canProceed || isApproved || isApproving || isApproveConfirming}
                                    className={cn(
                                        "w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all",
                                        isApproved
                                            ? "bg-[#C3F53C]/20 text-[#C3F53C] border border-[#C3F53C]/30"
                                            : canProceed
                                                ? "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                                                : "bg-white/5 text-gray-500 cursor-not-allowed"
                                    )}
                                >
                                    {isApproving || isApproveConfirming ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Approving...
                                        </>
                                    ) : isApproved ? (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Approved
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-5 h-5" />
                                            Approve {selectedToken.symbol}
                                        </>
                                    )}
                                </button>

                                {/* Create Vault Button */}
                                <button
                                    onClick={handleCreate}
                                    disabled={!canProceed || !isApproved || isCreating || isCreateConfirming}
                                    className={cn(
                                        "w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all",
                                        canProceed && isApproved
                                            ? "bg-[#C3F53C] text-black hover:bg-[#d4ff5c] shadow-[0_0_30px_rgba(195,245,60,0.3)]"
                                            : "bg-white/5 text-gray-500 cursor-not-allowed"
                                    )}
                                >
                                    {isCreating || isCreateConfirming ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Creating Vault...
                                        </>
                                    ) : (
                                        <>
                                            <Wallet className="w-5 h-5" />
                                            Create & Borrow
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Warning */}
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
                                <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-yellow-200/60">
                                    Your collateral will be locked until the loan is fully repaid. If health drops below 85%, your position may be liquidated.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

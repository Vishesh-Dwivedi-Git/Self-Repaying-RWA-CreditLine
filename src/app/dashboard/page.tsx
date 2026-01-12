"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, Gem, TrendingUp, Clock, DollarSign, AlertTriangle, ChevronRight, Activity, Settings, DoorOpen, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

// Mock Data
const VAULT_DATA = {
    id: "1234",
    status: "Active",
    health: 214,
    collateral: {
        asset: "mETH",
        amount: "10.000",
        value: 30000,
        apy: 3.2,
        nextHarvest: "12:34 PM"
    },
    loan: {
        borrowed: 21000,
        limit: 20000, // Remaining borrowable status usually. Let's interpret "Remaining" as credit line left.
        // Wait, if borrowed 21k and "remaining" is 20k, limit is 41k. 
        // 30k collateral * 0.70 (70% LTV) = 21k max borrow. 
        // If Health is 214%, that's (Collateral * LiquidationThreshold) / Loan.
        // Let's stick to the visual mockup numbers provided by user regardless of strict math for now.
        remaining: 20000,
        nextRepay: "12:34 PM",
        repayAmount: 25
    }
};

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-[#020202] text-white p-4 md:p-8 pt-24 md:pt-32 font-sans selection:bg-emerald-500/30">

            {/* Background Ambience */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(74,222,128,0.03),transparent_70%)] pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10 space-y-6">

                {/* --- HEADER --- */}
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/5">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-display font-medium tracking-tight">Vault #{VAULT_DATA.id}</h1>
                            <span className="text-emerald-500 text-xs font-mono uppercase tracking-widest hidden md:block">Odyssée Protocol V2</span>
                        </div>
                    </div>
                    <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono gap-2 h-9">
                        <RefreshCw className="w-3.5 h-3.5" />
                        REFRESH DATA
                    </Button>
                </header>

                {/* --- STATUS BAR --- */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex items-center justify-between shadow-2xl"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#4ade80]" />
                        <span className="text-sm font-medium text-white/90">VAULT STATUS:</span>
                        <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                            <span className="text-xs font-mono font-bold text-emerald-500">HEALTH {VAULT_DATA.health}%</span>
                        </div>
                        <span className="text-sm text-gray-400 hidden sm:inline-block">/ {VAULT_DATA.status}</span>
                    </div>
                    <div className="hidden md:flex text-xs text-gray-500 font-mono">
                        BLOCK #192842
                    </div>
                </motion.div>

                {/* --- MAIN SPLIT GRID --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* LEFT: COLLATERAL */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="group relative p-6 md:p-8 rounded-3xl bg-[#080808] border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden"
                    >
                        {/* Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h2 className="text-sm font-mono text-gray-500 uppercase tracking-widest">COLLATERAL</h2>
                            <Gem className="w-5 h-5 text-emerald-500" />
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div>
                                <div className="text-4xl md:text-5xl font-display font-medium text-white mb-2">
                                    {VAULT_DATA.collateral.amount} <span className="text-xl text-gray-500">{VAULT_DATA.collateral.asset}</span>
                                </div>
                                <div className="text-lg text-emerald-400 font-mono">
                                    ≈ ${VAULT_DATA.collateral.value.toLocaleString()} ({VAULT_DATA.health}%)
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/5 border-b">
                                <div>
                                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Yield APY</div>
                                    <div className="text-white font-medium">{VAULT_DATA.collateral.apy}%</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Next Harvest</div>
                                    <div className="text-white font-medium">{VAULT_DATA.collateral.nextHarvest}</div>
                                </div>
                            </div>

                            <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 h-12">
                                + Add More Collateral
                            </Button>
                        </div>
                    </motion.div>

                    {/* RIGHT: LOAN */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="group relative p-6 md:p-8 rounded-3xl bg-[#080808] border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden"
                    >
                        {/* Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-500/10 transition-colors" />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h2 className="text-sm font-mono text-gray-500 uppercase tracking-widest">YOUR LOAN</h2>
                            <DollarSign className="w-5 h-5 text-blue-500" />
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div>
                                <div className="text-4xl md:text-5xl font-display font-medium text-white mb-2">
                                    ${(VAULT_DATA.loan.borrowed / 1000).toFixed(0)}K
                                </div>
                                <div className="text-lg text-blue-400 font-mono">
                                    Borrowed
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/5 border-b">
                                <div>
                                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Activity className="w-3 h-3" /> Remaining</div>
                                    <div className="text-white font-medium">${(VAULT_DATA.loan.remaining / 1000).toFixed(0)}K</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Next Repay</div>
                                    <div className="text-white font-medium flex items-center gap-2">
                                        {VAULT_DATA.loan.nextRepay}
                                        <span className="text-emerald-400 text-xs">↓${VAULT_DATA.loan.repayAmount}</span>
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 h-12">
                                Borrow More
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* --- HEALTH METER --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 md:p-8 rounded-3xl bg-[#0a0a0a]/80 border border-white/5 space-y-4"
                >
                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-1">HEALTH METER</h3>
                            <div className="text-3xl font-display text-emerald-500">{VAULT_DATA.health}% <span className="text-lg text-emerald-500/50">Safe</span></div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500 mb-1">Est. Full Repay</div>
                            <div className="text-white font-medium">Dec 2026 (11 months)</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-6 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        {/* Safe Zone */}
                        <div className="absolute left-0 top-0 bottom-0 w-[70%] bg-emerald-500/20 border-r border-emerald-500/20"></div>
                        {/* Bar */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "80%" }}
                            transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
                            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full box-border border-r-2 border-white/20 shadow-[0_0_20px_rgba(52,211,153,0.3)]"
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-shimmer" />
                        </motion.div>
                    </div>

                    <div className="flex justify-between text-[10px] uppercase font-mono text-gray-600 pt-1">
                        <span>Liquidation (110%)</span>
                        <span>Current ({VAULT_DATA.health}%)</span>
                        <span>Max LTV</span>
                    </div>
                </motion.div>

                {/* --- FOOTER ACTIONS --- */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap gap-4 pt-4"
                >
                    <Button variant="ghost" className="text-gray-400 hover:text-white gap-2">
                        <History className="w-4 h-4" /> Repayment History
                    </Button>
                    <Button variant="ghost" className="text-gray-400 hover:text-white gap-2">
                        <Settings className="w-4 h-4" /> Advanced
                    </Button>
                    <div className="flex-1" />
                    <Button variant="ghost" className="text-red-400/70 hover:text-red-400 hover:bg-red-500/10 gap-2">
                        <DoorOpen className="w-4 h-4" /> Close Vault
                    </Button>
                </motion.div>

            </div>
        </div>
    );
}

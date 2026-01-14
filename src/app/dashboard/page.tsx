"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useDisconnect } from "wagmi";
import { parseEther, formatEther } from "viem";
import { useVaultInfo, useMethPrice, useFbtcPrice, useProtocolStats, useMethBalance, useFbtcBalance, useTokenAllowance, useCollateralAsset } from "@/hooks/useVaultData";
import { useApproveToken, useAddCollateral } from "@/hooks/useContractWrite";
import { useContractEvents } from "@/hooks/useContractEvents";
import { useHistoricalEvents, formatRelativeTime, formatEventForDisplay } from "@/hooks/useHistoricalEvents";
import { useTVLData, formatTVL, formatTVLShort } from "@/hooks/useTVLData";
import { CONTRACTS, TOKENS } from "@/lib/contracts";
import {
    LayoutDashboard,
    Wallet,
    History,
    Settings,
    LogOut,
    Bell,
    Search,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    Minus,
    MoreHorizontal,
    ChevronDown,
    X,
    Home,
    Unplug,
    User,
    ShieldCheck,
    Menu,
    ChevronRight,
    Lock,
    RefreshCw,
    RefreshCcw,
    ArrowRight,
    School,
    Activity,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// --- SUB-COMPONENTS ---

// 1. Sidebar Item (Refined)
const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-300 text-sm font-medium tracking-wide group relative overflow-hidden",
            active
                ? "bg-[#C3F53C]/10 text-white border border-[#C3F53C]/20 shadow-[0_0_20px_rgba(195,245,60,0.1)]"
                : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
        )}
    >
        {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#C3F53C] rounded-r-full" />}
        <Icon className={cn("w-4 h-4 transition-all duration-300", active ? "text-[#C3F53C]" : "text-gray-500 group-hover:text-[#C3F53C]")} />
        <span className="font-sans">{label}</span>
        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C3F53C] animate-pulse" />}
    </button>
);

// 2. Stat Card
// --- AVANT-GARDE COMPONENTS ---

// 1. Bento Card (Base Wrapper)
const BentoCard = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }} // Custom ease
        className={cn(
            "relative bg-[#030303] rounded-[2rem] overflow-hidden group border border-white/5",
            "hover:border-[#C3F53C]/30 transition-all duration-500",
            className
        )}
    >
        {/* Noise & Texture */}
        <div className="absolute inset-0 z-0 opacity-[0.4] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay" />
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 w-full h-full">
            {children}
        </div>

        {/* Hover Glow */}
        <div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20"
            style={{ background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(195, 245, 60, 0.06), transparent 40%)' }}
        />
    </motion.div>
);

// 2. Holo Gauge (Health Ring)
const HoloGauge = ({ percentage }: { percentage: number }) => {
    // 0-200 scale mapped to 0-100 for circle
    const normalized = Math.min((percentage / 200) * 100, 100);
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (normalized / 100) * circumference;

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Rotating Decoration Rings */}
            <div className="absolute inset-0 flex items-center justify-center animate-[spin_10s_linear_infinite] opacity-20">
                <div className="w-[90%] h-[90%] border border-dashed border-[#C3F53C] rounded-full" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center animate-[spin_15s_linear_infinite_reverse] opacity-10">
                <div className="w-[70%] h-[70%] border border-dotted border-white rounded-full" />
            </div>

            {/* Main Gauge */}
            <svg className="w-24 h-24 transform -rotate-90 relative z-10 drop-shadow-[0_0_10px_rgba(195,245,60,0.3)]">
                {/* Track */}
                <circle cx="48" cy="48" r="40" className="stroke-white/5" strokeWidth="6" fill="transparent" />
                {/* Progress */}
                <circle
                    cx="48" cy="48" r="40"
                    className="stroke-[#C3F53C] transition-[stroke-dashoffset] duration-1000 ease-out"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                />
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <span className="text-2xl font-display font-medium text-white tracking-tighter">{percentage}%</span>
                <span className="text-[8px] uppercase tracking-widest text-gray-500">Health</span>
            </div>
        </div>
    );
};

// 3. Digital Readout (Debt)
const DigitalReadout = ({ value, label }: { value: string, label: string }) => (
    <div className="flex flex-col h-full justify-between p-1">
        <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold">{label}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_red]" />
        </div>
        <div className="font-mono text-3xl text-white tracking-tighter tabular-nums truncate leading-none mt-2">
            {value}
        </div>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-4" />
        <div className="flex justify-between items-end mt-2 opacity-50">
            <span className="text-[8px] font-mono text-gray-500">USDC-SEQ.01</span>
            <Activity className="w-3 h-3 text-white" />
        </div>
    </div>
);

// 4. Yield Reactor (Vertical)
const YieldReactor = ({ amount, asset, usdValue }: { amount: number, asset: string, usdValue: string }) => (
    <div className="h-full flex flex-col relative overflow-hidden">
        {/* Core Animation Background */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#C3F53C]/20 to-transparent blur-2xl opacity-60" />

        <div className="relative z-10 flex flex-col h-full bg-white/[0.01] rounded-[1.5rem] border border-white/5 p-5">
            <div className="flex justify-between items-start">
                <div className="p-2 rounded-lg bg-[#C3F53C]/10 border border-[#C3F53C]/20">
                    <TrendingUp className="w-5 h-5 text-[#C3F53C]" />
                </div>
                <span className="text-[9px] font-mono text-[#C3F53C] animate-pulse">REACTION ACTIVE</span>
            </div>

            <div className="mt-auto">
                <h3 className="text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-2">Pending Yield</h3>
                <div className="text-3xl font-display font-medium text-white tracking-tight leading-none mb-1">
                    {amount.toFixed(6)}
                </div>
                <div className="text-sm text-gray-400 font-mono mb-4">{asset}</div>

                <div className="p-3 rounded-xl bg-[#0F0F0F] border border-white/10 flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">Est. Value</span>
                    <span className="text-sm font-medium text-[#C3F53C]">${usdValue}</span>
                </div>
            </div>
        </div>
    </div>
);

// 5. Activity Terminal (List)
const ActivityTerminal = ({ transactions }: { transactions: any[] }) => (
    <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
            <h3 className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold flex items-center gap-2">
                <History className="w-3 h-3" /> Terminal
            </h3>
            <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-gray-600" />
                <div className="w-1 h-1 rounded-full bg-gray-600" />
                <div className="w-1 h-1 rounded-full bg-gray-600" />
            </div>
        </div>

        <div className="flex-1 overflow-hidden relative font-mono text-[10px] space-y-2">
            {/* Scanline */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C3F53C]/5 to-transparent h-4 w-full animate-[scan_4s_linear_infinite] pointer-events-none" />

            {transactions.slice(0, 3).map((tx, i) => (
                <div key={i} className="flex justify-between items-center text-gray-400 hover:text-white transition-colors group cursor-pointer p-1.5 hover:bg-white/5 rounded">
                    <div className="flex items-center gap-2">
                        <span className="text-[#C3F53C] opacity-50 group-hover:opacity-100">{">"}</span>
                        <span>[{tx.date}]</span>
                        <span className={tx.type === "Harvest" ? "text-blue-400" : "text-white"}>{tx.type.toUpperCase()}</span>
                    </div>
                    <span>{tx.amount}</span>
                </div>
            ))}
            {transactions.length === 0 && <div className="text-gray-600 italic pl-4">{">"} System idle...</div>}
        </div>
    </div>
);




// --- VIEW COMPONENTS ---

// --- 6-LAYER ARCHITECTURE COMPONENTS ---

const ConnectionLine = ({ label }: { label: string }) => (
    <div className="flex items-center gap-2 text-[9px] font-mono text-gray-600 uppercase tracking-widest mt-4 pt-4 border-t border-white/5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#C3F53C] animate-pulse" />
        <span className="flex-1 truncate">{label}</span>
        <ArrowRight className="w-3 h-3 text-[#C3F53C]" />
    </div>
);

const LayerCard = ({
    icon: Icon,
    title,
    subtitle,
    value,
    subValue,
    desc,
    connection,
    delay = 0,
    children
}: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-[#0A0A0A]/60 backdrop-blur-md p-6 rounded-[1.75rem] border border-white/5 hover:border-[#C3F53C]/30 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between h-[280px]"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Header */}
        <div>
            <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#C3F53C] group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-5 h-5" />
                </div>
                {/* Layer Number Badge */}
                <div className="text-[9px] font-bold text-gray-700 border border-white/5 px-2 py-1 rounded bg-[#050505]">
                    LAYER {subtitle}
                </div>
            </div>

            <h3 className="text-lg font-display font-medium text-white mb-1 group-hover:text-[#C3F53C] transition-colors">{title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed h-10 overflow-hidden">{desc}</p>
        </div>

        {/* Dynamic Content Area (Value or Graph) */}
        <div className="my-2">
            {children ? children : (
                <div>
                    <div className="text-2xl font-display font-medium text-white tracking-tight">{value}</div>
                    {subValue && <div className="text-xs text-gray-500 font-mono mt-1">{subValue}</div>}
                </div>
            )}
        </div>

        {/* Footer Connection */}
        <ConnectionLine label={connection} />
    </motion.div>
);


const OverviewView = ({ data, setShowDepositModal }: any) => {
    // Health status helper
    const getHealthStatus = (health: number) => {
        if (health >= 150) return { label: "SAFE", color: "text-[#C3F53C]", bg: "bg-[#C3F53C]" };
        if (health >= 120) return { label: "MODERATE", color: "text-yellow-400", bg: "bg-yellow-400" };
        return { label: "AT RISK", color: "text-red-400", bg: "bg-red-400" };
    };
    const health = getHealthStatus(data.health);
    const formattedYieldUsd = (data.yield.total * (parseFloat(data.collateral.amount) > 0 ? (data.collateral.value / parseFloat(data.collateral.amount)) : 0)).toLocaleString(undefined, { maximumFractionDigits: 0 });

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 px-2">
                <div>
                    <h2 className="text-2xl md:text-3xl font-display font-medium text-white tracking-tight">Mainframe</h2>
                    <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-[0.2em] font-medium">System Status: Optimal</p>
                </div>
                <div className="flex gap-4">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[9px] text-gray-600 uppercase tracking-widest">Network</span>
                        <span className="text-xs font-mono text-[#C3F53C]">Mantle Sepolia</span>
                    </div>
                    <div className="w-px h-8 bg-white/10 hidden md:block" />
                    <div className="flex items-center gap-2 text-[10px] text-white font-mono border border-white/10 px-4 py-2 rounded-full bg-white/5">
                        <span className="w-2 h-2 rounded-full bg-[#C3F53C] animate-pulse" />
                        LIVE_FEED
                    </div>
                </div>
            </div>

            {/* AVANT-GARDE BENTO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 md:auto-rows-[160px]">

                {/* 1. Main Hero: Collateral Overview (2x2) */}
                <BentoCard className="md:col-span-2 md:row-span-2 p-6 md:p-8 flex flex-col justify-between group min-h-[260px] md:min-h-0" delay={0}>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-[10px] text-gray-400 uppercase tracking-[0.25em] mb-1">Total Collateral</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl md:text-5xl font-display font-medium text-white tracking-tighter shadow-black drop-shadow-lg">
                                        ${data.collateral.value.toLocaleString()}
                                    </span>
                                </div>
                                <div className="text-sm font-mono text-gray-500 mt-2 flex items-center gap-2">
                                    <span className="text-[#C3F53C] bg-[#C3F53C]/10 px-1.5 py-0.5 rounded border border-[#C3F53C]/10">+12% APY</span>
                                    <span>{data.collateral.amount} {data.collateral.asset}</span>
                                </div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Decorative Chart Area */}
                    <div className="relative h-32 w-full mt-auto opacity-50">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                            <defs>
                                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#C3F53C" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#C3F53C" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d="M0,50 L0,30 Q25,10 50,25 T100,15 L100,50 Z" fill="url(#chartGlow)" />
                            <path d="M0,30 Q25,10 50,25 T100,15" fill="none" stroke="#C3F53C" strokeWidth="0.5" />
                        </svg>
                    </div>
                </BentoCard>

                {/* 2. Yield Reactor (1x2 Vertical) */}
                <BentoCard className="md:col-span-1 md:row-span-2 p-0 min-h-[200px] md:min-h-0" delay={0.1}>
                    <YieldReactor amount={data.yield.total} asset={data.collateral.asset} usdValue={formattedYieldUsd} />
                </BentoCard>

                {/* 3. Health Gauge (1x1) */}
                <BentoCard className="md:col-span-1 md:row-span-1 p-4 min-h-[140px] md:min-h-0" delay={0.2}>
                    <HoloGauge percentage={data.health} />
                </BentoCard>

                {/* 4. Debt Monitor (1x1) */}
                <BentoCard className="md:col-span-1 md:row-span-1 p-4 md:p-6 min-h-[100px] md:min-h-0" delay={0.3}>
                    <DigitalReadout label="Debt Load" value={`$${data.loan.borrowed.toLocaleString()}`} />
                </BentoCard>

                {/* Activity Terminal (Span 4) */}
                <BentoCard className="col-span-1 md:col-span-4 md:row-span-1 p-4 min-h-[160px] md:min-h-[140px]" delay={0.5}>
                    <ActivityTerminal transactions={data.transactions} />
                </BentoCard>

            </div>
        </div>
    );
};

const CollateralView = ({ data, onAddCollateral, isFallbackPrice }: { data: any, onAddCollateral: () => void, isFallbackPrice?: boolean }) => {
    // Use live collateral value from data (already calculated with oracle price)
    const collateralValue = data.collateral.value;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-display font-medium text-white">Collateral Assets</h2>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Your Locked Assets</p>
                </div>
                <Button
                    onClick={onAddCollateral}
                    className="bg-[#C3F53C] text-black hover:bg-[#b2e035] text-xs font-bold px-4 py-2.5 rounded-xl gap-2 shadow-[0_0_20px_rgba(195,245,60,0.2)]"
                >
                    <Plus className="w-4 h-4" /> Add Collateral
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0A0A0A]/80 backdrop-blur-md p-5 rounded-[1.25rem] border border-[#C3F53C]/20 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#C3F53C]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <h3 className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-2 relative z-10">Total Collateral</h3>
                    <div className="text-3xl font-display font-medium text-[#C3F53C] relative z-10">${collateralValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                    <div className="text-[10px] text-gray-500 mt-1 relative z-10">{data.collateral.amount} {data.collateral.asset}</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#0A0A0A]/80 backdrop-blur-md p-5 rounded-[1.25rem] border border-white/5 relative overflow-hidden"
                >
                    <h3 className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-2">Current LTV</h3>
                    <div className="text-3xl font-display font-medium text-white">
                        {collateralValue > 0 ? Math.round((data.loan.borrowed / collateralValue) * 100) : 0}%
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1">Max: 70%</div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#0A0A0A]/80 backdrop-blur-md p-5 rounded-[1.25rem] border border-white/5 relative overflow-hidden"
                >
                    <h3 className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-2">Pending Yield</h3>
                    <div className="text-3xl font-display font-medium text-white">{data.yield.total.toFixed(6)}</div>
                    <div className="text-[10px] text-gray-500 mt-1">{data.collateral.asset} accrued</div>
                </motion.div>
            </div>

            {/* Assets Table */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#0A0A0A]/80 backdrop-blur-md border border-white/5 rounded-[1.25rem] overflow-hidden"
            >
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02]">
                            <th className="p-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">Asset</th>
                            <th className="p-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">Locked Balance</th>
                            <th className="p-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">Value (USD)</th>
                            <th className="p-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">Yield APY</th>
                            <th className="p-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl ${data.collateral.asset === "mETH" ? "bg-blue-500/20" : "bg-orange-500/20"} flex items-center justify-center ${data.collateral.asset === "mETH" ? "text-blue-400" : "text-orange-400"} font-bold text-sm`}>
                                        {data.collateral.asset === "mETH" ? "Ξ" : "₿"}
                                    </div>
                                    <div>
                                        <span className="font-medium text-white">{data.collateral.asset}</span>
                                        <div className="text-[10px] text-gray-500">
                                            {data.collateral.asset === "mETH" ? "Mantle Staked ETH" : "Wrapped BTC"}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="text-sm font-mono text-white">{data.collateral.amount}</div>
                                <div className="text-[10px] text-gray-500">{data.collateral.asset}</div>
                            </td>
                            <td className="p-4">
                                <div className="text-sm font-mono text-white">${collateralValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                <div className={`text-[10px] ${isFallbackPrice ? "text-yellow-500" : "text-[#C3F53C]"}`}>{isFallbackPrice ? "Estimated" : "Live price"}</div>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-mono text-[#C3F53C]">{data.collateral.asset === "mETH" ? "3.2%" : "2.1%"}</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#C3F53C] animate-pulse" />
                                </div>
                            </td>
                            <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button onClick={onAddCollateral} variant="ghost" className="h-8 px-3 text-xs text-gray-400 hover:text-white hover:bg-white/10">
                                        <Plus className="w-3 h-3 mr-1" /> Add
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Add More Assets CTA */}
                <div className="p-6 border-t border-white/5 flex items-center justify-center gap-4">
                    <div className="text-center">
                        <p className="text-gray-500 text-xs mb-3">Want to add more collateral?</p>
                        <Button
                            onClick={onAddCollateral}
                            variant="ghost"
                            className="text-[#C3F53C] hover:bg-[#C3F53C]/10 text-xs font-bold gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add Collateral
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const AnalyticsView = () => {
    // Use live protocol stats from contract
    const { totalVaults, totalRevenue, autoRepayments, isLoading } = useProtocolStats();
    // Use live TVL data from contract
    const { data: tvlData, isLoading: isTVLLoading } = useTVLData();

    const protocolStats = {
        totalVaults: totalVaults || 0,
        protocolRevenue: totalRevenue || 0,
        autoRepayments: autoRepayments || 0,
    };

    // Format TVL values for display
    const totalTVLFormatted = formatTVL(tvlData.totalTVL);
    const methTVLFormatted = formatTVLShort(tvlData.methTVL);
    const fbtcTVLFormatted = formatTVLShort(tvlData.fbtcTVL);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 px-2">
                <div>
                    <h2 className="text-2xl md:text-3xl font-display font-medium text-white tracking-tight">System Analytics</h2>
                    <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-[0.2em] font-medium">Protocol Telemetry & Metrics</p>
                </div>
                <div className="flex gap-4">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[9px] text-gray-600 uppercase tracking-widest">Data Stream</span>
                        <span className="text-xs font-mono text-[#C3F53C]">Encrypted</span>
                    </div>
                    <div className="w-px h-8 bg-white/10 hidden md:block" />
                    <div className="flex items-center gap-2 text-[10px] text-white font-mono border border-white/10 px-4 py-2 rounded-full bg-white/5">
                        <span className="w-2 h-2 rounded-full bg-[#C3F53C] animate-pulse" />
                        LIVE_DATA
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
                <BentoCard className="p-4 md:p-6" delay={0}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[#C3F53C]/10 flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-[#C3F53C]" />
                        </div>
                        <div>
                            <h3 className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-1">Total Vaults</h3>
                            <div className="text-2xl md:text-3xl font-display font-medium text-white shadow-black drop-shadow-md">{protocolStats.totalVaults}</div>
                        </div>
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest pl-1">Active Positions</div>
                </BentoCard>

                <BentoCard className="p-4 md:p-6" delay={0.1}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-1">Protocol Revenue</h3>
                            <div className="text-2xl md:text-3xl font-display font-medium text-white shadow-black drop-shadow-md">${protocolStats.protocolRevenue.toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest pl-1">15% Yield Fee Yield</div>
                </BentoCard>

                <BentoCard className="p-4 md:p-6" delay={0.2}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                            <RefreshCcw className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-1">Auto-Repayments</h3>
                            <div className="text-2xl md:text-3xl font-display font-medium text-white shadow-black drop-shadow-md">{protocolStats.autoRepayments.toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest pl-1">Automated Actions</div>
                </BentoCard>
            </div>

            {/* Charts Grid - PREMIUM VISUALIZATIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
                {/* TVL CHART - Quantum Stream Visualization */}
                <BentoCard className="p-0 h-[280px] md:h-[340px] flex flex-col relative overflow-hidden group" delay={0.3}>
                    {/* Retro-Futuristic 3D Grid Background */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0A0A0A]" style={{ perspective: '500px' }}>
                        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_bottom,transparent_0%,#3b82f6_100%)]"
                            style={{ transform: 'rotateX(45deg) scale(2)', transformOrigin: 'bottom' }}>
                            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, .3) 25%, rgba(59, 130, 246, .3) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, .3) 75%, rgba(59, 130, 246, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(59, 130, 246, .3) 25%, rgba(59, 130, 246, .3) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, .3) 75%, rgba(59, 130, 246, .3) 76%, transparent 77%, transparent)', backgroundSize: '40px 40px' }} />
                        </div>
                    </div>

                    {/* Digital Rain / Matrix Effect */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(59,130,246,0.5) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

                    <div className="flex items-center justify-between p-6 relative z-10">
                        <h3 className="text-sm font-medium text-white flex items-center gap-2">
                            <div className="relative">
                                <Activity className="w-4 h-4 text-blue-400" />
                                <div className="absolute inset-0 bg-blue-500 blur-md opacity-50" />
                            </div>
                            <span className="tracking-wide">TVL VARIANCE</span>
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="text-[10px] text-blue-400 font-mono tracking-wider">QUANTUM STREAM</div>
                            <div className="px-1.5 py-0.5 rounded bg-blue-500/20 border border-blue-500/30 text-[9px] text-blue-300 font-bold">
                                +12.4%
                            </div>
                        </div>
                    </div>

                    {/* Quantum Chart Container */}
                    <div className="flex-1 relative z-10 px-4 pb-4">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 400 180" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="neonBeam" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                                    <stop offset="10%" stopColor="#3b82f6" />
                                    <stop offset="50%" stopColor="#60a5fa" />
                                    <stop offset="90%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                </linearGradient>
                                <filter id="glowBlur">
                                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Interactive Scanline Area */}
                            <rect width="100%" height="100%" fill="transparent" className="group-hover:cursor-crosshair" />

                            {/* Main Data Beam */}
                            <g>
                                {/* Outer Glow Path */}
                                <motion.path
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                    d="M0,140 Q25,130 50,120 T100,100 T150,80 T200,95 T250,70 T300,55 T350,65 T400,40"
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="6"
                                    className="opacity-20 blur-sm"
                                />
                                {/* Middle Bloom Path */}
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.1 }}
                                    d="M0,140 Q25,130 50,120 T100,100 T150,80 T200,95 T250,70 T300,55 T350,65 T400,40"
                                    fill="none"
                                    stroke="url(#neonBeam)"
                                    strokeWidth="3"
                                    filter="url(#glowBlur)"
                                />
                                {/* Core White Path */}
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                                    d="M0,140 Q25,130 50,120 T100,100 T150,80 T200,95 T250,70 T300,55 T350,65 T400,40"
                                    fill="none"
                                    stroke="#ffffff"
                                    strokeWidth="1"
                                    className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                />
                            </g>

                            {/* Floating Data Points - Using live TVL */}
                            {[
                                { cx: 100, cy: 100, val: isTVLLoading ? "..." : `$${methTVLFormatted}` },
                                { cx: 250, cy: 70, val: isTVLLoading ? "..." : `$${fbtcTVLFormatted}` },
                                { cx: 400, cy: 40, val: isTVLLoading ? "..." : totalTVLFormatted }
                            ].map((pt, i) => (
                                <motion.g
                                    key={i}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 1.5 + i * 0.2 }}
                                >
                                    <circle cx={pt.cx} cy={pt.cy} r="3" fill="#0A0A0A" stroke="#3b82f6" strokeWidth="2" />
                                    <circle cx={pt.cx} cy={pt.cy} r="6" fill="transparent" stroke="#3b82f6" strokeWidth="1" className="opacity-30 animate-ping" />
                                    <text x={pt.cx} y={pt.cy - 15} textAnchor="middle" fill="#60a5fa" fontSize="10" className="font-mono">{pt.val}</text>
                                </motion.g>
                            ))}

                            {/* Interactive Scanline (Visual Only for now) */}
                            <motion.line
                                x1="200" y1="0" x2="200" y2="100%"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                                animate={{ opacity: [0.2, 0.5, 0.2] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </svg>

                        {/* Holographic Tooltip Area */}
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur border border-blue-500/20 px-3 py-1.5 rounded-lg flex items-center gap-3">
                            <div className="text-[10px] text-gray-400 font-mono">CURRENT TVL</div>
                            <div className="text-sm font-bold text-white">{isTVLLoading ? "Loading..." : totalTVLFormatted}</div>
                        </div>
                    </div>
                </BentoCard>

                {/* COLLATERAL DISTRIBUTION - Gravity Well Visualization */}
                <BentoCard className="p-0 h-[320px] md:h-[340px] flex flex-col md:flex-row relative overflow-hidden group" delay={0.4}>
                    {/* Deep Space Background */}
                    <div className="absolute inset-0 bg-[#000000]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(59,130,246,0.05),_transparent_40%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_rgba(195,245,60,0.05),_transparent_40%)]" />

                    {/* Starfield Effect */}
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(white 0.5px, transparent 0.5px)', backgroundSize: '24px 24px', opacity: 0.1 }} />

                    {/* Main Title Badge */}
                    <div className="absolute top-6 left-6 z-20">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
                            Collateral Ecology
                        </h3>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#C3F53C] shadow-[0_0_10px_#C3F53C] animate-pulse" />
                            <span className="text-[10px] text-[#C3F53C] font-mono">SYSTEM LIVE</span>
                        </div>
                    </div>

                    {/* Gravity Well Visualization (Left) */}
                    <div className="w-full md:w-2/3 h-2/3 md:h-full relative z-10">
                        {/* Orbital Rings */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[180px] h-[180px] rounded-full border border-white/5" />
                            <div className="absolute w-[280px] h-[280px] rounded-full border border-dashed border-white/5 animate-spin-slow" style={{ animationDuration: '60s' }} />
                        </div>

                        {/* Central Core (TVL) */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                {/* Core Glow */}
                                <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl animate-pulse" />
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-orange-500/10 rounded-full blur-md" />

                                {/* Core Content */}
                                <div className="relative z-10 text-center">
                                    <div className="text-[10px] text-gray-500 tracking-widest font-mono mb-1">TOTAL</div>
                                    <div className="text-xl font-display font-bold text-white tracking-tighter">{isTVLLoading ? "..." : totalTVLFormatted}</div>
                                </div>

                                {/* Energy Beams */}
                                <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none opacity-20">
                                    <circle cx="50%" cy="50%" r="48" fill="none" stroke="url(#coreGradient)" strokeWidth="1" />
                                    <defs>
                                        <radialGradient id="coreGradient">
                                            <stop offset="50%" stopColor="transparent" />
                                            <stop offset="100%" stopColor="white" />
                                        </radialGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>

                        {/* Orbiting Planets (Assets) */}
                        <div className="absolute inset-0">
                            {/* mETH Planet - 60% */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0"
                            >
                                <div className="absolute top-1/2 left-[75%] -translate-y-1/2 -translate-x-1/2 w-16 h-16 pointer-events-auto cursor-pointer group hover:scale-110 transition-transform">
                                    {/* Planet Body */}
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1e40af] to-[#60a5fa] shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.5),0_0_20px_rgba(59,130,246,0.3)] relative z-10 mx-auto">
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
                                    </div>
                                    {/* Label Tag */}
                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded border border-blue-500/30 whitespace-nowrap z-20">
                                        <div className="text-[10px] text-blue-400 font-bold">mETH • 60%</div>
                                    </div>
                                    {/* Tether Line */}
                                    <div className="absolute top-1/2 right-1/2 w-[100px] h-[1px] bg-gradient-to-l from-blue-500/20 to-transparent -z-10 origin-right rotate-[15deg]" />
                                </div>
                            </motion.div>

                            {/* fBTC Planet - 25% */}
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0"
                            >
                                <div className="absolute bottom-[20%] left-[30%] -translate-y-1/2 -translate-x-1/2 w-12 h-12 pointer-events-auto cursor-pointer group hover:scale-110 transition-transform">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#9a3412] to-[#fdba74] shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.5),0_0_20px_rgba(249,115,22,0.3)] relative z-10 mx-auto">
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
                                    </div>
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded border border-orange-500/30 whitespace-nowrap z-20">
                                        <div className="text-[10px] text-orange-400 font-bold">fBTC • 25%</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Other Planet - 15% */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 w-full h-full"
                            >
                                <div className="absolute top-[25%] left-[40%] w-10 h-10 pointer-events-auto cursor-pointer group hover:scale-110 transition-transform">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3f6212] to-[#ecfccb] shadow-[inset_-3px_-3px_8px_rgba(0,0,0,0.5),0_0_15px_rgba(195,245,60,0.3)] relative z-10 mx-auto">
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
                                    </div>
                                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded border border-[#C3F53C]/30 whitespace-nowrap z-20">
                                        <div className="text-[10px] text-[#C3F53C] font-bold">Other • 15%</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Data Panel (Right) */}
                    <div className="w-full md:w-1/3 h-1/3 md:h-full border-t md:border-t-0 md:border-l border-white/5 bg-white/[0.02] backdrop-blur-sm p-3 md:p-5 flex flex-row md:flex-col justify-center gap-2 md:gap-4 relative z-20">
                        {[
                            { symbol: "Ξ", name: "mETH", value: methTVLFormatted, sub: `${tvlData.methPercentage.toFixed(0)}%`, color: "text-blue-400", bg: "bg-blue-500", border: "border-blue-500/20" },
                            { symbol: "₿", name: "fBTC", value: fbtcTVLFormatted, sub: `${tvlData.fbtcPercentage.toFixed(0)}%`, color: "text-orange-400", bg: "bg-orange-500", border: "border-orange-500/20" },
                        ].map((item, i) => (
                            <div key={i} className={`relative p-3 rounded-xl border ${item.border} bg-black/20 group hover:bg-white/5 transition-colors cursor-default`}>
                                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${item.bg} opacity-50 group-hover:opacity-100 transition-opacity`} />
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[10px] font-bold ${item.color}`}>{item.name}</span>
                                    <span className="text-[9px] text-gray-500 font-mono">{item.sub}</span>
                                </div>
                                <div className="flex items-end justify-between">
                                    <span className="text-lg font-display font-medium text-white">${item.value}</span>
                                    <div className={`text-[8px] px-1.5 py-0.5 rounded ${item.bg}/20 ${item.color} font-mono`}>
                                        APY 4.2%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </BentoCard>
            </div>

            {/* Protocol Parameters */}
            <BentoCard className="p-4 md:p-5" delay={0.5}>
                <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C3F53C]" />
                    Protocol Parameters
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <div className="text-center p-3 bg-white/5 rounded-xl">
                        <div className="text-2xl font-display text-[#C3F53C]">70%</div>
                        <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">Max LTV</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-xl">
                        <div className="text-2xl font-display text-white">85%</div>
                        <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">Liquidation</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-xl">
                        <div className="text-2xl font-display text-white">85%</div>
                        <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">Yield → Repay</div>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-xl">
                        <div className="text-2xl font-display text-white">15%</div>
                        <div className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">Protocol Fee</div>
                    </div>
                </div>
            </BentoCard>
        </div>
    );
};

const TransactionsView = ({ transactions }: any) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
        <h2 className="text-xl font-display font-medium text-white">Transaction History</h2>
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                        <th className="p-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">Type</th>
                        <th className="p-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">Amount</th>
                        <th className="p-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">Date</th>
                        <th className="p-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">Status</th>
                        <th className="p-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold text-right">Hash</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((tx: any) => (
                        <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="p-4"><span className={cn("text-xs font-bold px-2 py-1 rounded bg-white/5 border border-white/10", tx.type === "Harvest" ? "text-[#C3F53C] border-[#C3F53C]/20" : "text-white")}>{tx.type}</span></td>
                            <td className="p-4 text-sm font-mono text-gray-300">{tx.amount}</td>
                            <td className="p-4 text-sm text-gray-500">{tx.date}</td>
                            <td className="p-4 text-xs font-bold text-[#C3F53C] uppercase tracking-wide">{tx.status}</td>
                            <td className="p-4 text-right text-xs font-mono text-blue-400 hover:text-blue-300 cursor-pointer">{tx.hash}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const SettingsView = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 max-w-2xl">
        <h2 className="text-xl font-display font-medium text-white">Vault Settings</h2>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm font-medium text-white">Auto-Repay</div>
                    <div className="text-xs text-gray-500 mt-1">Automatically use yield to repay debt when health is low.</div>
                </div>
                <div className="w-10 h-6 bg-[#C3F53C] rounded-full relative cursor-pointer shadow-[0_0_10px_rgba(195,245,60,0.3)]">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full" />
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-6">
                <div>
                    <div className="text-sm font-medium text-white">Notifications</div>
                    <div className="text-xs text-gray-500 mt-1">Get email alerts for liquidation risks.</div>
                </div>
                <div className="w-10 h-6 bg-white/10 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white/50 rounded-full" />
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-6">
                <div>
                    <div className="text-sm font-medium text-white">Slippage Tolerance</div>
                    <div className="text-xs text-gray-500 mt-1">Max slippage for harvest swaps.</div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-white bg-white/5 border border-white/10 rounded px-2 py-1">0.5%</span>
                </div>
            </div>
        </div>

        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6">
            <h3 className="text-red-500 font-bold text-sm mb-2 uppercase tracking-widest flex items-center gap-2"><Lock className="w-4 h-4" /> Danger Zone</h3>
            <p className="text-gray-400 text-xs mb-4">Emergency withdrawal will bypass all strategies and return funds to your wallet.</p>
            <Button className="bg-red-500 hover:bg-red-600 text-white border-none w-full">Emergency Withdraw</Button>
        </div>
    </div>
);


// --- MAIN PAGE COMPONENT ---
export default function VaultPage() {
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();

    // Contract data hooks
    const { data: vaultInfo, isLoading: isLoadingVault, refetch: refetchVault } = useVaultInfo(address as `0x${string}`);
    const { price: methPrice, isLoading: isLoadingMethPrice, isFallback: isMethPriceFallback } = useMethPrice();
    const { price: fbtcPrice, isLoading: isLoadingFbtcPrice, isFallback: isFbtcPriceFallback } = useFbtcPrice();
    const { assetAddress: collateralAsset, isMeth, isFbtc, symbol: collateralSymbol, isLoading: isLoadingCollateralAsset } = useCollateralAsset(address as `0x${string}`);

    // Token balances
    const { balance: methBalanceRaw, formatted: methBalance, refetch: refetchMethBalance } = useMethBalance(address as `0x${string}`);
    const { balance: fbtcBalanceRaw, formatted: fbtcBalance, refetch: refetchFbtcBalance } = useFbtcBalance(address as `0x${string}`);

    // Token allowances
    const { allowance: methAllowance, refetch: refetchMethAllowance } = useTokenAllowance(
        CONTRACTS.METH as `0x${string}`,
        address as `0x${string}`,
        CONTRACTS.VAULT_MANAGER as `0x${string}`
    );
    const { allowance: fbtcAllowance, refetch: refetchFbtcAllowance } = useTokenAllowance(
        CONTRACTS.FBTC as `0x${string}`,
        address as `0x${string}`,
        CONTRACTS.VAULT_MANAGER as `0x${string}`
    );

    // Contract write hooks
    const { approve, isPending: isApproving, isSuccess: isApproveSuccess, isConfirming: isApproveConfirming } = useApproveToken();
    const { addCollateral, isPending: isAddingCollateral, isSuccess: isAddCollateralSuccess, isConfirming: isAddCollateralConfirming } = useAddCollateral();

    // Contract events
    useContractEvents({
        userAddress: address as `0x${string}`,
        onAutoYieldApplied: (yieldAmount, debtReduced) => {
            // Show notification and refresh data
            console.log(`🎉 Yield Applied: ${formatEther(yieldAmount)} - Debt reduced by ${formatEther(debtReduced)}`);
            refetchVault();
        },
        onVaultClosed: (collateralReturned) => {
            console.log(`🏆 Vault Closed! Collateral returned: ${formatEther(collateralReturned)}`);
            router.push('/create-vault');
        },
    });

    // States
    const [activeView, setActiveView] = useState("overview"); // overview, collateral, analytics
    const [showBackPopup, setShowBackPopup] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [hasCheckedVault, setHasCheckedVault] = useState(false);
    const [txStep, setTxStep] = useState<"idle" | "approving" | "adding">("idle");
    const [notifications, setNotifications] = useState<{ id: number; title: string; desc: string; time: string }[]>([]);

    // Fetch historical events
    const { events: historicalEvents, isLoading: isHistoryLoading } = useHistoricalEvents({
        userAddress: address as `0x${string}`,
        maxEvents: 10
    });

    // Determine vault's collateral type (for display purposes)
    const vaultCollateralType = collateralSymbol === "fBTC" ? "fBTC" : "mETH";

    // Get current price based on vault's collateral type
    const currentPrice = vaultCollateralType === "mETH" ? methPrice : fbtcPrice;
    const currentBalance = vaultCollateralType === "mETH" ? methBalance : fbtcBalance;
    const currentBalanceRaw = vaultCollateralType === "mETH" ? methBalanceRaw : fbtcBalanceRaw;
    const currentAllowance = vaultCollateralType === "mETH" ? methAllowance : fbtcAllowance;

    // Timeout fallback - if contract check takes too long, assume no vault
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!hasCheckedVault) {
                setHasCheckedVault(true);
                // If still loading after timeout, redirect to create-vault
                router.push('/create-vault');
            }
        }, 5000); // 5 second timeout

        return () => clearTimeout(timeout);
    }, [hasCheckedVault, router]);

    // Redirect to create-vault if no active vault
    useEffect(() => {
        if (!isLoadingVault && isConnected) {
            setHasCheckedVault(true);
            if (!vaultInfo?.isActive) {
                router.push('/create-vault');
            }
        }
    }, [isLoadingVault, isConnected, vaultInfo, router]);

    // Redirect to home if not connected
    useEffect(() => {
        if (!isConnected) {
            router.push('/');
        }
    }, [isConnected, router]);

    // Refresh data after successful transactions
    useEffect(() => {
        if (isApproveSuccess) {
            refetchMethAllowance();
            refetchFbtcAllowance();
        }
    }, [isApproveSuccess, refetchMethAllowance, refetchFbtcAllowance]);

    useEffect(() => {
        if (isAddCollateralSuccess) {
            refetchVault();
            refetchMethBalance();
            refetchFbtcBalance();
            setShowDepositModal(false);
            setAmount("");
            setTxStep("idle");
            // Add notification
            setNotifications(prev => [{
                id: Date.now(),
                title: "Collateral Added",
                desc: `${amount} ${vaultCollateralType} deposited`,
                time: "Just now"
            }, ...prev].slice(0, 5));
        }
    }, [isAddCollateralSuccess, amount, vaultCollateralType, refetchVault, refetchMethBalance, refetchFbtcBalance]);

    // Determine the collateral asset symbol (from contract or default)
    const vaultCollateralSymbol = collateralSymbol || "mETH";
    const vaultCollateralPrice = vaultCollateralSymbol === "mETH" ? methPrice : fbtcPrice;

    // Calculate live vault data from contract
    const collateralAmount = vaultInfo ? parseFloat(vaultInfo.collateral) : 0;
    const collateralValue = collateralAmount * vaultCollateralPrice;
    const debtAmount = vaultInfo ? parseFloat(vaultInfo.debt) : 0;
    const pendingYieldAmount = vaultInfo ? parseFloat(vaultInfo.pendingYield) : 0;
    const pendingYieldValue = pendingYieldAmount * vaultCollateralPrice;
    const healthFactor = vaultInfo ? vaultInfo.healthFactor : 0;

    // Build live vault data object
    const liveVaultData = {
        health: Math.round(healthFactor),
        collateral: {
            asset: vaultCollateralSymbol,
            amount: collateralAmount.toFixed(4),
            value: collateralValue,
        },
        loan: {
            borrowed: debtAmount,
            currency: "USDC",
        },
        yield: {
            total: pendingYieldAmount,
            monthly: pendingYieldAmount * 0.1, // Estimated monthly
        },
        transactions: historicalEvents.map((event) => {
            const display = formatEventForDisplay(event);
            return {
                id: event.id,
                type: display.title,
                amount: display.amount,
                date: formatRelativeTime(event.timestamp),
                status: "Success",
                hash: event.transactionHash,
            };
        }),
        notifications,
    };

    // Actions
    const handleBack = () => setShowBackPopup(true);
    const handleHome = () => router.push("/");
    const handleDisconnect = () => {
        disconnect();
        router.push("/");
    };

    // Handle adding collateral with proper approval flow
    const handleConfirmAction = async () => {
        if (!amount || parseFloat(amount) <= 0) return;

        const amountInWei = parseEther(amount);
        // Use the vault's collateral type (can't change it)
        const tokenAddress = (vaultCollateralType === "mETH" ? CONTRACTS.METH : CONTRACTS.FBTC) as `0x${string}`;
        const minHealthFactor = BigInt(2000000000000000000); // 200% (2.0 in 18 decimals)

        try {
            // Check if we need approval
            if (currentAllowance < amountInWei) {
                setTxStep("approving");
                await approve(
                    tokenAddress,
                    CONTRACTS.VAULT_MANAGER as `0x${string}`,
                    amountInWei
                );
                // Wait for approval to complete, then add collateral
                // The useEffect watching isApproveSuccess will trigger allowance refresh
            } else {
                // Already approved, add collateral directly
                setTxStep("adding");
                await addCollateral(amountInWei);
            }
        } catch (error) {
            console.error("Transaction failed:", error);
            setTxStep("idle");
        }
    };

    // Effect to chain approval -> addCollateral
    useEffect(() => {
        if (isApproveSuccess && txStep === "approving" && amount) {
            // After approval succeeds, add collateral
            const amountInWei = parseEther(amount);
            const tokenAddress = (vaultCollateralType === "mETH" ? CONTRACTS.METH : CONTRACTS.FBTC) as `0x${string}`;
            const minHealthFactor = BigInt(2000000000000000000); // 200% (2.0 in 18 decimals)
            setTxStep("adding");
            addCollateral(amountInWei).catch((err) => {
                console.error("Add collateral failed:", err);
                setTxStep("idle");
            });
        }
    }, [isApproveSuccess, txStep, amount, vaultCollateralType, addCollateral]);

    // Determine button state
    const isTransacting = txStep !== "idle" || isApproving || isApproveConfirming || isAddingCollateral || isAddCollateralConfirming;
    const needsApproval = amount ? currentAllowance < parseEther(amount) : false;

    const getButtonText = () => {
        if (!amount || parseFloat(amount) <= 0) return "Enter Amount";
        if (isApproving || isApproveConfirming) return `Approving ${vaultCollateralType}...`;
        if (isAddingCollateral || isAddCollateralConfirming) return "Adding Collateral...";
        if (needsApproval) return `Approve & Add ${amount} ${vaultCollateralType}`;
        return `Add ${amount} ${vaultCollateralType}`;
    };

    const navItems = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "collateral", label: "Collateral", icon: Wallet },
        { id: "analytics", label: "Analytics", icon: TrendingUp },
    ];

    // Helper to render active view
    const renderContent = () => {
        switch (activeView) {
            case "overview": return <OverviewView data={liveVaultData} setShowDepositModal={setShowDepositModal} />;
            case "collateral": return <CollateralView data={liveVaultData} onAddCollateral={() => setShowDepositModal(true)} isFallbackPrice={vaultCollateralSymbol === "mETH" ? isMethPriceFallback : isFbtcPriceFallback} />;
            case "analytics": return <AnalyticsView />;
            default: return <OverviewView data={liveVaultData} setShowDepositModal={setShowDepositModal} />;
        }
    };

    // Loading state - show while checking vault status
    if (isLoadingVault || !hasCheckedVault) {
        return (
            <div className="h-screen w-full bg-[#050505] text-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-2 border-[#C3F53C]/20 border-t-[#C3F53C] rounded-full animate-spin mx-auto" />
                    <p className="text-gray-400 text-sm">Checking vault status...</p>
                </div>
            </div>
        );
    }

    // If no active vault, useEffect will handle redirect - show loading state while that happens
    if (!vaultInfo?.isActive) {
        return (
            <div className="h-screen w-full bg-[#050505] text-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-2 border-[#C3F53C]/20 border-t-[#C3F53C] rounded-full animate-spin mx-auto" />
                    <p className="text-gray-400 text-sm">Redirecting to create vault...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[100dvh] w-full bg-[#050505] text-white font-sans selection:bg-[#C3F53C]/30 flex flex-col lg:flex-row overflow-x-hidden relative">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

            <Modal isOpen={showBackPopup} onClose={() => setShowBackPopup(false)} title="Exit Dashboard?">
                <div className="space-y-3 relative z-10">
                    <Button onClick={handleHome} className="w-full bg-white/5 hover:bg-white/10 text-white justify-start pl-4 h-12 rounded-xl text-xs font-bold tracking-widest border border-white/10 uppercase">
                        <Home className="w-4 h-4 mr-3 text-gray-400" /> Go to Landing Page
                    </Button>
                    <Button onClick={handleDisconnect} className="w-full bg-red-500/5 hover:bg-red-500/10 text-red-500 justify-start pl-4 h-12 rounded-xl text-xs font-bold tracking-widest border border-red-500/10 uppercase transition-colors">
                        <Unplug className="w-4 h-4 mr-3" /> Disconnect Wallet
                    </Button>
                </div>
            </Modal>

            {/* ADD COLLATERAL MODAL - Enhanced with real data */}
            <Modal isOpen={showDepositModal} onClose={() => !isTransacting && setShowDepositModal(false)} title="Add Collateral">
                <div className="space-y-4 relative z-10">
                    {/* Asset Display - Locked to vault's collateral type */}
                    <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/5">
                        <label className="text-[10px] text-gray-500 mb-3 block uppercase tracking-widest font-bold">Vault Collateral Asset</label>
                        <div className="flex gap-3">
                            <div
                                className={`flex-1 p-3 rounded-xl flex items-center gap-3 ${vaultCollateralType === "mETH" ? "bg-blue-500/10 border border-blue-500/30" : "bg-orange-500/10 border border-orange-500/30"}`}
                            >
                                <div className={`w-8 h-8 rounded-lg ${vaultCollateralType === "mETH" ? "bg-blue-500/20" : "bg-orange-500/20"} flex items-center justify-center ${vaultCollateralType === "mETH" ? "text-blue-400" : "text-orange-400"} font-bold text-sm`}>
                                    {vaultCollateralType === "mETH" ? "Ξ" : "₿"}
                                </div>
                                <div className="text-left">
                                    <div className="text-sm font-medium text-white">{vaultCollateralType}</div>
                                    <div className="text-[10px] text-gray-500">{vaultCollateralType === "mETH" ? "Mantle Staked ETH" : "Wrapped BTC"}</div>
                                </div>
                                <div className="ml-auto">
                                    <span className="text-[9px] text-gray-500 bg-white/5 px-2 py-1 rounded-full">Locked</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-[10px] text-yellow-500/80 mt-2 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> You can only add more {vaultCollateralType} to this vault.
                        </p>
                    </div>

                    {/* Amount Input */}
                    <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/5">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Amount</label>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-500">Balance:</span>
                                <span className="text-[10px] text-white font-mono">
                                    {parseFloat(currentBalance).toFixed(4)} {vaultCollateralType}
                                </span>
                                <button
                                    onClick={() => setAmount(currentBalance)}
                                    disabled={isTransacting}
                                    className="text-[9px] text-[#C3F53C] font-bold px-2 py-0.5 rounded bg-[#C3F53C]/10 hover:bg-[#C3F53C]/20 transition-colors disabled:opacity-50"
                                >
                                    MAX
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                placeholder="0.00"
                                autoFocus
                                disabled={isTransacting}
                                className="flex-1 bg-transparent text-3xl font-display text-white placeholder:text-gray-800 focus:outline-none disabled:opacity-50"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <span className={`text-lg font-medium ${vaultCollateralType === "mETH" ? "text-blue-400" : "text-orange-400"}`}>{vaultCollateralType}</span>
                        </div>
                        {amount && (
                            <div className="mt-2 text-xs text-gray-500">
                                ≈ ${(parseFloat(amount || "0") * currentPrice).toLocaleString(undefined, { maximumFractionDigits: 0 })} USD
                            </div>
                        )}
                    </div>

                    {/* Impact Preview */}
                    <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/5">
                        <label className="text-[10px] text-gray-500 mb-3 block uppercase tracking-widest font-bold">Position Impact</label>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">New Collateral Value</span>
                                <span className="text-white font-mono">
                                    ${(collateralValue + (parseFloat(amount || "0") * currentPrice)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">New Health Factor</span>
                                <span className="text-[#C3F53C] font-mono">
                                    +{amount ? Math.round(parseFloat(amount) * currentPrice / (debtAmount || 1) * 10) : 0}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Status */}
                    {isTransacting && (
                        <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-[#C3F53C]/20">
                            <div className="flex items-center gap-3">
                                <Loader2 className="w-5 h-5 text-[#C3F53C] animate-spin" />
                                <div>
                                    <div className="text-sm font-medium text-white">
                                        {txStep === "approving" ? "Approving Token..." : "Adding Collateral..."}
                                    </div>
                                    <div className="text-[10px] text-gray-500">
                                        {txStep === "approving"
                                            ? "Please confirm the approval transaction in your wallet"
                                            : "Please confirm the deposit transaction in your wallet"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <Button
                        onClick={handleConfirmAction}
                        disabled={!amount || parseFloat(amount) <= 0 || isTransacting || parseFloat(amount) > parseFloat(currentBalance)}
                        className="w-full bg-[#C3F53C] hover:bg-[#b2e035] text-black font-bold h-14 rounded-xl tracking-wide uppercase text-xs disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(195,245,60,0.3)] flex items-center justify-center gap-2"
                    >
                        {isTransacting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {getButtonText()}
                    </Button>

                    {/* Insufficient balance warning */}
                    {amount && parseFloat(amount) > parseFloat(currentBalance) && (
                        <div className="text-center text-xs text-red-400">
                            Insufficient {vaultCollateralType} balance
                        </div>
                    )}
                </div>
            </Modal>
            <Modal isOpen={showWithdrawModal} onClose={() => setShowWithdrawModal(false)} title="Withdraw Funds">
                <div className="mb-4 bg-[#0A0A0A] p-4 rounded-2xl border border-white/5 relative z-10">
                    <label className="text-[10px] text-gray-500 mb-2 block uppercase tracking-widest font-bold">Amount (mETH)</label>
                    <input type="number" placeholder="0.00" autoFocus className="w-full bg-transparent text-3xl font-display text-white placeholder:text-gray-800 focus:outline-none" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <Button onClick={handleConfirmAction} className="w-full bg-white hover:bg-gray-200 text-black font-bold h-12 rounded-xl tracking-wide uppercase text-xs">Confirm Withdraw</Button>
            </Modal>

            {/* --- SIDEBAR --- */}
            <aside className="hidden lg:flex flex-col w-64 bg-[#080808]/50 backdrop-blur-xl border-r border-white/5 p-6 h-full flex-shrink-0 relative z-20">
                <div className="flex items-center gap-4 mb-8 cursor-pointer group" onClick={handleBack}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1a1a1a] to-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-lg group-hover:border-[#C3F53C]/50 transition-colors">
                        <span className="font-display font-bold text-[#C3F53C]">AD</span>
                    </div>
                    <div>
                        <div className="text-sm font-display font-medium text-white tracking-wide">Admin</div>
                        <div className="text-[10px] text-gray-600 uppercase tracking-[0.15em] font-bold group-hover:text-[#C3F53C] transition-colors">Vault Owner</div>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar min-h-0">
                    <div className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.2em] mb-4 px-3 mt-2">Vault Console</div>
                    {navItems.map(item => (
                        <SidebarItem key={item.id} icon={item.icon} label={item.label} active={activeView === item.id} onClick={() => setActiveView(item.id)} />
                    ))}
                </nav>

                <div className="pt-6 mt-auto border-t border-white/5">
                    <button onClick={handleDisconnect} className="flex items-center gap-3 text-gray-500 hover:text-white transition-colors w-full px-3 py-2">
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium tracking-wide">Disconnect</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="fixed inset-y-0 left-0 w-64 bg-[#080808] border-r border-white/10 z-50 p-6 flex flex-col lg:hidden">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#C3F53C] font-bold text-xs">AD</div><span className="text-sm font-bold text-white">Admin</span></div>
                            <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
                        </div>
                        <nav className="flex-1 space-y-2 overflow-y-auto min-h-0">
                            {navItems.map(item => (
                                <SidebarItem key={item.id} icon={item.icon} label={item.label} active={activeView === item.id} onClick={() => { setActiveView(item.id); setIsMobileMenuOpen(false); }} />
                            ))}
                        </nav>
                        <div className="mt-auto pt-6 border-t border-white/5"><Button onClick={handleDisconnect} variant="ghost" className="w-full justify-start text-gray-500 hover:text-white pl-0"><LogOut className="w-4 h-4 mr-2" /> Disconnect</Button></div>
                    </motion.div>
                )}
            </AnimatePresence>
            {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 min-h-0 lg:h-full overflow-y-auto relative z-10 flex flex-col">
                <div className="flex-1 w-full p-4 lg:p-8 pb-32 md:pb-32">
                    <div className="max-w-[1600px] mx-auto space-y-6 pb-24">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                            <div className="flex items-center justify-between md:block w-full md:w-auto">
                                <div>
                                    <h1 className="text-3xl font-display font-medium text-white tracking-tight">
                                        {navItems.find(n => n.id === activeView)?.label || "Vault"}
                                    </h1>
                                    <div className="flex items-center gap-2 text-xs text-gray-600 mt-2 font-mono uppercase tracking-widest"><span className="w-2 h-2 rounded-full bg-[#C3F53C] animate-pulse" />System Active<span className="mx-2 text-gray-800">|</span>Today</div>
                                </div>
                                <button className="lg:hidden p-2 text-gray-400" onClick={() => setIsMobileMenuOpen(true)}><Menu className="w-6 h-6" /></button>
                            </div>
                            <div className="hidden md:flex items-center gap-4">
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-hover:text-[#C3F53C] transition-colors" />
                                    <input type="text" placeholder="SEARCH ASSETS..." className="pl-10 pr-4 py-2.5 bg-[#0F0F0F] border border-white/5 rounded-full text-xs font-bold tracking-widest focus:outline-none focus:border-[#C3F53C]/50 w-64 transition-all placeholder:text-gray-700 text-white" />
                                </div>
                                <Button className="w-10 h-10 rounded-full p-0 bg-[#0F0F0F] border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all"><Bell className="w-4 h-4 text-gray-400" /></Button>
                            </div>
                        </div>

                        {/* VIEW CONTENT */}
                        {renderContent()}

                    </div>
                </div>
            </main>
        </div>
    );
}

// --- MODAL COMPONENT ---
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    const modalContent = (
        <div
            className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-[9999] flex items-center justify-center"
            style={{ margin: 0, padding: 0 }}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative w-[90%] max-w-md p-6 rounded-3xl bg-[#0F0F0F] border border-white/10 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Noise texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-3xl bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Title */}
                <h2 className="text-lg font-display font-medium text-white mb-6 tracking-wide">{title}</h2>

                {/* Content */}
                <div className="relative z-10">
                    {children}
                </div>
            </motion.div>
        </div>
    );

    return createPortal(modalContent, document.body);
}

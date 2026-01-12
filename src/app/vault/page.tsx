"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useDisconnect } from "wagmi";
import { useVaultInfo, useMethPrice } from "@/hooks/useVaultData";
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
    School
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const VAULT_DATA = {
    id: "Vault #1234",
    netValue: 10500, // Collateral - Debt
    health: 143,
    collateral: { asset: "mETH", amount: "10.000", value: 35000 },
    loan: { borrowed: 24500, currency: "USDC" },
    yield: { total: 1250, monthly: 120 },
    transactions: [
        { id: 1, type: "Harvest", amount: "+0.05 mETH", date: "Just now", status: "Success", hash: "0x12...34" },
        { id: 2, type: "Repay", amount: "-250 USDC", date: "2h ago", status: "Auto", hash: "0x56...78" },
        { id: 3, type: "Deposit", amount: "+2.00 mETH", date: "1d ago", status: "Success", hash: "0x90...12" },
        { id: 4, type: "Harvest", amount: "+0.03 mETH", date: "2d ago", status: "Success", hash: "0x34...56" },
        { id: 5, type: "Borrow", amount: "+500 USDC", date: "3d ago", status: "Success", hash: "0x78...90" },
        { id: 6, type: "Deposit", amount: "+10.00 mETH", date: "5d ago", status: "Success", hash: "0xAB...CD" },
    ],
    notifications: [
        { id: 1, title: "Yield Harvested", desc: "0.05 mETH added", time: "Just now" },
        { id: 2, title: "Health Update", desc: "Health > 143%", time: "1h ago" },
    ],
    protocolRevenue: 12450
};

// --- SUB-COMPONENTS ---

// 1. Sidebar Item
const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-center gap-3 w-full p-2.5 rounded-xl transition-all duration-300 text-sm font-medium tracking-wide group",
            active
                ? "bg-white/5 text-white border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                : "text-gray-500 hover:text-white hover:bg-white/5"
        )}
    >
        <Icon className={cn("w-4 h-4 transition-colors", active ? "text-[#C3F53C]" : "text-gray-500 group-hover:text-white")} />
        <span className="font-sans">{label}</span>
    </button>
);

// 2. Stat Card
const StatCard = ({ label, value, sub, trend, delay = 0 }: { label: string, value: string, sub: string, trend?: { val: string, up: boolean }, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        className="bg-[#0A0A0A]/80 backdrop-blur-md p-4 lg:p-5 rounded-[1.25rem] border border-white/5 hover:border-[#C3F53C]/30 transition-all duration-500 group relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C3F53C]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#C3F53C]/10 transition-all duration-500" />
        <div className="flex justify-between items-start mb-2 relative z-10">
            <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">{label}</h3>
            {trend && (
                <div className={cn("flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full font-bold tracking-wide border", trend.up ? "bg-[#C3F53C]/5 text-[#C3F53C] border-[#C3F53C]/20" : "bg-red-500/5 text-red-400 border-red-500/20")}>
                    {trend.up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                    {trend.val}
                </div>
            )}
        </div>
        <div className="text-2xl lg:text-3xl font-display font-medium text-white mb-0.5 group-hover:text-[#C3F53C] transition-colors tracking-tight">{value}</div>
        <div className="text-[10px] lg:text-[11px] text-gray-500 font-sans tracking-wide">{sub}</div>
    </motion.div>
);

// 3. LTV Chart
const LTVChart = ({ health }: { health: number }) => {
    return (
        <div className="relative w-28 h-28 lg:w-32 lg:h-32 flex items-center justify-center group pointer-events-none select-none">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" stroke="#1A1A1A" strokeWidth="8" fill="none" />
                <circle
                    cx="50" cy="50" r="40"
                    stroke="#C3F53C" strokeWidth="8" fill="none"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 * (1 - (100 / (health || 1)))}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_15px_rgba(195,245,60,0.3)] transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute text-center">
                <div className="text-xl lg:text-2xl font-display font-bold text-white tracking-tighter">{health}%</div>
                <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">Health</div>
            </div>
            <div className="absolute inset-0 bg-[#C3F53C]/5 blur-2xl rounded-full" />
        </div>
    );
};

// 4. Premium Yield Card (The Upgrade - REALISTIC LIVE VERSION)
const PremiumYieldCard = ({ yieldVal }: { yieldVal: number }) => {
    // Live Ticker State
    const [displayYield, setDisplayYield] = useState(yieldVal);
    const [hashRate, setHashRate] = useState(4200);

    // Simulate Live Yield Generation
    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayYield(prev => prev + (Math.random() * 0.00005));
            setHashRate(prev => 4200 + Math.floor(Math.random() * 150 - 75));
        }, 100);
        return () => clearInterval(interval);
    }, []);

    // Formatter
    const formattedYield = displayYield.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 6 });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-[#050505] p-6 rounded-[1.75rem] border border-white/10 h-[180px] relative overflow-hidden group shadow-2xl flex flex-col justify-between"
        >
            {/* Holographic Gradient Mesh */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(195,245,60,0.1),transparent_60%)] opacity-80" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-[length:20px_20px] opacity-[0.03]" />

            {/* Top Section: Header */}
            <div className="relative z-10 w-full">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#C3F53C]" />
                            <div className="absolute inset-0 rounded-full bg-[#C3F53C] animate-ping opacity-75" />
                        </div>
                        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Live Yield Stream</h2>
                    </div>
                    <div className="font-mono text-[9px] text-[#C3F53C]/70 bg-[#C3F53C]/5 px-2 py-0.5 rounded border border-[#C3F53C]/10 whitespace-nowrap">
                        {hashRate} H/s
                    </div>
                </div>

                <div className="text-3xl lg:text-4xl font-display font-medium text-white tracking-tight drop-shadow-[0_0_15px_rgba(195,245,60,0.15)] glow-text tabular-nums truncate">
                    ${formattedYield}
                </div>
            </div>

            {/* Bottom Section: Graph */}
            <div className="relative z-10 h-10 w-full mt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 360 50" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#C3F53C" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#C3F53C" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Graph Line */}
                    <path
                        d="M0,40 Q20,38 40,20 T80,30 T120,10 T160,25 T200,5 T240,30 T280,15 T320,35 T360,10"
                        fill="none"
                        stroke="#C3F53C"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                        className="drop-shadow-[0_0_8px_#C3F53C]"
                    >
                        <animateTransform
                            attributeName="transform"
                            type="translate"
                            from="0 0"
                            to="-40 0"
                            dur="2s"
                            repeatCount="indefinite"
                        />
                    </path>

                    {/* Area Fill */}
                    <path
                        d="M0,40 Q20,38 40,20 T80,30 T120,10 T160,25 T200,5 T240,30 T280,15 T320,35 T360,10 V50 H0 Z"
                        fill="url(#yieldGradient)"
                        className="opacity-30"
                    >
                        <animateTransform
                            attributeName="transform"
                            type="translate"
                            from="0 0"
                            to="-40 0"
                            dur="2s"
                            repeatCount="indefinite"
                        />
                    </path>
                </svg>

                {/* Scan Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C3F53C]/10 to-transparent w-[20%] h-full animate-[scan_3s_linear_infinite] pointer-events-none" />
            </div>
        </motion.div>
    );
};

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
    // We reuse the live yield logic for the Yield Router card specifically
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Flow Indicator */}
            <div className="flex items-center justify-between mb-8 px-2">
                <div>
                    <h2 className="text-xl font-display font-medium text-white">System Architecture</h2>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Operating at Peak Efficiency</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-2 text-[10px] text-[#C3F53C] font-mono border border-[#C3F53C]/20 px-3 py-1.5 rounded-full bg-[#C3F53C]/5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C3F53C] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C3F53C]"></span>
                        </span>
                        SYSTEM ONLINE
                    </div>
                </div>
            </div>

            {/* The 6-Layer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 1. COLLATERAL VAULT */}
                <LayerCard
                    icon={Lock}
                    title="Collateral Vault"
                    subtitle="01"
                    desc="Secure custody for mETH & fBTC assets."
                    value="$35,000.00"
                    subValue="10.00 mETH Locked"
                    connection="Provides Collateral Balance to Loan Manager"
                    delay={0}
                >
                    <div>
                        <div className="text-3xl font-display font-medium text-white tracking-tight">$35,000</div>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-bold">mETH</span>
                            <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20 font-bold">fBTC</span>
                        </div>
                    </div>
                </LayerCard>

                {/* 2. YIELD ROUTER (The Engine) */}
                <LayerCard
                    icon={RefreshCw}
                    title="Yield Router"
                    subtitle="02"
                    desc="Harvests native staking rewards from Mantle."
                    connection="Claims & Routes Staking Rewards"
                    delay={0.1}
                >
                    {/* Mini Live Yield Visual */}
                    <div className="relative h-12 w-full overflow-hidden bg-[#0A0A0A] rounded-lg border border-white/5 flex items-center px-4">
                        <div className="absolute inset-0 bg-[#C3F53C]/5 animate-pulse" />
                        <TrendingUp className="w-5 h-5 text-[#C3F53C] mr-3" />
                        <div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Live APY</div>
                            <div className="text-lg font-mono text-white">4.2% <span className="text-[#C3F53C] text-xs">+0.001</span></div>
                        </div>
                    </div>
                </LayerCard>

                {/* 3. LOAN MANAGER */}
                <LayerCard
                    icon={Wallet}
                    title="Loan Manager"
                    subtitle="03"
                    desc="Manages debt issuance and LTV calculations."
                    connection="Calculates Debt & LTV"
                    delay={0.2}
                >
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-2xl font-display font-medium text-white">$24,500</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Total Debt</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-display text-[#C3F53C]">70%</div>
                            <div className="text-[9px] text-gray-500 uppercase">Current LTV</div>
                        </div>
                    </div>
                </LayerCard>

                {/* 4. AUTO-REPAY ENGINE */}
                <LayerCard
                    icon={RefreshCcw}
                    title="Auto-Repay Engine"
                    subtitle="04"
                    desc="Swaps yield for stablecoins to burn debt."
                    connection="Swaps Yield -> Stablecoins -> Burns Debt"
                    delay={0.3}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex-1 bg-white/5 rounded-lg p-2 text-center border border-white/5">
                            <div className="text-[10px] text-gray-500 mb-1">Harvest</div>
                            <div className="text-sm text-white font-mono">0.05 ETH</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#C3F53C]" />
                        <div className="flex-1 bg-[#C3F53C]/10 rounded-lg p-2 text-center border border-[#C3F53C]/20">
                            <div className="text-[10px] text-[#C3F53C] mb-1">Repaid</div>
                            <div className="text-sm text-white font-mono">$185.20</div>
                        </div>
                    </div>
                </LayerCard>

                {/* 5. LIQUIDATION ENGINE */}
                <LayerCard
                    icon={ShieldCheck}
                    title="Liquidation Engine"
                    subtitle="05"
                    desc="Monitors Health Factor to ensure solvency."
                    connection="Monitors Health Factor"
                    delay={0.4}
                >
                    <div className="relative pt-2">
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-[#C3F53C] w-[85%] shadow-[0_0_10px_#C3F53C]" />
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-xs text-white font-bold">1.43 HF</span>
                            <span className="text-[9px] text-[#C3F53C] uppercase tracking-widest">Safe Zone</span>
                        </div>
                    </div>
                </LayerCard>

                {/* 6. PROTOCOL TREASURY */}
                <LayerCard
                    icon={School} // Fallback to School or Building icon for Governance if needed, creating generic Icon wrapper or importing
                    title="Protocol Treasury"
                    subtitle="06"
                    desc="Collects 15% fee for protocol sustainability."
                    connection="Receives Protocol Fee"
                    delay={0.5}
                >
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center bg-[#0A0A0A]">
                            <span className="text-[10px] font-bold text-gray-400">15%</span>
                        </div>
                        <div>
                            <div className="text-lg font-display text-white">$1,245.00</div>
                            <div className="text-[9px] text-gray-500 uppercase tracking-widest">Fees Collected</div>
                        </div>
                    </div>
                </LayerCard>
            </div>

            {/* Original Premium Yield Card (Optional - kept for flashy visual at bottom if layout permits, or remove if too cluttered. User asked to rework dashboard *vs* architecture. Let's keep the premium card as a "Master View" below) */}
            <div className="mt-8">
                <h2 className="text-sm font-display font-medium text-white mb-4 uppercase tracking-widest">Live System Output</h2>
                <PremiumYieldCard yieldVal={data.yield.total} />
            </div>
        </div>
    );
};

const CollateralView = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-display font-medium text-white">Collateral Assets</h2>
            <Button className="bg-[#C3F53C] text-black hover:bg-[#b2e035] text-xs font-bold px-4 py-2 rounded-lg gap-2"><Plus className="w-4 h-4" /> Add Collateral</Button>
        </div>
        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                        <th className="p-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">Asset</th>
                        <th className="p-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">Balance</th>
                        <th className="p-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">Value (USD)</th>
                        <th className="p-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">LTV Impact</th>
                        <th className="p-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="p-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">Ξ</div><span className="font-medium">mETH</span></div></td>
                        <td className="p-4 text-sm font-mono">10.00</td>
                        <td className="p-4 text-sm font-mono text-gray-400">$35,000.00</td>
                        <td className="p-4 text-sm font-mono text-[#C3F53C]">+15%</td>
                        <td className="p-4 text-right"><Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white"><MoreHorizontal className="w-4 h-4" /></Button></td>
                    </tr>
                </tbody>
            </table>
            <div className="p-8 text-center text-gray-500 text-xs">No other assets found.</div>
        </div>
    </div>
);

const AnalyticsView = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
        <h2 className="text-xl font-display font-medium text-white">Yield Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl h-80 flex items-center justify-center relative overflow-hidden group">
                <div className="text-center z-10">
                    <TrendingUp className="w-12 h-12 text-[#C3F53C] mx-auto mb-4 opacity-50" />
                    <p className="text-gray-500 text-sm">Historical APY Chart Placeholder</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-tr from-[#C3F53C]/5 to-transparent opacity-20" />
            </div>
            <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-2xl h-80 flex items-center justify-center relative overflow-hidden">
                <div className="text-center z-10">
                    <ArrowUpRight className="w-12 h-12 text-blue-400 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-500 text-sm">Revenue Projection Placeholder</p>
                </div>
            </div>
        </div>
    </div>
);

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
    const { data: vaultInfo, isLoading: isLoadingVault } = useVaultInfo(address as `0x${string}`);
    const { price: methPrice } = useMethPrice();

    // States
    const [activeView, setActiveView] = useState("overview"); // overview, collateral, analytics, transactions, settings
    const [showBackPopup, setShowBackPopup] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [hasCheckedVault, setHasCheckedVault] = useState(false);

    // Timeout fallback - if contract check takes too long, assume no vault
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!hasCheckedVault) {
                setHasCheckedVault(true);
                // If still loading after timeout, redirect to create-vault
                router.push('/create-vault');
            }
        }, 3000); // 3 second timeout

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

    // Calculate live vault data
    const liveVaultData = vaultInfo ? {
        ...VAULT_DATA,
        health: vaultInfo.healthFactor,
        collateral: {
            asset: "mETH",
            amount: parseFloat(vaultInfo.collateral).toFixed(4),
            value: parseFloat(vaultInfo.collateral) * methPrice,
        },
        loan: {
            borrowed: parseFloat(vaultInfo.debt),
            currency: "USDC",
        },
        yield: {
            total: parseFloat(vaultInfo.pendingYield) * methPrice,
            monthly: parseFloat(vaultInfo.pendingYield) * methPrice * 0.1,
        },
    } : VAULT_DATA;

    // Actions
    const handleBack = () => setShowBackPopup(true);
    const handleHome = () => router.push("/");
    const handleDisconnect = () => {
        disconnect();
        router.push("/");
    };

    const handleConfirmAction = () => {
        alert("Transaction Sent (Demo)");
        setAmount("");
        setShowDepositModal(false);
        setShowWithdrawModal(false);
    };

    const navItems = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "collateral", label: "Collateral", icon: Wallet },
        { id: "analytics", label: "Analytics", icon: TrendingUp },
        { id: "transactions", label: "Transactions", icon: History },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    // Helper to render active view
    const renderContent = () => {
        switch (activeView) {
            case "overview": return <OverviewView data={liveVaultData} setShowDepositModal={setShowDepositModal} />;
            case "collateral": return <CollateralView />;
            case "analytics": return <AnalyticsView />;
            case "transactions": return <TransactionsView transactions={liveVaultData.transactions} />;
            case "settings": return <SettingsView />;
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

    // Redirect happens in useEffect, but if somehow we get here without active vault, redirect again
    if (!vaultInfo?.isActive) {
        router.push('/create-vault');
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
        <div className="h-[100dvh] w-full bg-[#050505] text-white font-sans selection:bg-[#C3F53C]/30 flex overflow-hidden relative">
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

            {/* Deposit/Withdraw Modals reused... */}
            <Modal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)} title="Deposit Funds">
                <div className="mb-4 bg-[#0A0A0A] p-4 rounded-2xl border border-white/5 relative z-10">
                    <label className="text-[10px] text-gray-500 mb-2 block uppercase tracking-widest font-bold">Amount (mETH)</label>
                    <input type="number" placeholder="0.00" autoFocus className="w-full bg-transparent text-3xl font-display text-white placeholder:text-gray-800 focus:outline-none" value={amount} onChange={(e) => setAmount(e.target.value)} />
                </div>
                <Button onClick={handleConfirmAction} className="w-full bg-[#C3F53C] hover:bg-[#b2e035] text-black font-bold h-12 rounded-xl tracking-wide uppercase text-xs">Confirm Deposit</Button>
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
                        <span className="font-display font-bold text-[#C3F53C]">GH</span>
                    </div>
                    <div>
                        <div className="text-sm font-display font-medium text-white tracking-wide">Guy Hawkins</div>
                        <div className="text-[10px] text-gray-600 uppercase tracking-[0.15em] font-bold group-hover:text-[#C3F53C] transition-colors">Vault Owner</div>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar min-h-0">
                    <div className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.2em] mb-4 px-3 mt-2">Console</div>
                    {navItems.slice(0, 3).map(item => (
                        <SidebarItem key={item.id} icon={item.icon} label={item.label} active={activeView === item.id} onClick={() => setActiveView(item.id)} />
                    ))}
                    <div className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.2em] mt-8 mb-4 px-3">System</div>
                    {navItems.slice(3).map(item => (
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
                            <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[#C3F53C] font-bold text-xs">GH</div><span className="text-sm font-bold text-white">Guy Hawkins</span></div>
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
            <main className="flex-1 h-full overflow-hidden relative z-10 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto w-full p-4 lg:p-8 scroll-smooth pb-32 md:pb-32">
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

// --- MODAL COMPONENT (Re-declared for completeness if needed, or stick with previous) ---
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
    if (!isOpen) return null;
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl" onClick={onClose}>
                    <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-sm p-6 rounded-3xl bg-[#0F0F0F] border border-white/10 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                        <button onClick={onClose} className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                        <h2 className="text-lg font-display font-medium text-white mb-6 tracking-wide">{title}</h2>
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

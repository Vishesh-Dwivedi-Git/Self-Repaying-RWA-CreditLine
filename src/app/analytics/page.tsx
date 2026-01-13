"use client";

import React from "react";
import { motion } from "framer-motion";
import { useProtocolStats } from "@/hooks/useVaultData";
import { Navbar } from "@/components/Navbar";
import {
    TrendingUp,
    Wallet,
    RefreshCcw,
    Activity,
    BarChart3,
    PieChart,
    ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Stat Card Component
const StatCard = ({
    label,
    value,
    sub,
    icon: Icon,
    delay = 0,
    accent = false,
}: {
    label: string;
    value: string;
    sub: string;
    icon: any;
    delay?: number;
    accent?: boolean;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className={cn(
            "bg-[#0A0A0A]/80 backdrop-blur-md p-6 rounded-[1.5rem] border hover:border-[#C3F53C]/30 transition-all duration-500 group relative overflow-hidden",
            accent ? "border-[#C3F53C]/20" : "border-white/5"
        )}
    >
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#C3F53C]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#C3F53C]/10 transition-all duration-500" />

        <div className="flex items-start justify-between mb-4 relative z-10">
            <div
                className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    accent
                        ? "bg-[#C3F53C]/10 text-[#C3F53C]"
                        : "bg-white/5 text-white"
                )}
            >
                <Icon className="w-6 h-6" />
            </div>
            <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-[#C3F53C] transition-colors" />
        </div>

        <div className="relative z-10">
            <h3 className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold mb-2">
                {label}
            </h3>
            <div
                className={cn(
                    "text-3xl font-display font-medium mb-1 tracking-tight transition-colors",
                    accent
                        ? "text-[#C3F53C]"
                        : "text-white group-hover:text-[#C3F53C]"
                )}
            >
                {value}
            </div>
            <div className="text-xs text-gray-500">{sub}</div>
        </div>
    </motion.div>
);

// Chart Placeholder Component
const ChartPlaceholder = ({
    title,
    icon: Icon,
    delay = 0,
}: {
    title: string;
    icon: any;
    delay?: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-[#0A0A0A]/80 backdrop-blur-md border border-white/5 p-6 rounded-[1.5rem] h-80 flex flex-col relative overflow-hidden group hover:border-[#C3F53C]/20 transition-colors"
    >
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <Icon className="w-4 h-4 text-[#C3F53C]" /> {title}
            </h3>
            <div className="text-[10px] text-gray-600 uppercase tracking-widest">
                Real-time
            </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#C3F53C]/10 transition-colors">
                    <Icon className="w-8 h-8 text-gray-500 group-hover:text-[#C3F53C] transition-colors" />
                </div>
                <p className="text-gray-500 text-sm">
                    Chart visualization coming soon
                </p>
            </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-tr from-[#C3F53C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
);

export default function AnalyticsPage() {
    const { totalVaults, totalRevenue, autoRepayments, isLoading } =
        useProtocolStats();

    return (
        <main className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            {/* Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(195,245,60,0.03),transparent_60%)] pointer-events-none" />
            <div className="fixed inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="pt-32 pb-20 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C3F53C]/20 bg-[#C3F53C]/5 text-[#C3F53C] text-[10px] font-medium uppercase tracking-wider mb-4">
                            <Activity className="w-3 h-3" />
                            Protocol Analytics
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-medium text-white tracking-tight mb-4">
                            Odyssée Protocol Stats
                        </h1>
                        <p className="text-gray-400 max-w-xl">
                            Real-time insights into protocol performance,
                            auto-repayments, and yield generation across all
                            vaults.
                        </p>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <StatCard
                            icon={Wallet}
                            label="Total Vaults"
                            value={
                                isLoading
                                    ? "..."
                                    : totalVaults.toLocaleString()
                            }
                            sub="Active positions"
                            delay={0}
                            accent
                        />
                        <StatCard
                            icon={TrendingUp}
                            label="Protocol Revenue"
                            value={
                                isLoading
                                    ? "..."
                                    : `$${totalRevenue.toLocaleString()}`
                            }
                            sub="From 15% yield fee"
                            delay={0.1}
                        />
                        <StatCard
                            icon={RefreshCcw}
                            label="Auto-Repayments"
                            value={
                                isLoading
                                    ? "..."
                                    : autoRepayments.toLocaleString()
                            }
                            sub="Automated debt reductions"
                            delay={0.2}
                        />
                    </div>

                    {/* Charts Grid - PREMIUM VISUALIZATIONS */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* TVL CHART - Quantum Stream Visualization */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-[#0A0A0A] border border-white/10 p-0 rounded-[1.5rem] h-80 flex flex-col relative overflow-hidden group shadow-2xl"
                        >
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

                                    {/* Floating Data Points */}
                                    {[
                                        { cx: 100, cy: 100, val: "$1.8M" },
                                        { cx: 250, cy: 70, val: "$2.1M" },
                                        { cx: 400, cy: 40, val: "$2.4M" }
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
                                    <div className="text-sm font-bold text-white">$2,140,000</div>
                                </div>
                            </div>
                        </motion.div>

                        {/* COLLATERAL DISTRIBUTION - Gravity Well Visualization */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-[#0A0A0A] border border-white/10 p-0 rounded-[1.5rem] h-80 flex relative overflow-hidden group shadow-2xl"
                        >
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
                            <div className="w-2/3 h-full relative z-10">
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
                                            <div className="text-xl font-display font-bold text-white tracking-tighter">$2.4M</div>
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
                            <div className="w-1/3 h-full border-l border-white/5 bg-white/[0.02] backdrop-blur-sm p-5 flex flex-col justify-center gap-4 relative z-20">
                                {[
                                    { symbol: "Ξ", name: "mETH", value: "1.44M", sub: "60%", color: "text-blue-400", bg: "bg-blue-500", border: "border-blue-500/20" },
                                    { symbol: "₿", name: "fBTC", value: "600K", sub: "25%", color: "text-orange-400", bg: "bg-orange-500", border: "border-orange-500/20" },
                                    { symbol: "◆", name: "Other", value: "360K", sub: "15%", color: "text-[#C3F53C]", bg: "bg-[#C3F53C]", border: "border-[#C3F53C]/20" },
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
                        </motion.div>
                    </div>

                    {/* Protocol Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-12 p-8 rounded-[1.5rem] bg-[#0A0A0A]/80 border border-white/5"
                    >
                        <h3 className="text-lg font-display font-medium text-white mb-6">
                            Protocol Parameters
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                                    Max LTV
                                </div>
                                <div className="text-2xl font-display text-[#C3F53C]">
                                    70%
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                                    Liquidation Threshold
                                </div>
                                <div className="text-2xl font-display text-white">
                                    85%
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                                    Yield to Repayment
                                </div>
                                <div className="text-2xl font-display text-white">
                                    85%
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                                    Protocol Fee
                                </div>
                                <div className="text-2xl font-display text-white">
                                    15%
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}

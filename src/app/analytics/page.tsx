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

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ChartPlaceholder
                            icon={BarChart3}
                            title="TVL Over Time"
                            delay={0.3}
                        />
                        <ChartPlaceholder
                            icon={PieChart}
                            title="Collateral Distribution"
                            delay={0.4}
                        />
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

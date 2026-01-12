"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Globe, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TX_DATA = [
    { id: "0x8a...29f1", type: "Mint", amount: "50,000 USDC", protocol: "Mantle", time: "2s ago" },
    { id: "0x9b...44a2", type: "Burn", amount: "12,500 USDT", protocol: "Ethereum", time: "5s ago" },
    { id: "0x7c...11e9", type: "Rebalance", amount: "150,000 DAI", protocol: "Aave V3", time: "8s ago" },
    { id: "0x3d...88b4", type: "Liquidate", amount: "4,200 WETH", protocol: "Compound", time: "12s ago" },
    { id: "0x1a...99c3", type: "Mint", amount: "1,000,000 USDC", protocol: "Mantle", time: "15s ago" },
];

// TX Row with spotlight effect
const TxRow = ({ tx, index }: { tx: typeof TX_DATA[0], index: number }) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!rowRef.current) return;
        const rect = rowRef.current.getBoundingClientRect();
        rowRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        rowRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };

    return (
        <motion.div
            ref={rowRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.01, x: 5 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className={cn(
                "group relative flex items-center justify-between p-4 rounded-xl border overflow-hidden transition-all duration-300",
                isHovered ? "bg-[#C3F53C]/5 border-[#C3F53C]/20" : "bg-white/5 border-white/5"
            )}
        >
            {/* Spotlight */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(195,245,60,0.1), transparent 40%)`,
                }}
            />

            <div className="relative z-10 flex items-center gap-4">
                <div className={cn(
                    "p-2 rounded-lg transition-colors duration-300",
                    isHovered ? "bg-[#C3F53C]/20 text-[#C3F53C]" : "bg-white/5 text-gray-400"
                )}>
                    <Globe className="w-4 h-4" />
                </div>
                <div>
                    <div className={cn("text-xs font-medium transition-colors duration-300", isHovered ? "text-[#C3F53C]" : "text-white")}>{tx.type}</div>
                    <div className="text-[10px] font-mono text-gray-500">{tx.id}</div>
                </div>
            </div>
            <div className="relative z-10 text-right">
                <div className="text-xs font-medium text-white">{tx.amount}</div>
                <div className="text-[10px] text-gray-500">{tx.protocol} • {tx.time}</div>
            </div>
        </motion.div>
    );
};

export function TransparencySection() {
    return (
        <section className="py-16 md:py-24 px-4 md:px-6 bg-[#050505] text-white border-t border-white/5">
            <div className="max-w-7xl mx-auto space-y-10 md:space-y-16">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C3F53C]/20 bg-[#C3F53C]/5 text-[#C3F53C] text-[10px] font-medium uppercase tracking-wider">
                            <Globe className="w-3 h-3" />
                            On-Chain Verification
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-medium leading-tight">
                            Simplify and enhance <br />
                            <span className="text-gray-500">transparency in transfers.</span>
                        </h2>
                    </div>
                    <button className="px-6 py-3 rounded-full bg-[#C3F53C] text-black font-medium hover:bg-[#d4ff5c] transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(195,245,60,0.3)]">
                        View Explorer <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Dashboard / Console Visual */}
                <div className="relative w-full rounded-3xl border border-white/10 bg-[#080808] overflow-hidden shadow-2xl">
                    {/* Top Bar */}
                    <div className="h-12 border-b border-white/5 bg-white/[0.02] flex items-center justify-between px-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-[#C3F53C]/20 border border-[#C3F53C]/50" />
                        </div>
                        <div className="text-xs font-mono text-gray-500">odyssee_explorer_v2.0</div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/5 min-h-[420px]">

                        {/* Live Feed */}
                        <div className="lg:col-span-2 p-6 overflow-hidden relative">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-[#C3F53C]" /> Live Transactions
                                </h3>
                                <div className="flex items-center gap-2 text-[10px] text-[#C3F53C]">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C3F53C] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C3F53C]"></span>
                                    </span>
                                    Connected
                                </div>
                            </div>

                            <div className="space-y-3">
                                {TX_DATA.map((tx, i) => (
                                    <TxRow key={tx.id} tx={tx} index={i} />
                                ))}
                            </div>

                            {/* Gradient Fade */}
                            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />
                        </div>

                        {/* Stats Panel */}
                        <div className="p-6 bg-gradient-to-b from-white/[0.02] to-transparent flex flex-col justify-center gap-8">
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Total Value Locked</div>
                                <div className="text-3xl font-display font-medium text-white">$42.8M</div>
                                <div className="text-xs text-[#C3F53C] flex items-center gap-1 mt-1">
                                    <ArrowRight className="w-3 h-3 -rotate-45" /> +12.4% this week
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500 mb-2">Protocol Health</div>
                                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full w-[98%] bg-[#C3F53C] rounded-full shadow-[0_0_15px_rgba(195,245,60,0.5)]" />
                                </div>
                                <div className="flex justify-between mt-2 text-[10px]">
                                    <span className="text-gray-400">Risk Score</span>
                                    <span className="text-[#C3F53C]">98/100 (Safe)</span>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-[#C3F53C]/5 border border-[#C3F53C]/10 mt-auto">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-[#C3F53C] shrink-0" />
                                    <div>
                                        <div className="text-xs font-medium text-white mb-1">Proof of Reserve</div>
                                        <div className="text-[10px] text-gray-400 leading-relaxed">
                                            Assets are verified on-chain via Chainlink Oracles every 5 minutes.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Partner Logos Ticker */}
                <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-40 hover:opacity-70 transition-all duration-500">
                    {[
                        "MANTLE",
                        "CENTRIFUGE",
                        "GOLDFINCH",
                        "BACKED",
                        "CHAINLINK",
                        "PYTH"
                    ].map(p => (
                        <span key={p} className="text-sm font-bold tracking-[0.2em] text-white hover:text-[#C3F53C] transition-colors cursor-default">
                            {p}
                        </span>
                    ))}
                </div>

            </div>
        </section>
    );
}

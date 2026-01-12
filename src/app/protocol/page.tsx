"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import {
    Cpu,
    ShieldCheck,
    Layers,
    Zap,
    RefreshCcw,
    Lock,
    ArrowRight,
    FileCode
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- COMPONENTS ---

const SectionHeader = ({ icon: Icon, title, subtitle }: { icon: any, title: string, subtitle: string }) => (
    <div className="mb-12">
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C3F53C]/10 border border-[#C3F53C]/20 text-[#C3F53C] text-xs font-bold tracking-widest uppercase mb-4"
        >
            <Icon className="w-3 h-3" /> {title}
        </motion.div>
        <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-display font-medium text-white tracking-tight leading-tight"
        >
            {subtitle}
        </motion.h2>
    </div>
);

// Feature Card with Odyssée Spotlight
const FeatureCard = ({ icon: Icon, title, desc, delay = 0 }: any) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className={cn(
                "group relative p-8 rounded-[2rem] bg-[#080808] border overflow-hidden transition-all duration-300",
                isHovered ? "border-[#C3F53C]/30 shadow-[0_20px_60px_rgba(195,245,60,0.1)]" : "border-white/5 hover:border-white/10"
            )}
        >
            {/* Spotlight */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100 rounded-[2rem]"
                style={{
                    background: `radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(195,245,60,0.12), transparent 40%)`,
                }}
            />

            <div className={cn(
                "relative z-10 w-12 h-12 rounded-2xl border flex items-center justify-center mb-6 transition-all duration-300",
                isHovered ? "bg-[#C3F53C]/10 border-[#C3F53C]/30" : "bg-white/5 border-white/10"
            )}>
                <Icon className={cn("w-6 h-6 transition-colors duration-300", isHovered ? "text-[#C3F53C]" : "text-white/60")} />
            </div>
            <h3 className={cn("text-xl font-display font-medium mb-3 transition-colors duration-300", isHovered ? "text-[#C3F53C]" : "text-white")}>{title}</h3>
            <p className="relative z-10 text-gray-400 font-sans leading-relaxed text-sm">{desc}</p>
        </motion.div>
    );
};

// Layer Item with Odyssée Hover
const LayerItem = ({ layer, title, desc, index }: any) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ x: 10 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={cn(
                "flex items-start gap-6 p-6 rounded-2xl border bg-[#0A0A0A]/50 backdrop-blur-sm relative group transition-all duration-300",
                isHovered ? "border-[#C3F53C]/30 shadow-[0_10px_40px_rgba(195,245,60,0.05)]" : "border-white/5"
            )}
        >
            <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-opacity duration-300", isHovered ? "opacity-100 bg-[#C3F53C]" : "opacity-0")} />
            <div className={cn(
                "flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full border font-mono text-xs font-bold transition-all duration-300",
                isHovered ? "bg-[#C3F53C]/10 border-[#C3F53C]/30 text-[#C3F53C]" : "bg-white/5 border-white/10 text-gray-500"
            )}>
                L{layer}
            </div>
            <div>
                <h3 className={cn("text-lg font-display font-medium mb-1 transition-colors duration-300", isHovered ? "text-[#C3F53C]" : "text-white")}>{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
        </motion.div>
    );
};

export default function ProtocolPage() {
    return (
        <div className="min-h-screen bg-[#050505] selection:bg-[#C3F53C]/30 overflow-hidden font-sans">
            <Navbar />

            {/* Background Ambience */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#C3F53C]/5 blur-[150px] rounded-full pointer-events-none" />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 px-6">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C3F53C]/10 border border-[#C3F53C]/20 text-[#C3F53C] text-xs font-bold tracking-widest uppercase mb-8"
                    >
                        <Cpu className="w-3 h-3 animate-pulse" /> Protocol Mechanics
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-5xl md:text-8xl font-display font-medium text-white tracking-tighter mb-8 max-w-5xl mx-auto leading-[0.9]"
                    >
                        The Engine Behind <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C3F53C] via-white to-gray-600">Self-Repaying Loans</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        A seamless loop of yield harvesting, auto-compounding, and debt servicing.
                        Powered by Mantle Network's native yield.
                    </motion.p>
                </div>
            </section>

            {/* THE LOOP DIAGRAM */}
            <section className="py-24 px-6 border-y border-white/5 bg-white/[0.01]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <SectionHeader
                                icon={RefreshCcw}
                                title="The Infinite Loop"
                                subtitle="Liquidity without selling. Repayment without effort."
                            />
                            <div className="space-y-8">
                                {[
                                    { n: 1, t: "Deposit & Borrow", d: "User deposits mETH/fBTC and borrows stablecoins (up to 70% LTV).", active: true },
                                    { n: 2, t: "Yield Generation", d: "Collateral earns native yield (~4% APY) on Mantle Network continuously.", active: false },
                                    { n: 3, t: "Auto-Harvest", d: "Keepers trigger harvest. Yield is swapped to stablecoins.", active: false },
                                    { n: 4, t: "Debt Reduction", d: "85% of yield repays the user's loan automatically. 15% to protocol.", active: false }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all",
                                            step.active ? "bg-[#C3F53C] text-black" : "bg-white/10 text-white group-hover:bg-[#C3F53C]/20 group-hover:text-[#C3F53C]"
                                        )}>{step.n}</div>
                                        <div>
                                            <h4 className="text-white font-bold mb-1 group-hover:text-[#C3F53C] transition-colors">{step.t}</h4>
                                            <p className="text-gray-400 text-sm">{step.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visual Diagram */}
                        <div className="relative aspect-square md:aspect-video lg:aspect-square bg-[#080808] rounded-[3rem] border border-white/10 overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(195,245,60,0.1),transparent_70%)]" />

                            {/* Central Node */}
                            <div className="relative z-10 w-48 h-48 rounded-full border border-[#C3F53C]/30 flex items-center justify-center backdrop-blur-xl">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-white mb-1">Vault</div>
                                    <div className="text-xs text-[#C3F53C] uppercase tracking-widest">mETH / fBTC</div>
                                </div>
                                {/* Orbiting Particles */}
                                <div className="absolute inset-0 animate-spin-slow">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#C3F53C] rounded-full shadow-[0_0_15px_#C3F53C]" />
                                </div>
                            </div>

                            {/* Connecting Nodes */}
                            <div className="absolute top-10 left-10 p-4 rounded-xl bg-[#C3F53C]/5 border border-[#C3F53C]/20 backdrop-blur-md">
                                <div className="text-xs text-[#C3F53C] uppercase tracking-widest mb-1">Input</div>
                                <div className="text-white font-bold">Collateral</div>
                            </div>
                            <div className="absolute bottom-10 right-10 p-4 rounded-xl bg-[#C3F53C]/5 border border-[#C3F53C]/20 backdrop-blur-md">
                                <div className="text-xs text-[#C3F53C] uppercase tracking-widest mb-1">Output</div>
                                <div className="text-white font-bold">Debt Repayment</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ARCHITECTURE LAYERS */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <SectionHeader icon={Layers} title="System Architecture" subtitle="Built for Modular Security" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <LayerItem layer="6" title="Governance" desc="Protocol Treasury & Parameter Management" index={0} />
                        <LayerItem layer="5" title="Liquidation Engine" desc="Dutch Auction Mechanism & Health Monitoring" index={1} />
                        <LayerItem layer="4" title="Auto-Repay Engine" desc="Yield-to-Stablecoin Swaps & Debt Reduction" index={2} />
                        <LayerItem layer="3" title="Lending Engine" desc="Loan Management & LTV Calculations" index={3} />
                        <LayerItem layer="2" title="Yield Router" desc="Yield Aggregation & Optimization Layer" index={4} />
                        <LayerItem layer="1" title="Collateral Vaults" desc="Secure Custody for mETH & fBTC" index={5} />
                    </div>

                    <div className="sticky top-32 h-fit p-8 rounded-[2rem] bg-[#080808] border border-white/10">
                        <h3 className="text-2xl font-display font-medium text-white mb-6">Smart Contract Stack</h3>
                        <div className="space-y-3 font-mono text-sm">
                            {[
                                { name: "LendingPool.sol", tag: "Core", color: "text-blue-400" },
                                { name: "YieldRouter.sol", tag: "Logic", color: "text-purple-400" },
                                { name: "LiquidationEngine.sol", tag: "Safety", color: "text-orange-400" },
                                { name: "CollateralVault.sol", tag: "Storage", color: "text-green-400" }
                            ].map((file, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-[#C3F53C]/20 transition-colors group">
                                    <span className="text-gray-300 flex items-center gap-2"><FileCode className={cn("w-4 h-4", file.color)} /> {file.name}</span>
                                    <span className="text-[#C3F53C] text-xs">{file.tag}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <div className="text-xs text-gray-500 uppercase tracking-widest mb-3">Audited By</div>
                            <div className="flex gap-4">
                                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 font-bold">CERTIK</div>
                                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 font-bold">TOB</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SAFETY & RISK */}
            <section className="py-24 px-6 bg-[#030303] border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <SectionHeader icon={ShieldCheck} title="Fortress Security" subtitle="Risk Management First" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={Lock}
                            title="Flash Loan Protection"
                            desc="Single-block collateral lockup prevents flash loan manipulation attacks."
                            delay={0}
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Oracle Redundancy"
                            desc="Chainlink + Mantle Native Price Feeds with 15-minute TWAP fallbacks."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={RefreshCcw}
                            title="Dutch Auctions"
                            desc="Efficient liquidation mechanism starting at 105% of debt value to ensure solvency."
                            delay={0.2}
                        />
                    </div>
                </div>
            </section>

        </div>
    );
}

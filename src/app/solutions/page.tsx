"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import {
    Lightbulb,
    Briefcase,
    GraduationCap,
    Landmark,
    Coins,
    ArrowRight,
    TrendingUp,
    Building2,
    Wallet,
    Cable
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

// --- COMPONENTS ---

// Persona Card with Odyssée Style
const PersonaCard = ({ icon: Icon, title, useCase, amount, payoff, delay }: any) => {
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ duration: 0.6, delay }}
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

            <div className="relative z-10">
                <div className={cn(
                    "w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 transition-all duration-300",
                    isHovered ? "bg-[#C3F53C]/10 border-[#C3F53C]/30" : "bg-white/5 border-white/10"
                )}>
                    <Icon className={cn("w-7 h-7 transition-colors duration-300", isHovered ? "text-[#C3F53C]" : "text-white/60")} />
                </div>

                <h3 className={cn("text-2xl font-display font-medium mb-2 transition-colors duration-300", isHovered ? "text-[#C3F53C]" : "text-white")}>{title}</h3>
                <p className="text-gray-400 font-sans text-sm mb-6 min-h-[40px]">{useCase}</p>

                <div className="space-y-3 pt-6 border-t border-white/5">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Loan Amount</span>
                        <span className="text-white font-mono font-medium">{amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Est. Payoff</span>
                        <span className="text-[#C3F53C] font-mono font-medium">{payoff}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const StepItem = ({ number, title, desc }: any) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex items-start gap-6 group"
        >
            <div className={cn(
                "flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center font-bold font-mono transition-all duration-300",
                isHovered ? "bg-[#C3F53C] border-[#C3F53C] text-black" : "bg-white/5 border-white/10 text-white"
            )}>
                {number}
            </div>
            <div>
                <h4 className={cn("text-lg font-display font-medium mb-1 transition-colors duration-300", isHovered ? "text-[#C3F53C]" : "text-white")}>{title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
};

export default function SolutionsPage() {
    return (
        <div className="min-h-screen bg-[#050505] selection:bg-[#C3F53C]/30 overflow-hidden font-sans">
            <Navbar />

            {/* Background Ambience */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-0" />
            <div className="fixed bottom-0 right-0 w-[800px] h-[800px] bg-[#C3F53C]/5 blur-[150px] rounded-full pointer-events-none" />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-24 px-6 text-center">
                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C3F53C]/10 border border-[#C3F53C]/20 text-[#C3F53C] text-xs font-bold tracking-widest uppercase mb-8"
                    >
                        <Lightbulb className="w-3 h-3" /> Use Cases
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-8xl font-display font-medium text-white tracking-tighter mb-8 leading-none"
                    >
                        Liquidity Without <br />
                        <span className="text-gray-600">Liquidation</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Unlock the power of your assets to fund real-world goals.
                        Let the yield pay off your debts while you maintain ownership.
                    </motion.p>
                </div>
            </section>

            {/* PERSONAS GRID */}
            <section className="py-12 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <PersonaCard
                        icon={TrendingUp}
                        title="The HODLer"
                        useCase="Access liquidity for trading or lifestyle without triggering taxable events or selling upside."
                        amount="$10k - $100k"
                        payoff="Ongoing"
                        delay={0}
                    />
                    <PersonaCard
                        icon={Building2}
                        title="Real Estate Mogul"
                        useCase="Fund a down payment for property investment using idle crypto holdings."
                        amount="$50k - $200k"
                        payoff="~15 Years"
                        delay={0.1}
                    />
                    <PersonaCard
                        icon={Briefcase}
                        title="Business Owner"
                        useCase="Secure working capital for inventory or expansion without traditional bank friction."
                        amount="$25k - $500k"
                        payoff="~12 Years"
                        delay={0.2}
                    />
                    <PersonaCard
                        icon={GraduationCap}
                        title="The Student"
                        useCase="Finance education with a self-repaying loan, minimizing future debt burden."
                        amount="$10k - $50k"
                        payoff="~10 Years"
                        delay={0.3}
                    />
                    <PersonaCard
                        icon={Landmark}
                        title="Treasury Manager"
                        useCase="Optimize DAO treasury assets to cover operational costs via borrowing."
                        amount="$1M+"
                        payoff="Variable"
                        delay={0.4}
                    />
                    <PersonaCard
                        icon={Wallet}
                        title="Yield Maxi"
                        useCase="Leverage loop: Borrow stables to buy more mETH, compounding yield exposure."
                        amount="Degenerate"
                        payoff="High Risk"
                        delay={0.5}
                    />
                </div>
            </section>

            {/* RWA BRIDGE */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto bg-[#080808] border border-white/10 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C3F53C]/5 blur-[120px] rounded-full pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-display font-medium text-white mb-6 tracking-tight">
                                Bridging <span className="text-[#C3F53C]">Crypto</span> to <br />
                                Real World Assets
                            </h2>
                            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                                We are building the pipeline to connect automated DeFi credit lines directly with real-world asset platforms like Centrifuge and Goldfinch.
                            </p>

                            <div className="space-y-8">
                                <StepItem number="01" title="Crypto Collateral" desc="Your mETH/fBTC generates yield on Mantle Network." />
                                <StepItem number="02" title="Stablecoin Liquidity" desc="Borrow USDC to bridge into RWA investment pools." />
                                <StepItem number="03" title="Real World Growth" desc="Combine crypto yield with RWA APY for dual-engine compounding." />
                            </div>

                            <div className="mt-12">
                                <Button className="bg-[#C3F53C] text-black hover:bg-[#d4ff5c] rounded-full px-8 h-12 text-sm font-bold tracking-wide shadow-[0_0_30px_rgba(195,245,60,0.3)]">
                                    Explore Partners
                                </Button>
                            </div>
                        </div>

                        {/* Visual RWA Bridge */}
                        <div className="relative h-[400px] bg-[#0A0A0A] rounded-3xl border border-white/5 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(195,245,60,0.08),transparent_70%)]" />
                            <div className="text-center relative z-10">
                                <div className="w-24 h-24 mb-6 rounded-full bg-[#C3F53C]/10 border border-[#C3F53C]/30 flex items-center justify-center mx-auto text-[#C3F53C]">
                                    <Cable className="w-12 h-12" />
                                </div>
                                <div className="text-2xl font-display text-white">RWA Integration</div>
                                <div className="text-sm text-[#C3F53C] uppercase tracking-widest mt-2">Coming Q3 2025</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}

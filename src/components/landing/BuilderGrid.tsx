"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Wallet, Building2, Briefcase } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const USE_CASES = [
    {
        id: "01",
        title: "Long-term HODLers",
        description: "Access liquidity for lifestyle expenses while keeping your mETH position intact. Zero capital gains events.",
        loanRange: "$10k - $100k",
        icon: Wallet,
    },
    {
        id: "02",
        title: "Real Estate Investors",
        description: "Fund down payments instantly. Use your crypto portfolio as a self-repaying bridge loan for property acquisition.",
        loanRange: "$50k - $2M",
        icon: Building2,
    },
    {
        id: "03",
        title: "Business Efficiency",
        description: "Secure working capital lines that pay themselves back. Smooth out cash flow volatility without selling treasury assets.",
        loanRange: "$100k - $5M",
        icon: Briefcase,
    }
];

// Use Case Card with Odyssée Style
const UseCaseCard = ({ item, index }: { item: typeof USE_CASES[0], index: number }) => {
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
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            viewport={{ once: true }}
            className={cn(
                "group relative h-[400px] md:h-[500px] rounded-[1.5rem] md:rounded-[2rem] bg-[#080808] border overflow-hidden transition-all duration-500",
                isHovered ? "border-[#C3F53C]/30 shadow-[0_20px_60px_rgba(195,245,60,0.1)]" : "border-white/5 hover:border-white/10"
            )}
        >
            {/* Spotlight Glow */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(195,245,60,0.1), transparent 40%)`,
                }}
            />

            {/* Background Gradient on Hover - Lime */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-b from-[#C3F53C]/10 to-transparent transition-opacity duration-700",
                isHovered ? "opacity-100" : "opacity-0"
            )} />

            {/* Giant Watermark Number */}
            <div className={cn(
                "absolute -right-4 -top-10 text-[180px] font-display font-bold select-none pointer-events-none transition-colors duration-500",
                isHovered ? "text-[#C3F53C]/[0.05]" : "text-white/[0.02]"
            )}>
                {item.id}
            </div>

            {/* Content Container */}
            <div className="relative h-full p-10 flex flex-col justify-between z-10">

                {/* Top Icon */}
                <div className={cn(
                    "w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-300",
                    isHovered ? "bg-[#C3F53C]/10 border-[#C3F53C]/30" : "bg-white/5 border-white/10"
                )}>
                    <item.icon className={cn("w-6 h-6 transition-colors duration-300", isHovered ? "text-[#C3F53C]" : "text-white/60")} />
                </div>

                {/* Text Body */}
                <div>
                    <h3 className={cn(
                        "text-3xl font-display font-medium mb-4 transition-colors duration-300",
                        isHovered ? "text-[#C3F53C]" : "text-white"
                    )}>{item.title}</h3>
                    <p className={cn(
                        "leading-relaxed font-light transition-colors duration-300",
                        isHovered ? "text-gray-300" : "text-gray-500"
                    )}>
                        {item.description}
                    </p>
                </div>

                {/* Bottom Metadata */}
                <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-gray-600">Loan Range</span>
                        <span className={cn("font-mono transition-colors duration-300", isHovered ? "text-[#C3F53C]" : "text-[#C3F53C]/80")}>{item.loanRange}</span>
                    </div>
                    <div className={cn(
                        "w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300",
                        isHovered ? "bg-[#C3F53C] border-[#C3F53C] text-black" : "border-white/10 text-white/50"
                    )}>
                        <ArrowUpRight className="w-5 h-5" />
                    </div>
                </div>
            </div>

        </motion.div>
    );
};

export function BuilderGrid() {
    return (
        <section className="py-16 md:py-40 bg-[#030303] text-white">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">

                <div className="mb-12 md:mb-24 flex flex-col items-center text-center space-y-4 md:space-y-6">
                    <ScrollReveal>
                        <h2 className="text-3xl sm:text-4xl md:text-7xl font-display font-medium leading-[1] md:leading-[0.9] tracking-tighter">
                            Unlock real world <br />
                            <span className="text-white/30">purchasing power.</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl text-base md:text-lg font-light mt-4 md:mt-6 mx-auto">
                            Liquidity without liquidation. Keep your upside, spend your yield.
                        </p>
                    </ScrollReveal>
                </div>

                <ScrollReveal delay={0.2} width="100%">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                        {USE_CASES.map((item, i) => (
                            <UseCaseCard key={i} item={item} index={i} />
                        ))}
                    </div>
                </ScrollReveal>

                {/* Bottom CTA Block (Full Width Glass) – Odyssée Style */}
                <ScrollReveal delay={0.4} width="100%">
                    <div className="mt-16 md:mt-32 relative rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden bg-[#080808] border border-white/5">
                        {/* Ambient Glow */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(195,245,60,0.1),transparent_50%)]" />

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center p-8 md:p-20 gap-8 md:gap-10">
                            <div className="space-y-4 max-w-2xl">
                                <h3 className="text-2xl sm:text-3xl md:text-5xl font-display font-medium text-white tracking-tight text-center md:text-left">
                                    Ready to deploy capital?
                                </h3>
                                <p className="text-base md:text-xl text-gray-500 font-light text-center md:text-left">
                                    Launch a vault in seconds. No paperwork, just smart contracts.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button className="px-8 md:px-10 py-4 md:py-5 rounded-full bg-[#C3F53C] text-black font-medium hover:bg-[#d4ff5c] transition-colors shadow-[0_0_30px_rgba(195,245,60,0.3)] text-base md:text-lg">
                                    Open Vault
                                </button>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

            </div>
        </section>
    );
}

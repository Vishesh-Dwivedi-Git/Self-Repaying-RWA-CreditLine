"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ShieldCheck, Lock, Fingerprint, ArrowUpRight, Server, Eye, FileKey, Siren, Activity, Shield } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";

const SECURITY_NODES = [
    {
        title: "Smart Audits",
        value: "CERTIK / TOB",
        icon: FileKey,
        status: "VERIFIED",
        description: "Double-blind audit process with formal verification."
    },
    {
        title: "Oracle Feed",
        value: "CHAINLINK + TWAP",
        icon: Eye,
        status: "ACTIVE",
        description: "Redundant price feeds with 150bp deviation checks."
    },
    {
        title: "Governance",
        value: "24H TIMELOCK",
        icon: Server,
        status: "ENFORCED",
        description: "All upgrades subject to DAO vote and execution delay."
    },
    {
        title: "Kill Switch",
        value: "CIRCUIT BREAKER",
        icon: Siren,
        status: "STANDBY",
        statusColor: "text-red-500 border-red-500/30",
        description: "Automated pause functionality for black swan events."
    }
];

// Reusable Spotlight Card Component
const SecurityCard = ({ node, index }: { node: typeof SECURITY_NODES[0], index: number }) => {
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
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02, y: -3 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className={cn(
                "group relative p-5 flex items-center gap-6 rounded-2xl border bg-[#080808] overflow-hidden transition-all duration-300",
                isHovered ? "border-[#C3F53C]/30 shadow-[0_10px_40px_rgba(195,245,60,0.08)]" : "border-white/5 hover:border-white/10"
            )}
        >
            {/* Spotlight Glow Effect */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(195,245,60,0.1), transparent 40%)`,
                }}
            />

            {/* Icon Box */}
            <div className={cn(
                "relative z-10 w-12 h-12 flex items-center justify-center rounded-xl border transition-all duration-300",
                isHovered ? "bg-[#C3F53C]/10 border-[#C3F53C]/30" : "bg-black border-white/10"
            )}>
                <node.icon className={cn("w-6 h-6 transition-colors duration-300", isHovered ? "text-[#C3F53C]" : "text-gray-400")} />
            </div>

            {/* Content */}
            <div className="relative z-10 flex-1">
                <div className="flex justify-between items-center mb-1">
                    <h3 className={cn("font-medium transition-colors duration-300", isHovered ? "text-[#C3F53C]" : "text-white")}>{node.title}</h3>
                    <span className={cn(
                        "text-[10px] font-mono border px-2 py-0.5 rounded-full transition-colors duration-300",
                        node.statusColor ? node.statusColor : isHovered ? "text-[#C3F53C] border-[#C3F53C]/30" : "text-gray-500 border-gray-500/30"
                    )}>
                        {node.status}
                    </span>
                </div>
                <div className="text-xs font-mono text-gray-500">{node.value}</div>
            </div>

            {/* Hover Arrow */}
            <ArrowUpRight className={cn(
                "w-5 h-5 transition-all duration-300",
                isHovered ? "text-[#C3F53C] translate-x-0 opacity-100" : "text-white/20 -translate-x-2 opacity-0"
            )} />
        </motion.div>
    );
};

export function SecurityFeature() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const shieldRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
    const shieldScale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

    return (
        <section ref={containerRef} className="relative py-16 md:py-32 bg-[#030303] overflow-hidden text-white border-t border-white/5">

            {/* Ambient Lighting - Lime */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-[#C3F53C]/5 blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-full h-[500px] bg-[#C3F53C]/3 blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* LEFT COLUMN: THE FORTRESS CORE */}
                    <div className="relative order-2 lg:order-1 flex justify-center lg:justify-start">
                        <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center pointer-events-none select-none">

                            {/* Rotating Shield Rings - LIME */}
                            <motion.div
                                style={{ rotate: shieldRotate, scale: shieldScale }}
                                className="absolute inset-0 border border-[#C3F53C]/20 rounded-full border-dashed"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-[15%] border border-white/10 rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-[25%] border-2 border-[#C3F53C]/10 rounded-full border-t-[#C3F53C]/50"
                            />

                            {/* Center Core Hologram - LIME */}
                            <div className="relative z-10 w-48 h-48 bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-500 group shadow-2xl shadow-[#C3F53C]/5">
                                <div className="absolute inset-0 bg-[#C3F53C]/5 rounded-3xl animate-pulse" style={{ animationDuration: '3s' }} />
                                <Shield className="w-16 h-16 text-[#C3F53C] mb-4 drop-shadow-[0_0_20px_rgba(195,245,60,0.4)]" />
                                <div className="text-2xl font-display font-medium text-white">100%</div>
                                <div className="text-xs font-mono text-[#C3F53C]/80 uppercase tracking-widest mt-1">SECURE</div>

                                {/* Floating Lock Indicators */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-6 -right-6 p-3 bg-[#111] border border-white/10 rounded-xl shadow-lg"
                                >
                                    <Lock className="w-5 h-5 text-white/50" />
                                </motion.div>
                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute -bottom-6 -left-6 p-3 bg-[#111] border border-[#C3F53C]/20 rounded-xl shadow-lg"
                                >
                                    <Activity className="w-5 h-5 text-[#C3F53C]" />
                                </motion.div>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT COLUMN: DATA TERMINAL */}
                    <div className="order-1 lg:order-2 space-y-12">

                        {/* Header */}
                        <div className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 text-[#C3F53C] text-xs font-mono tracking-[0.2em] uppercase"
                            >
                                <div className="w-2 h-2 bg-[#C3F53C] rounded-full animate-pulse" />
                                Institutional Grade
                            </motion.div>

                            <h2 className="text-5xl md:text-6xl font-display font-medium tracking-tight text-white leading-[1.1]">
                                Fortress-level <br />
                                <span className="text-gray-500">infrastructure.</span>
                            </h2>
                            <p className="text-lg text-gray-400 font-light leading-relaxed max-w-md">
                                Built on verifiable, immutable smart contracts. Audited by the world's leading firms to ensure your assets never leave your control.
                            </p>
                        </div>

                        {/* Feature Cards List */}
                        <div className="grid gap-4">
                            {SECURITY_NODES.map((node, i) => (
                                <SecurityCard key={i} node={node} index={i} />
                            ))}
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}

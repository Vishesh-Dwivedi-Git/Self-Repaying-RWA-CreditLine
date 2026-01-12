// Entire content replaced due to massive volume of changes.
// Using optimized content with Lime colors.

"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ShieldAlert, TrendingUp, Activity, Globe, ArrowUpRight, Lock, Zap, Cpu, ScanLine, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

// --- ADVANCED VISUALS ---

// 1. HOLO-EMITTER (Auto-Repay)
const HoloEmitter = ({ isHovered }: { isHovered: boolean }) => (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(195,245,60,0.15),transparent_70%)]" />

        {/* Central Core */}
        <div className={cn(
            "relative z-10 w-32 h-32 rounded-full border border-[#C3F53C]/30 flex items-center justify-center transition-all duration-1000",
            isHovered ? "animate-[spin_4s_linear_infinite]" : "animate-[spin_10s_linear_infinite]"
        )}>
            <div className="absolute inset-0 rounded-full border border-dashed border-[#C3F53C]/20" />
            <div className={cn(
                "w-20 h-20 rounded-full bg-[#C3F53C]/10 backdrop-blur-md border border-[#C3F53C]/50 flex items-center justify-center shadow-[0_0_30px_rgba(195,245,60,0.2)] transition-all duration-500",
                isHovered && "scale-110 shadow-[0_0_50px_rgba(195,245,60,0.4)] border-[#C3F53C]"
            )}>
                <Zap className={cn("w-8 h-8 text-[#C3F53C] transition-all duration-300", isHovered ? "fill-[#C3F53C] scale-125" : "fill-[#C3F53C]/20")} />
            </div>
        </div>

        {/* Orbiting Particles */}
        <div className={cn("absolute inset-0 transition-all duration-1000", isHovered ? "animate-[spin_3s_linear_infinite_reverse]" : "animate-[spin_15s_linear_infinite_reverse]")}>
            <div className="absolute top-1/2 left-10 w-2 h-2 bg-[#C3F53C] rounded-full shadow-[0_0_10px_#C3F53C]" />
            <div className="absolute bottom-10 right-1/2 w-1.5 h-1.5 bg-white rounded-full opacity-50" />
        </div>

        {/* Data Stream Lines */}
        <div className="absolute inset-0 flex justify-center">
            <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#C3F53C]/20 to-transparent" />
            <div className={cn("w-[1px] h-full bg-gradient-to-b from-transparent via-[#C3F53C]/20 to-transparent translate-x-12 dashed transition-opacity duration-500", isHovered ? "opacity-100" : "opacity-30")} />
            <div className={cn("w-[1px] h-full bg-gradient-to-b from-transparent via-[#C3F53C]/20 to-transparent -translate-x-12 dashed transition-opacity duration-500", isHovered ? "opacity-100" : "opacity-30")} />
        </div>
    </div>
);

// 2. LIQUIDITY CURVE (Dutch Auction)
const LiquidityCurve = ({ isHovered }: { isHovered: boolean }) => (
    <div className="relative w-full h-full bg-[#0a0a0a] p-6 flex flex-col justify-end">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />

        {/* Curve Line */}
        <svg className="absolute inset-0 w-full h-full overflow-visible">
            <path
                d="M -20 100 Q 150 200 400 50"
                fill="none"
                stroke="#C3F53C"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="opacity-50"
            />
            <path
                d="M -20 120 Q 150 220 400 70"
                fill="none"
                stroke={isHovered ? "#C3F53C" : "#b2e035"}
                strokeWidth="2"
                className={cn("transition-all duration-500", isHovered && "drop-shadow-[0_0_10px_#C3F53C]")}
            />
            {/* Active Point */}
            <circle cx="200" cy="140" r="4" fill="#C3F53C" className={cn("transition-all duration-300", isHovered && "scale-150")}>
                <animateMotion dur={isHovered ? "2s" : "4s"} repeatCount="indefinite" path="M -20 120 Q 150 220 400 70" />
            </circle>
        </svg>

        {/* Floating Price Tag */}
        <div className={cn(
            "relative z-10 self-start mb-4 px-3 py-1.5 border rounded text-xs font-mono backdrop-blur-sm transition-all duration-300",
            isHovered ? "bg-[#C3F53C] text-black border-[#C3F53C] scale-110 -translate-y-2 font-bold" : "bg-[#C3F53C]/10 text-[#C3F53C] border-[#C3F53C]/30"
        )}>
            DISCOUNT: -4.2%
        </div>
    </div>
);

// 3. MANTLE INTEGRATION (Network)
const MantleNetwork = ({ isHovered }: { isHovered: boolean }) => (
    <div className="relative w-full h-full bg-[#050505] overflow-hidden flex items-center justify-center">
        {/* Hexagonal Mesh */}
        <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: "radial-gradient(circle at center, #ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px"
        }} />

        {/* Connecting Nodes */}
        <div className="relative w-full h-full">
            <div className={cn("absolute top-1/4 left-1/4 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_white] transition-transform duration-500", isHovered && "scale-150 shadow-[0_0_25px_white]")} />
            <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-gray-500 rounded-full" />
            <div className="absolute top-1/2 right-10 w-2 h-2 bg-gray-500 rounded-full" />

            {/* Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="25%" y1="25%" x2="75%" y2="66%" stroke={isHovered ? "#C3F53C" : "white"} strokeWidth={isHovered ? "1.5" : "0.5"} strokeOpacity={isHovered ? "0.8" : "0.2"} className="transition-all duration-500" />
                <line x1="25%" y1="25%" x2="90%" y2="50%" stroke={isHovered ? "#C3F53C" : "white"} strokeWidth={isHovered ? "1.5" : "0.5"} strokeOpacity={isHovered ? "0.8" : "0.2"} className="transition-all duration-500 delay-75" />
            </svg>
        </div>

        {/* Central Badge */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className={cn(
                "w-16 h-16 rounded-xl border backdrop-blur-md flex items-center justify-center rotate-45 transition-all duration-500 cursor-none",
                isHovered ? "bg-[#C3F53C] border-[#C3F53C] rotate-0 scale-110 shadow-[0_0_30px_#C3F53C]" : "bg-white/5 border-white/10 hover:rotate-0"
            )}>
                <div className={cn("-rotate-45 transition-all duration-500", isHovered && "rotate-0")}>
                    {/* Using Icon as primary visual */}
                    <Cpu className={cn("w-8 h-8 transition-colors duration-300", isHovered ? "text-black" : "text-white")} />
                </div>
            </div>
        </div>
    </div>
);

// 4. ON-CHAIN SCANNER (Transparency)
const OnChainScanner = ({ isHovered }: { isHovered: boolean }) => (
    <div className="relative w-full h-full bg-[#080808] flex flex-col p-6">
        <div className="flex justify-between items-center mb-4 opacity-50">
            <div className="flex gap-1">
                <div className="w-1 h-1 bg-white rounded-full" />
                <div className="w-1 h-1 bg-white rounded-full" />
                <div className="w-1 h-1 bg-white rounded-full" />
            </div>
            <div className="text-[10px] font-mono tracking-widest">LIVE FEED</div>
        </div>

        {/* Code Rain / Data Lines */}
        <div className="space-y-2 font-mono text-[10px] text-[#C3F53C]/80">
            <div className="flex justify-between border-b border-[#C3F53C]/10 pb-1">
                <span>TX_HASH</span>
                <span>FEES</span>
            </div>
            <div className={cn("flex justify-between transition-opacity duration-300", isHovered ? "opacity-100" : "opacity-80")}>
                <span>0x8a...29f1</span>
                <span>0.00%</span>
            </div>
            <div className={cn("flex justify-between transition-opacity duration-300", isHovered ? "opacity-100" : "opacity-60")}>
                <span>0x9b...44a2</span>
                <span>0.00%</span>
            </div>
            <div className={cn("flex justify-between transition-opacity duration-300", isHovered ? "opacity-100" : "opacity-40")}>
                <span>0x7c...11e9</span>
                <span>0.00%</span>
            </div>
        </div>

        {/* Scanning Bar */}
        <div className={cn(
            "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C3F53C] to-transparent pointer-events-none transition-all duration-500",
            isHovered ? "animate-[scan_1s_linear_infinite] opacity-80 h-2 shadow-[0_0_15px_#C3F53C]" : "animate-scan-y opacity-30 h-1"
        )} />
    </div>
);


// --- MAIN CARD COMPONENT ---

const FeatureCard = ({ title, description, visual: Visual, cta = "Learn more", className, delay = 0 }: any) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        const mouseXVal = e.clientX - rect.left;
        const mouseYVal = e.clientY - rect.top;

        // CSS Variable for Spotlight only
        divRef.current.style.setProperty('--mouse-x', `${mouseXVal}px`);
        divRef.current.style.setProperty('--mouse-y', `${mouseYVal}px`);
    };

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay, ease: "easeOut" }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={cn(
                "group relative flex flex-col rounded-[2rem] overflow-hidden",
                className
            )}
        >
            {/* Card Container - NO 3D ROTATION */}
            <div
                className={cn(
                    "relative flex flex-col h-full rounded-[2rem] border bg-[#080808] overflow-hidden transition-all duration-500 shadow-2xl",
                    isHovered
                        ? "border-[#C3F53C]/40 shadow-[0_20px_60px_rgba(195,245,60,0.15)]"
                        : "border-white/5 hover:border-white/20"
                )}
            >
                {/* Grain Texture */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light pointer-events-none" />

                {/* Spotlight Effect (CSS Variable driven) */}
                <div
                    className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 group-hover:opacity-100"
                    style={{
                        background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(195,245,60,0.15), transparent 40%)`,
                    }}
                />

                {/* Edge Glow on Hover */}
                <div className={cn(
                    "absolute inset-0 rounded-[2rem] transition-opacity duration-500 pointer-events-none",
                    isHovered ? "opacity-100" : "opacity-0"
                )} style={{
                    boxShadow: "inset 0 0 30px rgba(195,245,60,0.1)"
                }} />

                {/* Inner Layout */}
                <div className="flex flex-col h-full relative z-10">

                    {/* Visual Header */}
                    <div className="relative h-64 w-full border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent overflow-hidden">
                        <div className={cn(
                            "absolute inset-0 transition-transform duration-700 ease-out",
                            isHovered ? "scale-105" : "scale-100"
                        )}>
                            <Visual isHovered={isHovered} />
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="flex flex-1 flex-col justify-between p-8 md:p-10 transform-style-3d">
                        <div className="space-y-4 translate-z-10">
                            <h3 className={cn(
                                "text-2xl md:text-3xl font-display font-medium text-white tracking-tight transition-colors duration-300",
                                isHovered ? "text-[#C3F53C]" : "group-hover:text-gray-100"
                            )}>
                                {title}
                            </h3>
                            <p className="text-base text-gray-400 leading-relaxed font-light max-w-[90%]">
                                {description}
                            </p>
                        </div>

                        <div className="pt-8 flex items-center gap-3">
                            <div className={cn("h-[1px] bg-white/20 transition-all duration-300", isHovered ? "w-16 bg-[#C3F53C]" : "w-8 group-hover:w-12")} />
                            <span className={cn(
                                "text-xs font-mono font-medium uppercase tracking-widest transition-colors",
                                isHovered ? "text-[#C3F53C]" : "text-white/40 group-hover:text-white"
                            )}>
                                {cta}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


// --- EXPORTED SECTION ---

export function RWAIntelligence() {
    return (
        <section className="relative w-full py-16 md:py-40 bg-[#030303] text-white overflow-hidden">

            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[#C3F53C]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">

                {/* Premium Header - UPDATED INTERACTIVE VISUAL */}
                <div className="mb-12 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12 border-b border-white/10 pb-8 md:pb-12">
                    <div className="max-w-3xl">
                        <ScrollReveal>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/80 text-[10px] font-mono uppercase tracking-wider mb-6 backdrop-blur-md">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C3F53C] animate-pulse" />
                                Odyssée Intelligence Grid v2.0
                            </div>

                            <h2 className="text-3xl sm:text-4xl md:text-7xl font-display font-medium tracking-tighter text-white leading-[1] md:leading-[0.9] relative z-10">
                                <span className="relative inline-block group cursor-pointer">
                                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400 group-hover:from-[#C3F53C] group-hover:to-white transition-all duration-500">
                                        Self-repaying
                                    </span>
                                    {/* Interactive Underline Flow */}
                                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#C3F53C]/30 rounded-full overflow-hidden">
                                        <span className="absolute inset-0 bg-[#C3F53C] w-full -translate-x-full group-hover:animate-[slide_1.5s_infinite_linear]" />
                                    </span>
                                    {/* Hover Glow */}
                                    <span className="absolute inset-0 bg-[#C3F53C]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg -z-10" />
                                </span>
                                <br />
                                <span className="text-white/40">credit infrastructure.</span>
                            </h2>
                        </ScrollReveal>
                    </div>

                    <div className="max-w-sm pb-2">
                        <ScrollReveal delay={0.2}>
                            <p className="text-base md:text-lg text-gray-400 font-light leading-relaxed">
                                Turn dormant assets into active yield generators.
                                The first protocol that pays off your loan for you.
                            </p>
                        </ScrollReveal>
                    </div>
                </div>

                {/* BENTO GRID LAYOUT (Zig-Zag) */}
                <ScrollReveal delay={0.3} width="100%">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[minmax(300px,auto)] md:auto-rows-[minmax(400px,auto)]">

                        {/* Item 1: Wide (2 cols) */}
                        <FeatureCard
                            className="md:col-span-2 bg-[#050505]"
                            title="Auto-Repaying Loans"
                            description="Stop managing debt manually. Our engine harvests yield from your collateral (mETH, fBTC) and applies it directly to your loan principal, effectively lowering your LTV every block."
                            visual={HoloEmitter}
                            cta="Explore Engine"
                            delay={0.1}
                        />

                        {/* Item 2: Tall/Narrow (1 col) */}
                        <FeatureCard
                            className="md:col-span-1 bg-[#080808]"
                            title="Dutch Actions"
                            description="Fair market value protection. Assets are sold gradually to preserve borrower equity during liquidation events."
                            visual={LiquidityCurve}
                            cta="View Mechanisms"
                            delay={0.2}
                        />

                        {/* Item 3: Tall/Narrow (1 col) */}
                        <FeatureCard
                            className="md:col-span-1 bg-[#080808]"
                            title="Mantle Native"
                            description="Deep integration with Mantle's native yield-bearing assets. Zero-drag execution."
                            visual={MantleNetwork}
                            cta="Network Specs"
                            delay={0.3}
                        />

                        {/* Item 4: Wide (2 cols) */}
                        <FeatureCard
                            className="md:col-span-2 bg-[#050505]"
                            title="Zero Hidden Spreads"
                            description="85% of harvested yield goes directly to debt repayment. We enforce radical transparency with on-chain fee verification and open-source accounting."
                            visual={OnChainScanner}
                            cta="Verify On-Chain"
                            delay={0.4}
                        />

                    </div>
                </ScrollReveal>

            </div>
        </section>
    );
}

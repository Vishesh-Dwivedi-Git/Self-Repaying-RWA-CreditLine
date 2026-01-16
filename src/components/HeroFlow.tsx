"use client";

import React, { useEffect, useRef, useState } from "react";
import anime from "animejs/lib/anime.es.js";
import { ChevronRight, Wallet, Activity, TrendingUp, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Navbar } from "@/components/Navbar";
import { TrustedBy } from "@/components/TrustedBy";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { useProtocolStats } from "@/hooks/useVaultData";
import { useTVLData, formatTVL } from "@/hooks/useTVLData";

export default function HeroFlow() {
    const svgRef = useRef<SVGSVGElement>(null);
    const [mounted, setMounted] = useState(false);
    const [showWalletPrompt, setShowWalletPrompt] = useState(false);
    const router = useRouter();
    const { isConnected } = useAccount();
    
    // Live protocol stats (no wallet required)
    const { totalVaults, totalRevenue, autoRepayments, isLoading: isStatsLoading } = useProtocolStats();
    const { data: tvlData, isLoading: isTVLLoading } = useTVLData();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !svgRef.current) return;

        // Floating animation for the WHOLE GROUP (Unified movement)
        anime({
            targets: ".iso-whole-group",
            translateY: [0, -10],
            direction: "alternate",
            loop: true,
            easing: "easeInOutSine",
            duration: 4000,
        });

        // Mini floating for headers (independent)
        anime({
            targets: ".iso-float-mini",
            translateY: [0, -4],
            direction: "alternate",
            loop: true,
            easing: "easeInOutSine",
            duration: 2000,
            delay: anime.stagger(200)
        });

        // DATA PACKET ANIMATION
        anime({
            targets: ".data-packet",
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: "linear",
            duration: 4000,
            loop: true,
            delay: anime.stagger(800),
        });

        // Pulse Effect
        anime({
            targets: ".pulse-circle",
            scale: [1, 1.5],
            opacity: [0.5, 0],
            easing: "easeOutQuad",
            duration: 2000,
            loop: true,
        });
    }, [mounted]);

    return (
        <section className="relative w-full min-h-screen flex flex-col justify-center bg-[#050505] text-white px-6 md:px-12 lg:px-24 overflow-hidden selection:bg-[#4ade80] selection:text-black bg-grain">

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(74,222,128,0.05),transparent_60%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(30,30,30,0.4),transparent_50%)] pointer-events-none" />

            {/* Navbar (Fixed) */}
            <Navbar />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full max-w-7xl mx-auto h-full pt-28 md:pt-24 pb-24 md:pb-32">
                {/* Left Content */}
                <div className="flex flex-col gap-5 md:gap-8 max-w-2xl animate-fade-in-up z-10 relative">
                    {/* Decorative Line (Solid Tech Border) */}
                    <div className="absolute -left-8 top-2 w-[1px] h-32 bg-white/20 hidden md:block"></div>

                    <h1 className="text-3xl sm:text-4xl md:text-[5rem] font-display font-semibold tracking-[-0.03em] md:tracking-[-0.04em] leading-[1.05] md:leading-[0.95] text-white">
                        Your collateral <br className="hidden sm:block" />
                        works for you, <span className="text-[#C3F53C]">automatically</span>
                    </h1>
                    <p className="text-base md:text-xl text-gray-400 leading-relaxed max-w-lg font-light">
                        Deposit mETH or fBTC, borrow stablecoins, and watch your debt disappear. Yield from your collateral automatically pays off your loan.
                    </p>

                    {/* Stats Row - Wraps on mobile */}
                    <div className="flex flex-wrap gap-6 md:gap-8 pt-2">
                        <div>
                            <div className="text-xl md:text-3xl font-display font-semibold text-white tracking-tight">
                                {isTVLLoading ? "..." : formatTVL(tvlData.totalTVL)}
                            </div>
                            <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest">Total TVL</div>
                        </div>
                        <div>
                            <div className="text-xl md:text-3xl font-display font-semibold text-[#C3F53C] tracking-tight">
                                {isStatsLoading ? "..." : totalVaults.toLocaleString()}
                            </div>
                            <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest">Active Vaults</div>
                        </div>
                        <div>
                            <div className="text-xl md:text-3xl font-display font-semibold text-white tracking-tight">
                                {isStatsLoading ? "..." : autoRepayments.toLocaleString()}
                            </div>
                            <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest">Auto-Repayments</div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-2 md:pt-4 relative">
                        <PremiumButton
                            className="px-8 md:px-14 py-3 md:py-4 text-sm md:text-base font-medium"
                            onClick={() => {
                                if (isConnected) {
                                    router.push('/dashboard');
                                } else {
                                    setShowWalletPrompt(true);
                                    setTimeout(() => setShowWalletPrompt(false), 3000);
                                }
                            }}
                        >
                            Launch App <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                        </PremiumButton>

                        {/* Wallet Connection Prompt Popup */}
                        {showWalletPrompt && (
                            <div className="absolute -top-16 left-0 right-0 md:right-auto w-full md:w-auto z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#C3F53C]/10 border border-[#C3F53C]/30 backdrop-blur-xl shadow-lg">
                                    <Wallet className="w-5 h-5 text-[#C3F53C]" />
                                    <span className="text-sm font-medium text-white">Please connect your wallet first</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Visual - Hidden on mobile, shown on lg+ */}
                <div className="hidden lg:flex relative w-full h-[600px] items-center justify-center pointer-events-none select-none">
                    <svg
                        ref={svgRef}
                        viewBox="100 50 600 500"
                        className="w-full h-full drop-shadow-2xl"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <defs>
                            {/* --- ADVANCED GRADIENTS (CONTRAST BOOSTED) --- */}
                            <linearGradient id="metal-base" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3a3a3a" />
                                <stop offset="20%" stopColor="#4a4a4a" />
                                <stop offset="50%" stopColor="#222" />
                                <stop offset="100%" stopColor="#1a1a1a" />
                            </linearGradient>

                            <linearGradient id="metal-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#555" />
                                <stop offset="100%" stopColor="#222" />
                            </linearGradient>

                            <linearGradient id="glass-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#444" stopOpacity="0.4" />
                                <stop offset="50%" stopColor="#222" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#000" stopOpacity="0.9" />
                            </linearGradient>

                            <linearGradient id="green-glow-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#C3F53C" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#b2e035" stopOpacity="0.2" />
                            </linearGradient>

                            {/* --- FILTERS --- */}
                            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feColorMatrix type="matrix" values="1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 1 0" in="coloredBlur" result="coloredBlurAlpha" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            <filter id="soft-shadow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="6" result="blur" />
                                <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" />
                            </filter>
                        </defs>

                        {/* --- UNIFIED FLOATING GROUP (Hardware + Wires move together) --- */}
                        <g className="iso-whole-group">
                            {/* --- CONNECTING DATA LINES (Background Layer) --- */}
                            <g className="wires opacity-30">
                                {/* Wire 1: Server -> Hub */}
                                <path d="M 600,290 C 530,290 530,310 480,350" fill="none" stroke="#444" strokeWidth="1.5" strokeDasharray="4 4" />
                                <circle className="data-packet" r="3" fill="#C3F53C" filter="url(#neon-glow)">
                                    <animateMotion dur="3s" repeatCount="indefinite" path="M 600,290 C 530,290 530,310 480,350" />
                                </circle>

                                {/* Wire 2: Chart -> Hub */}
                                <path d="M 500,220 C 480,240 460,300 440,330" fill="none" stroke="#444" strokeWidth="1.5" strokeDasharray="4 4" />
                                <circle className="data-packet" r="3" fill="#C3F53C" filter="url(#neon-glow)">
                                    <animateMotion dur="4s" repeatCount="indefinite" path="M 500,220 C 480,240 460,300 440,330" />
                                </circle>

                                {/* Wire 3: Hub -> Wallet */}
                                <path d="M 350,390 C 300,410 280,430 260,450" fill="none" stroke="#444" strokeWidth="1.5" strokeDasharray="4 4" />
                            </g>


                            {/* --- 1. SERVER TOWER (Right) --- */}
                            <g transform="translate(600, 260)">
                                {/* Shadow */}
                                <ellipse cx="0" cy="110" rx="35" ry="12" fill="#000" filter="url(#soft-shadow)" opacity="0.7" />

                                {/* Main Body */}
                                <path d="M-30,0 L-30,100 A30,12 0 0,0 30,100 L30,0 A30,12 0 0,1 -30,0" fill="url(#metal-base)" stroke="#333" strokeOpacity="0.5" />

                                {/* Top Cap */}
                                <ellipse cx="0" cy="0" rx="30" ry="12" fill="#222" stroke="#444" strokeWidth="1" />
                                <ellipse cx="0" cy="0" rx="20" ry="8" fill="#111" stroke="#333" strokeWidth="0.5" />

                                {/* Bottom Cap Rim */}
                                <ellipse cx="0" cy="100" rx="30" ry="12" fill="#111" stroke="#222" />

                                {/* Rack Inserts (Detailed) */}
                                {[20, 35, 50, 65, 80].map((y, i) => (
                                    <g key={i}>
                                        <line x1="-22" y1={y} x2="22" y2={y} stroke="#000" strokeWidth="3" opacity="0.6" />
                                        <line x1="-22" y1={y + 1} x2="22" y2={y + 1} stroke="#333" strokeWidth="0.5" opacity="0.3" />
                                    </g>
                                ))}

                                {/* Active LEDs */}
                                <g transform="translate(0, 80)">
                                    <circle cx="-12" cy="0" r="1.5" fill="#C3F53C" filter="url(#neon-glow)" />
                                    <circle cx="-6" cy="0" r="1.5" fill="#657f18" />
                                    <circle cx="0" cy="0" r="1.5" fill="#657f18" />
                                    <circle cx="6" cy="0" r="1.5" fill="#C3F53C" filter="url(#neon-glow)">
                                        <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
                                    </circle>
                                </g>
                            </g>

                            {/* --- 2. ANALYTICS BLOCK (Top Center) --- */}
                            <g transform="translate(500, 150)">
                                {/* Shadow */}
                                <path d="M-10,60 L20,70 L60,50 L30,40 Z" fill="#000" filter="url(#soft-shadow)" opacity="0.5" />

                                {/* Base Block */}
                                <path d="M0,0 L40,15 L40,65 L0,50 Z" fill="#1a1a1a" stroke="#333" />
                                <path d="M0,50 L-15,40 L-15,-10 L0,0 Z" fill="#222" />
                                <path d="M-15,-10 L0,-20 L40,-5 L40,15 L0,0 Z" fill="#2a2a2a" stroke="#333" />

                                {/* Green Highlight Top */}
                                <path d="M-15,-10 L0,-20 L40,-5 L0,0 Z" fill="#C3F53C" opacity="0.1" />

                                {/* Rising Bar Graph */}
                                <g transform="translate(10, -5)">
                                    <path d="M0,0 L10,5 L10,35 L0,30 Z" fill="#657f18" opacity="0.5" />
                                    <path d="M0,30 L-8,25 L-8,-5 L0,0 Z" fill="#4c6600" opacity="0.5" />
                                    <path d="M-8,-5 L0,-10 L10,-5 L0,0 Z" fill="#C3F53C" />
                                    {/* Floating Indicator */}
                                    <circle cx="1" cy="-15" r="2" fill="#C3F53C" filter="url(#neon-glow)" className="iso-float-mini" />
                                </g>
                            </g>

                            {/* --- 3. MAIN HUB (Center Glass Tablet) --- */}
                            <g transform="translate(400, 320)">
                                {/* Realistic Shadow */}
                                <ellipse cx="0" cy="80" rx="100" ry="30" fill="#000" opacity="0.6" filter="url(#soft-shadow)" />

                                {/* Bottom Chassis (Dark Metal) */}
                                <path d="M-130,0 L0,50 L130,0 L0,-50 Z" fill="#0f0f0f" stroke="#222" strokeWidth="1" />
                                <path d="M-130,0 L0,50 L0,65 L-130,15 Z" fill="#151515" /> {/* Left Side */}
                                <path d="M130,0 L0,50 L0,65 L130,15 Z" fill="#0a0a0a" />  {/* Right Side */}

                                {/* Inner Tech Layer */}
                                <path d="M-120,-5 L0,40 L120,-5 L0,-50 Z" fill="#1c1c1c" />
                                <path d="M-80,0 L0,30 L80,0 L0,-30 Z" fill="none" stroke="#2a2a2a" strokeWidth="1" />

                                {/* Top Glass Surface */}
                                <g transform="translate(0, -10)">
                                    <path d="M-130,0 L0,50 L130,0 L0,-50 Z" fill="url(#glass-gradient)" stroke="#C3F53C" strokeWidth="0.5" opacity="0.5" />

                                    {/* Holographic UI Elements */}
                                    <path d="M-40,10 L0,25 L40,10" fill="none" stroke="#C3F53C" strokeWidth="1.5" opacity="0.6" filter="url(#neon-glow)" />
                                    <circle cx="0" cy="25" r="3" fill="#C3F53C" filter="url(#neon-glow)" />

                                    <line x1="-90" y1="-10" x2="-60" y2="2" stroke="#C3F53C" strokeWidth="1" opacity="0.3" strokeDasharray="2 2" />
                                    <line x1="90" y1="-10" x2="60" y2="2" stroke="#C3F53C" strokeWidth="1" opacity="0.3" strokeDasharray="2 2" />
                                </g>

                                {/* Floating Hologram Logo - Odyssée Brand */}
                                <g transform="translate(0, -35)" className="iso-float-mini">
                                    <path d="M0,0 L20,10 L0,20 L-20,10 Z" fill="#C3F53C" opacity="0.2" className="pulse-circle" />
                                    <text x="0" y="10" textAnchor="middle" fill="#C3F53C" fontSize="18" fontFamily="sans-serif" fontWeight="bold" transform="skewY(10) rotate(-10)">Ō</text>
                                </g>
                            </g>

                            {/* --- 4. DIGITAL LEDGER (Bottom Left) --- */}
                            <g transform="translate(250, 430)">
                                {/* Shadow */}
                                <path d="M-10,30 L50,55 L30,-10 L-25,-30 Z" fill="#000" filter="url(#soft-shadow)" opacity="0.4" />

                                {/* Back Cover */}
                                <path d="M0,0 L50,20 L50,-50 L0,-70 Z" fill="#111" stroke="#333" />

                                {/* Spine */}
                                <path d="M0,-70 L-10,-60 L-10,10 L0,0 Z" fill="#222" stroke="#111" />

                                {/* Front Cover (Open) */}
                                <path d="M-10,10 L-60,30 L-60,-40 L-10,-60 Z" fill="#151515" stroke="#333" />

                                {/* Pages (Stacked) */}
                                <path d="M0,0 L-55,25 L-55,-45 L0,-70 Z" fill="#e5e5e5" opacity="0.1" />
                                <path d="M-2,-2 L-57,23 L-57,-47 L-2,-72 Z" fill="#e5e5e5" opacity="0.05" />

                                {/* Digital Content */}
                                <line x1="-45" y1="-35" x2="-15" y2="-48" stroke="#C3F53C" strokeWidth="1.5" opacity="0.8" />
                                <line x1="-45" y1="-25" x2="-15" y2="-38" stroke="#C3F53C" strokeWidth="1.5" opacity="0.5" />
                                <line x1="-45" y1="-15" x2="-25" y2="-23" stroke="#C3F53C" strokeWidth="1.5" opacity="0.3" />

                                {/* Security Badge */}
                                <circle cx="25" cy="-25" r="10" fill="#111" stroke="#333" />
                                <path d="M25,-32 L30,-22 L20,-22 Z" fill="#C3F53C" filter="url(#neon-glow)" />
                            </g>
                        </g>

                    </svg>
                </div>
            </div>



            {/* Trusted By Section - Relative on mobile, Absolute on desktop */}
            <div className="relative lg:absolute lg:bottom-0 left-0 w-full z-20 mt-8 lg:mt-0">
                <TrustedBy />
            </div>
        </section>
    );
}

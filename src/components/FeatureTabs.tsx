"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, PenTool, FileText, Zap, ChevronRight, Layers, Cpu, Database, Share2, Search, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// --- CONTENT DATA ---
const FEATURES = [
    {
        id: "spec-gen",
        label: "Spec generation",
        icon: Zap,
        title: "Intelligent Spec Generation",
        subtitle: "Requirements to Logic",
        description: "Transform abstract requirements into mathematically verifiable protocol specifications. Our engine parses natural language into rigid logic gates, ensuring your protocol behaves exactly as intended before a single line of code is written.",
        accent: "#10b981", // Emerald
        gradient: "from-emerald-500/10 to-teal-500/5",
        visual: (
            <div className="w-full h-full relative flex items-center justify-center p-8 overflow-hidden font-mono antialiased">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                {/* Floating HUD Elements */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="absolute top-8 left-8 p-3 rounded-lg bg-black/80 border border-emerald-500/20 backdrop-blur-md flex items-center gap-3 z-20 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-[pulse_2s_infinite]" />
                    <span className="text-[10px] text-emerald-400 tracking-wider">NLP_ENGINE_ACTIVE</span>
                </motion.div>

                {/* Floating Code Card 1 (Input) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="absolute top-20 left-12 w-64 p-4 rounded-xl bg-[#0a0a0a] border border-white/10 shadow-2xl z-10"
                >
                    <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
                        <div className="w-6 h-6 rounded bg-emerald-500/20 flex items-center justify-center">
                            <span className="text-xs text-emerald-400">IN</span>
                        </div>
                        <span className="text-xs text-gray-400">requirement.txt</span>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] text-gray-500">"Create a vault that accepts WETH and auto-rebalances when LTV {'>'} 75%."</p>
                    </div>
                </motion.div>

                {/* Central Processor */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.1, opacity: 0 }}
                    className="relative z-0 w-32 h-32 rounded-full border border-emerald-500/20 flex items-center justify-center"
                >
                    <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full" />
                    <Zap className="w-10 h-10 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                    <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]">
                        <circle cx="64" cy="64" r="63" stroke="url(#gradient-emerald)" strokeWidth="1" fill="none" strokeDasharray="10 10" opacity="0.5" />
                    </svg>
                </motion.div>

                {/* Floating Spec Card (Output) */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="absolute bottom-16 right-12 w-72 p-5 rounded-xl bg-[#0c0c0c] border border-emerald-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-20"
                >
                    <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                        <span className="text-xs text-emerald-400 font-bold">GENERATED SPEC</span>
                        <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    <div className="font-mono text-[10px] space-y-1 text-gray-400">
                        <div><span className="text-purple-400">const</span> <span className="text-white">MAX_LTV</span> = <span className="text-orange-300">7500</span>;</div>
                        <div><span className="text-purple-400">function</span> <span className="text-blue-300">checkRebalance</span>() {"{"}</div>
                        <div className="pl-2">if (<span className="text-white">ltv</span> {'>'} <span className="text-white">MAX_LTV</span>) return <span className="text-emerald-400">true</span>;</div>
                        <div>{"}"}</div>
                    </div>
                </motion.div>

                {/* Laser Connector */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                        <linearGradient id="gradient-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                            <stop offset="50%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <motion.path
                        d="M 280 180 Q 400 250 520 320"
                        stroke="url(#gradient-emerald)"
                        strokeWidth="1.5"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                    />
                </svg>
            </div>
        )
    },
    {
        id: "design-specs",
        label: "Design specs",
        icon: PenTool,
        title: "System Architecture Mapping",
        subtitle: "Visual Infrastructure",
        description: "Visualize complex data flows with auto-generated topography. Map component interactions across distributed ledgers in real-time with our interactive ecosystem explorer.",
        accent: "#3b82f6", // Blue
        gradient: "from-blue-500/10 to-indigo-500/5",
        visual: (
            <div className="w-full h-full relative flex items-center justify-center [perspective:1000px] overflow-hidden">
                {/* 3D Grid Floor */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:40px_40px] [transform:rotateX(60deg)_scale(2)] opacity-60 origin-bottom" />

                {/* Central Core */}
                <motion.div
                    initial={{ scale: 0, rotateY: 90 }} animate={{ scale: 1, rotateY: 0 }} exit={{ scale: 0, rotateY: -90 }}
                    transition={{ type: "spring", stiffness: 50 }}
                    className="relative w-32 h-32 bg-black/80 rounded-2xl border border-blue-500/50 shadow-[0_0_60px_rgba(59,130,246,0.2)] flex flex-col items-center justify-center backdrop-blur-xl z-20"
                >
                    <Cpu className="w-12 h-12 text-blue-400 mb-2" />
                    <span className="text-[10px] font-mono text-blue-200">CORE_VAULT</span>

                    {/* Ring */}
                    <div className="absolute inset-0 rounded-2xl border border-blue-400/20 animate-ping opacity-20" />
                </motion.div>

                {/* Orbiting Satellites */}
                {[0, 120, 240].map((deg, i) => (
                    <motion.div
                        key={i}
                        className="absolute flex flex-col items-center gap-2 z-10"
                        animate={{
                            rotate: [0, 360],
                            translateX: [140, 140], // Keep radius
                        }}
                        transition={{ duration: 20, ease: "linear", repeat: Infinity }}
                        style={{ transformOrigin: "center center" }} // Incorrect for orbiting around center container, fixed below via absolute positioning hack
                    >
                        {/* Correct orbit logic using parent rotation container or trigonometry. Using absolute positions for simplicity in this constrained view */}
                        <motion.div
                            className="w-12 h-12 bg-[#0f0f0f] border border-white/10 rounded-lg flex items-center justify-center shadow-lg"
                            initial={{ x: 0, y: 0, opacity: 0 }}
                            animate={{
                                x: Math.cos(deg * (Math.PI / 180)) * 160,
                                y: Math.sin(deg * (Math.PI / 180)) * 80,
                                opacity: 1
                            }}
                            transition={{ duration: 1, delay: i * 0.2 }}
                        >
                            {i === 0 ? <Database className="w-5 h-5 text-gray-400" /> : i === 1 ? <Search className="w-5 h-5 text-gray-400" /> : <Share2 className="w-5 h-5 text-gray-400" />}
                        </motion.div>
                        {/* Connecting Line to Center */}
                        <svg className="absolute top-1/2 left-1/2 w-[200px] h-[200px] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                            <line x1="100" y1="100" x2={100 + Math.cos(deg * (Math.PI / 180)) * 160} y2={100 + Math.sin(deg * (Math.PI / 180)) * 80} stroke="#3b82f6" strokeWidth="1" />
                        </svg>
                    </motion.div>
                ))}
            </div>
        )
    },
    {
        id: "code-specs",
        label: "Code specs",
        icon: FileText,
        title: "Verified Contract Export",
        subtitle: "Audited Production Code",
        description: "Zero-error translation from spec to solidity. Export production-ready styling compatible with Foundry and Hardhat, pre-audited for common vulnerabilities.",
        accent: "#a855f7", // Purple
        gradient: "from-purple-500/10 to-pink-500/5",
        visual: (
            <div className="w-full h-full relative bg-[#080808] flex flex-col font-mono text-xs overflow-hidden">
                {/* Editor Header */}
                <div className="h-9 border-b border-white/5 bg-[#0f0f0f] flex items-center px-4 justify-between">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#2a2a2a]" />
                        <div className="w-3 h-3 rounded-full bg-[#2a2a2a]" />
                        <div className="w-3 h-3 rounded-full bg-[#2a2a2a]" />
                    </div>
                    <div className="text-purple-400/80">Vault.sol</div>
                </div>

                {/* Code Content */}
                <div className="flex-1 p-6 relative">
                    <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-white/5" /> {/* Gutter Line */}

                    <motion.div className="space-y-1.5 ml-4"
                        initial="hidden" animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.1 } }
                        }}
                    >
                        <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="text-gray-500">// SPDX-License-Identifier: MIT</motion.div>
                        <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="text-purple-400">pragma solidity ^0.8.20;</motion.div>
                        <br />
                        <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
                            <span className="text-blue-400">contract</span> OdysseeVault <span className="text-blue-400">is</span> IVault {"{"}
                        </motion.div>
                        <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="pl-4">
                            <span className="text-purple-400">using</span> SafeERC20 <span className="text-purple-400">for</span> IERC20;
                        </motion.div>
                        <br />
                        <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="pl-4">
                            <span className="text-gray-500">/// @notice Deposit assets</span>
                        </motion.div>
                        <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="pl-4">
                            <span className="text-purple-400">function</span> <span className="text-yellow-200">deposit</span>(<span className="text-orange-300">uint256</span> amount) <span className="text-purple-400">external</span> {"{"}
                        </motion.div>
                        <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="pl-8 text-white/50">
                            /* Logic auto-injected from spec */
                        </motion.div>
                        <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="pl-4 text-white">{"}"}</motion.div>
                        <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className="text-white">{"}"}</motion.div>
                    </motion.div>

                    {/* Success Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5 }}
                        className="absolute bottom-6 right-6 px-3 py-1.5 bg-green-900/20 border border-green-500/30 rounded text-green-400 flex items-center gap-2 backdrop-blur-md"
                    >
                        <Check className="w-3 h-3" /> 0 Vulnerabilities Found
                    </motion.div>
                </div>
            </div>
        )
    }
];

export function FeatureTabs() {
    const [activeTab, setActiveTab] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const DURATION = 8000; // Slower, more deliberate cycle

    // --- MOUSE SPOTLIGHT EFFECT ---
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // --- TIMER LOGIC ---
    useEffect(() => {
        let startTime = Date.now();
        let pausedTime = 0;

        const tick = () => {
            if (isHovered) {
                startTime = Date.now() - (progress / 100 * DURATION); // Pause logic
                return;
            }

            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / DURATION) * 100, 100);
            setProgress(newProgress);

            if (elapsed >= DURATION) {
                setActiveTab((prev) => (prev + 1) % FEATURES.length);
                startTime = Date.now();
                setProgress(0);
            }

            intervalRef.current = setTimeout(tick, 16);
        };

        intervalRef.current = setTimeout(tick, 16);
        return () => { if (intervalRef.current) clearTimeout(intervalRef.current); };
    }, [activeTab, isHovered]);

    return (
        <section ref={containerRef} className="relative w-full py-40 bg-[#050505] text-white overflow-hidden group">

            {/* --- ADVENT GRADE BACKGROUND --- */}
            {/* Dynamic Spotlight */}
            <div
                className="absolute w-[800px] h-[800px] bg-white/[0.03] rounded-full blur-[100px] pointer-events-none transition-transform duration-75"
                style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)' }}
            />
            {/* Tab Color Ambient Glow */}
            <div
                className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full blur-[120px] transition-colors duration-1000 opacity-20 pointer-events-none",
                    activeTab === 0 ? "bg-emerald-600" : activeTab === 1 ? "bg-blue-600" : "bg-purple-600"
                )}
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* --- HEADER --- */}
                <div className="mb-20 space-y-4">
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-medium tracking-tight bg-gradient-to-r from-white via-white/80 to-transparent bg-clip-text text-transparent">
                        Engineered for Precision.
                    </h2>
                    <p className="text-xl text-gray-500 max-w-xl font-light">
                        The world's most advanced RWA protocol generator. <br />From abstract spec to verified contract in seconds.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* --- LEFT: TAB CONTROLS --- */}
                    <div className="lg:col-span-4 flex flex-col gap-4">
                        {FEATURES.map((feature, index) => {
                            const isActive = activeTab === index;
                            return (
                                <button
                                    key={feature.id}
                                    onClick={() => { setActiveTab(index); setProgress(0); }}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    className={cn(
                                        "relative group/btn p-6 rounded-2xl text-left transition-all duration-500 border overflow-hidden",
                                        isActive
                                            ? "bg-white/5 border-white/10 shadow-[inner_0_0_20px_rgba(255,255,255,0.05)]"
                                            : "bg-transparent border-transparent hover:bg-white/[0.02]"
                                    )}
                                >
                                    {/* Progress Bar Background (Fill) */}
                                    {isActive && (
                                        <div
                                            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50 transition-all duration-300"
                                            style={{ width: `${progress}%` }}
                                        />
                                    )}

                                    <div className="flex items-center gap-4 mb-2">
                                        <div className={cn("p-2 rounded-lg transition-colors duration-500", isActive ? "bg-white/10" : "bg-white/5 group-hover/btn:bg-white/10")}>
                                            <feature.icon className={cn("w-5 h-5 transition-colors duration-500", isActive ? "text-white" : "text-gray-500")} />
                                        </div>
                                        <span className={cn("font-medium transition-colors duration-300", isActive ? "text-white" : "text-gray-500")}>
                                            {feature.label}
                                        </span>
                                    </div>

                                    <div className={cn("pl-[52px] text-sm leading-relaxed transition-all duration-500", isActive ? "text-gray-400 opacity-100 max-h-20" : "text-gray-600 opacity-0 max-h-0 overflow-hidden")}>
                                        {feature.subtitle}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* --- RIGHT: VISUAL DISPLAY (BENTO FEATURE) --- */}
                    <div className="lg:col-span-8 h-[600px]">
                        <div className="relative w-full h-full rounded-3xl border border-white/10 bg-[#080808] overflow-hidden shadow-2xl">
                            {/* Top Gloss */}
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none" />

                            {/* Dynamic Content */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    className="w-full h-full"
                                    initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                    exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                                    transition={{ duration: 0.7, ease: "circOut" }}
                                >
                                    {FEATURES[activeTab].visual}

                                    {/* Description Overlay (Bottom) */}
                                    <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black via-black/80 to-transparent z-30">
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                                            className="max-w-2xl"
                                        >
                                            <h3 className="text-2xl text-white font-display mb-2">{FEATURES[activeTab].title}</h3>
                                            <p className="text-gray-400 text-sm leading-relaxed">{FEATURES[activeTab].description}</p>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Corner Accents */}
                            <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/30" />
                            <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/30" />
                            <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/30" />
                            <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/30" />
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

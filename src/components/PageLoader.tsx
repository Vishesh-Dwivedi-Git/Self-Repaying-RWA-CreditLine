"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SHUTTER_COLUMNS = 5;

export const PageLoader = () => {
    const [loading, setLoading] = useState(true);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        // Counter Animation
        const interval = setInterval(() => {
            setCounter((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setLoading(false), 800); // Wait for scramble completion
                    return 100;
                }
                const increment = Math.floor(Math.random() * 3) + 1; // Slower, more "technical" count
                return Math.min(prev + increment, 100);
            });
        }, 40);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence mode="wait">
            {loading && (
                <div className="fixed inset-0 z-[9999] flex pointer-events-none">
                    {/* --- BACKGROUND SHUTTERS (The Veil) --- */}
                    {[...Array(SHUTTER_COLUMNS)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="relative h-full bg-[#050505] border-r border-[#1a1a1a]"
                            style={{ width: `${100 / SHUTTER_COLUMNS}%` }}
                            initial={{ y: 0 }}
                            exit={{
                                y: "-100%",
                                transition: {
                                    duration: 0.8,
                                    ease: [0.76, 0, 0.24, 1],
                                    delay: 0.05 * i, // Staggered wave effect
                                },
                            }}
                        >
                            {/* Subtle Grid Pattern per column */}
                            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:100%_40px]" />
                        </motion.div>
                    ))}

                    {/* --- CONTENT LAYER (Absolute Centered) --- */}
                    <motion.div
                        className="absolute inset-0 flex flex-col items-center justify-center z-50 text-white"
                        exit={{ opacity: 0, transition: { duration: 0.3 } }}
                    >
                        {/* Abstract Radar/Core */}
                        <div className="w-64 h-64 relative flex items-center justify-center mb-8">
                            <div className="absolute inset-0 border border-[#C3F53C]/20 rounded-full animate-[spin_4s_linear_infinite]" />
                            <div className="absolute inset-4 border border-[#C3F53C]/10 rounded-full animate-[spin_8s_linear_infinite_reverse]" />
                            <div className="w-2 h-2 bg-[#C3F53C] shadow-[0_0_20px_#C3F53C] rounded-full" />

                            {/* Scanning Line */}
                            <div className="absolute inset-0 w-full h-full animate-[spin_2s_linear_infinite] opacity-30">
                                <div className="h-[50%] w-[1px] bg-gradient-to-t from-[#C3F53C] to-transparent mx-auto" />
                            </div>
                        </div>

                        {/* Digital Scramble Counter */}
                        <div className="flex flex-col items-center">
                            <h1 className="text-7xl md:text-9xl font-mono font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
                                {counter < 100 ? `0${counter}`.slice(-3) : "100"}%
                            </h1>
                            <div className="flex items-center gap-3 mt-4">
                                <span className="w-2 h-2 bg-[#C3F53C] animate-pulse" />
                                <span className="text-xs font-mono text-[#C3F53C] tracking-[0.3em] uppercase">
                                    {counter < 100 ? "Initializing_Odyssee" : "System_Ready"}
                                </span>
                            </div>
                        </div>

                        {/* Bottom Technical Data */}
                        <div className="absolute bottom-12 left-0 w-full px-12 flex justify-between items-end opacity-40 font-mono text-[10px] uppercase tracking-widest">
                            <div className="flex flex-col gap-1">
                                <span>Ref: XJ-992</span>
                                <span>Sec: Level 5</span>
                            </div>
                            <div className="flex flex-col gap-1 text-right">
                                <span>Node: Mantle-1</span>
                                <span>Status: {counter < 100 ? "Decrypting..." : "Online"}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

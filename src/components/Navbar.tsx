"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";
import { Menu, X, ArrowUpRight, Wallet } from "lucide-react";
import { useAccount } from "wagmi";

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [showWalletPrompt, setShowWalletPrompt] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { isConnected } = useAccount();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Protocol", href: "/protocol" },
        { name: "Solutions", href: "/solutions" },
        { name: "Developers", href: "/developers" },
    ];

    return (
        <>
            {/* --- DESKTOP FLOATING ISLAND --- */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="fixed top-6 left-0 w-full z-50 flex justify-center px-4 pointer-events-none"
            >
                <div
                    className={cn(
                        "pointer-events-auto flex items-center justify-between p-2 rounded-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] backdrop-blur-xl border border-white/10 w-[95%] md:w-[800px]",
                        scrolled
                            ? "bg-[#050505]/80 shadow-2xl border-white/15"
                            : "bg-[#0a0a0a]/50 shadow-lg"
                    )}
                >
                    {/* 1. Logo (Simple & Clean) */}
                    <Link href="/" className="flex items-center gap-3 pl-4 pr-2 group">
                        <div className="relative w-8 h-8 rounded-full bg-white flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-black group-hover:bg-emerald-500 transition-colors duration-300" />
                        </div>
                        <span className="font-display font-medium text-white tracking-tight text-lg">Odyssée</span>
                    </Link>

                    {/* 2. Navigation (Clean Pills) */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link, index) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="relative px-5 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-300 rounded-full"
                            >
                                {hoveredIndex === index && (
                                    <motion.div
                                        layoutId="nav-bg"
                                        className="absolute inset-0 bg-white/10 rounded-full"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{link.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* 3. Actions */}
                    <div className="flex items-center gap-2 pl-2">
                        <ConnectWalletButton />

                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* --- MOBILE MENU (Premium Dropdown - Extends from Navbar) --- */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed top-20 left-0 right-0 z-[60] px-4 md:hidden"
                    >
                        <div className="bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                            {/* Menu Header */}
                            <div className="flex justify-between items-center p-4 border-b border-white/5">
                                <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">Navigation</span>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#C3F53C]/10 flex items-center justify-center text-gray-400 hover:text-[#C3F53C] transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Nav Links */}
                            <div className="p-2">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.05 + i * 0.05 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={cn(
                                                "flex items-center justify-between p-4 rounded-xl text-base font-medium transition-all duration-200",
                                                pathname === link.href
                                                    ? "bg-[#C3F53C]/10 text-[#C3F53C]"
                                                    : "text-white hover:bg-white/5 hover:text-[#C3F53C]"
                                            )}
                                        >
                                            <span>{link.name}</span>
                                            <ArrowUpRight className={cn(
                                                "w-4 h-4 transition-transform",
                                                pathname === link.href ? "text-[#C3F53C]" : "text-gray-500"
                                            )} />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Footer Action */}
                            <div className="p-4 border-t border-white/5 relative">
                                <button
                                    onClick={() => {
                                        if (isConnected) {
                                            setMobileMenuOpen(false);
                                            router.push('/vault');
                                        } else {
                                            setShowWalletPrompt(true);
                                            setTimeout(() => setShowWalletPrompt(false), 3000);
                                        }
                                    }}
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#C3F53C] text-black font-medium hover:bg-[#d4ff5c] transition-colors"
                                >
                                    Launch App
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>

                                {/* Wallet Prompt */}
                                {showWalletPrompt && (
                                    <div className="absolute -top-14 left-4 right-4 z-50">
                                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#C3F53C]/10 border border-[#C3F53C]/30 backdrop-blur-xl shadow-lg">
                                            <Wallet className="w-5 h-5 text-[#C3F53C]" />
                                            <span className="text-sm font-medium text-white">Connect wallet first</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop for mobile menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm md:hidden"
                    />
                )}
            </AnimatePresence>
        </>
    );
};

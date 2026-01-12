"use client";

import React from "react";
import Link from "next/link";
import { Twitter, Github, Disc, Send } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-black text-white border-t border-white/10 pt-20 pb-10 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

                {/* Brand Column */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-black" />
                        </div>
                        <span className="text-xl font-display font-medium">Odyssée</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                        Self-repaying credit lines on Mantle Network. Deposit mETH or fBTC, borrow stablecoins, and let yield pay off your debt automatically.
                    </p>
                    <div className="flex gap-4">
                        {[Twitter, Github, Disc].map((Icon, i) => (
                            <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#C3F53C]/10 hover:border-[#C3F53C]/30 hover:text-[#C3F53C] text-gray-400 transition-all">
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Links Column 1 */}
                <div>
                    <h4 className="font-medium mb-6">Protocol</h4>
                    <ul className="space-y-4 text-sm text-gray-500">
                        {["Vault Dashboard", "Yield Calculator", "Health Monitor", "Liquidation Auctions", "Documentation"].map(item => (
                            <li key={item}><Link href="#" className="hover:text-[#C3F53C] transition-colors">{item}</Link></li>
                        ))}
                    </ul>
                </div>

                {/* Links Column 2 */}
                <div>
                    <h4 className="font-medium mb-6">Security</h4>
                    <ul className="space-y-4 text-sm text-gray-500">
                        {["CertiK Audit", "Trail of Bits", "Bug Bounty", "Oracle Feeds", "Smart Contracts"].map(item => (
                            <li key={item}><Link href="#" className="hover:text-[#C3F53C] transition-colors">{item}</Link></li>
                        ))}
                    </ul>
                </div>

                {/* Newsletter / Contact */}
                <div>
                    <h4 className="font-medium mb-6">Stay Updated</h4>
                    <form className="space-y-4">
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
                            />
                            <button type="submit" className="absolute right-2 top-2 p-1.5 bg-white text-black rounded hover:bg-gray-200 transition-colors">
                                <Send className="w-3 h-3" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Get protocol updates, yield strategies, and early access to new features.
                        </p>
                    </form>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                <div>© 2024 Odyssée Protocol. All rights reserved.</div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    All Systems Operational
                </div>
            </div>
        </footer>
    );
}

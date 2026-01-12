"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/Button";
import { ChevronRight, ChevronDown, Wallet, LogOut, Copy, Check, Vault } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { PremiumButton } from "@/components/ui/PremiumButton";

export function ConnectWalletButton() {
    const { address, isConnected } = useAccount();
    const { connect, connectors, isPending } = useConnect();
    const { disconnect } = useDisconnect();
    const [showDropdown, setShowDropdown] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const truncateAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    // If connected, show address with dropdown
    if (isConnected && address) {
        return (
            <div className="flex items-center gap-3">
                {/* Vault Link */}
                <Link
                    href="/vault"
                    className="px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all flex items-center gap-2"
                >
                    <Vault className="w-4 h-4" />
                    Vault
                </Link>

                {/* Wallet Button */}
                <div className="relative">
                    <Button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="rounded-full bg-black/80 backdrop-blur-md text-white border border-white/30 px-4 py-2 h-auto text-sm font-medium tracking-wide transition-all shadow-[inset_0_0_15px_rgba(255,255,255,0.1),0_0_15px_rgba(255,255,255,0.1)] hover:border-white/60 hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.2),0_0_30px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-95"
                    >
                        <Wallet className="w-4 h-4 mr-2" />
                        {truncateAddress(address)}
                        <ChevronDown className={cn("w-3.5 h-3.5 ml-2 transition-transform", showDropdown && "rotate-180")} />
                    </Button>

                    {/* Dropdown */}
                    {showDropdown && (
                        <div className="absolute top-full right-0 mt-2 w-48 rounded-xl bg-black/90 backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden z-50">
                            <button
                                onClick={handleCopy}
                                className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                {copied ? "Copied!" : "Copy Address"}
                            </button>
                            <button
                                onClick={() => { disconnect(); setShowDropdown(false); }}
                                className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/10 hover:text-red-300 transition-colors flex items-center gap-2 border-t border-white/10"
                            >
                                <LogOut className="w-4 h-4" />
                                Disconnect
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Not connected - show connect options
    return (
        <div className="relative">
            <PremiumButton
                onClick={() => setShowDropdown(!showDropdown)}
                disabled={isPending}
                className="px-6 py-2 h-auto text-sm font-medium hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
                {isPending ? "Connecting..." : "Connect Wallet"}
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </PremiumButton>

            {/* Wallet Selection Dropdown */}
            {showDropdown && !isPending && (
                <div className="absolute top-full right-0 mt-2 w-56 rounded-xl bg-black/90 backdrop-blur-xl border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden z-50">
                    <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Select Wallet</p>
                    </div>
                    {connectors.map((connector) => (
                        <button
                            key={connector.uid}
                            onClick={() => {
                                connect({ connector });
                                setShowDropdown(false);
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center gap-3"
                        >
                            <Wallet className="w-4 h-4" />
                            {connector.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

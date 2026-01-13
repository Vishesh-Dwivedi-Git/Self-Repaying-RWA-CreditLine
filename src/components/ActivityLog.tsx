"use client";

import React, { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { formatEther, formatUnits, parseAbiItem } from "viem";
import { CONTRACTS } from "@/lib/contracts";
import { Clock, TrendingDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityEvent {
    id: string;
    type: "auto-repay" | "vault-created" | "vault-closed";
    timestamp: Date;
    yieldAmount?: string;
    debtReduced?: string;
    collateral?: string;
    transactionHash: string;
}

interface ActivityLogProps {
    userAddress?: `0x${string}`;
    maxEvents?: number;
}

export function ActivityLog({ userAddress, maxEvents = 10 }: ActivityLogProps) {
    const [events, setEvents] = useState<ActivityEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const publicClient = usePublicClient();

    useEffect(() => {
        if (!userAddress || !publicClient) {
            setIsLoading(false);
            return;
        }

        async function fetchEvents() {
            try {
                // Fetch AutoYieldApplied events
                const autoRepayLogs = await publicClient!.getLogs({
                    address: CONTRACTS.VAULT_MANAGER as `0x${string}`,
                    event: parseAbiItem("event AutoYieldApplied(address indexed user, uint256 yieldAmount, uint256 debtReduced)"),
                    args: { user: userAddress },
                    fromBlock: "earliest",
                    toBlock: "latest",
                });

                // Fetch VaultCreated events
                const vaultCreatedLogs = await publicClient!.getLogs({
                    address: CONTRACTS.VAULT_MANAGER as `0x${string}`,
                    event: parseAbiItem("event VaultCreated(address indexed user, uint256 collateral, uint256 debt)"),
                    args: { user: userAddress },
                    fromBlock: "earliest",
                    toBlock: "latest",
                });

                // Get block timestamps for all events
                const allLogs = [...autoRepayLogs, ...vaultCreatedLogs];
                const blockNumbers = [...new Set(allLogs.map(log => log.blockNumber))];
                
                const blockTimestamps: Record<string, bigint> = {};
                await Promise.all(
                    blockNumbers.map(async (blockNumber) => {
                        if (blockNumber) {
                            const block = await publicClient!.getBlock({ blockNumber });
                            blockTimestamps[blockNumber.toString()] = block.timestamp;
                        }
                    })
                );

                // Process auto-repay events
                const autoRepayEvents: ActivityEvent[] = autoRepayLogs.map((log) => ({
                    id: `${log.transactionHash}-${log.logIndex}`,
                    type: "auto-repay" as const,
                    timestamp: new Date(Number(blockTimestamps[log.blockNumber?.toString() || "0"]) * 1000),
                    yieldAmount: log.args.yieldAmount ? formatEther(log.args.yieldAmount) : "0",
                    debtReduced: log.args.debtReduced ? formatUnits(log.args.debtReduced, 6) : "0",
                    transactionHash: log.transactionHash,
                }));

                // Process vault created events
                const vaultCreatedEvents: ActivityEvent[] = vaultCreatedLogs.map((log) => ({
                    id: `${log.transactionHash}-${log.logIndex}`,
                    type: "vault-created" as const,
                    timestamp: new Date(Number(blockTimestamps[log.blockNumber?.toString() || "0"]) * 1000),
                    collateral: log.args.collateral ? formatEther(log.args.collateral) : "0",
                    transactionHash: log.transactionHash,
                }));

                // Combine and sort by timestamp (newest first)
                const allEvents = [...autoRepayEvents, ...vaultCreatedEvents]
                    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                    .slice(0, maxEvents);

                setEvents(allEvents);
            } catch (error) {
                console.error("Error fetching activity events:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchEvents();
    }, [userAddress, publicClient, maxEvents]);

    // Format relative time
    const formatRelativeTime = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-[#C3F53C] animate-spin" />
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="text-center py-8">
                <Clock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No activity yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {events.map((event) => (
                <div
                    key={event.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                >
                    {/* Icon */}
                    <div
                        className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                            event.type === "auto-repay"
                                ? "bg-[#C3F53C]/10 text-[#C3F53C]"
                                : "bg-blue-500/10 text-blue-400"
                        )}
                    >
                        {event.type === "auto-repay" ? (
                            <TrendingDown className="w-4 h-4" />
                        ) : (
                            <Clock className="w-4 h-4" />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-white">
                                {event.type === "auto-repay"
                                    ? "Auto-Repay"
                                    : "Vault Created"}
                            </span>
                            <span className="text-[10px] text-gray-500">
                                {formatRelativeTime(event.timestamp)}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {event.type === "auto-repay" ? (
                                <>
                                    Debt reduced by{" "}
                                    <span className="text-[#C3F53C] font-mono">
                                        ${parseFloat(event.debtReduced || "0").toFixed(2)}
                                    </span>
                                </>
                            ) : (
                                <>
                                    Deposited{" "}
                                    <span className="text-blue-400 font-mono">
                                        {parseFloat(event.collateral || "0").toFixed(4)} mETH
                                    </span>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

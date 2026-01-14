"use client";

import { useEffect, useState, useCallback } from "react";
import { usePublicClient } from "wagmi";
import { formatEther, formatUnits, parseAbiItem } from "viem";
import { CONTRACTS } from "@/lib/contracts";

// Event types
export interface HistoricalEvent {
    id: string;
    type: "vault-created" | "auto-repay" | "collateral-added" | "vault-closed";
    timestamp: Date;
    blockNumber: bigint;
    transactionHash: string;
    // Event-specific fields
    collateral?: string;
    debt?: string;
    yieldAmount?: string;
    debtReduced?: string;
    collateralReturned?: string;
}

interface UseHistoricalEventsOptions {
    userAddress?: `0x${string}`;
    maxEvents?: number;
}

export function useHistoricalEvents({
    userAddress,
    maxEvents = 50,
}: UseHistoricalEventsOptions) {
    const [events, setEvents] = useState<HistoricalEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const publicClient = usePublicClient();

    const fetchEvents = useCallback(async () => {
        if (!publicClient) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            // Calculate safe block range (Mantle Sepolia limits eth_getLogs to 10,000 blocks)
            const currentBlock = await publicClient.getBlockNumber();
            const fromBlock = currentBlock > BigInt(9000) ? currentBlock - BigInt(9000) : BigInt(0);

            // Define event signatures
            const vaultCreatedEvent = parseAbiItem(
                "event VaultCreated(address indexed user, address collateral, uint256 amount)"
            );
            const autoYieldEvent = parseAbiItem(
                "event AutoYieldApplied(address indexed user, uint256 yieldAmount, uint256 debtReduced)"
            );
            const collateralAddedEvent = parseAbiItem(
                "event CollateralAdded(address indexed user, uint256 amount)"
            );
            const vaultClosedEvent = parseAbiItem(
                "event VaultClosed(address indexed user)"
            );

            // Fetch all event types in parallel
            const [vaultCreatedLogs, autoYieldLogs, collateralAddedLogs, vaultClosedLogs] =
                await Promise.all([
                    publicClient.getLogs({
                        address: CONTRACTS.VAULT_MANAGER as `0x${string}`,
                        event: vaultCreatedEvent,
                        args: userAddress ? { user: userAddress } : undefined,
                        fromBlock,
                        toBlock: currentBlock,
                    }),
                    publicClient.getLogs({
                        address: CONTRACTS.VAULT_MANAGER as `0x${string}`,
                        event: autoYieldEvent,
                        args: userAddress ? { user: userAddress } : undefined,
                        fromBlock,
                        toBlock: currentBlock,
                    }),
                    publicClient.getLogs({
                        address: CONTRACTS.VAULT_MANAGER as `0x${string}`,
                        event: collateralAddedEvent,
                        args: userAddress ? { user: userAddress } : undefined,
                        fromBlock,
                        toBlock: currentBlock,
                    }),
                    publicClient.getLogs({
                        address: CONTRACTS.VAULT_MANAGER as `0x${string}`,
                        event: vaultClosedEvent,
                        args: userAddress ? { user: userAddress } : undefined,
                        fromBlock,
                        toBlock: currentBlock,
                    }),
                ]);

            // Collect all unique block numbers
            const allLogs = [
                ...vaultCreatedLogs,
                ...autoYieldLogs,
                ...collateralAddedLogs,
                ...vaultClosedLogs,
            ];
            const blockNumbers = [...new Set(allLogs.map((log) => log.blockNumber))].filter(
                (bn): bn is bigint => bn !== null
            );

            // Fetch block timestamps
            const blockTimestamps: Record<string, bigint> = {};
            await Promise.all(
                blockNumbers.map(async (blockNumber) => {
                    try {
                        const block = await publicClient.getBlock({ blockNumber });
                        blockTimestamps[blockNumber.toString()] = block.timestamp;
                    } catch {
                        // Use current time as fallback
                        blockTimestamps[blockNumber.toString()] = BigInt(
                            Math.floor(Date.now() / 1000)
                        );
                    }
                })
            );

            // Process vault created events
            const vaultCreatedEvents: HistoricalEvent[] = vaultCreatedLogs.map((log) => ({
                id: `${log.transactionHash}-${log.logIndex}`,
                type: "vault-created" as const,
                timestamp: new Date(
                    Number(blockTimestamps[log.blockNumber?.toString() || "0"]) * 1000
                ),
                blockNumber: log.blockNumber ?? BigInt(0),
                transactionHash: log.transactionHash,
                collateral: log.args.amount ? formatEther(log.args.amount) : "0",
            }));

            // Process auto-yield events
            const autoYieldEvents: HistoricalEvent[] = autoYieldLogs.map((log) => ({
                id: `${log.transactionHash}-${log.logIndex}`,
                type: "auto-repay" as const,
                timestamp: new Date(
                    Number(blockTimestamps[log.blockNumber?.toString() || "0"]) * 1000
                ),
                blockNumber: log.blockNumber ?? BigInt(0),
                transactionHash: log.transactionHash,
                yieldAmount: log.args.yieldAmount ? formatEther(log.args.yieldAmount) : "0",
                debtReduced: log.args.debtReduced
                    ? formatUnits(log.args.debtReduced, 6)
                    : "0",
            }));

            // Process collateral added events
            const collateralAddedEvents: HistoricalEvent[] = collateralAddedLogs.map(
                (log) => ({
                    id: `${log.transactionHash}-${log.logIndex}`,
                    type: "collateral-added" as const,
                    timestamp: new Date(
                        Number(blockTimestamps[log.blockNumber?.toString() || "0"]) * 1000
                    ),
                    blockNumber: log.blockNumber ?? BigInt(0),
                    transactionHash: log.transactionHash,
                    collateral: log.args.amount ? formatEther(log.args.amount) : "0",
                })
            );

            // Process vault closed events
            const vaultClosedEvents: HistoricalEvent[] = vaultClosedLogs.map((log) => ({
                id: `${log.transactionHash}-${log.logIndex}`,
                type: "vault-closed" as const,
                timestamp: new Date(
                    Number(blockTimestamps[log.blockNumber?.toString() || "0"]) * 1000
                ),
                blockNumber: log.blockNumber ?? BigInt(0),
                transactionHash: log.transactionHash,
            }));

            // Combine and sort by timestamp (newest first)
            const allEvents = [
                ...vaultCreatedEvents,
                ...autoYieldEvents,
                ...collateralAddedEvents,
                ...vaultClosedEvents,
            ]
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .slice(0, maxEvents);

            setEvents(allEvents);
        } catch (err) {
            console.error("Error fetching historical events:", err);
            setError(err instanceof Error ? err : new Error("Failed to fetch events"));
        } finally {
            setIsLoading(false);
        }
    }, [publicClient, userAddress, maxEvents]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    return {
        events,
        isLoading,
        error,
        refetch: fetchEvents,
    };
}

// Format relative time helper
export function formatRelativeTime(date: Date): string {
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
}

// Format event for display
export function formatEventForDisplay(event: HistoricalEvent): {
    title: string;
    description: string;
    amount: string;
    isPositive: boolean;
} {
    switch (event.type) {
        case "vault-created":
            return {
                title: "Vault Created",
                description: `Deposited ${parseFloat(event.collateral || "0").toFixed(4)} collateral`,
                amount: `+${parseFloat(event.collateral || "0").toFixed(4)}`,
                isPositive: true,
            };
        case "auto-repay":
            return {
                title: "Auto-Repay",
                description: `Debt reduced by $${parseFloat(event.debtReduced || "0").toFixed(2)}`,
                amount: `-$${parseFloat(event.debtReduced || "0").toFixed(2)}`,
                isPositive: true,
            };
        case "collateral-added":
            return {
                title: "Collateral Added",
                description: `Added ${parseFloat(event.collateral || "0").toFixed(4)}`,
                amount: `+${parseFloat(event.collateral || "0").toFixed(4)}`,
                isPositive: true,
            };
        case "vault-closed":
            return {
                title: "Vault Closed",
                description: "Collateral withdrawn",
                amount: "Closed",
                isPositive: false,
            };
        default:
            return {
                title: "Unknown Event",
                description: "",
                amount: "",
                isPositive: false,
            };
    }
}

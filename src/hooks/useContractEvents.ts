"use client";

import { useEffect } from "react";
// TEMPORARILY DISABLED - RPC rate limiting issues
// import { useWatchContractEvent } from "wagmi";
import { CONTRACTS, VAULT_MANAGER_ABI } from "@/lib/contracts";

// Event ABIs
const VAULT_EVENTS_ABI = [
    {
        name: "VaultCreated",
        type: "event",
        inputs: [
            { name: "user", type: "address", indexed: true },
            { name: "collateral", type: "uint256", indexed: false },
            { name: "debt", type: "uint256", indexed: false },
        ],
    },
    {
        name: "AutoYieldApplied",
        type: "event",
        inputs: [
            { name: "user", type: "address", indexed: true },
            { name: "yieldAmount", type: "uint256", indexed: false },
            { name: "debtReduced", type: "uint256", indexed: false },
        ],
    },
    {
        name: "VaultClosed",
        type: "event",
        inputs: [
            { name: "user", type: "address", indexed: true },
            { name: "collateralReturned", type: "uint256", indexed: false },
        ],
    },
] as const;

interface UseContractEventsOptions {
    userAddress?: `0x${string}`;
    onVaultCreated?: (collateral: bigint, debt: bigint) => void;
    onAutoYieldApplied?: (yieldAmount: bigint, debtReduced: bigint) => void;
    onVaultClosed?: (collateralReturned: bigint) => void;
}

export function useContractEvents({
    userAddress,
    onVaultCreated,
    onAutoYieldApplied,
    onVaultClosed,
}: UseContractEventsOptions) {
    // Watch for VaultCreated events
    // TEMPORARILY DISABLED - RPC rate limiting issues on Mantle Sepolia
    /*
    useWatchContractEvent({
        address: CONTRACTS.VAULT_MANAGER as `0x${string}`,
        abi: VAULT_EVENTS_ABI,
        eventName: "VaultCreated",
        args: userAddress ? { user: userAddress } : undefined,
        onLogs: (logs) => {
            logs.forEach((log) => {
                if (onVaultCreated && log.args.collateral && log.args.debt) {
                    onVaultCreated(log.args.collateral, log.args.debt);
                }
            });
        },
    });
    */

    // Watch for AutoYieldApplied events
    // TEMPORARILY DISABLED - RPC rate limiting issues on Mantle Sepolia
    /*
    useWatchContractEvent({
        address: CONTRACTS.VAULT_MANAGER as `0x${string}`,
        abi: VAULT_EVENTS_ABI,
        eventName: "AutoYieldApplied",
        args: userAddress ? { user: userAddress } : undefined,
        onLogs: (logs) => {
            logs.forEach((log) => {
                if (onAutoYieldApplied && log.args.yieldAmount && log.args.debtReduced) {
                    onAutoYieldApplied(log.args.yieldAmount, log.args.debtReduced);
                }
            });
        },
    });
    */

    // Watch for VaultClosed events
    // TEMPORARILY DISABLED - RPC rate limiting issues on Mantle Sepolia
    /*
    useWatchContractEvent({
        address: CONTRACTS.VAULT_MANAGER as `0x${string}`,
        abi: VAULT_EVENTS_ABI,
        eventName: "VaultClosed",
        args: userAddress ? { user: userAddress } : undefined,
        onLogs: (logs) => {
            logs.forEach((log) => {
                if (onVaultClosed && log.args.collateralReturned) {
                    onVaultClosed(log.args.collateralReturned);
                }
            });
        },
    });
    */
}

export { VAULT_EVENTS_ABI };

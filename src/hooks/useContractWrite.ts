"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, parseUnits } from "viem";
import {
    CONTRACTS,
    VAULT_MANAGER_ABI,
    ERC20_ABI,
} from "@/lib/contracts";

// Hook: Approve token spending
export function useApproveToken() {
    const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const approve = async (
        tokenAddress: `0x${string}`,
        spenderAddress: `0x${string}`,
        amount: bigint
    ) => {
        return writeContract({
            address: tokenAddress,
            abi: ERC20_ABI,
            functionName: "approve",
            args: [spenderAddress, amount],
        });
    };

    return {
        approve,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        isError,
        error,
    };
}

// Hook: Deposit collateral and borrow
export function useDepositAndBorrow() {
    const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const depositAndBorrow = async (
        assetAddress: `0x${string}`,
        collateralAmount: bigint,
        borrowAmount: bigint
    ) => {
        return writeContract({
            address: CONTRACTS.VAULT_MANAGER as `0x${string}`,
            abi: VAULT_MANAGER_ABI,
            functionName: "depositCollateralAndBorrow",
            args: [assetAddress, collateralAmount, borrowAmount],
        });
    };

    return {
        depositAndBorrow,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        isError,
        error,
    };
}

// Hook: Add collateral to existing vault
export function useAddCollateral() {
    const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const addCollateral = async (amount: bigint) => {
        return writeContract({
            address: CONTRACTS.VAULT_MANAGER as `0x${string}`,
            abi: VAULT_MANAGER_ABI,
            functionName: "addCollateral",
            args: [amount],
        });
    };

    return {
        addCollateral,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        isError,
        error,
    };
}

// Hook: Withdraw collateral (close vault)
export function useWithdrawCollateral() {
    const { writeContract, data: hash, isPending, isError, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const withdrawCollateral = async () => {
        return writeContract({
            address: CONTRACTS.VAULT_MANAGER as `0x${string}`,
            abi: VAULT_MANAGER_ABI,
            functionName: "withdrawCollateral",
            args: [],
        });
    };

    return {
        withdrawCollateral,
        hash,
        isPending,
        isConfirming,
        isSuccess,
        isError,
        error,
    };
}

// Combined hook for vault operations
export function useVaultOperations() {
    const approveHook = useApproveToken();
    const depositBorrowHook = useDepositAndBorrow();
    const addCollateralHook = useAddCollateral();
    const withdrawHook = useWithdrawCollateral();

    return {
        approve: approveHook,
        depositAndBorrow: depositBorrowHook,
        addCollateral: addCollateralHook,
        withdraw: withdrawHook,
    };
}

"use client"

import React, { createContext, useContext } from "react"
import { useVaults } from "@/hooks/useVaults"

const VaultContext = createContext<ReturnType<typeof useVaults> | null>(null)

export function VaultProvider({ children }: { children: React.ReactNode }) {
    const vaultData = useVaults()
    return (
        <VaultContext.Provider value={vaultData}>
            {children}
        </VaultContext.Provider>
    )
}

export const useVaultContext = () => {
    const context = useContext(VaultContext)
    if (!context) throw new Error("useVaultContext must be used within VaultProvider")
    return context
}

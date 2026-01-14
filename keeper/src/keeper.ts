import { ethers } from 'ethers';
import { createClient } from 'redis';
import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

const config = {
    RPC_URL: process.env.MANTLE_SEPOLIA_RPC || 'https://rpc.sepolia.mantle.xyz',
    PRIVATE_KEY: process.env.KEEPER_PRIVATE_KEY!,
    VAULT_MANAGER: process.env.VAULT_MANAGER_ADDRESS!,
    ORACLE_ADDRESS: process.env.ORACLE_ADDRESS!,
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
    SCAN_INTERVAL: 30 * 60 * 1000, // 30 minutes
    MIN_YIELD: BigInt(1e15), // Minimum yield threshold
    MIN_HEALTH_FACTOR: 150n, // 150% health factor required
    HTTP_PORT: parseInt(process.env.HTTP_PORT || '3001'), // HTTP server port
};

// ABI for VaultManager contract
const VAULT_ABI = [
    "function getVaultInfo(address) view returns (uint256,uint256,uint256,uint256,bool,bool)",
    "function vaults(address) view returns (uint256 collateralAmount, uint256 debtAmount, uint256 lastYieldClaim, address collateralAsset, bool isActive, uint256 lastAutoCheck)",
    "function getAllVaultOwners(uint256,uint256) view returns (address[])",
    "function totalVaults() view returns (uint256)",
    "function processMultipleAutoRepayments(address[])",
    "function processAutoRepayment(address)",
    "function keepers(address) view returns (bool)",
    "function autoCheckInterval() view returns (uint256)",
    "function minYieldThreshold() view returns (uint256)"
];

// ABI for Price Oracle
const ORACLE_ABI = [
    "function getAssetValue(address asset, uint256 amount) view returns (uint256)",
    "function getPrice(address asset) view returns (uint256)"
];

// Setup provider and wallet
const provider = new ethers.JsonRpcProvider(config.RPC_URL);
const wallet = new ethers.Wallet(config.PRIVATE_KEY, provider);
const redis = createClient({ url: config.REDIS_URL });

// Contract instances
const vaultManager = new ethers.Contract(
    config.VAULT_MANAGER,
    VAULT_ABI,
    wallet
) as ethers.Contract & {
    keepers: (address: string) => Promise<boolean>;
    totalVaults: () => Promise<bigint>;
    getAllVaultOwners: (start: number, count: number) => Promise<string[]>;
    getVaultInfo: (user: string) => Promise<[bigint, bigint, bigint, bigint, boolean, boolean]>;
    vaults: (user: string) => Promise<[bigint, bigint, bigint, string, boolean, bigint]>;
    processMultipleAutoRepayments: (addresses: string[], overrides?: { gasLimit: number }) => Promise<ethers.ContractTransactionResponse>;
    processAutoRepayment: ethers.BaseContractMethod<[string], void, ethers.ContractTransactionResponse>;
    autoCheckInterval: () => Promise<bigint>;
    minYieldThreshold: () => Promise<bigint>;
};

const oracle = new ethers.Contract(
    config.ORACLE_ADDRESS,
    ORACLE_ABI,
    provider
) as ethers.Contract & {
    getAssetValue: (asset: string, amount: bigint) => Promise<bigint>;
    getPrice: (asset: string) => Promise<bigint>;
};

interface VaultCandidate {
    owner: string;
    collateral: bigint;
    debt: bigint;
    pendingYield: bigint;
    collateralAsset: string;
}

/**
 * OptimizedKeeper: Two-phase scanning for gas efficiency
 * 
 * Phase 1: CHEAP FILTERS (no price oracle calls)
 *   - Check debt > 0
 *   - Check pendingYield >= threshold
 *   - Check vault is active
 *   - Check time interval passed
 * 
 * Phase 2: PRICE VALIDATION (only for candidates)
 *   - Get fresh price from oracle
 *   - Verify health factor before processing
 */
class OptimizedKeeper {
    private scanBatchSize = 100;
    private processBatchSize = 20;
    private lastScanTime: Date | null = null;
    private nextScanTime: Date | null = null;
    private isScanning = false;

    async run(): Promise<void> {
        console.log('🚀 Optimized Keeper Started');
        console.log(`📊 Config: MIN_YIELD=${config.MIN_YIELD}, MIN_HEALTH=${config.MIN_HEALTH_FACTOR}%`);

        // Verify authorization
        const walletAddress = await wallet.getAddress();
        const isKeeper = await vaultManager.keepers(walletAddress);
        if (!isKeeper) throw new Error('❌ Not authorized keeper');
        console.log(`✅ Authorized as keeper: ${walletAddress}`);

        // Start scanning loop
        setInterval(() => this.executeCycle(), config.SCAN_INTERVAL);
        await this.executeCycle();
    }

    getStatus() {
        const now = new Date();
        const secondsUntilNextScan = this.nextScanTime
            ? Math.max(0, Math.floor((this.nextScanTime.getTime() - now.getTime()) / 1000))
            : 0;

        return {
            lastScanTime: this.lastScanTime?.toISOString() || null,
            nextScanTime: this.nextScanTime?.toISOString() || null,
            secondsUntilNextScan,
            scanInterval: config.SCAN_INTERVAL / 1000, // in seconds
            isScanning: this.isScanning,
        };
    }

    private async executeCycle(): Promise<void> {
        this.lastScanTime = new Date();
        this.nextScanTime = new Date(this.lastScanTime.getTime() + config.SCAN_INTERVAL);
        this.isScanning = true;

        console.log(`\n⏰ ${this.lastScanTime.toISOString()} - Starting scan cycle`);

        try {
            // Phase 1: Quick scan (no price oracle)
            const candidates = await this.scanReadyVaults();
            if (candidates.length === 0) {
                console.log('😴 No candidates found');
                return;
            }
            console.log(`🎯 Found ${candidates.length} yield-ready candidates`);

            // Phase 2: Process with fresh prices
            await this.processYieldWithFreshPrice(candidates);
        } catch (error) {
            console.error('❌ Cycle error:', error);
        } finally {
            this.isScanning = false;
        }
    }

    /**
     * Phase 1: CHEAP FILTERS FIRST (NO price oracle calls)
     * Only checks: debt > 0, pendingYield >= threshold, active, time passed
     */
    private async scanReadyVaults(): Promise<VaultCandidate[]> {
        const totalVaults = Number(await vaultManager.totalVaults());
        const candidates: VaultCandidate[] = [];
        const minYield = await vaultManager.minYieldThreshold();
        const checkInterval = await vaultManager.autoCheckInterval();
        const currentTime = BigInt(Math.floor(Date.now() / 1000));

        console.log(`🔍 Scanning ${totalVaults} vaults (cheap filters only)...`);

        // Handle zero vaults case
        if (totalVaults === 0) {
            console.log('📭 No vaults exist yet');
            return candidates;
        }

        for (let start = 0; start < totalVaults; start += this.scanBatchSize) {
            const owners: string[] = await vaultManager.getAllVaultOwners(start, this.scanBatchSize);

            console.log(`\n📦 Batch ${Math.floor(start / this.scanBatchSize) + 1}: Checking ${owners.length} vaults...`);

            // Parallel check all vaults in batch (no price calls!)
            const checks = owners.map(async (owner, index) => {
                try {
                    const [collateral, debt, pendingYield, , active, ready] =
                        await vaultManager.getVaultInfo(owner);

                    // Log each vault's details
                    const collateralInMETH = ethers.formatEther(collateral);
                    const debtAmount = ethers.formatEther(debt);
                    const yieldInMETH = ethers.formatEther(pendingYield);
                    const minYieldInMETH = ethers.formatEther(minYield);
                    const meetsThreshold = pendingYield >= minYield;

                    console.log(`\n  🔹 Vault ${start + index + 1}: ${owner}`);
                    console.log(`     💰 Collateral Deposited: ${collateralInMETH} mETH`);
                    console.log(`     💳 Debt Borrowed: ${debtAmount} stablecoin`);
                    console.log(`     📈 Yield Earned (interest): ${yieldInMETH} mETH`);
                    console.log(`     🎯 Min Yield Required for Repayment: ${minYieldInMETH} mETH (0.001 mETH)`);
                    console.log(`     Status: Active=${active}, Ready=${ready}`);

                    // Clear comparison
                    if (meetsThreshold) {
                        console.log(`     ✅ YIELD SUFFICIENT: ${yieldInMETH} >= ${minYieldInMETH} mETH`);
                    } else {
                        console.log(`     ❌ YIELD TOO LOW: ${yieldInMETH} < ${minYieldInMETH} mETH`);
                        console.log(`     ⏳ Need ${(Number(minYieldInMETH) - Number(yieldInMETH)).toFixed(6)} more mETH yield`);
                    }

                    // CHEAP FILTERS: Only check time/yield/status
                    if (
                        debt > 0n &&
                        pendingYield >= minYield &&
                        active &&
                        ready
                    ) {
                        console.log(`     ⭐ CANDIDATE for auto-repayment!`);
                        // Get collateral asset for later price check
                        try {
                            const vault = await vaultManager.vaults(owner);
                            return {
                                owner: ethers.getAddress(owner),
                                collateral,
                                debt,
                                pendingYield,
                                collateralAsset: vault[3] // collateralAsset address
                            } as VaultCandidate;
                        } catch (error) {
                            console.error(`     ⚠️ Failed to get vault info for ${owner}: ${error}`);
                            // Still mark as null so it gets filtered out
                            return null;
                        }
                    } else {
                        const reason = debt === 0n ? 'No debt borrowed' :
                            !meetsThreshold ? `Yield too low (need ${minYieldInMETH} mETH)` :
                                !active ? 'Vault inactive' :
                                    'Not ready yet (time interval)';
                        console.log(`     ⏭️ Skipped: ${reason}`);
                    }
                } catch (error) {
                    console.error(`  ❌ Error checking vault ${owner}: ${error}`);
                }
                return null;
            });

            const results = await Promise.all(checks);
            for (const result of results) {
                if (result) candidates.push(result);
            }
        }

        return candidates;
    }

    /**
     * Phase 2: ONLY NOW call price oracle (1x per vault)
     * Get fresh price → verify health → process
     */
    private async processYieldWithFreshPrice(candidates: VaultCandidate[]): Promise<void> {
        let processed = 0;
        let skippedHealth = 0;

        for (const candidate of candidates) {
            try {
                // Skip if debt is zero (avoid division by zero)
                if (candidate.debt === 0n) {
                    console.log(`  ⏭️ Skipped ${candidate.owner.slice(0, 10)}...: zero debt`);
                    continue;
                }

                // Get FRESH collateral value from oracle
                const collateralValue = await oracle.getAssetValue(
                    candidate.collateralAsset,
                    candidate.collateral
                );

                // Skip if collateral value is zero (oracle error or no price)
                if (collateralValue === 0n) {
                    console.log(`  ⚠️ Skipped ${candidate.owner.slice(0, 10)}...: zero collateral value (oracle issue?)`);
                    continue;
                }

                // Calculate health factor: (collateralValue * 100) / debt
                const healthFactor = (collateralValue * 100n) / candidate.debt;

                console.log(`📈 ${candidate.owner.slice(0, 10)}... | Health: ${healthFactor}% | Yield: ${ethers.formatEther(candidate.pendingYield)}`);

                // Only process if healthy enough
                if (healthFactor >= config.MIN_HEALTH_FACTOR) {
                    try {
                        // First try static call to get revert reason if it would fail
                        await vaultManager.processAutoRepayment.staticCall(candidate.owner);

                        // If static call succeeds, send actual transaction
                        const tx = await vaultManager.processAutoRepayment(candidate.owner, {
                            gasLimit: 80_000_000
                        });
                        const receipt = await tx.wait();
                        console.log(`  ✅ Processed | Tx: ${receipt?.hash?.slice(0, 16)}... | Gas: ${receipt?.gasUsed}`);
                        processed++;

                        // Brief pause between transactions
                        await new Promise<void>(r => setTimeout(r, 500));
                    } catch (staticError: any) {
                        console.log(`  ⚠️ Static call failed for ${candidate.owner.slice(0, 10)}...`);
                        console.log(`     Reason: ${staticError.message || staticError.reason || 'Unknown'}`);
                        if (staticError.data) {
                            console.log(`     Error data: ${staticError.data}`);
                        }
                    }
                } else {
                    console.log(`  ⚠️ Skipped: Health ${healthFactor}% < ${config.MIN_HEALTH_FACTOR}%`);
                    skippedHealth++;
                }
            } catch (error) {
                console.error(`  ❌ Failed: ${candidate.owner}`, error);
            }
        }

        console.log(`\n📊 Cycle complete: ${processed} processed, ${skippedHealth} skipped (low health)`);
    }
}

// START HTTP SERVER
const app = express();
app.use(cors());
app.use(express.json());

const keeper = new OptimizedKeeper();

// Status endpoint
app.get('/api/status', (req, res) => {
    res.json(keeper.getStatus());
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start HTTP server
app.listen(config.HTTP_PORT, () => {
    console.log(`🌐 HTTP server listening on port ${config.HTTP_PORT}`);
});

// START OPTIMIZED KEEPER
keeper.run().catch(console.error);

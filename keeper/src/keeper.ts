import { ethers } from 'ethers';
import { createClient } from 'redis';
import * as dotenv from 'dotenv';

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
};

// ABI for VaultManager contract
const VAULT_ABI = [
    "function getVaultInfo(address) view returns (uint256,uint256,uint256,uint256,bool,bool)",
    "function getVaultBasicInfo(address) view returns (uint256 collateral, uint256 debt, uint256 pendingYield, address collateralAsset, bool active, uint256 lastAutoCheck)",
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
    getVaultBasicInfo: (user: string) => Promise<[bigint, bigint, bigint, string, boolean, bigint]>;
    processMultipleAutoRepayments: (addresses: string[], overrides?: { gasLimit: number }) => Promise<ethers.ContractTransactionResponse>;
    processAutoRepayment: (user: string, overrides?: { gasLimit: number }) => Promise<ethers.ContractTransactionResponse>;
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

    private async executeCycle(): Promise<void> {
        console.log(`\n⏰ ${new Date().toISOString()} - Starting scan cycle`);

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

            // Parallel check all vaults in batch (no price calls!)
            const checks = owners.map(async (owner) => {
                try {
                    const [collateral, debt, pendingYield, , active, ready] =
                        await vaultManager.getVaultInfo(owner);

                    // CHEAP FILTERS: Only check time/yield/status
                    if (
                        debt > 0n &&
                        pendingYield >= minYield &&
                        active &&
                        ready
                    ) {
                        // Get collateral asset for later price check
                        const vault = await vaultManager.getVaultBasicInfo(owner).catch(() => null);
                        if (vault) {
                            return {
                                owner: ethers.getAddress(owner),
                                collateral,
                                debt,
                                pendingYield,
                                collateralAsset: vault[3] // collateralAsset address
                            } as VaultCandidate;
                        }
                    }
                } catch {
                    // Skip failed vaults
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
                    const tx = await vaultManager.processAutoRepayment(candidate.owner, {
                        gasLimit: 500_000
                    });
                    const receipt = await tx.wait();
                    console.log(`  ✅ Processed | Tx: ${receipt?.hash?.slice(0, 16)}... | Gas: ${receipt?.gasUsed}`);
                    processed++;

                    // Brief pause between transactions
                    await new Promise<void>(r => setTimeout(r, 500));
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

// START OPTIMIZED KEEPER
new OptimizedKeeper().run().catch(console.error);

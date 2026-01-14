const { ethers } = require("hardhat");

async function main() {
    const VAULT_MANAGER = "0xe98B06719298a232b9f9DFECE520Ee9e0Dfb24E2";
    const USER = "0x7975E591c26e6c6D9B0CFd9A81f6d61A921C080c";
    
    console.log("🧪 Testing Auto-Repayment Flow\n");
    
    // Get contracts
    const vaultManager = await ethers.getContractAt("AutoRepaymentVaultManager", VAULT_MANAGER);
    
    // 1. Check vault info
    console.log("1️⃣ Checking vault info...");
    const vaultInfo = await vaultManager.getVaultInfo(USER);
    console.log("   Collateral:", ethers.formatEther(vaultInfo[0]), "mETH");
    console.log("   Debt:", ethers.formatUnits(vaultInfo[1], 6), "USDC");
    console.log("   Pending Yield:", ethers.formatEther(vaultInfo[2]), "mETH");
    console.log("   Health Factor:", Number(vaultInfo[3]) / 100, "%");
    
    // 2. Wait or simulate time
    console.log("\n2️⃣ Simulating time passage...");
    console.log("   (In testnet, yield accumulates naturally over time)");
    console.log("   Current yield:", ethers.formatEther(vaultInfo[2]), "mETH");
    
    if (vaultInfo[2] > 0n) {
        console.log("\n3️⃣ Yield detected! Keeper can process auto-repayment.");
        console.log("   Run: await vaultManager.processAutoRepayment(USER)");
    } else {
        console.log("\n⏳ No yield yet. Check again in a few hours or:");
        console.log("   - Wait for natural accumulation (3% APY)");
        console.log("   - For instant testing, you'd need to use Hardhat's time manipulation on local network");
    }
    
    // 4. Show keeper stats
    console.log("\n📊 Protocol Stats:");
    const totalVaults = await vaultManager.totalVaults();
    const totalRevenue = await vaultManager.totalProtocolRevenue();
    const repayCount = await vaultManager.autoRepaymentCount();
    console.log("   Total Vaults:", totalVaults.toString());
    console.log("   Protocol Revenue:", ethers.formatUnits(totalRevenue, 6), "USDC");
    console.log("   Auto-Repayments:", repayCount.toString());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

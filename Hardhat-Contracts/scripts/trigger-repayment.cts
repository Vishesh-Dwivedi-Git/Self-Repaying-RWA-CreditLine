const { ethers } = require("hardhat");

async function main() {
    const VAULT_MANAGER = "0xe98B06719298a232b9f9DFECE520Ee9e0Dfb24E2";
    const USER = "0x7975E591c26e6c6D9B0CFd9A81f6d61A921C080c";
    
    console.log("🔧 Manually Triggering Auto-Repayment\n");
    
    const [keeper] = await ethers.getSigners();
    const vaultManager = await ethers.getContractAt("AutoRepaymentVaultManager", VAULT_MANAGER);
    
    // Check before
    console.log("📊 BEFORE Auto-Repayment:");
    let vaultInfo = await vaultManager.getVaultInfo(USER);
    console.log("   Debt:", ethers.formatUnits(vaultInfo[1], 6), "USDC");
    console.log("   Pending Yield:", ethers.formatEther(vaultInfo[2]), "mETH");
    console.log("   Health Factor:", Number(vaultInfo[3]) / 100, "%");
    
    // Process auto-repayment
    console.log("\n⚙️  Processing auto-repayment...");
    try {
        const tx = await vaultManager.processAutoRepayment(USER);
        const receipt = await tx.wait();
        console.log("   ✅ Transaction successful!");
        console.log("   TX Hash:", receipt.hash);
        
        // Find AutoYieldApplied event
        const event = receipt.logs.find(log => {
            try {
                const parsed = vaultManager.interface.parseLog(log);
                return parsed.name === "AutoYieldApplied";
            } catch {
                return false;
            }
        });
        
        if (event) {
            const parsed = vaultManager.interface.parseLog(event);
            console.log("\n🎉 Auto-Repayment Event:");
            console.log("   Yield Harvested:", ethers.formatEther(parsed.args.yieldAmount), "mETH");
            console.log("   Debt Reduced:", ethers.formatUnits(parsed.args.debtReduced, 6), "USDC");
        }
    } catch (error) {
        console.log("   ❌ Error:", error.message);
        
        // Check if it's the yield threshold issue
        if (error.message.includes("Yield too low")) {
            console.log("\n💡 Yield is below minimum threshold (0.001 ETH)");
            console.log("   Options:");
            console.log("   1. Wait longer for more yield to accumulate");
            console.log("   2. Lower the threshold: vaultManager.setMinYieldThreshold(1)");
            console.log("   3. Add more collateral to generate more yield");
        }
        return;
    }
    
    // Check after
    console.log("\n📊 AFTER Auto-Repayment:");
    vaultInfo = await vaultManager.getVaultInfo(USER);
    console.log("   Debt:", ethers.formatUnits(vaultInfo[1], 6), "USDC");
    console.log("   Pending Yield:", ethers.formatEther(vaultInfo[2]), "mETH");
    console.log("   Health Factor:", Number(vaultInfo[3]) / 100, "%");
    
    // Protocol stats
    const totalRevenue = await vaultManager.totalProtocolRevenue();
    const repayCount = await vaultManager.autoRepaymentCount();
    console.log("\n💰 Protocol Stats:");
    console.log("   Total Revenue:", ethers.formatUnits(totalRevenue, 6), "USDC");
    console.log("   Auto-Repayments:", repayCount.toString());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

const { ethers } = require("hardhat");

// Existing deployed addresses (keep tokens and oracle)
const EXISTING = {
    METH: "0x4eE625d46fE7865f381FfaDeB7fF1709b17c884b",
    FBTC: "0xC9Bbb21089DD3C16e63C41B9bfd2E418756Ce217",
    USDC: "0xA22B13d1E19c56ef25bDF6cD1d2d7c7195D4237b",
    ORACLE: "0x7e9aEBFFFD6482282f837892beCdfBc4fD0d6aaa"
};

async function main() {
    console.log("🚀 Redeploying VaultManager only...\n");

    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);
    console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "MNT\n");

    // 1. Deploy new VaultManager
    console.log("1️⃣ Deploying new VaultManager...");
    const VaultManager = await ethers.getContractFactory("AutoRepaymentVaultManager");
    const vaultManager = await VaultManager.deploy(EXISTING.USDC, EXISTING.ORACLE);
    await vaultManager.waitForDeployment();
    const vaultManagerAddress = await vaultManager.getAddress();
    console.log("   VaultManager:", vaultManagerAddress);

    // 2. Configure Protocol
    console.log("\n2️⃣ Configuring protocol...");
    await vaultManager.addSupportedCollateral(EXISTING.METH);
    console.log("   ✅ mETH added as collateral");

    await vaultManager.addSupportedCollateral(EXISTING.FBTC);
    console.log("   ✅ fBTC added as collateral");

    // 3. Add keeper (for the keeper service)
    console.log("\n3️⃣ Adding keeper...");
    const keeperAddress = process.env.KEEPER_ADDRESS || deployer.address;
    await vaultManager.addKeeper(keeperAddress);
    console.log("   ✅ Added keeper:", keeperAddress);

    // 4. Fund VaultManager with USDC
    console.log("\n4️⃣ Funding VaultManager with USDC...");
    const usdc = await ethers.getContractAt("MockStablecoin", EXISTING.USDC);
    const mintAmount = ethers.parseUnits("10000000", 6); // 10M USDC
    await usdc.mint(vaultManagerAddress, mintAmount);
    console.log("   ✅ Minted 10M USDC to VaultManager");

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📋 UPDATE THESE ADDRESSES:");
    console.log("=".repeat(60));
    console.log(`VAULT_MANAGER: "${vaultManagerAddress}"`);
    console.log("\nKeep existing:");
    console.log(`ORACLE: "${EXISTING.ORACLE}"`);
    console.log(`METH: "${EXISTING.METH}"`);
    console.log(`FBTC: "${EXISTING.FBTC}"`);
    console.log(`USDC: "${EXISTING.USDC}"`);
    console.log("=".repeat(60));
    console.log("\n✅ VaultManager redeployment complete!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

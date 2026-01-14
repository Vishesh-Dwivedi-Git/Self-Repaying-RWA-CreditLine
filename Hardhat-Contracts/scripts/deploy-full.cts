const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Deploying Full Protocol with SimplePriceOracle...\n");

    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);
    console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "MNT\n");

    // 1. Deploy Mock Tokens
    console.log("1️⃣ Deploying Mock Tokens...");
    
    const MockMETH = await ethers.getContractFactory("MockMETH");
    const meth = await MockMETH.deploy();
    await meth.waitForDeployment();
    console.log("   MockMETH:", await meth.getAddress());

    const MockFBTC = await ethers.getContractFactory("MockFBTC");
    const fbtc = await MockFBTC.deploy();
    await fbtc.waitForDeployment();
    console.log("   MockFBTC:", await fbtc.getAddress());

    const MockStablecoin = await ethers.getContractFactory("MockStablecoin");
    const usdc = await MockStablecoin.deploy("Mock USDC", "mUSDC", 6);
    await usdc.waitForDeployment();
    console.log("   MockUSDC:", await usdc.getAddress());

    // 2. Deploy SimplePriceOracle
    console.log("\n2️⃣ Deploying SimplePriceOracle...");
    const SimplePriceOracle = await ethers.getContractFactory("SimplePriceOracle");
    const oracle = await SimplePriceOracle.deploy();
    await oracle.waitForDeployment();
    console.log("   Oracle:", await oracle.getAddress());

    // 3. Set Prices
    console.log("\n3️⃣ Setting prices...");
    const methPrice = ethers.parseEther("3500"); // $3500 per mETH
    const fbtcPrice = ethers.parseEther("60000"); // $60000 per fBTC
    
    await oracle.setPrice(await meth.getAddress(), methPrice);
    console.log("   mETH price set to $3500");
    
    await oracle.setPrice(await fbtc.getAddress(), fbtcPrice);
    console.log("   fBTC price set to $60000");

    // 4. Deploy VaultManager
    console.log("\n4️⃣ Deploying VaultManager...");
    const VaultManager = await ethers.getContractFactory("AutoRepaymentVaultManager");
    const vaultManager = await VaultManager.deploy(
        await usdc.getAddress(),
        await oracle.getAddress()
    );
    await vaultManager.waitForDeployment();
    console.log("   VaultManager:", await vaultManager.getAddress());

    // 5. Configure Protocol
    console.log("\n5️⃣ Configuring protocol...");
    await vaultManager.addSupportedCollateral(await meth.getAddress());
    console.log("   ✅ mETH added as collateral");
    
    await vaultManager.addSupportedCollateral(await fbtc.getAddress());
    console.log("   ✅ fBTC added as collateral");

    // 6. Fund VaultManager with USDC
    console.log("\n6️⃣ Funding VaultManager with USDC...");
    const mintAmount = ethers.parseUnits("10000000", 6); // 10M USDC
    await usdc.mint(await vaultManager.getAddress(), mintAmount);
    console.log("   ✅ Minted 10M USDC to VaultManager");

    // 7. Mint test tokens to deployer
    console.log("\n7️⃣ Minting test tokens to deployer...");
    await meth.mint(deployer.address, ethers.parseEther("100"));
    console.log("   ✅ Minted 100 mETH to deployer");
    
    await fbtc.mint(deployer.address, ethers.parseEther("10"));
    console.log("   ✅ Minted 10 fBTC to deployer");

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📋 DEPLOYMENT SUMMARY - Update these in frontend/contracts.ts:");
    console.log("=".repeat(60));
    console.log(`VAULT_MANAGER: "${await vaultManager.getAddress()}"`);
    console.log(`ORACLE: "${await oracle.getAddress()}"`);
    console.log(`METH: "${await meth.getAddress()}"`);
    console.log(`FBTC: "${await fbtc.getAddress()}"`);
    console.log(`USDC: "${await usdc.getAddress()}"`);
    console.log("=".repeat(60));
    console.log("\n✅ Deployment complete!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

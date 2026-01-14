import { ethers } from "hardhat";

// Latest deployed addresses
const ADDRESSES = {
    VAULT_MANAGER: "0xd964f2d9057997c3261af1046c486e7Eb278cB9F",
    ORACLE: "0x77057304c6b2B1331E83E0D8Be18961f01eedfc4",
    METH: "0x514F4AF14a671beD0E4378b1CF62Bb28788617Fb",
    FBTC: "0xf257ec0A9A87597433bee54E802C1b309a432A17",
    USDC: "0x9525b1083914d898468232198f53858957BD3511",
};

// Prices in 18 decimals
const METH_PRICE = ethers.parseEther("3200"); // $3,200 per mETH
const FBTC_PRICE = ethers.parseEther("95000"); // $95,000 per fBTC

async function main() {
    console.log("🔧 Setting up Protocol...\n");

    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);
    console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "MNT\n");

    // Get contract instances
    const oracle = await ethers.getContractAt("SimplePriceOracle", ADDRESSES.ORACLE);
    const vaultManager = await ethers.getContractAt("AutoRepaymentVaultManager", ADDRESSES.VAULT_MANAGER);

    // 1. Set Oracle Prices
    console.log("1️⃣ Setting Oracle Prices...");

    console.log("   Setting mETH price to $3,200...");
    const tx1 = await oracle.setPrice(ADDRESSES.METH, METH_PRICE);
    await tx1.wait();
    console.log("   ✅ mETH price set!");

    console.log("   Setting fBTC price to $95,000...");
    const tx2 = await oracle.setPrice(ADDRESSES.FBTC, FBTC_PRICE);
    await tx2.wait();
    console.log("   ✅ fBTC price set!");

    // 2. Add Supported Collaterals to VaultManager
    console.log("\n2️⃣ Adding supported collaterals to VaultManager...");

    try {
        console.log("   Adding mETH as collateral...");
        const tx3 = await vaultManager.addSupportedCollateral(ADDRESSES.METH);
        await tx3.wait();
        console.log("   ✅ mETH added as supported collateral!");
    } catch (e: any) {
        if (e.message.includes("already")) {
            console.log("   ℹ️ mETH already supported");
        } else {
            console.log("   ⚠️ mETH:", e.message?.slice(0, 100));
        }
    }

    try {
        console.log("   Adding fBTC as collateral...");
        const tx4 = await vaultManager.addSupportedCollateral(ADDRESSES.FBTC);
        await tx4.wait();
        console.log("   ✅ fBTC added as supported collateral!");
    } catch (e: any) {
        if (e.message.includes("already")) {
            console.log("   ℹ️ fBTC already supported");
        } else {
            console.log("   ⚠️ fBTC:", e.message?.slice(0, 100));
        }
    }

    // 3. Verify prices
    console.log("\n3️⃣ Verifying Oracle Prices...");
    const methPrice = await oracle.getPrice(ADDRESSES.METH);
    const fbtcPrice = await oracle.getPrice(ADDRESSES.FBTC);
    console.log("   mETH Price:", ethers.formatEther(methPrice), "USD");
    console.log("   fBTC Price:", ethers.formatEther(fbtcPrice), "USD");

    // 4. Verify collateral support
    console.log("\n4️⃣ Verifying Collateral Support...");
    const methSupported = await vaultManager.supportedCollateral(ADDRESSES.METH);
    const fbtcSupported = await vaultManager.supportedCollateral(ADDRESSES.FBTC);
    console.log("   mETH supported:", methSupported);
    console.log("   fBTC supported:", fbtcSupported);

    console.log("\n" + "=".repeat(50));
    console.log("✅ Protocol setup complete!");
    console.log("=".repeat(50));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

import { ethers } from "hardhat";

// Latest deployed addresses
const ADDRESSES = {
    VAULT_MANAGER: "0xd964f2d9057997c3261af1046c486e7Eb278cB9F",
    ORACLE: "0x77057304c6b2B1331E83E0D8Be18961f01eedfc4",
    METH: "0x514F4AF14a671beD0E4378b1CF62Bb28788617Fb",
    FBTC: "0xf257ec0A9A87597433bee54E802C1b309a432A17",
    USDC: "0x9525b1083914d898468232198f53858957BD3511",
};

async function main() {
    console.log("🔍 Checking contract configuration...\n");

    // Check VaultManager's oracle address
    const vaultManager = await ethers.getContractAt("AutoRepaymentVaultManager", ADDRESSES.VAULT_MANAGER);
    const oracleInVaultManager = await vaultManager.priceOracle();
    console.log("VaultManager address:", ADDRESSES.VAULT_MANAGER);
    console.log("VaultManager's priceOracle:", oracleInVaultManager);
    console.log("Expected oracle:", ADDRESSES.ORACLE);
    console.log("Oracle match:", oracleInVaultManager.toLowerCase() === ADDRESSES.ORACLE.toLowerCase() ? "✅ YES" : "❌ NO - MISMATCH!");

    // Check if mETH is supported collateral
    const methSupported = await vaultManager.supportedCollateral(ADDRESSES.METH);
    console.log("\nmETH supported:", methSupported ? "✅ YES" : "❌ NO");

    // Check oracle prices
    const oracle = await ethers.getContractAt("SimplePriceOracle", oracleInVaultManager);
    try {
        const methPrice = await oracle.getPrice(ADDRESSES.METH);
        console.log("mETH price in oracle:", ethers.formatEther(methPrice), "USD");
    } catch (e: any) {
        console.log("❌ mETH price NOT SET in oracle:", oracleInVaultManager);
    }

    // Check if prices are set on the new oracle
    console.log("\n--- Checking NEW oracle ---");
    const newOracle = await ethers.getContractAt("SimplePriceOracle", ADDRESSES.ORACLE);
    try {
        const methPriceNew = await newOracle.getPrice(ADDRESSES.METH);
        console.log("mETH price in NEW oracle:", ethers.formatEther(methPriceNew), "USD");
    } catch (e: any) {
        console.log("❌ mETH price NOT SET in new oracle");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

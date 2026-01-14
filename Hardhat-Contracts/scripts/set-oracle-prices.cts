import { ethers } from "hardhat";

async function main() {
    const ORACLE_ADDRESS = "0x7e9aEBFFFD6482282f837892beCdfBc4fD0d6aaa";
    const METH_ADDRESS = "0x4eE625d46fE7865f381FfaDeB7fF1709b17c884b";
    const FBTC_ADDRESS = "0xC9Bbb21089DD3C16e63C41B9bfd2E418756Ce217";

    // Prices in 18 decimals
    const METH_PRICE = ethers.parseEther("3200"); // $3,200 per mETH
    const FBTC_PRICE = ethers.parseEther("95000"); // $95,000 per fBTC

    console.log("🔧 Setting Oracle Prices...\n");

    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);

    const oracle = await ethers.getContractAt("SimplePriceOracle", ORACLE_ADDRESS);

    // Set mETH price
    console.log("Setting mETH price to $3,200...");
    const tx1 = await oracle.setPrice(METH_ADDRESS, METH_PRICE);
    await tx1.wait();
    console.log("✅ mETH price set!");

    // Set fBTC price
    console.log("Setting fBTC price to $95,000...");
    const tx2 = await oracle.setPrice(FBTC_ADDRESS, FBTC_PRICE);
    await tx2.wait();
    console.log("✅ fBTC price set!");

    // Verify
    console.log("\n📊 Verifying prices...");
    const methPrice = await oracle.getPrice(METH_ADDRESS);
    const fbtcPrice = await oracle.getPrice(FBTC_ADDRESS);
    console.log("mETH Price:", ethers.formatEther(methPrice), "USD");
    console.log("fBTC Price:", ethers.formatEther(fbtcPrice), "USD");

    console.log("\n✅ All prices set successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

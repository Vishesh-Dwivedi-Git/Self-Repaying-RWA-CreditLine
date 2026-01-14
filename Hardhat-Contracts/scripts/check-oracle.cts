import { ethers } from "hardhat";

async function main() {
    const ORACLE_ADDRESS = "0x7e9aEBFFFD6482282f837892beCdfBc4fD0d6aaa";
    const METH_ADDRESS = "0x4eE625d46fE7865f381FfaDeB7fF1709b17c884b";
    const FBTC_ADDRESS = "0xC9Bbb21089DD3C16e63C41B9bfd2E418756Ce217";
    const VAULT_MANAGER = "0xbBfeD32470c2F9B01207083ecd4e7C7f4B5d76Ca";

    const oracle = await ethers.getContractAt("SimplePriceOracle", ORACLE_ADDRESS);
    const meth = await ethers.getContractAt("MockMETH", METH_ADDRESS);
    const fbtc = await ethers.getContractAt("MockFBTC", FBTC_ADDRESS);

    console.log("📊 Checking Oracle Prices...");
    const methPrice = await oracle.getPrice(METH_ADDRESS);
    const fbtcPrice = await oracle.getPrice(FBTC_ADDRESS);
    console.log("mETH Price:", ethers.formatEther(methPrice), "USD");
    console.log("fBTC Price:", ethers.formatEther(fbtcPrice), "USD");

    console.log("\n💰 Checking Token Balances in VaultManager...");
    const methBalance = await meth.balanceOf(VAULT_MANAGER);
    const fbtcBalance = await fbtc.balanceOf(VAULT_MANAGER);
    console.log("mETH Balance:", ethers.formatEther(methBalance));
    console.log("fBTC Balance:", ethers.formatEther(fbtcBalance));

    console.log("\n💵 Calculating TVL...");
    const methTVL = Number(ethers.formatEther(methBalance)) * Number(ethers.formatEther(methPrice));
    const fbtcTVL = Number(ethers.formatEther(fbtcBalance)) * Number(ethers.formatEther(fbtcPrice));
    console.log("mETH TVL: $", methTVL.toLocaleString());
    console.log("fBTC TVL: $", fbtcTVL.toLocaleString());
    console.log("Total TVL: $", (methTVL + fbtcTVL).toLocaleString());
}

main().catch(console.error);

const { ethers } = require("hardhat");

async function main() {
    const METH = "0x2EBF29b2371760995545abCdC8048cf7A1419Ce7";
    const USER_WALLET = "0x7975E591c26e6c6D9B0CFd9A81f6d61A921C080c";
    
    console.log("Minting test mETH to user wallet...");
    
    const meth = await ethers.getContractAt("MockMETH", METH);
    const tx = await meth.mint(USER_WALLET, ethers.parseEther("10"));
    await tx.wait();
    
    console.log("✅ Minted 10 mETH to", USER_WALLET);
    console.log("TX:", tx.hash);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

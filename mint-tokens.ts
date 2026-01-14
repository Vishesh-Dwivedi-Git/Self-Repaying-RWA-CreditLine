import { createWalletClient, createPublicClient, http } from 'viem';
import { mantleSepoliaTestnet } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Contract addresses
const METH = "0x514F4AF14a671beD0E4378b1CF62Bb28788617Fb";
const FBTC = "0xf257ec0A9A87597433bee54E802C1b309a432A17";

// Mock token ABI with mint function - try different signatures
const MOCK_TOKEN_ABI = [
    {
        name: "mint",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [],
        outputs: [],
    },
    {
        name: "mint",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [{ name: "amount", type: "uint256" }],
        outputs: [],
    },
    {
        name: "mint",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
            { name: "to", type: "address" },
            { name: "amount", type: "uint256" }
        ],
        outputs: [],
    },
    {
        name: "faucet",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [],
        outputs: [],
    },
    {
        name: "balanceOf",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "account", type: "address" }],
        outputs: [{ name: "", type: "uint256" }],
    },
    {
        name: "name",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "string" }],
    }
] as const;

async function mintTokens() {
    // Get private key from environment or prompt
    const privateKey = "0x91cf95b469529e9cbb9c1b319501b3b16b0543127349af0b282cf39add503d5f";
    
    if (!privateKey) {
        console.error("❌ Please set PRIVATE_KEY environment variable");
        console.log("Usage: PRIVATE_KEY=0x... npx tsx mint-tokens.ts");
        process.exit(1);
    }

    const account = privateKeyToAccount(privateKey);
    
    const publicClient = createPublicClient({
        chain: mantleSepoliaTestnet,
        transport: http("https://rpc.sepolia.mantle.xyz"),
    });

    const walletClient = createWalletClient({
        account,
        chain: mantleSepoliaTestnet,
        transport: http("https://rpc.sepolia.mantle.xyz"),
    });

    console.log(`\n🔑 Wallet Address: ${account.address}\n`);

    // Try to get token name to verify contract
    try {
        const methName = await publicClient.readContract({
            address: METH as `0x${string}`,
            abi: MOCK_TOKEN_ABI,
            functionName: "name",
        });
        console.log(`   mETH Token Name: ${methName}`);
    } catch (e) {
        console.log("   ⚠️  Could not read mETH name");
    }

    // Check balances before minting
    console.log("📊 Balances before minting:");
    const methBalanceBefore = await publicClient.readContract({
        address: METH as `0x${string}`,
        abi: MOCK_TOKEN_ABI,
        functionName: "balanceOf",
        args: [account.address],
    });
    const fbtcBalanceBefore = await publicClient.readContract({
        address: FBTC as `0x${string}`,
        abi: MOCK_TOKEN_ABI,
        functionName: "balanceOf",
        args: [account.address],
    });
    console.log(`   mETH: ${Number(methBalanceBefore) / 1e18} mETH`);
    console.log(`   fBTC: ${Number(fbtcBalanceBefore) / 1e18} fBTC\n`);

    // Mint mETH - try different methods
    try {
        console.log("⏳ Trying faucet() for mETH...");
        const methHash = await walletClient.writeContract({
            address: METH as `0x${string}`,
            abi: MOCK_TOKEN_ABI,
            functionName: "faucet",
        });
        console.log(`   Tx: ${methHash}`);
        await publicClient.waitForTransactionReceipt({ hash: methHash });
        console.log("✅ mETH received from faucet!\n");
    } catch (error: any) {
        console.log("   faucet() failed, trying mint(amount)...");
        try {
            const amount = BigInt("100000000000000000000"); // 100 tokens
            const methHash = await walletClient.writeContract({
                address: METH as `0x${string}`,
                abi: MOCK_TOKEN_ABI,
                functionName: "mint",
                args: [amount],
            });
            console.log(`   Tx: ${methHash}`);
            await publicClient.waitForTransactionReceipt({ hash: methHash });
            console.log("✅ mETH minted with amount!\n");
        } catch (error2: any) {
            console.log("   mint(amount) failed, trying mint(to, amount)...");
            try {
                const amount = BigInt("100000000000000000000"); // 100 tokens
                const methHash = await walletClient.writeContract({
                    address: METH as `0x${string}`,
                    abi: MOCK_TOKEN_ABI,
                    functionName: "mint",
                    args: [account.address, amount],
                });
                console.log(`   Tx: ${methHash}`);
                await publicClient.waitForTransactionReceipt({ hash: methHash });
                console.log("✅ mETH minted with to + amount!\n");
            } catch (error3: any) {
                console.error("❌ All mint methods failed for mETH");
                console.error("   Last error:", error3.message);
            }
        }
    }

    // Mint fBTC
    try {
        console.log("⏳ Minting fBTC...");
        const fbtcHash = await walletClient.writeContract({
            address: FBTC as `0x${string}`,
            abi: MOCK_TOKEN_ABI,
            functionName: "mint",
        });
        console.log(`   Tx: ${fbtcHash}`);
        await publicClient.waitForTransactionReceipt({ hash: fbtcHash });
        console.log("✅ fBTC minted!\n");
    } catch (error: any) {
        console.error("❌ Failed to mint fBTC:", error.message);
    }

    // Check balances after minting
    console.log("📊 Balances after minting:");
    const methBalanceAfter = await publicClient.readContract({
        address: METH as `0x${string}`,
        abi: MOCK_TOKEN_ABI,
        functionName: "balanceOf",
        args: [account.address],
    });
    const fbtcBalanceAfter = await publicClient.readContract({
        address: FBTC as `0x${string}`,
        abi: MOCK_TOKEN_ABI,
        functionName: "balanceOf",
        args: [account.address],
    });
    console.log(`   mETH: ${Number(methBalanceAfter) / 1e18} mETH`);
    console.log(`   fBTC: ${Number(fbtcBalanceAfter) / 1e18} fBTC\n`);

    console.log("🎉 Done! You can now use these tokens to create a vault.\n");
}

mintTokens().catch(console.error);

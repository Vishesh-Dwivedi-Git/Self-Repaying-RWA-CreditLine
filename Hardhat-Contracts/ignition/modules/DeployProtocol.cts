import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// Mint amounts for testing
const TREASURY_MINT = 10000000n * 10n ** 6n;  // 10M USDC (6 decimals)

// Manual prices (since Chainlink not available on Mantle Sepolia)
const METH_PRICE = 3500n * 10n ** 18n;        // $3500 per mETH
const FBTC_PRICE = 60000n * 10n ** 18n;       // $60000 per fBTC

export default buildModule("DeployProtocol", (m) => {
  // Mock Tokens
  const meth = m.contract("MockMETH");
  const fbtc = m.contract("MockFBTC");
  const usdc = m.contract("MockStablecoin", ["Mock USDC", "mUSDC", 6]);

  // SimplePriceOracle with manual prices (for testnet)
  const oracle = m.contract("SimplePriceOracle");

  // Set manual prices for testnet
  m.call(oracle, "setPrice", [meth, METH_PRICE], { id: "setMethPrice" });
  m.call(oracle, "setPrice", [fbtc, FBTC_PRICE], { id: "setFbtcPrice" });

  // Core Protocol - VaultManager
  const vaultManager = m.contract("AutoRepaymentVaultManager", [usdc, oracle]);

  // Configure protocol - add supported collaterals
  m.call(vaultManager, "addSupportedCollateral", [meth], { id: "addMethCollateral" });
  m.call(vaultManager, "addSupportedCollateral", [fbtc], { id: "addFbtcCollateral" });

  // Fund protocol treasury with USDC
  m.call(usdc, "mint", [vaultManager, TREASURY_MINT], { id: "mintTreasuryUsdc" });

  return { vaultManager, meth, fbtc, usdc, oracle };
});

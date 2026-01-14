// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IYieldBearingAsset {
    function getPendingYield(address account) external view returns (uint256);

    function claimYield(address account) external returns (uint256);
}

interface IPriceOracle {
    function getAssetValue(
        address asset,
        uint256 amount
    ) external view returns (uint256);
}

contract AutoRepaymentVaultManager is ReentrancyGuard, Ownable {
    /// @dev User vault data
    struct Vault {
        uint256 collateralAmount;
        uint256 debtAmount;
        uint256 lastYieldClaim;
        address collateralAsset;
        bool isActive;
        uint256 lastAutoCheck;
    }

    /// @dev Mappings
    mapping(address => Vault) public vaults;
    mapping(address => bool) public supportedCollateral;
    mapping(address => bool) public keepers;

    /// @dev Track all vault owners for keeper scanning
    address[] public allVaultOwners;
    uint256 public totalVaults;

    /// @dev Protocol constants
    uint256 public constant LTV_RATIO = 70;
    uint256 public constant LIQUIDATION_THRESHOLD = 85;
    uint256 public constant PROTOCOL_FEE = 20;
    uint256 public constant BASIS_POINTS = 100;

    /// @dev Auto-repayment config
    uint256 public minYieldThreshold = 1e15; // Min yield to process
    uint256 public autoCheckInterval = 1 hours; // Min time between checks

    /// @dev Immutable addresses
    address public immutable stablecoin;
    address public immutable priceOracle;

    /// @dev Protocol stats
    uint256 public totalProtocolRevenue;
    uint256 public autoRepaymentCount;

    /// @dev Events
    event VaultCreated(
        address indexed user,
        address collateral,
        uint256 amount
    );
    event LoanIssued(address indexed user, uint256 amount);
    event AutoYieldApplied(
        address indexed user,
        uint256 yieldAmount,
        uint256 debtReduction
    );
    event VaultClosed(address indexed user);
    event Liquidated(address indexed user, uint256 collateralSeized);
    event KeeperExecuted(address indexed keeper, uint256 processedVaults);
    event CollateralAdded(address indexed user, uint256 amount);

    /// @dev Modifiers
    modifier onlyKeeper() {
        require(keepers[msg.sender] || msg.sender == owner(), "Not keeper");
        _;
    }

    constructor(address _stablecoin, address _priceOracle) Ownable(msg.sender) {
        stablecoin = _stablecoin;
        priceOracle = _priceOracle;
        keepers[msg.sender] = true; // Deployer is initial keeper
    }

    /// @notice Deposit collateral and borrow stablecoins (ONE-TIME USER ACTION)
    function depositCollateralAndBorrow(
        address collateralAsset,
        uint256 collateralAmount,
        uint256 borrowAmount
    ) external nonReentrant {
        require(supportedCollateral[collateralAsset], "Unsupported collateral");
        require(!vaults[msg.sender].isActive, "Vault exists");
        require(borrowAmount > 0, "Must borrow");

        // ✅ CRITICAL: Validate borrowAmount against LTV using oracle
        uint256 collateralValue = IPriceOracle(priceOracle).getAssetValue(
            collateralAsset,
            collateralAmount
        );
        uint256 maxBorrow = (collateralValue * LTV_RATIO) / BASIS_POINTS;
        require(borrowAmount <= maxBorrow, "Exceeds LTV limit");

        // Transfer collateral to protocol
        IERC20(collateralAsset).transferFrom(
            msg.sender,
            address(this),
            collateralAmount
        );

        // Create vault & track for scanning
        vaults[msg.sender] = Vault({
            collateralAmount: collateralAmount,
            debtAmount: borrowAmount,
            lastYieldClaim: block.timestamp,
            collateralAsset: collateralAsset,
            isActive: true,
            lastAutoCheck: block.timestamp
        });

        allVaultOwners.push(msg.sender);
        totalVaults++;

        // Issue stablecoin loan
        IERC20(stablecoin).transfer(msg.sender, borrowAmount);

        emit VaultCreated(msg.sender, collateralAsset, collateralAmount);
        emit LoanIssued(msg.sender, borrowAmount);
    }

    /// @notice Add more collateral to existing vault
    function addCollateral(uint256 amount) external nonReentrant {
        Vault storage vault = vaults[msg.sender];
        require(vault.isActive, "No active vault");
        require(amount > 0, "Amount must be > 0");

        // Transfer collateral to protocol
        IERC20(vault.collateralAsset).transferFrom(
            msg.sender,
            address(this),
            amount
        );

        // Update vault state
        vault.collateralAmount += amount;

        emit CollateralAdded(msg.sender, amount);
    }

    /// @notice Keeper: Auto-repay ONE vault using yield
    /// @dev Optimized: checks yield first (cheap), then price (expensive)
    function processAutoRepayment(address user) public nonReentrant onlyKeeper {
        Vault storage vault = vaults[user];
        require(vault.isActive && vault.debtAmount > 0, "Invalid vault");

        // 1. YIELD FIRST (cheap check)
        uint256 pendingYield = IYieldBearingAsset(vault.collateralAsset)
            .getPendingYield(user);
        require(pendingYield >= minYieldThreshold, "Yield too low");

        // 2. PRICE ONLY NOW (expensive - oracle call)
        uint256 collateralValue = IPriceOracle(priceOracle).getAssetValue(
            vault.collateralAsset,
            vault.collateralAmount
        );
        uint256 healthFactor = (collateralValue * 100) / vault.debtAmount;
        require(healthFactor >= 120, "Unhealthy vault"); // Safety check

        // 3. Claim yield from collateral asset
        uint256 yieldEarned = IYieldBearingAsset(vault.collateralAsset)
            .claimYield(user);
        if (yieldEarned == 0) return; // No yield available

        // Split: 80% debt repayment, 20% protocol fee
        uint256 protocolShare = (yieldEarned * PROTOCOL_FEE) / BASIS_POINTS;
        uint256 debtRepayment = yieldEarned - protocolShare;

        // Apply to debt (cap at remaining debt)
        if (debtRepayment >= vault.debtAmount) {
            debtRepayment = vault.debtAmount;
            vault.debtAmount = 0;
        } else {
            vault.debtAmount -= debtRepayment;
        }

        // Update timestamps & stats
        vault.lastYieldClaim = block.timestamp;
        vault.lastAutoCheck = block.timestamp;
        totalProtocolRevenue += protocolShare;
        autoRepaymentCount++;

        // Transfer protocol fee
        IERC20(vault.collateralAsset).transfer(owner(), protocolShare);

        emit AutoYieldApplied(user, yieldEarned, debtRepayment);

        // Auto-emit closed event if fully repaid
        if (vault.debtAmount == 0) {
            emit VaultClosed(user);
        }
    }

    /// @notice Keeper: Batch process multiple vaults (GAS EFFICIENT)
    function processMultipleAutoRepayments(
        address[] calldata users
    ) external nonReentrant onlyKeeper {
        uint256 processed = 0;
        for (uint256 i = 0; i < users.length; i++) {
            try this.processAutoRepayment(users[i]) {
                processed++;
            } catch {} // Continue on individual failures
        }
        emit KeeperExecuted(msg.sender, processed);
    }

    /// @notice Keeper: Get paginated list of ALL vault owners
    function getAllVaultOwners(
        uint256 start,
        uint256 limit
    ) external view returns (address[] memory) {
        uint256 end = start + limit > allVaultOwners.length
            ? allVaultOwners.length
            : start + limit;
        address[] memory result = new address[](end - start);
        for (uint256 i = start; i < end; i++) {
            result[i - start] = allVaultOwners[i];
        }
        return result;
    }

    /// @notice Owner: Add supported collateral (mETH, fBTC)
    function addSupportedCollateral(address collateral) external onlyOwner {
        supportedCollateral[collateral] = true;
    }

    /// @notice Owner: Add keeper address
    function addKeeper(address keeper) external onlyOwner {
        keepers[keeper] = true;
    }

    /// @notice User: Withdraw collateral when debt=0
    function withdrawCollateral() external nonReentrant {
        Vault storage vault = vaults[msg.sender];
        require(vault.isActive && vault.debtAmount == 0, "Cannot withdraw");

        uint256 amount = vault.collateralAmount;
        address collateral = vault.collateralAsset;

        vault.isActive = false;
        vault.collateralAmount = 0;

        IERC20(collateral).transfer(msg.sender, amount);
        emit VaultClosed(msg.sender);
    }

    /// @notice Get complete vault info (keeper uses this)
    function getVaultInfo(
        address user
    )
        external
        view
        returns (
            uint256 collateral,
            uint256 debt,
            uint256 pendingYield,
            uint256 healthFactor,
            bool active,
            bool readyForAutoRepay
        )
    {
        Vault memory vault = vaults[user];
        if (!vault.isActive) return (0, 0, 0, 0, false, false);

        collateral = vault.collateralAmount;
        debt = vault.debtAmount;
        pendingYield = IYieldBearingAsset(vault.collateralAsset)
            .getPendingYield(user);

        if (debt > 0) {
            uint256 collateralValue = IPriceOracle(priceOracle).getAssetValue(
                vault.collateralAsset,
                vault.collateralAmount
            );
            healthFactor = (collateralValue * 100) / debt;
        }

        active = true;
        readyForAutoRepay = (block.timestamp >=
            vault.lastAutoCheck + autoCheckInterval &&
            pendingYield >= minYieldThreshold);
    }
}

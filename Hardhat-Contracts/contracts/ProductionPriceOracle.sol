// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @dev Chainlink AggregatorV3Interface - defined locally to avoid npm dependency
interface AggregatorV3Interface {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );

    function decimals() external view returns (uint8);
}

contract ProductionPriceOracle is Ownable {
    mapping(address => AggregatorV3Interface) public priceFeeds;

    constructor() Ownable(msg.sender) {}

    /// @notice Set Chainlink price feed for asset
    function setPriceFeed(
        address asset,
        address chainlinkFeed
    ) external onlyOwner {
        priceFeeds[asset] = AggregatorV3Interface(chainlinkFeed);
    }

    /// @notice Get LIVE price from Chainlink (8 decimals)
    function getLatestPrice(address asset) public view returns (uint256) {
        AggregatorV3Interface feed = priceFeeds[asset];
        require(address(feed) != address(0), "No price feed");

        (, int256 price, , , ) = feed.latestRoundData();
        require(price > 0, "Invalid price");

        return uint256(price); // 8 decimals (Chainlink standard)
    }

    /// @notice Get asset value = amount * price (normalized to 18 decimals)
    function getAssetValue(
        address asset,
        uint256 amount
    ) external view returns (uint256) {
        uint256 price = getLatestPrice(asset);
        return (amount * price * 1e10) / 1e8; // Normalize 8dec → 18dec
    }
}

/// @title SimplePriceOracle - Manual price oracle for testing
/// @dev Use this for local/test environments, ProductionPriceOracle for mainnet
contract SimplePriceOracle is Ownable {
    mapping(address => uint256) public prices;

    event PriceUpdated(address indexed asset, uint256 price);

    constructor() Ownable(msg.sender) {}

    function setPrice(address asset, uint256 price) external onlyOwner {
        prices[asset] = price;
        emit PriceUpdated(asset, price);
    }

    function getPrice(address asset) external view returns (uint256) {
        uint256 price = prices[asset];
        require(price > 0, "Price not set");
        return price;
    }

    function getAssetValue(
        address asset,
        uint256 amount
    ) external view returns (uint256) {
        uint256 price = prices[asset];
        require(price > 0, "Price not set");
        return (amount * price) / 1e18;
    }
}

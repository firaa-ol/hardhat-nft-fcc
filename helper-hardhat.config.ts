import { ethers } from "hardhat";

export interface networkConfigItem {
    blockConfirmations?: number;
    name?: string;
    subscriptionId?: string;
    keepersUpdateInterval?: string;
    raffleEntranceFee?: string;
    callbackGasLimit?: string;
    vrfCoordinatorV2?: string;
    gasLane?: string;
    ethUsdPriceFeed?: string;
    mintFee?: string;
}

export interface networkConfigInfo {
    [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
    5: {
        name: "goerli",
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        subscriptionId: "10500",
        callbackGasLimit: "500000",
        blockConfirmations: 6,
        mintFee: "10000000000000000", // 0.01 ETH
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    },
    31337: {
        name: "hardhat",
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        callbackGasLimit: "500000",
        mintFee: "10000000000000000", // 0.01 ETH
    },
};
export const developmentChains = ["hardhat", "localhost"];

export const DECIMALS = "18";
export const INITIAL_PRICE = "200000000000000000000";

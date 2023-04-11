import { ethers, network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat.config";
import { VRFCoordinatorV2Mock } from "../typechain-types";
import verify from "../utils/verify";
import { DeployFunction } from "hardhat-deploy/types";

let tokenUris = [
    "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo",
    "ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d",
    "ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm",
];
const FUND_AMOUNT = ethers.utils.parseUnits("30").toString();

const randomIpfsDeploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deploy, log } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();
    const chainId = network.config.chainId ?? "";
    let vrfCoordinatorV2Address, subscriptionId;
    let vrfCoordinatorV2Mock: VRFCoordinatorV2Mock;

    if (developmentChains.includes(network.name)) {
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
        const tx = await vrfCoordinatorV2Mock.createSubscription();
        const txReceipt = await tx.wait(1);
        //@ts-ignore
        subscriptionId = txReceipt.events[0].args.subId;
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT);
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
        subscriptionId = networkConfig[chainId].subscriptionId;
    }

    log("-------------------------------------------");
    const args = [
        vrfCoordinatorV2Address,
        subscriptionId,
        networkConfig[chainId].gasLane,
        networkConfig[chainId].callbackGasLimit,
        tokenUris,
        networkConfig[chainId].mintFee,
    ];

    const randomIpfsNft = await deploy("RandomIpfsNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
    });

    if (developmentChains.includes(network.name)) {
        log("Register the raffle contract as consumer in the VRF Mock..");
        //@ts-ignore
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, randomIpfsNft.address);
    }

    log("-------------------------------------------");

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying....");
        await verify(randomIpfsNft.address, args);
    }
};

export default randomIpfsDeploy;
randomIpfsDeploy.tags = ["randomIpfs", "all"];

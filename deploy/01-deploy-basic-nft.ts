import { network } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat.config";
import verify from "../utils/verify";
import { DeployFunction } from "hardhat-deploy/types";

const basicNft: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deploy, log } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();

    log("-------------------------------------------");
    const args: any[] = [];
    const basicNft = await deploy("BasicNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: networkConfig[network.config.chainId ?? ""].blockConfirmations || 1,
    });

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying....");
        await verify(basicNft.address, args);
    }

    log("-------------------------------------------");
};

export default basicNft;
basicNft.tags = ["basicNft", "all"];

import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers, network } from "hardhat";
import { DECIMALS, INITIAL_PRICE, developmentChains } from "../helper-hardhat.config";
import { DeployFunction } from "hardhat-deploy/types";

const BASE_FEE = ethers.utils.parseEther("0.25"); //it costs 0.25 Link per request
const GAS_PRICE_LINK = 1e9; //calculated value based on the gas price of the chain

const mocksDeploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deploy, log } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();

    if (developmentChains.includes(network.name)) {
        log("Local network detected, Deploying mocks...");
        // deploy a mock vrfcoordinator

        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK],
        });

        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        });

        log("Mocks Deployed....");
        log("--------------------------------------------");
    }
};

export default mocksDeploy;
mocksDeploy.tags = ["mocks", "all"];

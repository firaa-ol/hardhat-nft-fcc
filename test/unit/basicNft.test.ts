import { assert } from "chai";
import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { developmentChains } from "../../helper-hardhat.config";
import { BasicNft } from "../../typechain-types";

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Basic Nft Unit Tests", async () => {
          let deployer: string;
          let basicNft: BasicNft;

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer;
              await deployments.fixture();
              basicNft = await ethers.getContract("BasicNft", deployer);
          });

          it("mints nft", async () => {
              const txResp = await basicNft.mintNft();
              await txResp.wait(1);
              const counter = await basicNft.getTokenCounter();
              const tokenUri = await basicNft.tokenURI(0);

              assert.equal(counter.toString(), "1");
              assert.equal(tokenUri, await basicNft.TOKEN_URI());
          });
      });

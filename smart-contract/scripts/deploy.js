const hre = require("hardhat");
var fs = require('fs');
require("dotenv").config({ path: ".env" });

async function main() {
  const subscriptionId = process.env.VRF_SUBSCRIPTION_ID;
  const vrfCoordinator = process.env.VRF_COORDINATOR;

  const LotteryGame = await hre.ethers.getContractFactory("LotteryGame");
  const lotteryGame = await LotteryGame.deploy(subscriptionId, vrfCoordinator);

  await lotteryGame.deployed();

  console.log(
    `Lottery Game deployed to ${lotteryGame.address}`
  );

  const contract_address_var = `export const CONTRACT_ADDRESS = "${lotteryGame.address}"`;
  
  // save to application
  fs.writeFile('../web-app/src/constants.js', contract_address_var, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

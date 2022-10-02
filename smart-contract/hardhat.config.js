require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const INFURA_API_KEY_URL = process.env.INFURA_API_KEY_URL;
const RINKEBY_PRIVATE_KEY = process.env.RINKEBY_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: '../web-app/src/artifacts',
  },
  // networks: {
  //   goerli: {
  //     url: INFURA_API_KEY_URL,
  //     accounts: [RINKEBY_PRIVATE_KEY],
  //   }
  // },
};

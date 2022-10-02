# Lottery Game Dapp
The lottery game dapp where players choose a lucky number and bet money after wait for owner publish the result (you win or lose).

## Features
* Bet with number and money
* History bet
* Show the number of players are betting
* Random number from Chainlink VRF V2

## Technology Stack
* Hardhat framework (Write, test and deploy smart contract)
* Solidity 0.8.0
* Chai (Test smart contract)
* Reactjs (Use function component)
* MUI (UI)
* Etherjs
* Chainlink (Verifiable Random)
* Infura, Goerli (Deploy smart contract)

## Project setup
### Smart contract
1. cd smart-contract
2. npm install
* **Deploy smart contract (local)**
1. npx hardhat node (keep terminal run, import accounts to metamask)
2. npx hardhat run scripts/deploy.js --network localhost (open another terminal)
* **Deploy smart contract (Goerli testnet)**
1. Create .env file and add:  
INFURA_API_KEY_URL: "rinkeby-network-endpoint-from-infura"  
RINKEBY_PRIVATE_KEY: "account-private-key"
2. npx hardhat run scripts/deploy.js --network goerli

### Frotend
1. cd web-app
2. npm install
3. npm start
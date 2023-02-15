# Store IPFS hash in blockchain using ExpressJS backend server

This project demonstrates a basic Hardhat use case, where a smart contract is written in solidity, which stores the IPFS hash for a certain date. A backend server written in ExpressJS, which handles the request to store data in IPFS and store the corresponding IPFS CID hash in the blockchain network. I have used energy web blockchain rpc url to upload the smart contract. However, you can use the blockchain of your own choice, and its corresponding rpc url. This repository comes with a smart contract, a backend server written in ExpressJS (index.js), and an HTML frontend to choose the file and store it in IPFS web3storage. 

To run the code, you need to run the following commands. 

```shell
npm install
```

You first need to compile the contract and upload it to the blockchain network. Run the following commands to compile and upload the contract.


```shell
npx hardhat compile
npx hardhat run --network volta scripts/deploy.js
```

Once the contract is uploaded to the blockchain, copy the contract address and copy it in the .env file. 
You can also use another blockchain by writing the blockchain's endpoint in truffle-config. 

Once you have pasted your private key and contract address in the .env file, simply run command 

```shell
node index.js
```

and go to http://localhost:3000 to select and upload file on IPFS, and corresponding hash in the blockchain network of your choice.


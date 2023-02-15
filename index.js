//Load express module with `require` directive
const express = require('express');
const fileUpload = require('express-fileupload');
const { Web3Storage, getFilesFromPath  } = require('web3.storage');
const { writeFile } = require("fs/promises");
const fsExtra = require('fs-extra');
const app = express();
var fs = require('fs');
const util = require('util')
app.use(
  fileUpload({
    extended: true,
  })
);
app.use(express.json());
const path = require("path");


const ethers = require('ethers')
//Define port
var port = 3000
//Define request response in root URL (/)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


app.post("/uploadData", async (req, res) => {
    //Getting form parameters from HTML
    var date = req.body.datefolder;
    var sampleFile = req.files.file1;
    var filename = req.files.file1.name; 
    // Setup date format for influxDB query

    async function moveFiletoServer() {   //storing file in project directory first...
        sampleFile.mv(__dirname + `/${filename}`, err => {
            if (err) {
             return res.status(500).send(err);
            }
            console.log("File added to server")
        });
    }
    
    
    async function deleteFiles() {
        fsExtra.emptyDirSync(__dirname + `${filename}`);
    }
    //res.send("Data uploaded to blockchain")
    
    
    async function uploaddatatoIPFS() {
        //Uploading file in IPFS web3 storage using the token
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGYwNTMwNUY1NUJiRjM4MjhjNjE2Q0RhYTk0ZDZGN2YzMDVjQTRjYzUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTIxMjY3NTM2MTIsIm5hbWUiOiJTdG9yYWdlU29sIn0.XH1EzxD93lUrJVVnO1uzpzDsmh4XG1PEsdgJdBpVvlk";
      const storage = new Web3Storage({ token: token });
      const files = await getFilesFromPath(__dirname + `/${filename}`);
      console.log(`read ${files.length} file(s) from path`)
      console.log("Uploading file to IPFS. Please wait...")
      const cid = await storage.put(files)
      console.log(`IPFS CID: ${cid}`)
      return(cid)
    }
    
    async function storeDataInBlockchain(date, hash) {
        //Storing the data in blockchain
      const { ethers } = require("hardhat");
      //Environment variables
      const API_URL = process.env.API_URL;
      const PRIVATE_KEY = process.env.PRIVATE_KEY;
      const CONTRACT_ADDRESS_1 = process.env.CONTRACT_ADDRESS;
      // Contract ABI
      const { abi } = require("./artifacts/contracts/IPFShashStorage.sol/IPFShashStorage.json");
      const provider = new ethers.providers.JsonRpcProvider(API_URL);
      // It calculates the blockchain address from private key
      const signer = new ethers.Wallet(PRIVATE_KEY, provider);
      //console.log(signer)
      const StorageContract = new ethers.Contract(CONTRACT_ADDRESS_1, abi, signer);
      let _hash = hash.toString();
      let _date = date;
    
      //Checking if data is already available for certain date and address
      const newMessage = await StorageContract.GetIPFShash(_date);
      if (newMessage == "") {
        console.log("Storing the IPFS hash...");
        const tx = await StorageContract.StoreIPFShash(_hash, _date);
        await tx.wait();
      }
      else {
        console.log("Data is already stored for this date")
      }
      // Shows the stored hash
      const newMessage1 = await StorageContract.GetIPFShash(_date);
      console.log("The stored hash is: " + newMessage1);
    }
    
    
    await moveFiletoServer();
    let hash = await uploaddatatoIPFS();
    
    await storeDataInBlockchain(date, hash)
    //await deleteFiles();
    res.send("ok");

    });


//Launch listening server on port 3000
app.listen(port, function () {
    console.log('app listening on port 3000!')
})
  
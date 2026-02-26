const Web3 = require("web3");

// ✅ Sepolia RPC URL
const web3 = new Web3("https://eth-sepolia.g.alchemy.com/v2/1HzWQFdzeKr2vjKAKlpwC");

// ✅ Your Sepolia private key
let privateKey = "0x462af996eada2c8e839880b679ee0fd21c332e9b34ee6a668e2d47bae1a78692";
if (!privateKey.startsWith("0x")) privateKey = "0x" + privateKey;

// ✅ Account setup
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

// ✅ FIXED ABI — removed outer [ ]
const contractABI = [
    {
        "inputs": [
            { "internalType": "string", "name": "_name", "type": "string" },
            { "internalType": "string", "name": "_batchNumber", "type": "string" },
            { "internalType": "string", "name": "_manufactureDate", "type": "string" },
            { "internalType": "string", "name": "_productHash", "type": "string" }
        ],
        "name": "addProduct",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "_productHash", "type": "string" },
            { "internalType": "address", "name": "newOwner", "type": "address" }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "_productHash", "type": "string" }
        ],
        "name": "getCurrentOwner",
        "outputs": [
            { "internalType": "address", "name": "", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "_productHash", "type": "string" }
        ],
        "name": "getOwnershipHistory",
        "outputs": [
            { "internalType": "address[]", "name": "", "type": "address[]" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            { "internalType": "address", "name": "", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "_productHash", "type": "string" }
        ],
        "name": "verifyProduct",
        "outputs": [
            { "internalType": "bool", "name": "", "type": "bool" },
            { "internalType": "string", "name": "", "type": "string" },
            { "internalType": "string", "name": "", "type": "string" },
            { "internalType": "string", "name": "", "type": "string" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// ✅ Contract address
const contractAddress = "0x7d14565cdcb92f626f834117528ecc206fc4e257";

// ✅ Create contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

module.exports = { web3, contract, account };

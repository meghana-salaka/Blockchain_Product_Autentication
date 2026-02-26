const { contract } = require("./web3Config");

(async () => {
  const hash = "bb4c9d7eaa12f98a00f18c6e3b0f52c1a1d8ee5a3a4c9e8b5e6c1a7f3b8a1234"; // Your DB-only product
  const result = await contract.methods.verifyProduct(hash).call();
  console.log("Raw blockchain result:", result);

  // Force boolean check
  const exists = (result[0] === true || result[0] === 'true');
  console.log("Decoded exists:", exists);
})();


const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { web3, contract, account } = require("../blockchain/web3Config");
require("dotenv").config();

// ===============================
// Transfer Product (All Transfers)
// ===============================
router.post("/transferProduct", async (req, res) => {
  console.log("\n==============================");
  console.log("📦 New Transfer Request Received");
  console.log("==============================");

  try {
    const { hash, newOwner, role } = req.body;
    console.log("Incoming body:", req.body);

    if (!hash || !newOwner || !role)
      return res.status(400).json({ message: "hash, newOwner, and role are required" });

    // Fetch product
    const product = await Product.findOne({ hash });
    if (!product) return res.status(404).json({ message: "Product not found in DB" });

    console.log("✅ Product found:", product.name);
    console.log("Current Owner:", product.currentOwner);
    console.log("New Owner:", newOwner);
    console.log("Role:", role);

    // Determine sender account dynamically
    let senderAccount = null;
    const currentOwner = product.currentOwner.toLowerCase();

    if (currentOwner === account.address.toLowerCase()) {
      senderAccount = account;
      console.log("🧾 Sender: Manufacturer account used");
    } else if (currentOwner === process.env.RETAILER_ADDRESS?.toLowerCase()) {
      senderAccount = web3.eth.accounts.privateKeyToAccount(process.env.RETAILER_PRIVATE_KEY);
      web3.eth.accounts.wallet.add(senderAccount);
      console.log("🧾 Sender: Retailer account used");
    } else {
      const customerMap = {
        [process.env.CUSTOMERA_ADDRESS?.toLowerCase()]: process.env.CUSTOMERA_PRIVATE_KEY,
        [process.env.CUSTOMERB_ADDRESS?.toLowerCase()]: process.env.CUSTOMERB_PRIVATE_KEY,
      };
      const key = customerMap[currentOwner];
      if (!key) return res.status(400).json({ message: "Unknown owner or missing private key" });
      senderAccount = web3.eth.accounts.privateKeyToAccount(key);
      web3.eth.accounts.wallet.add(senderAccount);
      console.log("🧾 Sender: Customer account used");
    }

    console.log("✅ Sender account resolved:", senderAccount.address);

    // Check sender balance
    const balance = await web3.eth.getBalance(senderAccount.address);
    if (Number(balance) === 0) return res.status(400).json({ message: "Insufficient balance for gas" });

    // Blockchain transfer
    let tx;
    try {
      tx = await contract.methods.transferOwnership(hash, newOwner).send({
        from: senderAccount.address,
        gas: 3000000,
      });
      console.log("✅ Blockchain transfer successful. Tx Hash:", tx.transactionHash);
    } catch (err) {
      console.error("❌ Blockchain transfer failed:", err.message);
      return res.status(500).json({ message: "Blockchain transfer failed", error: err.message });
    }

    // Update database
    product.currentOwner = newOwner;
    product.ownershipHistory.push({ owner: newOwner, timestamp: new Date(), role });

    // Map role → status
    if (role === "manufacturer") product.status = "Manufacturer_Owned";
    else if (role === "retailer") product.status = "Retailer_Owned";
    else if (role === "customer") {
      const customerHistory = product.ownershipHistory.filter(o => o.role === "customer");
      product.status = customerHistory.length === 1 ? "First_Buyer" : "Resold";
    }

    await product.save();

    console.log("✅ Database updated successfully!");
    console.log("==============================\n");

    return res.json({
      message: "✅ Ownership transferred successfully (on-chain + DB updated)",
      blockchainTx: tx.transactionHash,
      product,
    });

  } catch (err) {
    console.error("❌ Transfer route error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;


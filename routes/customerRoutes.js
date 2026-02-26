// routes/customer.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { web3, contract } = require("../blockchain/web3Config");
require("dotenv").config();

// ✅ Verify Product (Customer Verification)
router.post("/verifyProduct", async (req, res) => {
  try {
    const { hash, walletAddress } = req.body;

    console.log("\n==============================");
    console.log("🔍 Verify Product Request Received");
    console.log("==============================");
    console.log("Hash:", hash);
    console.log("Wallet Address:", walletAddress);
    console.log("==============================");

    if (!hash || !walletAddress) {
      return res.status(400).json({
        message: "❌ Product hash and wallet address are required",
      });
    }

    // ----------------------------
    // 1️⃣ Find product in DB
    // ----------------------------
    const product = await Product.findOne({ hash });
    if (!product) {
      console.log("❌ Product not found in DB");
      return res.status(404).json({
        message: "❌ Product not registered in Database or Blockchain",
        blockchain: false,
        database: false,
      });
    }

    // ----------------------------
    // 2️⃣ Check on Blockchain
    // ----------------------------
    let isOnChain = false;
    try {
      const result = await contract.methods.verifyProduct(hash).call();
      isOnChain = result[0] === true || result[0] === "true";
      console.log("✅ Blockchain verification result:", isOnChain);
    } catch (err) {
      console.warn("⚠️ Blockchain verification failed:", err.message);
      isOnChain = false;
    }

    // If product not found on-chain
    if (!isOnChain) {
      product.status = "DB_Only";
      await product.save();
      return res.status(200).json({
        message: "⚠️ Product found only in Database (not on Blockchain)",
        blockchain: false,
        database: true,
        productDetails: product,
      });
    }

    // ----------------------------
    // 3️⃣ Determine Ownership Status
    // ----------------------------
    const customerHistory = product.ownershipHistory.filter(
      (o) => o.role === "customer"
    );
    const isCurrentOwner =
      product.currentOwner.toLowerCase() === walletAddress.toLowerCase();

    let message = "";

    if (isCurrentOwner && customerHistory.length === 1) {
      // First genuine buyer
      product.status = "First_Buyer";
      message = "✅ You are the first genuine buyer!";
    } else if (isCurrentOwner && customerHistory.length > 1) {
      // Resold product
      product.status = "Resold";
      message = "⚠️ This product was already purchased before you.";
    } else {
      // Verified but not owned by this user
      message = "ℹ️ Product verified but you are not the current owner.";
    }

    await product.save();

    // ----------------------------
    // 4️⃣ Send Response
    // ----------------------------
    console.log("✅ Product Verification Complete!");
    console.log("Status:", product.status);
    console.log("==============================\n");

    res.status(200).json({
      message,
      blockchain: true,
      database: true,
      productDetails: product,
    });
  } catch (err) {
    console.error("❌ Server error in verifyProduct:", err);
    res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
});

module.exports = router;








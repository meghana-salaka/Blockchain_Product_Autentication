const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const QRCode = require("qrcode");
const Product = require("../models/Product");
const { web3, contract, account } = require("../blockchain/web3Config");

// ===============================
// Add Product (Manufacturer Route)
// ===============================
router.post("/addProduct", async (req, res) => {
  try {
    const {
      name,
      batchNumber,
      manufactureDate,
      expiryDate,
      sendToBlockchain = true,
    } = req.body;

    // 1️⃣ Generate unique hash for the product
    const hashInput = name + batchNumber + manufactureDate + expiryDate;
    const hash = crypto.createHash("sha256").update(hashInput).digest("hex");

    // 2️⃣ Prevent duplicates
    const existing = await Product.findOne({ hash });
    if (existing)
      return res.status(400).json({ message: "❌ Duplicate product found!" });

    // 3️⃣ Generate QR Code
    const qrData = { name, hash };
    const qrCodeUrl = await QRCode.toDataURL(JSON.stringify(qrData));

    let txHash = null;

    // 4️⃣ Manufacturer address (from web3Config)
    const manufacturerWallet = account.address;
    console.log("🏭 Manufacturer wallet address:", manufacturerWallet);

    // 5️⃣ Send to blockchain
    if (sendToBlockchain) {
      try {
        console.log("🚀 Sending product to blockchain...");
        const tx = await contract.methods
          .addProduct(name, batchNumber, manufactureDate, hash)
          .send({ from: manufacturerWallet, gas: 3000000 });
        console.log("✅ Blockchain TX Success:", tx.transactionHash);
        txHash = tx.transactionHash;
      } catch (err) {
        console.error("❌ Blockchain TX Failed:", err.message);
      }
    }

    // 6️⃣ Save product to MongoDB
    const newProduct = new Product({
      name,
      batchNumber,
      manufactureDate,
      expiryDate,
      hash,
      qrCodeUrl,
      manufacturerWallet,
      status: "Verified", // always verified on creation
      blockchainTx: txHash || null,
      currentOwner: manufacturerWallet,
      ownershipHistory: [
        { owner: manufacturerWallet, timestamp: new Date(), role: "manufacturer" },
      ],
    });

    await newProduct.save();

    // 7️⃣ Response
    res.status(201).json({
      message: txHash
        ? "✅ Product added successfully and stored on blockchain!"
        : "⚠ Product saved in DB only (blockchain failed)",
      blockchain: !!txHash,
      blockchainTx: txHash,
      product: newProduct,
    });
  } catch (err) {
    console.error("❌ Server Error Adding Product:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;

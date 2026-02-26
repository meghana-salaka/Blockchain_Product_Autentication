// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  batchNumber: { type: String, required: true },
  manufactureDate: { type: String, required: true },
  expiryDate: { type: String, required: true },
  hash: { type: String, unique: true, index: true },
  qrCodeUrl: { type: String },
  manufacturerWallet: { type: String },
  currentOwner: { type: String },

  ownershipHistory: [
    {
      owner: String,
      timestamp: { type: Date, default: Date.now },
      role: String,
    },
  ],

  status: {
    type: String,
    default: "Unverified",
    enum: [
      "Unverified",
      "DB_Only",
      "Verified",
      "First_Buyer",
      "Resold",
      "Ownership_Mismatch",
      "Retailer_Suspicious",
      "Manufacturer_Suspicious",
      "Fraud_Detected",
      "Manufacturer_Owned",
      "Retailer_Owned",
      "Customer_Owned",
    ],
  },

  blockchainTx: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Auto-update timestamp before save
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Product", productSchema);





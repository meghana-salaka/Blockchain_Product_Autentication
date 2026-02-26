const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// ✅ Track product by hash and return ownership history
router.get("/track/:hash", async (req, res) => {
  try {
    const { hash } = req.params;
    const product = await Product.findOne({ hash });

    if (!product)
      return res.status(404).json({ message: "Product not found in DB" });

    res.json({
      success: true,
      product: {
        name: product.name,
        batchNumber: product.batchNumber,
        manufactureDate: product.manufactureDate,
        expiryDate: product.expiryDate,
        currentOwner: product.currentOwner,
        status: product.status,
      },
      ownershipTimeline: product.ownershipHistory.map((o) => ({
        owner: o.owner,
        time: new Date(o.timestamp).toLocaleString(),
      })),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;

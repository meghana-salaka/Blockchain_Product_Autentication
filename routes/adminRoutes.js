const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/flagged", async (req, res) => {
  const suspicious = await Product.find({
    status: { $in: ["Ownership_Mismatch", "Retailer_Suspicious", "Manufacturer_Suspicious"] },
  });
  res.json({ suspicious });
});

module.exports = router;
 
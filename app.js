const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// --------------------
// Middleware
// --------------------
app.use(cors());
app.use(express.json());

// --------------------
// MongoDB connection
// --------------------
const MONGO_URI = 'mongodb+srv://admin:admin123@cluster0.pae3fe3.mongodb.net/fakeProductDB?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// --------------------
// Routes
// --------------------
const manufacturerRoutes = require("./routes/manufacturerRoutes");  // add product
const customerRoutes = require("./routes/customerRoutes");          // verify product
const retailerRoutes = require("./routes/retailerRoutes");          // transfer product (retailer & customer)
const productRoutes = require("./routes/productRoutes");            // track / ownership

// Mount routes
app.use("/manufacturer", manufacturerRoutes);
app.use("/customer", customerRoutes);
app.use("/retailer", retailerRoutes);
app.use("/products", productRoutes); // ✅ Added products route

// --------------------
// Test route
// --------------------
app.get('/', (req, res) => {
  res.send('✅ Server is running and MongoDB is connected!');
});

// --------------------
// Start server
// --------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
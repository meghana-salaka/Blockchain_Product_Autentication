import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ✅ Import all pages
import LandingPage from "./pages/LandingPage";
import RoleSelection from "./pages/RoleSelection";
import ManufacturerLogin from "./pages/ManufacturerLogin";
import ManufacturerDashboard from "./pages/ManufacturerDashboard";
import RetailerLogin from "./pages/RetailerLogin";
import RetailerDashboard from "./pages/RetailerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* 👥 Role Selection */}
        <Route path="/roles" element={<RoleSelection />} />

        {/* 🏭 Manufacturer */}
        <Route path="/manufacturer/login" element={<ManufacturerLogin />} />
        <Route path="/manufacturer/dashboard" element={<ManufacturerDashboard />} />

        {/* 🏪 Retailer */}
        <Route path="/retailer/login" element={<RetailerLogin />} />
        <Route path="/retailer/dashboard" element={<RetailerDashboard />} />

        {/* 👤 Customer */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

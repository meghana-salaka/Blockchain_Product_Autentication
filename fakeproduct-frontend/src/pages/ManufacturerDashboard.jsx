import React, { useState } from "react";
import axios from "axios";
import HeaderBar from "../components/HeaderBar";
import CanvasNetwork from "../components/CanvasNetwork";

export default function ManufacturerDashboard() {
  const [productData, setProductData] = useState({
    name: "",
    batchNumber: "",
    manufactureDate: "",
    expiryDate: "",
  });
  const [transferData, setTransferData] = useState({
    productHash: "",
    retailerWallet: "",
  });
  const [msg, setMsg] = useState("");
  const [tmsg, setTmsg] = useState("");
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingTransfer, setLoadingTransfer] = useState(false);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/roles";
  };

  async function addProduct(e) {
    e.preventDefault();
    setMsg("");
    setLoadingAdd(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/manufacturer/addProduct",
        productData
      );
      setMsg(res.data.message || "Added");
      setProductData({
        name: "",
        batchNumber: "",
        manufactureDate: "",
        expiryDate: "",
      });
    } catch (err) {
      setMsg(err.response?.data?.message || "Add failed");
    } finally {
      setLoadingAdd(false);
    }
  }

  async function transfer(e) {
    e.preventDefault();
    setTmsg("");
    setLoadingTransfer(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/retailer/transferProduct",
        {
          hash: transferData.productHash,
          newOwner: transferData.retailerWallet,
          role: "retailer",
        }
      );
      setTmsg(res.data.message || "Transferred");
      setTransferData({ productHash: "", retailerWallet: "" });
    } catch (err) {
      setTmsg(err.response?.data?.message || "Transfer failed");
    } finally {
      setLoadingTransfer(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      <CanvasNetwork intensity={1.25} />

      <div className="relative z-20">
        <HeaderBar title="Manufacturer" />

        {/* 🔒 Logout Button */}
        <button
  onClick={handleLogout}
  className="fixed top-5 right-6 z-[9999] px-4 py-2 
  bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all"
>
  Logout
</button>


        <main className="px-6 py-8 max-w-6xl mx-auto">
          <section className="grid md:grid-cols-2 gap-8">
            {/* Add Product */}
            <div className="backdrop-blur-md bg-white/5 border border-white/6 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-2">Add Product</h3>
              <form onSubmit={addProduct} className="space-y-3">
                <input
                  placeholder="Name"
                  required
                  value={productData.name}
                  onChange={(e) =>
                    setProductData({ ...productData, name: e.target.value })
                  }
                  className="w-full p-3 rounded bg-slate-800 text-white"
                />

                <input
                  placeholder="Batch Number"
                  required
                  value={productData.batchNumber}
                  onChange={(e) =>
                    setProductData({ ...productData, batchNumber: e.target.value })
                  }
                  className="w-full p-3 rounded bg-slate-800 text-white"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    required
                    value={productData.manufactureDate}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        manufactureDate: e.target.value,
                      })
                    }
                    className="p-3 rounded bg-slate-800 text-white"
                  />
                  <input
                    type="date"
                    required
                    value={productData.expiryDate}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        expiryDate: e.target.value,
                      })
                    }
                    className="p-3 rounded bg-slate-800 text-white"
                  />
                </div>

                <button className="w-full py-3 rounded bg-gradient-to-r from-blue-400 to-cyan-400 text-slate-900 font-semibold">
                  {loadingAdd ? "Adding..." : "Add Product"}
                </button>

                {msg && <div className="mt-2 text-green-300">{msg}</div>}
              </form>
            </div>

            {/* Transfer Section */}
            <div className="backdrop-blur-md bg-white/5 border border-white/6 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-2">
                Transfer to Retailer
              </h3>
              <form onSubmit={transfer} className="space-y-3">
                <input
                  placeholder="Product Hash"
                  required
                  value={transferData.productHash}
                  onChange={(e) =>
                    setTransferData({
                      ...transferData,
                      productHash: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded bg-slate-800 text-white"
                />

                <input
                  placeholder="Retailer Wallet"
                  required
                  value={transferData.retailerWallet}
                  onChange={(e) =>
                    setTransferData({
                      ...transferData,
                      retailerWallet: e.target.value,
                    })
                  }
                  className="w-full p-3 rounded bg-slate-800 text-white"
                />

                <button className="w-full py-3 rounded bg-gradient-to-r from-green-400 to-emerald-300 text-slate-900 font-semibold">
                  {loadingTransfer ? "Transferring..." : "Transfer"}
                </button>

                {tmsg && <div className="mt-2 text-yellow-200">{tmsg}</div>}
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

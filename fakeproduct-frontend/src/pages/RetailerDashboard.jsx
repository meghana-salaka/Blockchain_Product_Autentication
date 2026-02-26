import React, { useState } from "react";
import axios from "axios";
import HeaderBar from "../components/HeaderBar";
import CanvasNetwork from "../components/CanvasNetwork";

export default function RetailerDashboard() {
  const [transferData, setTransferData] = useState({
    productHash: "",
    newOwner: "",
  });
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState(null);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/roles";
  };

  const doTransfer = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/retailer/transferProduct",
        {
          hash: transferData.productHash,
          newOwner: transferData.newOwner,
          role: "customer",
        }
      );
      setResp(res.data);
      setTransferData({ productHash: "", newOwner: "" });
    } catch (err) {
      setResp({ message: err.response?.data?.message || "Transfer error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <CanvasNetwork intensity={1.25} />

      <div className="relative z-20">
        <HeaderBar title="Retailer" />

        {/* 🔒 Logout Button */}
        <button
  onClick={handleLogout}
  className="fixed top-5 right-6 z-[9999] px-4 py-2 
  bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all"
>
  Logout
</button>

        <main className="px-6 py-8 max-w-4xl mx-auto">
          <div className="backdrop-blur-md bg-white/5 border border-white/6 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-3">
              Transfer to Customer
            </h3>

            <div className="space-y-3">
              <input
                placeholder="Product Hash"
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
                placeholder="Customer Wallet"
                value={transferData.newOwner}
                onChange={(e) =>
                  setTransferData({
                    ...transferData,
                    newOwner: e.target.value,
                  })
                }
                className="w-full p-3 rounded bg-slate-800 text-white"
              />

              <button
                onClick={doTransfer}
                className="w-full py-3 rounded bg-gradient-to-r from-indigo-500 to-blue-400 
                text-slate-900 font-semibold"
              >
                {loading ? "Transferring..." : "Transfer Product"}
              </button>

              {resp && (
                <div className="mt-3 text-sm text-slate-200">{resp.message}</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

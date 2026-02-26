import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HeaderBar from "../components/HeaderBar";
import CanvasNetwork from "../components/CanvasNetwork";
import QrScanner from "qr-scanner";

export default function CustomerDashboard() {
  const navigate = useNavigate();

  const [verifyHash, setVerifyHash] = useState("");
  const [verifyWallet, setVerifyWallet] = useState("");
  const [verifyRes, setVerifyRes] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  // LOGOUT: use router navigate, stop scanner and clear storage
  const handleLogout = () => {
    console.log("Logout clicked — stopping scanner (if any) and navigating to /");
    // stop & destroy scanner safely
    if (scannerRef.current) {
      try {
        scannerRef.current.stop();
        scannerRef.current.destroy();
      } catch (e) {
        console.warn("Error stopping scanner:", e);
      }
      scannerRef.current = null;
    }
    localStorage.clear();
    // Use react-router navigation instead of window.location
    navigate("/roles", { replace: true });
  };

  // Verify product
  const doVerify = async () => {
    if (!verifyHash || !verifyWallet) {
      alert("Please enter product hash and wallet address.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/customer/verifyProduct", {
        hash: verifyHash,
        walletAddress: verifyWallet,
      });
      setVerifyRes(res.data);
    } catch (err) {
      console.error("❌ Verification error:", err.response?.data || err.message);
      setVerifyRes({ message: err.response?.data?.message || "Verification failed" });
    }
  };

  // Start / stop scanner
  useEffect(() => {
    if (showScanner && videoRef.current) {
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          console.log("📷 Scanned QR:", result.data);
          if (result.data && result.data !== "undefined") {
            setVerifyHash(result.data);
            setShowScanner(false);
            // give UI a small pause then verify
            setTimeout(() => doVerify(), 300);
          }
        },
        {
          onDecodeError: (error) => console.warn("Decode error:", error),
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
      scannerRef.current.start().catch((e) => {
        console.warn("QR scanner start failed:", e);
      });
    }

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop();
          scannerRef.current.destroy();
        } catch (e) {
          console.warn("scanner cleanup error:", e);
        }
        scannerRef.current = null;
      }
    };
  }, [showScanner]);

  return (
    <div className="relative min-h-screen">
      <CanvasNetwork intensity={1.25} />

      <div className="relative z-20">
        <HeaderBar title="Customer" />

        {/* 🔒 Logout Button - ensure it sits on top */}
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all z-[9999]"
          style={{ pointerEvents: "auto" }}
        >
          Logout
        </button>

        <main className="px-6 py-8 max-w-4xl mx-auto">
          <section className="grid grid-cols-1 gap-6">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-3">Verify Product</h3>
              <div className="space-y-3">
                <input
                  placeholder="Product Hash"
                  value={verifyHash}
                  onChange={(e) => setVerifyHash(e.target.value)}
                  className="w-full p-3 rounded bg-slate-800 text-white"
                />
                <input
                  placeholder="Your Wallet Address"
                  value={verifyWallet}
                  onChange={(e) => setVerifyWallet(e.target.value)}
                  className="w-full p-3 rounded bg-slate-800 text-white"
                />

                <div className="flex gap-3">
                  <button
                    onClick={doVerify}
                    className="flex-1 py-3 rounded bg-gradient-to-r from-green-400 to-cyan-400 text-slate-900 font-semibold"
                  >
                    Verify
                  </button>

                  <button
                    onClick={() => setShowScanner((s) => !s)}
                    className="py-3 px-4 rounded bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold"
                  >
                    {showScanner ? "Close Scanner" : "Scan QR"}
                  </button>
                </div>

                {showScanner && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-[9998]">
                    <div className="bg-gray-900 p-4 rounded-2xl shadow-2xl border border-indigo-500/40">
                      <h2 className="text-white text-lg font-semibold mb-3 text-center">
                        Scan Product QR Code
                      </h2>
                      <video
                        ref={videoRef}
                        className="rounded-xl border-4 border-indigo-500/70 shadow-lg"
                        style={{ width: "320px", height: "320px" }}
                      />
                      <button
                        onClick={() => setShowScanner(false)}
                        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                {verifyRes && (
                  <div className="mt-3 text-sm text-slate-200">
                    <div className="font-semibold">{verifyRes.message}</div>
                    {verifyRes.productDetails && (
                      <div className="mt-2 text-xs text-slate-300">
                        <div>Product: {verifyRes.productDetails.name}</div>
                        <div>Status: {verifyRes.productDetails.status}</div>
                        <div>Owner: {verifyRes.productDetails.currentOwner}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

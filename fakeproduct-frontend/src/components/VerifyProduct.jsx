import { useState } from "react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function VerifyProduct() {
  const [hash, setHash] = useState("");
  const [result, setResult] = useState(null);
  const [scanActive, setScanActive] = useState(false);
  const [nextOwner, setNextOwner] = useState("");

  // 🔹 Start QR Scanner
  const startScanner = () => {
    setScanActive(true);
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (decodedText) => {
        setHash(decodedText);
        setScanActive(false);
        scanner.clear();
      },
      (err) => console.warn(err)
    );
  };

  // 🔹 Verify Product (POST request)
  const handleVerify = async () => {
    if (!hash.trim()) return alert("Enter or scan a product hash first!");
    try {
      const res = await axios.post("http://localhost:5000/customer/verifyProduct", {
        hash,
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setResult({ message: "❌ Invalid or Fake Product" });
    }
  };

  // 🔹 Transfer Product (Resale)
  const handleTransfer = async () => {
    if (!hash.trim()) return alert("Please verify product first!");
    if (!nextOwner.trim()) return alert("Enter next owner's wallet address!");
    try {
      const res = await axios.post("http://localhost:5000/customer/transferProduct", {
        hash,
        newOwner: nextOwner,
      });
      alert(res.data.message);
      setNextOwner("");
    } catch (err) {
      console.error(err);
      alert("⚠️ Transfer failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center p-6">
      <div className="bg-gray-850 w-full max-w-md rounded-2xl shadow-2xl p-8 border border-gray-700">
        <h2 className="text-3xl font-semibold text-center mb-6 text-blue-400">
          🔍 Verify Product
        </h2>

        {/* Product Hash Input */}
        <input
          type="text"
          placeholder="Enter or Scan Product Hash"
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          className="w-full bg-gray-700 p-3 rounded-lg mb-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* QR Scanner */}
        <button
          onClick={startScanner}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg mb-4 font-semibold transition"
        >
          {scanActive ? "🔄 Scanning..." : "📷 Scan QR Code"}
        </button>

        {scanActive && <div id="reader" className="mb-4"></div>}

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold transition mb-4"
        >
          ✅ Verify Product
        </button>

        {/* Result */}
        {result && (
          <div
            className={`mt-3 p-4 rounded-xl text-center ${
              result.message?.includes("✅")
                ? "bg-green-700"
                : "bg-red-700"
            }`}
          >
            <p className="text-lg">{result.message}</p>
          </div>
        )}

        {/* Resale Transfer */}
        <div className="mt-8 border-t border-gray-700 pt-5">
          <h3 className="text-xl font-semibold mb-3 text-purple-400 text-center">
            🔁 Resale Transfer
          </h3>
          <input
            type="text"
            placeholder="Next Customer Wallet Address"
            value={nextOwner}
            onChange={(e) => setNextOwner(e.target.value)}
            className="w-full bg-gray-700 p-3 rounded-lg mb-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleTransfer}
            className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg font-semibold transition"
          >
            🔄 Transfer Product
          </button>
        </div>
      </div>
    </div>
  );
}



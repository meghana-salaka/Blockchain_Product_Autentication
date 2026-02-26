import { useState } from "react";
import axios from "axios";

export default function TransferProduct() {
  const [form, setForm] = useState({ hash: "", newOwner: "" });
  const [result, setResult] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/manufacturer/transferProduct", form);
      setResult(res.data.message);
    } catch (err) {
      setResult("⚠️ Transfer failed.");
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-8 shadow-lg mt-8">
      <h2 className="text-2xl font-semibold mb-4">Transfer Product</h2>
      <form onSubmit={handleTransfer} className="space-y-4">
        <input
          name="hash"
          placeholder="Product Hash"
          onChange={handleChange}
          className="w-full bg-gray-700 p-3 rounded-lg text-white placeholder-gray-400"
          required
        />
        <input
          name="newOwner"
          placeholder="Retailer Wallet Address"
          onChange={handleChange}
          className="w-full bg-gray-700 p-3 rounded-lg text-white placeholder-gray-400"
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg font-semibold"
        >
          Transfer
        </button>
      </form>
      {result && <p className="mt-4 text-center text-sm">{result}</p>}
    </div>
  );
}

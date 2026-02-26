import { useState } from "react";
import axios from "axios";

export default function AddProductForm() {
  const [form, setForm] = useState({
    name: "",
    batchNumber: "",
    manufactureDate: "",
    expiryDate: "",
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/manufacturer/addProduct", form);
      setResult(res.data.message);
    } catch (err) {
      setResult("❌ Error adding product");
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl p-8 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "batchNumber", "manufactureDate", "expiryDate"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field}
            onChange={handleChange}
            className="w-full bg-gray-700 p-3 rounded-lg text-white placeholder-gray-400"
            required
          />
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold"
        >
          Add Product
        </button>
      </form>
      {result && <p className="mt-4 text-center text-sm">{result}</p>}
    </div>
  );
}

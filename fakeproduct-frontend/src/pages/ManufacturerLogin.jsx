// ✅ src/pages/ManufacturerLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ManufacturerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary dummy credentials for testing
    if (email === "manufacturer@gmail.com" && password === "1234") {
      alert("Login successful!");
      navigate("/manufacturer/dashboard");
    } else {
      alert("Invalid credentials. Try again!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white p-6">
      <h1 className="text-3xl font-bold mb-6">👨‍🏭 Manufacturer Login</h1>

      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-xl shadow-lg w-80"
      >
        <label className="block mb-3 text-left text-gray-300">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full p-2 rounded-md text-black mb-4"
          required
        />

        <label className="block mb-3 text-left text-gray-300">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full p-2 rounded-md text-black mb-6"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 w-full py-2 rounded-md font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
}

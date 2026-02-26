import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-black/30 backdrop-blur-lg border-b border-gray-700">
      <h1
        className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 cursor-pointer"
        onClick={() => navigate("/")}
      >
        Fake Product DApp
      </h1>
      <button
        onClick={() => navigate("/")}
        className="bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2 rounded-lg font-semibold hover:opacity-90"
      >
        Logout
      </button>
    </nav>
  );
}


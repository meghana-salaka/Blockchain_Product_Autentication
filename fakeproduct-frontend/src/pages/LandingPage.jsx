// ✅ src/pages/LandingPage.jsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-purple-800 to-black flex flex-col justify-center items-center text-white text-center p-10">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl font-extrabold mb-6"
      >
        🛡️ Welcome to Fake Product Detection DApp
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-lg max-w-2xl mb-10 opacity-80"
      >
        A blockchain-powered system to verify product authenticity and prevent fake products.
        Scan, track, and verify genuine products easily using QR codes.
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/roles")}
        className="bg-gradient-to-r from-green-400 to-blue-500 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all"
      >
        🚀 Get Started
      </motion.button>
    </div>
  );
}

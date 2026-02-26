import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Factory, Store, User } from "lucide-react";

export default function RoleSelection() {
  const navigate = useNavigate();

  const roles = [
    {
      name: "Manufacturer",
      icon: <Factory size={60} />,
      color: "from-blue-500 to-cyan-400",
      path: "/manufacturer/login",
    },
    {
      name: "Retailer",
      icon: <Store size={60} />,
      color: "from-green-500 to-emerald-400",
      path: "/retailer/login",
    },
    {
      name: "Customer",
      icon: <User size={60} />,
      color: "from-purple-500 to-indigo-400",
      path: "/customer/dashboard",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl font-bold mb-12 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]"
      >
        Choose Your Role
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {roles.map((role, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(role.path)}
            className={`cursor-pointer bg-gradient-to-br ${role.color} p-[2px] rounded-2xl shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300`}
          >
            <div className="bg-gray-900 rounded-2xl p-8 flex flex-col items-center justify-center">
              <div className="mb-4 text-5xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                {role.icon}
              </div>
              <h2 className="text-2xl font-semibold">{role.name}</h2>
            </div>
          </motion.div>
        ))}
      </div>

      <p className="mt-12 text-gray-400 text-sm">
        Powered by <span className="text-blue-400">Blockchain Transparency</span>
      </p>
    </div>
  );
}


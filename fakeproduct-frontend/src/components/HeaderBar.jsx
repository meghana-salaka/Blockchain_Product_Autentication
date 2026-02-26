import React, { useState } from "react";
import { FiMoon, FiSun, FiUser, FiSettings } from "react-icons/fi";

/**
 * HeaderBar - reusable top header for each dashboard.
 * - animated neon text logo
 * - profile & settings popups (small in-page modals)
 * - dark mode toggle applies `.theme-dark` class to documentElement
 */
export default function HeaderBar({ title }) {
  const [dark, setDark] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const toggleDark = () => {
    const cls = "theme-dark";
    if (dark) {
      document.documentElement.classList.add(cls);
    } else {
      document.documentElement.classList.remove(cls);
    }
    setDark(!dark);
  };

  // initialize class on mount (safe)
  React.useEffect(() => {
    document.documentElement.classList.add("theme-dark");
  }, []);

  return (
    <>
      <header className="w-full flex items-center justify-between px-6 py-4 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 shadow-lg">
            {/* tiny badge mark */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h18" stroke="#021020" strokeWidth="2" strokeLinecap="round" />
              <path d="M6 7l6-4 6 4" stroke="#021020" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div>
            <div className="text-lg font-bold text-white tracking-wide flex items-center gap-3">
              <span className="logo-animated">Fake Product Detection System</span>
            </div>
            <div className="text-xs text-blue-200/60">{title || "Dashboard"}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setShowSettings(!showSettings); setShowProfile(false); }}
            className="p-2 rounded-md bg-white/5 hover:bg-white/8 transition relative"
            title="Settings"
          >
            <FiSettings className="text-slate-200" />
          </button>

          <button
            onClick={() => { setShowProfile(!showProfile); setShowSettings(false); }}
            className="p-2 rounded-md bg-white/5 hover:bg-white/8 transition relative"
            title="Profile"
          >
            <FiUser className="text-slate-200" />
          </button>

          <button
            onClick={toggleDark}
            className="p-2 rounded-md bg-white/5 hover:bg-white/8 transition"
            title="Toggle theme"
          >
            {dark ? <FiMoon className="text-blue-300" /> : <FiSun className="text-yellow-300" />}
          </button>
        </div>
      </header>

      {/* Settings popup */}
      {showSettings && (
        <div className="fixed top-20 right-6 z-50 w-64 bg-slate-900/90 border border-white/6 rounded-lg p-4 shadow-xl">
          <h4 className="font-semibold mb-2">Settings</h4>
          <div className="text-sm text-slate-300 mb-2">Theme & preferences</div>
          <div className="flex gap-2">
            <button
              onClick={() => { document.documentElement.classList.add("theme-dark"); setDark(true); }}
              className="flex-1 py-2 rounded bg-gradient-to-r from-blue-400 to-cyan-400 text-slate-900 font-semibold"
            >
              Dark
            </button>
            <button
              onClick={() => { document.documentElement.classList.remove("theme-dark"); setDark(false); }}
              className="flex-1 py-2 rounded border border-white/6"
            >
              Light
            </button>
          </div>
        </div>
      )}

      {/* Profile popup */}
      {showProfile && (
        <div className="fixed top-20 right-6 z-50 w-56 bg-slate-900/90 border border-white/6 rounded-lg p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">👤</div>
            <div>
              <div className="font-semibold">Demo User</div>
              <div className="text-xs text-slate-300">meghana@example.com</div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <button className="w-full py-2 rounded bg-white/5">View Profile</button>
            <button className="w-full py-2 rounded bg-red-600">Logout</button>
          </div>
        </div>
      )}

      {/* small neon-logo animation style */}
      <style>{`
        .logo-animated {
          background: linear-gradient(90deg, #bdefff, #60a5fa, #7c3aed);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 700;
          letter-spacing: 0.2px;
          text-shadow: 0 6px 24px rgba(96,165,250,0.08);
        }
      `}</style>
    </>
  );
}

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const { role } = (() => {
    try {
      const raw = localStorage.getItem("user");
      const user = raw ? JSON.parse(raw) : null;
      return { role: user?.role || "Guest" };
    } catch {
      return { role: "Guest" };
    }
  })();

  // Close on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  // ⭐ SUPER FAST ANIMATION VARIANTS (no stagger, instant)
  const container = {
    hidden: { opacity: 0, y: -4, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.12, // fast
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -4,
      scale: 0.98,
      transition: {
        duration: 0.1, // fast hide
        ease: "easeIn",
      },
    },
  };

  return (
    <nav
      className="
        w-full px-6 py-4 shadow-md 
        bg-gradient-to-r from-gray-900 to-gray-700 
        text-white flex justify-between items-center
      "
    >
      <Link to="/" className="text-2xl font-extrabold tracking-wide">
        <span className="text-white">Inventory</span>
        <span className="text-yellow-400">Pro</span>
      </Link>

      {/* Profile Menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((s) => !s)}
          className="text-3xl hover:text-yellow-300 transition"
        >
          <FaUserCircle />
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              exit="exit"
              className="absolute right-0 mt-3 w-52 bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 py-3 z-50"
              style={{ transformOrigin: "top right" }}
            >
              <div className="px-4 pb-2 border-b border-gray-200">
                <p className="font-semibold text-sm">Signed in as:</p>
                <p className="text-xs text-gray-600 capitalize">{role}</p>
              </div>

              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-100 text-sm"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>

              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 text-sm"
              >
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

// src/pages/auth/Login.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearAuthError } from "../../stores/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

/**
 * Themed Login page for InventoryPro (dark teal)
 * - Preserves behavior: dispatch(loginUser), error handling, redirect to /dashboard
 * - Updated visuals to match CompanyRegister theme
 */

const THEME = {
  bgDeep: "#071126",
  bgDeep2: "#061021",
  accent: "#00D1B2",
  accentSoft: "#8BE9FF",
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux auth state
  const { user, loading, error } = useSelector((state) => state.auth || {});

  // Local form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  // Show backend / auth errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  // On successful login
  useEffect(() => {
    if (user) {
      toast.success("Login successful");
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Username and password are required");
      return;
    }

    // Dispatch login (keeps existing thunk)
    dispatch(loginUser({ username, password, remember }));
  };

  const heroGradient = `radial-gradient(900px 300px at 10% 10%, rgba(0,209,178,0.06), transparent 6%), linear-gradient(180deg, ${THEME.bgDeep} 0%, ${THEME.bgDeep2} 100%)`;

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: heroGradient }}>
      <div className="w-full max-w-md">
        <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-8 border" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">
              Inventory<span style={{ color: THEME.accentSoft }}>Pro</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">Sign in to manage inventory, purchases and sales</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-gray-300">Email / Username</label>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="you@example.com"
                className="w-full px-3 py-2 rounded-md bg-black/20 border border-white/8 text-white placeholder:text-gray-400"
                disabled={loading}
                aria-label="Email or username"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter password"
                className="w-full px-3 py-2 rounded-md bg-black/20 border border-white/8 text-white placeholder:text-gray-400"
                disabled={loading}
                aria-label="Password"
              />
            </div>

            <div className="flex items-center justify-between text-sm text-gray-300">
              

              {/* lightweight help / contact link */}
              
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-md font-semibold"
              style={{
                background: THEME.accent,
                color: "#071126",
                boxShadow: "0 6px 18px rgba(0,209,178,0.08)",
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-400">
            New company?{" "}
            <Link to="/companies/register" className="text-teal-200 font-semibold hover:underline">Register here</Link>
          </div>

          <div className="mt-6 text-xs text-gray-400 text-center">
            By signing in you agree to our <a className="text-teal-200 underline" href="#terms">Terms</a> and <a className="text-teal-200 underline" href="#privacy">Privacy Policy</a>.
          </div>
        </div>

      </div>
    </div>
  );
}

// src/pages/companies/CompanyRegister.jsx
import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { registerCompany } from "../../stores/slices/companySlice";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function CompanyRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Password strength calculation
  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const percent = (score / 4) * 100;

    const levels = [
      { label: "Very Weak", color: "bg-red-600", badge: "text-red-400 border-red-400" },
      { label: "Weak",      color: "bg-orange-500", badge: "text-orange-400 border-orange-400" },
      { label: "Fair",      color: "bg-yellow-400", badge: "text-yellow-400 border-yellow-400" },
      { label: "Good",      color: "bg-green-400", badge: "text-green-400 border-green-400" },
      { label: "Strong",    color: "bg-green-600", badge: "text-green-500 border-green-500" }
    ];

    const idx = Math.max(0, Math.min(4, score));
    return { score, percent, ...levels[idx] };
  }, [password]);

  const submitCompany = async (e) => {
    e.preventDefault();

    // basic validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg("All fields are mandatory.");
      toast.error("All fields are mandatory.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (strength.score < 2) {
      setErrorMsg("Use a stronger password (mix cases, numbers or symbols).");
      toast.error("Use a stronger password (mix cases, numbers or symbols).");
      return;
    }

    setErrorMsg("");
    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
      };

      await dispatch(registerCompany(payload)).unwrap?.();

      toast.success("Registration successful! Please login.");
      // do NOT auto-login; redirect to login page
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center
                 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white"
    >
      <div className="bg-gray-800/60 backdrop-blur-lg p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-4">
          <span className="text-white">Inventory</span>
          <span className="text-yellow-400">Pro</span>
        </h1>

        <h2 className="text-xl mb-4 font-semibold text-center">Company Registration</h2>

        {errorMsg && <p className="mb-4 text-red-400 text-center">{errorMsg}</p>}

        <form onSubmit={submitCompany} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Company Name</label>
            <input
              className="w-full p-2 rounded text-black"
              placeholder="Company Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Email</label>
            <input
              className="w-full p-2 rounded text-black"
              placeholder="Email"
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Password</label>
            <div className="relative flex items-center">
              <input
                className="w-full p-2 rounded text-black pr-10"
                placeholder="Create a password (min 8 chars)"
                value={password}
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                aria-describedby="pwd-strength"
                disabled={loading}
              />

              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>

              {/* Strength badge */}
              {password.length > 0 && (
                <span
                  className={`absolute -top-6 right-0 text-xs px-2 py-[1px] rounded-full border font-semibold ${strength.badge}`}
                >
                  {strength.label}
                </span>
              )}
            </div>

            {/* Strength bar */}
            <div className="mt-2">
              <div className="w-full bg-gray-700 rounded h-2 overflow-hidden">
                <div
                  className={`${strength.color} h-2`}
                  style={{ width: `${strength.percent}%`, transition: "width 250ms" }}
                />
              </div>

              <div className="flex justify-between mt-1 text-xs text-gray-300">
                <span id="pwd-strength">{strength.label}</span>
                <span>{password.length} characters</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-300 disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register Company"}
          </button>
        </form>

        {/* Already have account */}
        <div className="mt-4 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-300 font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

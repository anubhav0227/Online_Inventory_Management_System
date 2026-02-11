// src/pages/auth/Login.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies } from "../../stores/slices/companySlice";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // load companies to check company user credentials
  const { list: companies = [], loading } = useSelector((s) => s.companies || {});
  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingLocal, setLoadingLocal] = useState(false);

  // hard-coded admin (single root) — credentials kept in logic only
  const ADMIN_EMAIL = "admin@inventorypro.com";
  const ADMIN_PASSWORD = "admin123";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingLocal(true);

    if (!email.trim() || !password.trim()) {
      toast.error("Email and password are required");
      setLoadingLocal(false);
      return;
    }

    try {
      // Admin login
      if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser = {
          id: "root-admin",
          name: "Root Admin",
          email: ADMIN_EMAIL,
          role: "admin",
          token: "admin-token-demo",
        };

        localStorage.setItem("user", JSON.stringify(adminUser));
        toast.success("Logged in as Admin");

        // <-- Changed: admin now goes to Dashboard (not /companies)
        navigate("/dashboard");
        return;
      }

      // Company login
      const company = companies.find(
        (c) =>
          String(c.email).toLowerCase() === String(email).toLowerCase() &&
          c.password === password
      );

      if (company) {
        const companyUser = {
          id: company.id,
          name: company.name,
          email: company.email,
          role: "company",
          token: "company-token-demo",
        };

        localStorage.setItem("user", JSON.stringify(companyUser));
        toast.success(`Welcome, ${company.name}`);
        navigate("/dashboard");
        return;
      }

      // No match
      toast.error("Invalid credentials. Try admin or registered company account.");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed");
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <div className="w-[420px] bg-gray-800/60 backdrop-blur p-8 rounded-2xl border border-gray-700 shadow-xl text-white">
        <h1 className="text-2xl font-bold mb-4 text-center">
          <span className="text-white">Inventory</span>
          <span className="text-yellow-400">Pro</span>
        </h1>

        <p className="text-sm text-gray-300 mb-6 text-center">
          Sign in to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Email</label>
            <input
              type="email"
              className="w-full p-2 rounded text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Password</label>
            <input
              type="password"
              className="w-full p-2 rounded text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-yellow-400 text-gray-900 font-bold rounded"
            disabled={loadingLocal || loading}
          >
            {loadingLocal || loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-gray-400">
          <div className="mt-2">
            New company? <Link to="/companies/register" className="text-yellow-300">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

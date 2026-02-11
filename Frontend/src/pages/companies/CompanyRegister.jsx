import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { registerCompany } from "../../stores/slices/companySlice";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

/**
 * Themed Company Register — dark teal dashboard look (InventoryPro)
 * - Behavior preserved: dispatch(registerCompany), validation, navigation
 * - UI updated to match the dashboard landing theme (teal accent)
 */

const THEME = {
  bgDeep: "#071126",
  bgDeep2: "#061021",
  accent: "#00D1B2",
  accentSoft: "#8BE9FF",
  glass: "rgba(255,255,255,0.04)",
};

export default function CompanyRegister() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // email == username
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ui state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ================= PASSWORD STRENGTH =================
  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const percent = (score / 4) * 100;

    // map to THEME-friendly classes
    const levels = [
      { label: "Very weak", colorClass: "bg-red-600" },
      { label: "Weak", colorClass: "bg-orange-500" },
      { label: "Fair", colorClass: "bg-yellow-400" },
      { label: "Good", colorClass: "bg-emerald-400" },
      { label: "Strong", colorClass: "bg-teal-400" },
    ];

    return { score, percent, ...levels[Math.min(score, 4)] };
  }, [password]);

  // ================= SUBMIT =================
  const submitCompany = async (e) => {
    e.preventDefault();

    // basic validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password.length < 8 || strength.score < 2) {
      toast.error("Please use a stronger password");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await dispatch(
        registerCompany({
          name: name.trim(),
          username: email.trim(), // MUST match backend
          password,
        })
      ).unwrap();

      toast.success("Registration successful! Please log in.");
      navigate("/login", { replace: true });
    } catch (err) {
      const msg = typeof err === "string" ? err : (err?.message ?? "Registration failed");
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const heroGradient = `radial-gradient(900px 300px at 10% 10%, rgba(0,209,178,0.06), transparent 6%), linear-gradient(180deg, ${THEME.bgDeep} 0%, ${THEME.bgDeep2} 100%)`;

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: heroGradient }}>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT — Form */}
        <div className="bg-slate-900/60 backdrop-blur-sm rounded-2xl p-8 border" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold">
              Inventory<span style={{ color: THEME.accentSoft }}>Pro</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">Create your company account — manage inventory with clarity.</p>
          </div>

          {errorMsg && (
            <div className="mb-4 text-center text-sm text-red-400">{errorMsg}</div>
          )}

          <form onSubmit={submitCompany} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-gray-300">Company name</label>
              <input
                className="w-full px-3 py-2 rounded-md bg-black/20 border border-white/8 text-white placeholder:text-gray-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                placeholder="Acme Pvt Ltd"
                aria-label="Company name"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 rounded-md bg-black/20 border border-white/8 text-white placeholder:text-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="company@example.com"
                aria-label="Company email"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-2 rounded-md bg-black/20 border border-white/8 text-white pr-10 placeholder:text-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                  aria-label="Password"
                  placeholder="Choose a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="mt-3">
                <div className="w-full bg-white/6 rounded h-2">
                  <div
                    className={`${strength.colorClass} h-2 rounded`}
                    style={{ width: `${strength.percent}%`, transition: "width 200ms" }}
                  />
                </div>

                <div className="flex justify-between text-xs mt-2 text-gray-300">
                  <span>{strength.label}</span>
                  <span>{password.length} chars</span>
                </div>
              </div>
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
              {loading ? "Registering..." : "Register Company"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-200 font-semibold hover:underline">Sign in</Link>
          </div>

          <div className="mt-6 text-xs text-gray-400">
            By creating an account you agree to our <a className="text-teal-200 underline" href="#terms">Terms</a> and <a className="text-teal-200 underline" href="#privacy">Privacy Policy</a>.
          </div>
        </div>

        {/* RIGHT — Benefits / Quick facts */}
        <aside className="bg-transparent rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold">Why InventoryPro?</h3>
              <p className="text-gray-400 mt-1">Tools to run inventory across stores and warehouses — simpler, faster, smarter.</p>
            </div>

            <ul className="space-y-3">
              <li className="flex gap-3 items-start">
                <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ background: "rgba(139,233,255,0.06)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-teal-200">
                    <path d="M5 12h14M12 5v14" stroke={THEME.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Automated reorders</div>
                  <div className="text-sm text-gray-400">Smart suggestions to reduce stockouts and overstocks.</div>
                </div>
              </li>

              <li className="flex gap-3 items-start">
                <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ background: "rgba(0,209,178,0.04)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-teal-200">
                    <path d="M3 7h18M3 12h18M3 17h18" stroke={THEME.accent} strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Unique features</div>
                  <div className="text-sm text-gray-400">Tools to run inventory across stores and warehouses faster & smarter.

</div>
                </div>
              </li>

              <li className="flex gap-3 items-start">
                <div className="w-9 h-9 rounded-md flex items-center justify-center" style={{ background: "rgba(0,209,178,0.03)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-teal-200">
                    <path d="M12 5v14M5 12h14" stroke={THEME.accent} strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Reports & alerts</div>
                  <div className="text-sm text-gray-400">Daily summaries and low-stock alerts delivered to your inbox.</div>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

// src/pages/LandingPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../stores/slices/productSlice";
import { fetchSales } from "../stores/slices/salesSlice";

/**
 * Landing page — extended with gallery, testimonials, pricing, FAQ,
 * animated counters, parallax hero, simulated live ticker and micro-interactions.
 *
 * Keep theme consistent with Dashboard (teal accent)
 */

const THEME = {
  bgDeep: "#0B1220",
  bgDeep2: "#071126",
  accent: "#00D1B2",
  accentSoft: "#8BE9FF",
  highlight: "#2DD4BF",
  glass: "rgba(255,255,255,0.04)",
};

const FALLBACK_PRODUCTS = [
  { id: 1, name: "Smart Controller X1", cat: "Hardware", price: 129, desc: "Compact handheld scanner for fast receiving and counts.", img: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=1200&q=60" },
  { id: 2, name: "Inventory Sync Pro (SaaS)", cat: "Software", price: 39, desc: "Cloud inventory, multi-location sync, and automated backups.", img: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=1200&q=60" },
  { id: 3, name: "Analytics Pack", cat: "Addon", price: 19, desc: "Advanced forecasting, exports and scheduled reports.", img: "https://images.unsplash.com/photo-1520975698518-9e3a2b6f9b3f?w=1200&q=60" },
  { id: 4, name: "Warehouse Kit — Starter", cat: "Hardware", price: 229, desc: "Scanner, dock, and starter label printer kit.", img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=60" },
  { id: 5, name: "Multi-store License", cat: "Software", price: 99, desc: "Manage multiple stores with role-based access.", img: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&q=60" },
  { id: 6, name: "Cold-Storage Sensor", cat: "IoT", price: 89, desc: "Temperature & humidity sensor with alerts for perishables.", img: "https://images.unsplash.com/photo-1508873699372-7ae2c56f1a52?w=1200&q=60" },
  { id: 7, name: "RFID Tag Pack", cat: "Accessories", price: 29, desc: "Bulk RFID tags for fast inventory counts.", img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&q=60" },
];

const INVENTORY_FACTS = [
  { title: "Days of Inventory Saved", stat: "34%", detail: "Average reduction in days-of-inventory after switching to automated reorders." },
  { title: "Stockouts Reduced", stat: "72%", detail: "Average drop in stockouts across our customers in 6 months." },
  { title: "PO Time Saved", stat: "5 hrs/wk", detail: "Average time procurement teams save with automated POs." },
];

const USE_CASES = [
  { title: "Retail — Faster Replenishment", desc: "Small to mid-size retailers reduce lost sales with automatic reorder suggestions and per-store safety stock.", img: "https://images.unsplash.com/photo-1520975915200-3d3a2c5d3b6b?w=1200&q=60" },
  { title: "Wholesale — Centralized Catalog", desc: "Wholesale operators manage multi-warehouse stock with per-location allocations and transfer recommendations.", img: "https://images.unsplash.com/photo-1556761175-129418cb2dfe?w=1200&q=60" },
  { title: "Food & Perishables — Expiry Alerts", desc: "Perishable inventory alerts ensure older stock is prioritized and waste is reduced.", img: "https://images.unsplash.com/photo-1542838687-8d150d7d0f3e?w=1200&q=60" },
];

const TESTIMONIALS = [
  { name: "Sonia Patel", title: "Inventory Lead — CornerMart", text: "InventoryPro cut our stockouts in half and freed the ops team to focus on strategy.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=60" },
  { name: "Liam Rivera", title: "Store Manager — HandyHome", text: "Setup was easy and the forecasts are shockingly accurate.", avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&q=60" },
  { name: "Aisha Khan", title: "Procurement Head — FreshFoods", text: "Expiry alerts saved us thousands in waste last quarter.", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=60" },
];

/* ---------- Sparkline (mini chart) ---------- */
function Sparkline({ values = [], width = 520, height = 72, stroke = THEME.accent }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  const padding = 6;
  if (!values || values.length === 0) {
    values = [...Array(20)].map((_, i) => Math.round(120 + Math.sin(i / 3) * 8 + Math.random() * 6));
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const stepX = (width - padding * 2) / Math.max(1, values.length - 1);
  const points = values.map((v, i) => {
    const x = padding + i * stepX;
    const y = padding + (1 - (v - min) / range) * (height - padding * 2);
    return { x, y, v, i };
  });
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(2)} ${height - padding} L ${points[0].x.toFixed(2)} ${height - padding} Z`;

  return (
    <div className="relative" style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="g1b2" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.22" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        <path d={areaD} fill="url(#g1b2)" stroke="none" />
        <path d={pathD} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {points.map((p) => (
          <circle
            key={p.i}
            cx={p.x}
            cy={p.y}
            r={6}
            fill="transparent"
            onMouseEnter={() => setHoverIdx(p.i)}
            onMouseLeave={() => setHoverIdx(null)}
            onFocus={() => setHoverIdx(p.i)}
            tabIndex={0}
            style={{ cursor: "pointer" }}
          />
        ))}

        {hoverIdx !== null && points[hoverIdx] && (
          <>
            <line x1={points[hoverIdx].x} x2={points[hoverIdx].x} y1={padding} y2={height - padding} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 4" />
            <circle cx={points[hoverIdx].x} cy={points[hoverIdx].y} r={4} fill={stroke} />
          </>
        )}
      </svg>

      {hoverIdx !== null && points[hoverIdx] && (
        <div
          className="absolute -translate-x-1/2 bg-slate-900 border border-white/6 px-2 py-1 text-xs rounded-md"
          style={{
            left: points[hoverIdx].x,
            top: points[hoverIdx].y - 36,
            transform: "translateX(-50%)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {points[hoverIdx].v} units
        </div>
      )}
    </div>
  );
}

/* ---------- FloatingChatbot (unchanged but slightly improved) ---------- */
function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ from: "bot", text: "Hi — I'm your Inventory Assistant. Ask about stock, reorders, or demos." }]);
  const [input, setInput] = useState("");

  function send() {
    if (!input.trim()) return;
    const u = input.trim();
    setMsgs((m) => [...m, { from: "user", text: u }]);
    setInput("");
    // mock bot reply
    setTimeout(() => {
      const reply = `I can help with: finding products, showing low stock, and explaining features. You asked: "${u}". (Demo)`;
      setMsgs((m) => [...m, { from: "bot", text: reply }]);
    }, 700);
  }

  return (
    <>
      <div style={{ position: "fixed", right: 24, bottom: 24, zIndex: 60 }}>
        {open && (
          <motion.div initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }} className="w-80 bg-slate-900 border border-white/6 rounded-xl shadow-lg overflow-hidden">
            <div className="px-3 py-2 bg-black/20 flex items-center justify-between">
              <div className="text-sm font-semibold">Inventory Assistant</div>
              <button className="text-xs text-gray-300" onClick={() => setOpen(false)}>✕</button>
            </div>
            <div className="p-3 max-h-64 overflow-auto space-y-3 text-sm">
              {msgs.map((m, i) => (
                <div key={i} className={`p-2 rounded-md ${m.from === "bot" ? "bg-white/4 text-gray-200" : "bg-white/8 text-black"}`} style={m.from === "bot" ? { textAlign: "left" } : { textAlign: "right" }}>
                  {m.text}
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-white/6 flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} className="flex-1 px-3 py-2 rounded-md bg-black/20 border border-white/8 text-sm" placeholder="Ask something..." />
              <button onClick={send} className="px-3 py-2 rounded-md" style={{ background: THEME.accent, color: "#071126" }}>Send</button>
            </div>
          </motion.div>
        )}

        <button onClick={() => setOpen((v) => !v)} className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center" style={{ background: THEME.accent }}>
          💬
        </button>
      </div>
    </>
  );
}

/* ---------- Parallax wrapper helper ---------- */
function ParallaxImage({ src, height = 360, children }) {
  // simple parallax on scroll
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function onScroll() {
      const rect = el.getBoundingClientRect();
      const offset = Math.min(Math.max((rect.top / window.innerHeight) * 40, -20), 20);
      el.style.backgroundPosition = `center ${50 + offset}%`;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div ref={ref} className="rounded-xl overflow-hidden relative" style={{ height }}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${src})`, filter: "saturate(0.95) contrast(0.95)", transformOrigin: "center" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/40" />
      <div className="relative z-10 h-full p-6 flex items-center">{children}</div>
    </div>
  );
}

/* ---------- Main LandingPage component ---------- */
export default function LandingPage() {
  const dispatch = useDispatch();
  const user = useSelector?.((s) => s?.auth?.user) ?? null;
  const isLoggedIn = !!user;

  // load real products & sales (if your store is wired)
  const productsFromStore = useSelector((s) => s.products?.list || []);
  const salesFromStore = useSelector((s) => s.sales?.list || []);
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchSales());
  }, [dispatch]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [galleryFilter, setGalleryFilter] = useState("All");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [liveTicker, setLiveTicker] = useState([
    { id: 1, text: "Warehouse A: 12 items low" },
    { id: 2, text: "Order #4892: awaiting supplier confirmation" },
    { id: 3, text: "Multi-store sync complete (3m ago)" },
  ]);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [faqOpenIdx, setFaqOpenIdx] = useState(null);

  // choose product list: prefer real store products (map to expected fields), otherwise fallback
  const PRODUCTS = (productsFromStore && productsFromStore.length > 0)
    ? productsFromStore.map((p) => ({
        id: p.id,
        name: p.name || p.productName || `Product ${p.id}`,
        cat: p.category || p.cat || "General",
        price: p.sellingPrice ?? p.price ?? 0,
        desc: p.description ?? p.shortDesc ?? "Great product for your store",
        img: (p.images && p.images[0]) || p.imageUrl || `https://images.unsplash.com/photo-1520975915200-3d3a2c5d3b6b?w=1200&q=60`,
      }))
    : FALLBACK_PRODUCTS;

  const categories = ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.cat)))];
  const filtered = PRODUCTS.filter((p) => {
    return (activeCategory === "All" || p.cat === activeCategory) &&
      p.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // mini chart from real sales (aggregate qty/day last 20 days) or fallback random
  const miniData = (() => {
    try {
      if (salesFromStore && salesFromStore.length > 0) {
        const days = 20;
        const today = new Date();
        const map = {};
        for (let i = 0; i < days; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() - (days - 1 - i));
          map[d.toISOString().slice(0, 10)] = 0;
        }
        for (const s of salesFromStore) {
          const d = s.createdAt || s.created_at || s.date || s.timestamp || s.time;
          if (!d) continue;
          const key = (new Date(d)).toISOString().slice(0, 10);
          if (key in map) map[key] += Number(s.quantity ?? s.qty ?? 1);
        }
        return Object.values(map).map(v => Math.round(v || 0));
      }
    } catch (e) { /* fallthrough */ }
    return Array.from({ length: 20 }).map((_, i) => Math.round(120 + Math.sin(i / 3) * 8 + (Math.random() - 0.5) * 12));
  })();

  // hero gradient + parallax background
  const heroGradient = `radial-gradient(1200px 400px at 10% 20%, rgba(0,209,178,0.07), transparent 8%), linear-gradient(180deg, ${THEME.bgDeep} 0%, ${THEME.bgDeep2} 100%)`;

  // simulate live ticker updates
  useEffect(() => {
    const t = setInterval(() => {
      setLiveTicker((prev) => {
        const next = [...prev];
        // rotate: small mutation for demo
        const first = next.shift();
        next.push({ id: Date.now(), text: first.text.replace(/\d+/, (m) => String(Math.max(1, Number(m) + (Math.random() > 0.5 ? 1 : -1)))) });
        return next;
      });
    }, 4200);
    return () => clearInterval(t);
  }, []);

  // testimonial auto-advance
  useEffect(() => {
    const t = setInterval(() => setTestimonialIndex((i) => (i + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(t);
  }, []);

  // simple newsletter capture (client-only)
  function submitNewsletter(e) {
    e.preventDefault();
    if (!newsletterEmail.includes("@")) {
      alert("Please enter a valid email.");
      return;
    }
    setNewsletterEmail("");
    alert("Thanks — subscription simulated (demo).");
  }

  const FAQS = [
    { q: "How quickly can I get started?", a: "You can sign up and connect your first store in under 10 minutes. Our onboarding prompts help you import SKUs and set safety stock." },
    { q: "Do you support multi-location transfers?", a: "Yes — InventoryPro supports transfers and per-location stock allocations with suggested transfers based on demand." },
    { q: "Can I export reports?", a: "Scheduled reports, CSV exports and API access are available on paid plans." },
  ];

  // gallery images (tags)
  const GALLERY = [
    { id: 1, tag: "warehouse", img: "https://images.unsplash.com/photo-1581093458798-7b8d4ff0b7a4?w=1400&q=60" },
    { id: 2, tag: "mobile", img: "https://images.unsplash.com/photo-1581091012184-8b2a00c5c8f2?w=1400&q=60" },
    { id: 3, tag: "team", img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1400&q=60" },
    { id: 4, tag: "analytics", img: "https://images.unsplash.com/photo-1551033406-611cf9f9f1b2?w=1400&q=60" },
    { id: 5, tag: "retail", img: "https://images.unsplash.com/photo-1542831371-d531d36971e6?w=1400&q=60" },
    { id: 6, tag: "iot", img: "https://images.unsplash.com/photo-1562577309-2592ab84b1bc?w=1400&q=60" },
  ];

  // gallery filtered list
  const galleryItems = GALLERY.filter(g => galleryFilter === "All" ? true : g.tag === galleryFilter);

  // animated counter helper
  function AnimatedCounter({ from = 0, to = 1000, duration = 1.6, prefix = "", suffix = "" }) {
    return (
      <motion.div initial={{ count: from }} animate={{ count: to }} transition={{ duration, ease: "easeOut" }}>
        {({ count }) => <div className="text-3xl font-bold">{prefix}{Math.round(count).toLocaleString()}{suffix}</div>}
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen text-gray-100" style={{ background: heroGradient }}>
      {/* NAV */}
      <nav className="sticky top-0 z-40" style={{ background: "rgba(5,7,10,0.45)", backdropFilter: "blur(6px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div style={{ background: THEME.accent }} className="p-2 rounded-md shadow">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect width="24" height="24" rx="6" fill="white" opacity="0.04" />
                  <path d="M5 12h14M12 5v14" stroke="#071126" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="font-extrabold tracking-tight">Inventory<span style={{ color: THEME.accentSoft }}>Pro</span></div>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-sm">
              <a href="#features" className="hover:underline">Features</a>
              <a href="#showcase" className="hover:underline">Showcase</a>
              <a href="#gallery" className="hover:underline">Gallery</a>
              <a href="#pricing" className="hover:underline">Pricing</a>
              <a href="#facts" className="hover:underline">Facts</a>
              <a href="#usecases" className="hover:underline">Use cases</a>
              {!isLoggedIn ? (
                <div className="flex gap-3">
                  <Link to="/login" className="px-4 py-2 rounded-md border border-white/10">Log in</Link>
                  <Link to="/companies/register" className="px-4 py-2 rounded-md" style={{ background: THEME.accent, color: "#071126", fontWeight: 700 }}>Get Started</Link>
                </div>
              ) : (
                <Link to="/dashboard" className="px-4 py-2 rounded-md" style={{ background: THEME.accent, color: "#071126", fontWeight: 700 }}>Dashboard</Link>
              )}
            </div>

            <div className="md:hidden">
              <button onClick={() => setMobileOpen((v) => !v)} className="p-2 rounded-md border border-white/6">
                {mobileOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-black/30 px-4 py-4">
            <div className="flex flex-col gap-3">
              <a href="#features" onClick={() => setMobileOpen(false)}>Features</a>
              <a href="#showcase" onClick={() => setMobileOpen(false)}>Showcase</a>
              <a href="#gallery" onClick={() => setMobileOpen(false)}>Gallery</a>
              <a href="#pricing" onClick={() => setMobileOpen(false)}>Pricing</a>
              <a href="#facts" onClick={() => setMobileOpen(false)}>Facts</a>
              <a href="#usecases" onClick={() => setMobileOpen(false)}>Use cases</a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <header className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, x: -36 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
            <div className="inline-flex items-center gap-3 bg-white/6 px-3 py-1 rounded-full text-sm">
              <span style={{ color: THEME.accent }}>Trusted by 1,200+ stores</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
              Inventory management for modern stores — <span style={{ background: `linear-gradient(90deg, ${THEME.accent}, ${THEME.accentSoft})`, WebkitBackgroundClip: "text", color: "transparent" }}>fast, reliable, effortless.</span>
            </h1>

            <p className="text-gray-300 max-w-xl">
              Manage stock, suppliers and sales with clarity. Avoid stockouts, reduce overstock, automate reorder flows and reclaim time for higher-value work.
            </p>

            <div className="flex gap-3 flex-wrap">
              <Link to={isLoggedIn ? "/dashboard" : "/companies/register"} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg" style={{ background: THEME.accent, color: "#071126", fontWeight: 700 }}>
                Get started — it's free
              </Link>

              <button onClick={() => setShowDemo(true)} className="px-4 py-3 rounded-lg border border-white/10">Watch demo</button>

              <button onClick={() => document.getElementById("showcase")?.scrollIntoView({ behavior: "smooth" })} className="px-4 py-3 rounded-lg border border-white/10">Explore showcase</button>
            </div>

            <div className="flex gap-3 mt-4">
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-sm text-gray-300">Save on average</div>
                <div className="text-lg font-semibold mt-1">~$249 / mo</div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg">
                <div className="text-sm text-gray-300">Uptime</div>
                <div className="text-lg font-semibold mt-1">99.99%</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-xs text-gray-400 mb-2">Live activity</div>
              <div className="bg-white/6 p-3 rounded-lg flex items-center gap-3">
                <div className="text-sm font-medium">Live ticker</div>
                <div className="flex-1 overflow-hidden">
                  <div style={{ minHeight: 24 }}>
                    {liveTicker.slice(0, 1).map((t) => (
                      <motion.div key={t.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.3 }} className="text-sm text-gray-300">
                        {t.text}
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-400">live • simulated</div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative">
            <div className="rounded-2xl shadow-2xl p-5 border border-white/6 overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.02), transparent)" }}>
              <ParallaxImage src="https://images.unsplash.com/photo-1557682250-9f8a5b2d0b0b?w=1600&q=60" height={360}>
                <div className="text-white max-w-md">
                  <div className="text-sm text-gray-300">Warehouse A</div>
                  <div className="text-2xl font-bold mt-1">Real-time overview</div>
                  <p className="text-sm text-gray-300 mt-2">Live stock levels, automated reorder suggestions and per-location insights.</p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="bg-white/6 p-3 rounded-lg">
                      <div className="text-xs text-gray-300">Low Stock</div>
                      <div className="text-lg font-semibold mt-1">12</div>
                    </div>
                    <div className="bg-white/6 p-3 rounded-lg">
                      <div className="text-xs text-gray-300">Pending POs</div>
                      <div className="text-lg font-semibold mt-1">5</div>
                    </div>
                  </div>
                </div>
              </ParallaxImage>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Demo modal (YouTube embed) */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowDemo(false)} />
          <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 max-w-4xl w-full bg-slate-900 rounded-xl p-6 border border-white/6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div><h3 className="text-xl font-bold">Live demo — InventoryPro</h3></div>
              <button aria-label="Close" onClick={() => setShowDemo(false)} className="text-gray-300">✕</button>
            </div>

            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="bg-black/20 rounded-lg p-2 min-h-[220px] flex items-center justify-center text-gray-300">
                <div className="w-full aspect-video rounded-md overflow-hidden border border-white/6">
                  <iframe
                    title="InventoryPro demo"
                    src="https://www.youtube.com/embed/ysz5S6PUM-U?autoplay=0&rel=0"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400">What you'll see:</div>
                <ul className="text-sm mt-2 space-y-2">
                  <li>• Fast product search & instant stock updates</li>
                  <li>• Automated reorder suggestions with forecast</li>
                  <li>• Purchase order automation and supplier sync</li>
                </ul>
                <div className="mt-4">
                  <Link to={isLoggedIn ? "/dashboard" : "/companies/register"} className="px-4 py-2" style={{ background: THEME.accent, color: "#071126", fontWeight: 700 }}>Try it now</Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* FEATURES */}
      <section id="features" className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-3">Key features</h2>
          <p className="text-gray-400 mb-6">Fast workflows, accurate forecasts and fewer surprises.</p>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div whileHover={{ y: -6 }} className="bg-white/4 p-6 rounded-xl border border-white/6">
              <h3 className="font-semibold">Smart reorders</h3>
              <p className="text-sm text-gray-400 mt-2">Automated suggestions based on demand and safety stock.</p>
            </motion.div>
            <motion.div whileHover={{ y: -6 }} className="bg-white/4 p-6 rounded-xl border border-white/6">
              <h3 className="font-semibold">Fast receiving</h3>
              <p className="text-sm text-gray-400 mt-2">Scan shipments quickly and reconcile with POs.</p>
            </motion.div>
            <motion.div whileHover={{ y: -6 }} className="bg-white/4 p-6 rounded-xl border border-white/6">
              <h3 className="font-semibold">Multi-location</h3>
              <p className="text-sm text-gray-400 mt-2">Centralized catalog with per-store stock and transfers.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SHOWCASE — display-only interactive tiles */}
      <section id="showcase" className="py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold">Product showcase</h2>
              <p className="text-gray-400">A curated list of devices, licenses and add-ons we recommend.</p>
            </div>

            <div className="flex gap-3 items-center">
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="px-4 py-2 bg-white/6 rounded-md border border-white/12 w-56 md:w-64 text-gray-900" />
              <select value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)} className="px-3 py-2 bg-white/6 rounded-md border border-white/12 text-gray-900">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <motion.article key={p.id} whileHover={{ y: -8, scale: 1.01 }} className="rounded-xl border border-white/12 bg-black/30 p-5 shadow min-h-[300px] flex flex-col">
                <div className="relative h-40 rounded-md overflow-hidden mb-4">
                  <img alt={p.name} src={p.img} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                  <div className="absolute left-3 top-3 px-2 py-1 rounded-md text-xs bg-black/40 backdrop-blur">{p.cat}</div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-lg">{p.name}</h3>
                      <p className="text-sm text-gray-300 mt-2 line-clamp-3">{p.desc}</p>
                    </div>
                    <div className="text-lg font-bold" style={{ color: THEME.accent }}>${Number(p.price || 0).toFixed(2)}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <button onClick={() => setLightbox(p.img)} className="px-3 py-2 rounded-md border border-white/12 text-sm">View image</button>
                  <div className="text-xs text-gray-400">SKU: {p.sku ?? "—"}</div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {/* extra content block to lengthen page */}
            <div className="bg-white/4 p-6 rounded-xl border border-white/6">
              <h3 className="font-semibold">Integrations</h3>
              <p className="text-sm text-gray-400 mt-2">Connect POS, accounting and supplier portals to keep everything in sync.</p>
            </div>
            <div className="bg-white/4 p-6 rounded-xl border border-white/6">
              <h3 className="font-semibold">Security & roles</h3>
              <p className="text-sm text-gray-400 mt-2">Role-based access and audit logs for compliance.</p>
            </div>
            <div className="bg-white/4 p-6 rounded-xl border border-white/6">
              <h3 className="font-semibold">Customer success</h3>
              <p className="text-sm text-gray-400 mt-2">Onboarding, training, and ongoing support to help you scale.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-14 bg-black/8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold">Gallery & product shots</h2>
              <p className="text-gray-400">Real screenshots and context to help you visualise the product in your operations.</p>
            </div>

            <div className="flex gap-2 items-center">
              <select value={galleryFilter} onChange={(e) => setGalleryFilter(e.target.value)} className="px-3 py-2 bg-white/6 rounded-md border border-white/12 text-gray-900">
                <option value="All">All</option>
                <option value="warehouse">Warehouse</option>
                <option value="mobile">Mobile</option>
                <option value="analytics">Analytics</option>
                <option value="retail">Retail</option>
                <option value="team">Team</option>
                <option value="iot">IoT</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map(g => (
              <motion.div key={g.id} whileHover={{ scale: 1.02 }} className="rounded-xl overflow-hidden border border-white/12 bg-black/20 cursor-pointer" onClick={() => setLightbox(g.img)}>
                <img src={g.img} alt={`gallery-${g.id}`} className="w-full h-56 object-cover" />
                <div className="p-4">
                  <div className="text-sm text-gray-300">{g.tag}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox overlay for images */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/80" onClick={() => setLightbox(null)} />
            <motion.div initial={{ y: 20, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.98 }} className="relative z-10 max-w-5xl w-full rounded-xl overflow-hidden border border-white/6 bg-black">
              <img src={lightbox} alt="lightbox" className="w-full h-[70vh] object-contain bg-black" />
              <div className="p-3 text-right bg-black/20">
                <button onClick={() => setLightbox(null)} className="px-3 py-2 rounded-md">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inventory Facts section */}
      <section id="facts" className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Inventory facts & impact</h2>
          <p className="text-gray-400 mb-6">Numbers compiled from our customer base and industry studies (representative).</p>

          <div className="grid md:grid-cols-3 gap-6">
            {INVENTORY_FACTS.map((f, i) => (
              <motion.div key={i} whileInView={{ y: 0, opacity: 1 }} initial={{ y: 8, opacity: 0 }} viewport={{ once: true }} className="bg-white/4 p-6 rounded-xl border border-white/6">
                <div className="text-sm text-gray-300">{f.title}</div>
                <div className="text-2xl font-bold mt-2">{f.stat}</div>
                <div className="text-sm text-gray-400 mt-2">{f.detail}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-white/4 p-6 rounded-xl border border-white/6">
              <div className="text-sm text-gray-300">Active customers</div>
              <div className="text-2xl font-bold mt-2"><AnimatedCounter from={800} to={1200} duration={2} /></div>
              <div className="text-xs text-gray-400 mt-2">Stores using InventoryPro</div>
            </div>
            <div className="bg-white/4 p-6 rounded-xl border border-white/6">
              <div className="text-sm text-gray-300">Avg savings</div>
              <div className="text-2xl font-bold mt-2"><AnimatedCounter from={120} to={249} duration={1.6} prefix="$" /></div>
              <div className="text-xs text-gray-400 mt-2">Per month (representative)</div>
            </div>
            <div className="bg-white/4 p-6 rounded-xl border border-white/6">
              <div className="text-sm text-gray-300">Forecast accuracy</div>
              <div className="text-2xl font-bold mt-2"><AnimatedCounter from={80} to={92} duration={1.6} suffix="%" /></div>
              <div className="text-xs text-gray-400 mt-2">Measured across connected stores</div>
            </div>
          </div>
        </div>
      </section>

      {/* Use cases / resources */}
      <section id="usecases" className="py-14">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">Use cases & resources</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {USE_CASES.map((u, i) => (
              <motion.div whileHover={{ y: -6 }} key={i} className="bg-white/4 rounded-xl overflow-hidden border border-white/6">
                <img src={u.img} alt={u.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold">{u.title}</h3>
                  <p className="text-sm text-gray-400 mt-2">{u.desc}</p>
                  <div className="mt-4">
                    <a className="text-sm px-3 py-2 rounded-md border border-white/12" href="#learn">Learn more</a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-12 bg-black/8">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Customer stories</h2>
          <p className="text-gray-400 mb-6">What our customers say.</p>

          <div className="relative">
            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`p-6 rounded-xl border ${i === testimonialIndex ? "border-white/20 bg-white/6" : "border-white/6 bg-black/10"}`}>
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-xs text-gray-400">{t.title}</div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-300">"{t.text}"</div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIndex(i)} className={`w-2 h-2 rounded-full ${i === testimonialIndex ? "bg-white" : "bg-white/30"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-14">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Simple pricing</h2>
          <p className="text-gray-400 mb-6">Transparent tiers for teams of any size.</p>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div whileHover={{ y: -6 }} className="p-6 rounded-xl border border-white/6 bg-white/4">
              <div className="text-sm text-gray-300">Starter</div>
              <div className="text-3xl font-bold mt-2">$29<span className="text-sm">/mo</span></div>
              <ul className="mt-4 text-sm text-gray-300 space-y-2">
                <li>• 1 store</li>
                <li>• Basic forecasts</li>
                <li>• Email support</li>
              </ul>
              <div className="mt-4">
                <Link to="/companies/register" className="px-4 py-2 rounded-md" style={{ background: THEME.accent, color: "#071126", fontWeight: 700 }}>Get started</Link>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -6 }} className="p-6 rounded-xl border border-white/6 bg-gradient-to-br from-white/6 to-transparent">
              <div className="text-sm text-gray-300">Professional</div>
              <div className="text-3xl font-bold mt-2">$99<span className="text-sm">/mo</span></div>
              <ul className="mt-4 text-sm text-gray-300 space-y-2">
                <li>• Up to 5 stores</li>
                <li>• Advanced forecasting</li>
                <li>• Priority support</li>
              </ul>
              <div className="mt-4">
                <Link to="/companies/register" className="px-4 py-2 rounded-md" style={{ background: THEME.accent, color: "#071126", fontWeight: 700 }}>Start trial</Link>
              </div>
            </motion.div>

            <motion.div whileHover={{ y: -6 }} className="p-6 rounded-xl border border-white/6 bg-white/4">
              <div className="text-sm text-gray-300">Enterprise</div>
              <div className="text-3xl font-bold mt-2">Contact</div>
              <ul className="mt-4 text-sm text-gray-300 space-y-2">
                <li>• Custom integrations</li>
                <li>• Dedicated CSM</li>
                <li>• SLA-backed uptime</li>
              </ul>
              <div className="mt-4">
                <a href="#contact" className="px-4 py-2 rounded-md border border-white/12">Contact sales</a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ + newsletter */}
      <section id="faq" className="py-12 bg-black/8">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-3">Frequently asked questions</h2>
            <div className="space-y-3 mt-4">
              {FAQS.map((f, i) => (
                <div key={i} className="bg-white/4 rounded-lg border border-white/6 overflow-hidden">
                  <button onClick={() => setFaqOpenIdx(faqOpenIdx === i ? null : i)} className="w-full text-left p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{f.q}</div>
                      <div className="text-xs text-gray-400">Click to {faqOpenIdx === i ? "collapse" : "expand"}</div>
                    </div>
                    <div className="text-gray-300">{faqOpenIdx === i ? "−" : "+"}</div>
                  </button>
                  <AnimatePresence>
                    {faqOpenIdx === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="p-4 text-sm text-gray-300 border-t border-white/6">
                        {f.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold">Get product updates</h3>
            <p className="text-gray-400 mt-2">Sign up for release notes and best practices (demo capture).</p>

            <form onSubmit={submitNewsletter} className="mt-4 flex gap-2">
              <input value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} placeholder="you@company.com" className="flex-1 px-4 py-3 rounded-md bg-white/6 border border-white/12 text-gray-900" />
              <button type="submit" className="px-4 py-3 rounded-md" style={{ background: THEME.accent, color: "#071126", fontWeight: 700 }}>Subscribe</button>
            </form>

            <div className="mt-6 text-sm text-gray-400">
              We respect your privacy — this is a front-end demo capture only.
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          <div>
            <div className="font-extrabold text-lg">Inventory<span style={{ color: THEME.accentSoft }}>Pro</span></div>
            <p className="text-gray-400 mt-3">Tools to run inventory across stores and warehouses — simpler, faster, smarter.</p>
          </div>

          <div className="text-sm text-gray-400">
            <div className="mb-2 font-semibold">Product</div>
            <ul className="space-y-2"><li><a href="#features">Features</a></li><li><a href="#showcase">Showcase</a></li><li><a href="#gallery">Gallery</a></li></ul>
          </div>

          <div className="text-sm text-gray-400">
            <div className="mb-2 font-semibold">Company</div>
            <ul className="space-y-2"><li><a href="#facts">Facts</a></li><li><a href="/companies/register">Get started</a></li><li><a href="#pricing">Pricing</a></li></ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-8 border-t border-white/6 pt-6 text-center text-gray-400">
          © {new Date().getFullYear()} InventoryPro. All rights reserved.
        </div>
      </footer>

      {/* Floating chatbot */}
      <FloatingChatbot />
    </div>
  );
}

// src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { saveAs } from "file-saver";

import { fetchCompanies } from "../stores/slices/companySlice";
import { fetchProducts } from "../stores/slices/productSlice";

import StatCard from "../components/dashboard/StatCard";
import RevenueTrendChart from "../components/dashboard/RevenueTrendChart";
import StockChart from "../components/dashboard/StockChart";
import Sparkline from "../components/dashboard/Sparkline";
import ProductTable from "../components/dashboard/ProductTable";

/* Theme consistent with LandingPage */
const THEME = {
  bg: "#0B1220",
  accent: "#00D1B2",
  accentSoft: "#8BE9FF",
  highlight: "#2DD4BF",
};

export default function Dashboard() {
  const dispatch = useDispatch();

  // Redux data
  const user = useSelector((s) => s.auth?.user);
  const role = user?.role;
  const isAdmin = role === "admin";
  const isCompany = role === "company";

  const companies = useSelector((s) => s.companies?.list || []);
  const products = useSelector((s) => s.products?.list || []);

  // UI state
  const [filterText, setFilterText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [live, setLive] = useState(true);
  const [timeframe, setTimeframe] = useState("30d");

  // chart controls
  const [selectedProductId, setSelectedProductId] = useState(null); // null => site-level revenueSeries
  const [autoplay, setAutoplay] = useState(false);
  const selectedIndexRef = useRef(0);

  // fetch on mount / role change
  useEffect(() => {
    if (!role) return;
    if (isAdmin) dispatch(fetchCompanies());
    if (isCompany) dispatch(fetchProducts());
  }, [dispatch, role, isAdmin, isCompany]);

  // site-level revenueSeries (fallback/overview) - simulated
  const [revenueSeries, setRevenueSeries] = useState(() =>
    Array.from({ length: 30 }, (_, i) => 1000 + Math.round(Math.random() * 1000 + i * 30))
  );
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => {
      setRevenueSeries((prev) => {
        const next = prev.slice(1);
        next.push(prev[prev.length - 1] + Math.round((Math.random() - 0.4) * 300));
        return next;
      });
    }, 2500);
    return () => clearInterval(t);
  }, [live]);

  // --- normalize products (ensure price, category, qty; remove reorder) ---
  const normalizedProducts = useMemo(() => {
    return (products || []).map((p) => {
      const priceVal = p?.price ?? p?.unitPrice ?? p?.listPrice ?? p?.mrp ?? p?.amount ?? 0;
      const price = Number(priceVal) || 0;
      const category = p?.category ?? p?.cat ?? "Other";
      const quantity = Number(p?.quantity) || 0;
      const prevQuantity = Number(p?.prevQuantity) || 0;
      // remove reorderLevel intentionally
      const { reorderLevel, ...rest } = p ?? {};
      return {
        ...rest,
        price,
        category,
        quantity,
        prevQuantity,
      };
    });
  }, [products]);

  // metrics
  const totalCompanies = companies.length;
  const activeCompanies = companies.filter((c) => c.active).length;
  const inactiveCompanies = totalCompanies - activeCompanies;

  const totalProducts = normalizedProducts.length;
  const avgStock = totalProducts
    ? Math.round(normalizedProducts.reduce((s, p) => s + (Number(p.quantity) || 0), 0) / totalProducts)
    : 0;
  const totalRevenue = revenueSeries.reduce((s, x) => s + x, 0);

  // filters/categories
  const categories = useMemo(() => {
    const set = new Set(normalizedProducts.map((p) => p.category || "Other"));
    return ["All", ...Array.from(set)];
  }, [normalizedProducts]);

  const filteredProducts = useMemo(() => {
    return normalizedProducts.filter((p) => {
      const matchesText = !filterText || (p.name || "").toLowerCase().includes(filterText.toLowerCase());
      const matchesCat = categoryFilter === "All" || (p.category || "Other") === categoryFilter;
      return matchesText && matchesCat;
    });
  }, [normalizedProducts, filterText, categoryFilter]);

  // CSV export (no reorder)
  function exportCSV() {
    const headers = ["id", "name", "category", "price", "quantity"];
    const rows = filteredProducts.map((p) => {
      const get = (key) => (key === "category" ? p.category ?? "" : p[key] ?? "");
      const escaped = headers.map((h) => {
        const val = String(get(h));
        const safe = val.replace(/"/g, '""');
        return `"${safe}"`;
      });
      return escaped.join(",");
    });
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `products-${new Date().toISOString().slice(0, 10)}.csv`);
  }

  const handleResetFilters = useCallback(() => {
    setFilterText("");
    setCategoryFilter("All");
  }, []);

  const noop = useCallback(() => {}, []);

  // -------------------------
  // Top sales / top purchases
  // -------------------------
  const productSalesValue = (p) => {
    if (p == null) return 0;
    if (p?.totalSales != null) return Number(p.totalSales) || 0;
    if (Array.isArray(p.salesSeries) && p.salesSeries.length) return p.salesSeries.reduce((s, x) => s + Number(x || 0), 0);
    if (Array.isArray(p.salesHistory) && p.salesHistory.length) return p.salesHistory.reduce((s, x) => s + Number(x || 0), 0);
    if (Array.isArray(p.sales) && p.sales.length) return p.sales.reduce((s, x) => s + Number(x || 0), 0);
    if (typeof p.sales === "number") return Number(p.sales) || 0;
    return (Number(p.price) || 0) * (Number(p.quantity) || 0);
  };

  const productPurchaseValue = (p) => {
    if (p == null) return 0;
    if (p?.totalPurchases != null) return Number(p.totalPurchases) || 0;
    if (Array.isArray(p.purchaseSeries) && p.purchaseSeries.length) return p.purchaseSeries.reduce((s, x) => s + Number(x || 0), 0);
    if (Array.isArray(p.purchaseHistory) && p.purchaseHistory.length) return p.purchaseHistory.reduce((s, x) => s + Number(x || 0), 0);
    if (Array.isArray(p.purchases) && p.purchases.length) return p.purchases.reduce((s, x) => s + Number(x || 0), 0);
    if (typeof p.purchases === "number") return Number(p.purchases) || 0;
    return (Number(p.price) || 0) * (Number(p.quantity) || 0);
  };

  const topSalesProducts = useMemo(() => {
    return normalizedProducts
      .map((p) => ({ ...p, _salesValue: productSalesValue(p) }))
      .sort((a, b) => b._salesValue - a._salesValue)
      .slice(0, 5);
  }, [normalizedProducts]);

  const topPurchaseProducts = useMemo(() => {
    return normalizedProducts
      .map((p) => ({ ...p, _purchaseValue: productPurchaseValue(p) }))
      .sort((a, b) => b._purchaseValue - a._purchaseValue)
      .slice(0, 5);
  }, [normalizedProducts]);

  // -------------------------
  // Chart: product-specific series selection & autoplay
  // -------------------------
  const timeframeLength = (tf) => (tf === "7d" ? 7 : tf === "30d" ? 30 : 90);

  // robust helper: find series arrays in product (sales/purchases), normalize length,
  // and return deterministic non-zero fallback if none exist.
  const getProductSeries = (p, length) => {
    if (!p) return Array.from({ length }, () => 0);

    // helper to pick first available numeric array-like series for given keys
    const pickSeries = (keys) => {
      for (const k of keys) {
        const v = p[k];
        if (Array.isArray(v) && v.length) {
          const arr = v.map((x) => {
            const n = Number(x);
            return Number.isFinite(n) ? n : 0;
          });
          return arr;
        }
        // if v is a single number and key implies series, create flat series
        if (typeof v === "number" && (k === "sales" || k === "purchases")) {
          return Array.from({ length }, () => Number(v));
        }
      }
      return null;
    };

    // try sales-related keys first
    const salesKeys = ["salesSeries", "salesHistory", "salesByDay", "dailySales", "sales"];
    let series = pickSeries(salesKeys);
    if (series) {
      if (series.length > length) return series.slice(-length);
      if (series.length < length) {
        const last = series[series.length - 1] ?? series[0] ?? 0;
        return [...series, ...Array.from({ length: length - series.length }, () => last)];
      }
      return series;
    }

    // try purchase-related keys
    const purchaseKeys = ["purchaseSeries", "purchaseHistory", "dailyPurchases", "purchases"];
    series = pickSeries(purchaseKeys);
    if (series) {
      if (series.length > length) return series.slice(-length);
      if (series.length < length) {
        const last = series[series.length - 1] ?? series[0] ?? 0;
        return [...series, ...Array.from({ length: length - series.length }, () => last)];
      }
      return series;
    }

    // deterministic synthetic fallback (guaranteed non-zero and stable)
    const price = Number(p.price) || 0;
    const quantity = Number(p.quantity) || 0;
    let base = Math.max(1, Math.round(price * Math.max(1, quantity)));

    if (base === 0) base = 10;

    const seedStr = String(p.id ?? p.sku ?? p.name ?? "product");
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;

    const arr = Array.from({ length }, (_, i) => {
      const jitter = ((seed % (i + 7)) - ((i % 7) + 3)) / 100; // stable jitter
      const val = Math.max(1, Math.round(base * (1 + jitter)));
      return val;
    });

    if (typeof process !== "undefined" && process?.env?.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.debug("[Dashboard] synthetic series for product", p.id ?? p.sku, arr.slice(0, Math.min(6, arr.length)));
    }

    return arr;
  };

  // build chartSeries: either site-level revenueSeries or product-specific series
  const chartSeries = useMemo(() => {
    const len = timeframeLength(timeframe);
    if (!selectedProductId) {
      if (revenueSeries.length >= len) return revenueSeries.slice(-len);
      return [...Array.from({ length: len - revenueSeries.length }, () => revenueSeries[0] ?? 0), ...revenueSeries];
    }
    // robust lookup: compare as strings
    const product = normalizedProducts.find((x) => String(x.id) === String(selectedProductId) || String(x.sku) === String(selectedProductId));
    return getProductSeries(product, len);
  }, [selectedProductId, revenueSeries, normalizedProducts, timeframe]);

  // autoplay cycling
  useEffect(() => {
    if (!autoplay) return undefined;
    if (normalizedProducts.length === 0) return undefined;

    const interval = setInterval(() => {
      selectedIndexRef.current = (selectedIndexRef.current + 1) % normalizedProducts.length;
      const next = normalizedProducts[selectedIndexRef.current];
      setSelectedProductId(next?.id ?? next?.sku ?? null);
    }, 3000);

    // ensure initial selection if none
    if (selectedProductId == null && normalizedProducts[0]) {
      selectedIndexRef.current = 0;
      setSelectedProductId(normalizedProducts[0]?.id ?? normalizedProducts[0]?.sku ?? null);
    }

    return () => clearInterval(interval);
  }, [autoplay, normalizedProducts]); // eslint-disable-line

  // when user manually selects a product, stop autoplay
  const handleSelectProduct = (id) => {
    setSelectedProductId(id || null);
    if (autoplay) setAutoplay(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="text-sm text-gray-400 mt-1">Overview & insights</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-300">Live</div>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={live}
              onChange={() => setLive((v) => !v)}
              className="form-checkbox h-4 w-4"
              aria-label="Toggle live updates"
            />
          </label>

          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 bg-black/20 rounded-md border border-white/6 text-sm"
            aria-label="Select timeframe"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          <button onClick={exportCSV} className="px-3 py-2 rounded-md text-sm bg-teal-400 text-black font-semibold">
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isCompany && (
          <>
            <StatCard title="Total Products" value={totalProducts} accent={THEME.accent} />
            <StatCard title="Average Stock" value={avgStock} accent="#FBBF24" />
            <StatCard title="Est. Revenue" value={`$${totalRevenue.toLocaleString()}`} accent="#60A5FA" />
          </>
        )}

        {isAdmin && (
          <>
            <StatCard title="Total Companies" value={totalCompanies} accent={THEME.accent} />
            <StatCard title="Active" value={activeCompanies} accent="#10B981" />
            <StatCard title="Inactive" value={inactiveCompanies} accent="#EF4444" />
            <StatCard title="Products (all)" value={normalizedProducts.length} accent="#60A5FA" />
          </>
        )}
      </div>

      {/* Small sparklines */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Sparkline title="Sales (7d)" values={revenueSeries.slice(-7)} color={THEME.accent} />
        <Sparkline title="Stock flux" values={filteredProducts.slice(0, 7).map((p) => Number(p.quantity || 0) - Number(p.prevQuantity || 0))} color="#F97316" />
        <Sparkline title="Orders" values={[12, 18, 10, 22, 15, 19, 25]} color="#60A5FA" />
      </div>

      {/* Charts area */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl border border-white/6 bg-black/30">
        <div className="w-full flex flex-col md:flex-row md:items-start md:gap-4">
          {/* Main chart */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Revenue trend</h3>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-400">Product</label>
                <select
                  value={selectedProductId ?? ""}
                  onChange={(e) => handleSelectProduct(e.target.value || null)}
                  className="px-2 py-1 rounded-md bg-black/20 border border-white/6 text-sm"
                >
                  <option value="">All (site)</option>
                  {normalizedProducts.map((p) => (
                    <option key={p.id ?? p.sku ?? p.name} value={p.id ?? p.sku ?? p.name}>
                      {p.name ?? p.sku ?? `#${p.id}`}
                    </option>
                  ))}
                </select>

                <label className="inline-flex items-center gap-2 ml-2">
                  <input type="checkbox" checked={autoplay} onChange={() => setAutoplay((v) => !v)} className="form-checkbox h-4 w-4" />
                  <span className="text-sm">Autoplay</span>
                </label>
              </div>
            </div>

            <RevenueTrendChart title="" series={chartSeries} />
          </div>

          {/* Right column: top sales & purchases */}
          <div className="w-full md:w-80 mt-4 md:mt-0">
            <div className="bg-black/20 p-4 rounded-md border border-white/6 mb-4">
              <h4 className="font-semibold mb-3">Top sales</h4>
              {topSalesProducts.length === 0 ? (
                <div className="text-sm text-gray-400">No sales data</div>
              ) : (
                <ul className="space-y-2">
                  {topSalesProducts.map((p) => (
                    <li key={p.id} className="flex items-center justify-between">
                      <div className="text-sm">{p.name ?? p.sku ?? `#${p.id}`}</div>
                      <div className="text-sm font-medium">${(p._salesValue || 0).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-black/20 p-4 rounded-md border border-white/6">
              <h4 className="font-semibold mb-3">Top purchases</h4>
              {topPurchaseProducts.length === 0 ? (
                <div className="text-sm text-gray-400">No purchase data</div>
              ) : (
                <ul className="space-y-2">
                  {topPurchaseProducts.map((p) => (
                    <li key={p.id} className="flex items-center justify-between">
                      <div className="text-sm">{p.name ?? p.sku ?? `#${p.id}`}</div>
                      <div className="text-sm font-medium">${(p._purchaseValue || 0).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Supporting row under chart */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/20 p-4 rounded-md border border-white/6">
            <StockChart products={filteredProducts} />
          </div>
          <div className="bg-black/20 p-4 rounded-md border border-white/6">
            <h4 className="font-semibold mb-3">Overview</h4>
            <div className="text-sm text-gray-300">Products: {normalizedProducts.length}</div>
            <div className="text-sm text-gray-300">Avg stock: {avgStock}</div>
            <div className="text-sm text-gray-300">Total revenue (site): ${totalRevenue.toLocaleString()}</div>
          </div>
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl border border-white/6 bg-black/30">
        <h3 className="font-semibold mb-3">Quick actions</h3>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="flex gap-3 flex-wrap">
            <button onClick={handleResetFilters} className="px-4 py-2 rounded-md border border-white/10">Reset filters</button>
            <button onClick={() => exportCSV()} className="px-4 py-2 rounded-md bg-teal-400 text-black font-semibold">Export CSV</button>
            <button onClick={() => setLive((v) => !v)} className="px-4 py-2 rounded-md border border-white/10">{live ? "Stop live" : "Start live"}</button>
          </div>

          <div className="ml-auto mt-3 md:mt-0 w-full md:w-auto">
            <div className="text-sm text-gray-400 mb-2">Filters</div>
            <div className="flex gap-2 items-center">
              <input placeholder="Search products..." value={filterText} onChange={(e) => setFilterText(e.target.value)} className="px-3 py-2 rounded-md bg-black/20 border border-white/6" />
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 rounded-md bg-black/20 border border-white/6">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Product table (hide reorder) */}
      <div className="p-5 rounded-xl border border-white/6 bg-black/30">
        <ProductTable products={filteredProducts} onEdit={noop} onViewCompany={noop} hideReorder={true} />
      </div>
    </div>
  );
}

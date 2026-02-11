// src/pages/purchase/Purchase.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPurchases,
  addPurchase,
  updatePurchase,
  deletePurchase,
} from "../../stores/slices/purchaseSlice";
import { fetchProducts } from "../../stores/slices/productSlice";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";

/* Theme variables — keep consistent with Dashboard */
const THEME = {
  accent: "#00D1B2",
  danger: "#EF4444",
  mutedText: "text-gray-400",
  cardBg: "bg-gray-900",
  cardBorder: "border-gray-700",
};

/* ===== ProductSelect (searchable + keyboard nav) ===== */
function ProductSelect({ value, onChange, products = [], placeholder = "Search / choose product..." }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const options = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    return (products || []).filter((p) => {
      if (!q) return true;
      return (p.name || "").toLowerCase().includes(q) || (p.sku || "").toLowerCase().includes(q);
    });
  }, [products, query]);

  const selected = useMemo(() => (products || []).find((p) => String(p.id) === String(value)), [products, value]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  function onKeyDown(e) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
      scrollIntoView(activeIndex + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      scrollIntoView(activeIndex - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (options[activeIndex]) selectOption(options[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function scrollIntoView(index) {
    const node = listRef.current?.children[index];
    if (node) node.scrollIntoView({ block: "nearest" });
  }

  function selectOption(opt) {
    onChange(String(opt.id));
    setOpen(false);
    inputRef.current?.focus();
  }

  return (
    <div className="relative w-full" style={{ minWidth: 260 }}>
      <div
        className={`flex items-center justify-between px-3 py-2 rounded-md ${THEME.cardBg} border ${THEME.cardBorder} cursor-text`}
        onClick={() => {
          setOpen((v) => !v);
          inputRef.current?.focus();
        }}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="text-sm font-medium text-white">
              {selected ? selected.name : <span className="text-gray-400">{placeholder}</span>}
            </div>
            <div className="text-xs text-gray-500">
              {selected ? `SKU: ${selected.sku ?? "-"}` : `Products: ${products?.length || 0}`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selected && (
            <div className="text-xs px-2 py-0.5 rounded text-black font-semibold" style={{ background: "linear-gradient(90deg, rgba(0,209,178,0.12), rgba(139,233,255,0.06))" }}>
              Qty: {selected.quantity ?? 0}
            </div>
          )}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-80 text-gray-300">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* invisible input for capturing keyboard events */}
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActiveIndex(0);
        }}
        onKeyDown={onKeyDown}
        placeholder={selected ? "" : placeholder}
        className="absolute left-0 top-0 w-full h-full opacity-0 pointer-events-none"
        aria-hidden
      />

      {open && (
        <div className="absolute z-50 mt-2 w-full max-h-64 overflow-auto rounded-md border border-gray-700 bg-gray-800 shadow-lg">
          <div className="px-3 py-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={onKeyDown}
              className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-sm text-white"
              placeholder="Type to search by name or SKU..."
            />
          </div>

          <ul ref={listRef} role="listbox" aria-label="Products" className="divide-y divide-gray-700">
            {options.length === 0 && <li className="px-3 py-2 text-gray-400 text-sm">No products match</li>}
            {options.map((p, idx) => {
              const active = idx === activeIndex;
              return (
                <li
                  key={p.id}
                  role="option"
                  aria-selected={String(p.id) === String(value)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => selectOption(p)}
                  className={`px-3 py-2 cursor-pointer flex items-center justify-between gap-4 ${active ? "bg-gray-700" : "hover:bg-gray-700"}`}
                >
                  <div>
                    <div className="font-medium text-sm text-white">{p.name}</div>
                    <div className="text-xs text-gray-400">SKU: {p.sku ?? "-"}</div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="text-xs text-gray-300">₹{p.sellingPrice}</div>
                    <div className="text-xs mt-1 px-2 py-0.5 rounded text-black" style={{ background: "#F3F4F6" }}>
                      Qty: {p.quantity ?? 0}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ===== Main PurchaseList page ===== */
export default function PurchaseList() {
  const dispatch = useDispatch();

  const { list: purchases = [], loading } = useSelector((state) => state.purchases || {});
  const products = useSelector((state) => state.products?.list || []);

  /* Form state */
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [costPrice, setCostPrice] = useState("");

  /* Edit state */
  const [editingId, setEditingId] = useState(null);
  const [editProductId, setEditProductId] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editCostPrice, setEditCostPrice] = useState("");

  /* Filtering / UI */
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState({ key: "createdAt", dir: "desc" });
  const [page, setPage] = useState(1);
  const perPage = 8;

  /* Delete */
  const [deleteId, setDeleteId] = useState(null); // will store numeric id
  const [deleting, setDeleting] = useState(false);

  /* Load data */
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchPurchases());
  }, [dispatch]);

  /* product map memoized for lookups (SKU, quantity, etc) */
  const productMap = useMemo(() => {
    const map = {};
    (products || []).forEach((p) => {
      map[String(p.id)] = p;
    });
    return map;
  }, [products]);

  /* derived totals & stats */
  const stats = useMemo(() => {
    const totalPurchases = purchases.length;
    const totalSpend = purchases.reduce((s, p) => s + (Number(p.totalAmount) || 0), 0);
    const byProduct = {};
    purchases.forEach((p) => {
      const k = p.productName || String(p.productId);
      byProduct[k] = (byProduct[k] || 0) + (Number(p.totalAmount) || 0);
    });
    const topProduct = Object.entries(byProduct).sort((a, b) => b[1] - a[1])[0];
    return {
      totalPurchases,
      totalSpend,
      topProduct: topProduct ? { name: topProduct[0], amount: topProduct[1] } : null,
    };
  }, [purchases]);

  /* filtered + sorted list */
  const filtered = useMemo(() => {
    const s = (searchText || "").trim().toLowerCase();
    let arr = (purchases || []).filter((p) => {
      if (!s) return true;
      return (
        (p.productName || "").toLowerCase().includes(s) ||
        String(p.productId).includes(s) ||
        String(productMap[String(p.productId)]?.sku || "").toLowerCase().includes(s)
      );
    });
    const dir = sortBy.dir === "asc" ? 1 : -1;
    arr = arr.sort((a, b) => {
      const k = sortBy.key;
      if (k === "productName") return dir * ((a.productName || "").localeCompare(b.productName || ""));
      if (k === "totalAmount") return dir * ((Number(a.totalAmount) || 0) - (Number(b.totalAmount) || 0));
      // fallback to date
      const ta = new Date(a.createdAt || a.created_at || 0).getTime();
      const tb = new Date(b.createdAt || b.created_at || 0).getTime();
      return dir * (ta - tb);
    });
    return arr;
  }, [purchases, searchText, sortBy, productMap]);

  const pages = Math.max(1, Math.ceil((filtered?.length || 0) / perPage));
  const pageData = (filtered || []).slice((page - 1) * perPage, page * perPage);

  /* compute totals for current add form */
  const addTotal = useMemo(() => {
    const q = Number(quantity) || 0;
    const p = Number(costPrice) || 0;
    return q * p;
  }, [quantity, costPrice]);

  /* Actions */
  async function submitPurchase() {
    if (!productId || !quantity || !costPrice) {
      toast.error("All fields are required");
      return;
    }
    try {
      await dispatch(
        addPurchase({
          productId: Number(productId),
          quantity: Number(quantity),
          costPrice: Number(costPrice),
        })
      ).unwrap();

      setProductId("");
      setQuantity("");
      setCostPrice("");
      setPage(1);
      toast.success("Purchase added");
      dispatch(fetchPurchases());
    } catch (err) {
      console.error(err);
      toast.error(typeof err === "string" ? err : "Failed to add purchase");
    }
  }

  function startEdit(p) {
    setEditingId(p.id);
    setEditProductId(String(p.productId));
    setEditQuantity(String(p.quantity));
    setEditCostPrice(String(p.unitPrice ?? p.costPrice ?? ""));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveEdit() {
    if (!editProductId || !editQuantity || !editCostPrice) {
      toast.error("All fields required");
      return;
    }
    try {
      await dispatch(
        updatePurchase({
          id: editingId,
          data: {
            productId: Number(editProductId),
            quantity: Number(editQuantity),
            costPrice: Number(editCostPrice),
          },
        })
      ).unwrap();

      setEditingId(null);
      setEditProductId("");
      setEditQuantity("");
      setEditCostPrice("");
      toast.success("Purchase updated");
      dispatch(fetchPurchases());
    } catch (err) {
      console.error(err);
      toast.error("Failed to update purchase");
    }
  }

  /* ===== FIXED delete flow: only single-item delete =====
     - deleteId set by Delete button (numeric)
     - confirmDelete reads deleteId and performs delete
  */
  async function confirmDelete() {
    // guard against missing id
    const idToDelete = Number(deleteId);
    if (!idToDelete) {
      setDeleteId(null);
      return;
    }

    try {
      setDeleting(true);
      // ensure numeric id passed to thunk
      await dispatch(deletePurchase(idToDelete)).unwrap();

      toast.success("Purchase deleted");
      // refresh list
      await dispatch(fetchPurchases());
    } catch (err) {
      console.error("Failed deleting purchase:", err);
      const msg = (err && err.message) || "Failed to delete purchase";
      toast.error(msg);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  function changeSort(key) {
    setSortBy((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  }

  function exportCSV() {
    const headers = ["id", "productName", "quantity", "unitPrice", "totalAmount", "createdAt"];
    const rows = (filtered || []).map((r) => headers.map((h) => `"${String(r[h] ?? "")}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `purchases-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* helper: lookup product */
  function productById(id) {
    return productMap[String(id)];
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchases</h1>
          <div className="text-gray-400 mt-1">Manage incoming stock — dashboard style</div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="px-3 py-2 rounded-md" style={{ background: THEME.accent, color: "#071126", fontWeight: 700 }}>
            Export CSV
          </button>
          <button
            onClick={() => {
              setProductId("");
              setQuantity("");
              setCostPrice("");
              setEditingId(null);
            }}
            className="px-3 py-2 rounded-md border border-gray-700"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-md ${THEME.cardBg} border ${THEME.cardBorder}`}>
          <div className="text-sm text-gray-400">Total purchases</div>
          <div className="text-2xl font-semibold text-white">{stats.totalPurchases}</div>
        </div>

        <div className={`p-4 rounded-md ${THEME.cardBg} border ${THEME.cardBorder}`}>
          <div className="text-sm text-gray-400">Total spend</div>
          <div className="text-2xl font-semibold text-white">₹{Number(stats.totalSpend || 0).toLocaleString()}</div>
        </div>

        <div className={`p-4 rounded-md ${THEME.cardBg} border ${THEME.cardBorder}`}>
          <div className="text-sm text-gray-400">Top product</div>
          <div className="text-lg font-semibold text-white">{stats.topProduct ? stats.topProduct.name : "—"}</div>
          {stats.topProduct && <div className="text-sm text-gray-400">₹{Number(stats.topProduct.amount).toLocaleString()}</div>}
        </div>
      </div>

      {/* Add / Edit card */}
      <div className={`p-5 rounded-md ${THEME.cardBg} border ${THEME.cardBorder}`}>
        <h2 className="font-semibold text-white mb-3">{editingId ? "Edit Purchase" : "Add Purchase"}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 items-end">
          <div className="col-span-1 lg:col-span-2">
            <label className="text-sm text-gray-400">Product</label>
            <ProductSelect
              value={editingId ? editProductId : productId}
              onChange={(val) => (editingId ? setEditProductId(val) : setProductId(val))}
              products={products}
              placeholder="Search product by name or SKU..."
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Quantity</label>
            <input
              type="number"
              min="0"
              value={editingId ? editQuantity : quantity}
              onChange={(e) => (editingId ? setEditQuantity(e.target.value) : setQuantity(e.target.value))}
              className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Cost Price</label>
            <input
              type="number"
              min="0"
              value={editingId ? editCostPrice : costPrice}
              onChange={(e) => (editingId ? setEditCostPrice(e.target.value) : setCostPrice(e.target.value))}
              className="w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white"
            />
          </div>

          {/* Actions */}
          <div className="lg:col-span-4 flex items-center justify-between mt-3">
            <div className="text-sm text-gray-400">Total: <span className="font-semibold text-white">₹{(editingId ? (Number(editQuantity || 0) * Number(editCostPrice || 0)) : addTotal).toLocaleString()}</span></div>

            <div className="flex gap-2">
              {editingId ? (
                <>
                  <button onClick={saveEdit} className="px-4 py-2 rounded-md" style={{ background: THEME.accent, color: "#071126", fontWeight: 700 }}>
                    Save
                  </button>
                  <button onClick={() => { setEditingId(null); setEditProductId(""); setEditQuantity(""); setEditCostPrice(""); }} className="px-3 py-2 rounded-md border border-gray-700">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button onClick={submitPurchase} disabled={loading} className="px-4 py-2 rounded-md" style={{ background: THEME.accent, color: "#071126", fontWeight: 700 }}>
                    Add Purchase
                  </button>
                  <button onClick={() => {
                    const prod = productById(productId);
                    if (prod?.buyingPrice) setCostPrice(String(prod.buyingPrice));
                    else if (prod?.sellingPrice) setCostPrice(String(prod.sellingPrice));
                    else toast("No price found for selected product");
                  }} className="px-3 py-2 rounded-md border border-gray-700">
                    Quick-fill price
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls: search / sort */}
      <div className={`p-4 rounded-md flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${THEME.cardBg} border ${THEME.cardBorder}`}>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            placeholder="Search product or SKU..."
            value={searchText}
            onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-white w-full md:w-80"
          />

          <div className="text-sm text-gray-400">Sort:</div>
          <button onClick={() => changeSort("createdAt")} className="px-2 py-1 rounded-md border border-gray-700">Date</button>
          <button onClick={() => changeSort("productName")} className="px-2 py-1 rounded-md border border-gray-700">Product</button>
          <button onClick={() => changeSort("totalAmount")} className="px-2 py-1 rounded-md border border-gray-700">Total</button>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-400 mr-2">Actions:</div>
          <button onClick={() => dispatch(fetchPurchases())} className="px-2 py-1 rounded-md border border-gray-700">Refresh</button>
        </div>
      </div>

      {/* List */}
      <div className={`rounded-md ${THEME.cardBg} border ${THEME.cardBorder} p-4`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-400">
              <tr>
                <th className="py-2">Product</th>
                <th className="py-2">Qty</th>
                <th className="py-2">Cost</th>
                <th className="py-2">Total</th>
                <th className="py-2">When</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-gray-400">No purchases found.</td>
                </tr>
              )}

              {pageData.map((p) => {
                const prod = productById(p.productId);
                return (
                  <tr key={p.id} className="border-t border-gray-700">
                    <td className="py-3">
                      <div className="font-medium text-white">{p.productName}</div>
                      {/* <div className="text-xs text-gray-400">SKU: {prod?.sku ?? "-"}</div>
                      {prod && <div className="text-xs text-gray-500">Stock: {prod.quantity ?? 0}</div>} */}
                    </td>

                    <td className="py-3">{p.quantity}</td>
                    <td className="py-3">₹{Number(p.unitPrice || p.costPrice || 0).toLocaleString()}</td>
                    <td className="py-3">₹{Number(p.totalAmount || (p.quantity * (p.unitPrice || p.costPrice) ) || 0).toLocaleString()}</td>
                    <td className="py-3 text-gray-400">{new Date(p.createdAt || p.created_at || p.timestamp || 0).toLocaleString()}</td>

                    <td className="py-3">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(p)} className="px-2 py-1 rounded-md border border-yellow-500 text-yellow-400">Edit</button>
                        {/* <button
                          onClick={() => setDeleteId(Number(p.id))}
                          className="px-2 py-1 rounded-md"
                          style={{ background: THEME.danger, color: "#fff" }}
                          disabled={deleting}
                          title={deleting ? "Deleting..." : "Delete"}
                        >
                          {deleting ? "Deleting..." : "Delete"}
                        </button> */}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-400">Showing {filtered.length} results</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 rounded-md border border-gray-700">Prev</button>
            <div className="text-sm">Page {page} / {pages}</div>
            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} className="px-3 py-1 rounded-md border border-gray-700">Next</button>
          </div>
        </div>
      </div>

      {/* Confirm delete modal
      <ConfirmDeleteModal
        open={!!deleteId}
        title="Delete Purchase"
        message="Are you sure you want to delete this purchase?"
        loading={deleting}
        onCancel={() => { setDeleteId(null); setDeleting(false); }}
        onConfirm={confirmDelete}
      /> */}
    </div>
  );
}

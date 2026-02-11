// src/pages/sales/SalesList.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSales,
  addSale,
  updateSale,
  deleteSale,
} from "../../stores/slices/salesSlice";
import { fetchProducts } from "../../stores/slices/productSlice";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";

/* Theme variables — keep consistent with Dashboard */
const THEME = {
  accent: "#00D1B2",
  danger: "#EF4444",
  mutedText: "text-gray-400",
};

/* Helpers */
function formatCurrency(n) {
  if (n == null || isNaN(n)) return "₹0";
  return "₹" + Number(n).toLocaleString();
}

function formatDate(value) {
  if (!value && value !== 0) return "-";
  let dateObj;
  if (typeof value === "number") dateObj = new Date(value);
  else if (typeof value === "string") {
    if (/^\d+$/.test(value)) dateObj = new Date(Number(value));
    else dateObj = new Date(value);
  } else if (value instanceof Date) dateObj = value;
  else return "-";
  if (isNaN(dateObj.getTime())) return "-";
  return dateObj.toLocaleString();
}

function getSaleDate(s) {
  if (!s) return null;
  const candidates = [
    s.createdAt,
    s.created_at,
    s.date,
    s.saleDate,
    s.timestamp,
    s.time,
    s.datetime,
    s.isoDate,
  ];
  for (const c of candidates) {
    if (c !== undefined && c !== null && c !== "") return c;
  }
  if (s.meta && (s.meta.createdAt || s.meta.date)) return s.meta.createdAt || s.meta.date;
  return null;
}

function toDateTimeLocal(value) {
  if (!value) return "";
  let d;
  if (typeof value === "number") d = new Date(value);
  else d = new Date(value);
  if (isNaN(d.getTime())) return "";
  const iso = d.toISOString();
  return iso.slice(0, 16);
}

/* ===== Custom ProductSelect component =====
   - Searchable
   - Keyboard navigation (ArrowUp/Down + Enter)
   - Shows qty badge and SKU
   - Accessible-ish (aria roles)
*/
function ProductSelect({ value, onChange, products, placeholder = "Select product" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // normalize products -> display list
  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (products || []).filter((p) => {
      if (!q) return true;
      const name = (p.name || "").toLowerCase();
      const sku = (p.sku || "").toLowerCase();
      return name.includes(q) || sku.includes(q);
    });
  }, [products, query]);

  // selected object for rendering
  const selected = useMemo(() => {
    return (products || []).find((p) => String(p.id) === String(value));
  }, [products, value]);

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
    if (open) {
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
    <div className="relative" style={{ minWidth: 260 }}>
      <div
        className="flex items-center justify-between px-3 py-2 rounded-md bg-black/20 border border-white/10 cursor-text"
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
            <div className="text-sm font-medium">
              {selected ? selected.name : <span className="text-gray-400">{placeholder}</span>}
            </div>
            <div className="text-xs text-gray-400">
              {selected ? `SKU: ${selected.sku ?? "-"}` : `Products: ${products?.length || 0}`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selected && (
            <div
              className="text-xs px-2 py-0.5 rounded text-black font-semibold"
              style={{ background: "linear-gradient(90deg, rgba(0,209,178,0.12), rgba(139,233,255,0.06))" }}
            >
              Qty: {selected.quantity ?? 0}
            </div>
          )}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-80">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* invisible input for typing/filtering */}
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
        <div className="absolute z-40 mt-2 w-full max-h-56 overflow-auto rounded-md border border-gray-700 bg-gray-900 shadow-lg">

          <div className="px-3 py-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={onKeyDown}
              className="w-full px-3 py-2 rounded-md bg-black/10 border border-white/6 text-sm"
              placeholder="Type to search by name or SKU..."
            />
          </div>

          <ul ref={listRef} role="listbox" aria-label="Products" className="divide-y divide-white/6">
            {options.length === 0 && (
              <li className="px-3 py-2 text-gray-400 text-sm">No products match</li>
            )}
            {options.map((p, idx) => {
              const active = idx === activeIndex;
              return (
                <li
                  key={p.id}
                  role="option"
                  aria-selected={String(p.id) === String(value)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => selectOption(p)}
                  className={`px-3 py-2 cursor-pointer flex items-center justify-between gap-4 ${active ? "bg-white/6" : "hover:bg-white/3"}`}
                >
                  <div>
                    <div className="font-medium text-sm">{p.name}</div>
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

/* ===== Main SalesList page (restored, modified to use ProductSelect) ===== */
export default function SalesList() {
  const dispatch = useDispatch();

  const { list: sales = [], loading: salesLoading } = useSelector((s) => s.sales || {});
  const products = useSelector((s) => s.products?.list || []);

  // Add form state
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [saleDate, setSaleDate] = useState(""); // datetime-local string

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editProductId, setEditProductId] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editUnitPrice, setEditUnitPrice] = useState("");
  const [editSaleDate, setEditSaleDate] = useState("");

  // Table UI
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState({ key: "createdAt", dir: "desc" });
  const [page, setPage] = useState(1);
  const perPage = 8;

  // Delete modal
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchSales());
  }, [dispatch]);

  useEffect(() => {
    if (!productId) {
      setUnitPrice("");
      return;
    }
    const prod = products.find((p) => String(p.id) === String(productId));
    if (prod) setUnitPrice(prod.sellingPrice ?? "");
    else setUnitPrice("");
  }, [productId, products]);

  const addTotal = useMemo(() => {
    const q = Number(quantity) || 0;
    const p = Number(unitPrice) || 0;
    return q * p;
  }, [quantity, unitPrice]);

  const editingProduct = useMemo(() => {
    return products.find((p) => String(p.id) === String(editProductId));
  }, [products, editProductId]);

  const editUnitPriceFromProduct = editingProduct?.sellingPrice ?? 0;
  const computedEditUnitPrice = editUnitPrice || editUnitPriceFromProduct;

  const editTotal = useMemo(() => {
    return (Number(editQuantity) || 0) * (Number(computedEditUnitPrice) || 0);
  }, [editQuantity, computedEditUnitPrice, editUnitPrice]);

  const filtered = useMemo(() => {
    const s = searchText.trim().toLowerCase();
    return (sales || [])
      .filter((sale) => {
        if (s) {
          const prodName = (sale.productName || "").toLowerCase();
          if (!prodName.includes(s)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const k = sortBy.key;
        const dir = sortBy.dir === "asc" ? 1 : -1;
        if (k === "productName") return dir * a.productName.localeCompare(b.productName);
        if (k === "quantity") return dir * ((a.quantity || 0) - (b.quantity || 0));
        if (k === "totalAmount") return dir * ((a.totalAmount || 0) - (b.totalAmount || 0));
        const da = getSaleDate(a);
        const db = getSaleDate(b);
        const ta = da ? new Date(da).getTime() : 0;
        const tb = db ? new Date(db).getTime() : 0;
        return dir * (ta - tb);
      });
  }, [sales, searchText, sortBy]);

  const pages = Math.max(1, Math.ceil((filtered?.length || 0) / perPage));
  const pageData = (filtered || []).slice((page - 1) * perPage, page * perPage);

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
    a.download = `sales-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function submitSale(e) {
    e.preventDefault();
    if (!productId || !quantity) {
      toast.error("Choose a product and quantity");
      return;
    }
    const selected = products.find((p) => String(p.id) === String(productId));
    if (!selected) {
      toast.error("Selected product not found");
      return;
    }
    if ((selected.quantity ?? 0) < Number(quantity)) {
      toast.error("Insufficient stock for this sale");
      return;
    }
    try {
      const createdAtIso = saleDate ? new Date(saleDate).toISOString() : new Date().toISOString();
      const payload = {
        productId: Number(productId),
        quantity: Number(quantity),
        createdAt: createdAtIso,
      };
      await dispatch(addSale(payload)).unwrap();
      toast.success("Sale added");
      setProductId("");
      setQuantity("");
      setUnitPrice("");
      setSaleDate("");
      setPage(1);
      dispatch(fetchSales());
    } catch (err) {
      console.error(err);
      toast.error("Failed to add sale");
    }
  }

  function startEdit(sale) {
    setEditingId(sale.id);
    setEditProductId(String(sale.productId));
    setEditQuantity(String(sale.quantity));
    setEditUnitPrice(String(sale.unitPrice ?? ""));
    const sd = getSaleDate(sale);
    setEditSaleDate(sd ? toDateTimeLocal(sd) : "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveEdit() {
    if (!editingId) return;
    if (!editProductId || !editQuantity) {
      toast.error("Product & quantity required");
      return;
    }
    try {
      const payload = {
        productId: Number(editProductId),
        quantity: Number(editQuantity),
        ...(editSaleDate ? { createdAt: new Date(editSaleDate).toISOString() } : {}),
      };
      await dispatch(updateSale({ id: editingId, data: payload })).unwrap();
      toast.success("Sale updated");
      setEditingId(null);
      setEditProductId("");
      setEditQuantity("");
      setEditUnitPrice("");
      setEditSaleDate("");
      dispatch(fetchSales());
    } catch (err) {
      console.error(err);
      toast.error("Failed to update");
    }
  }

  async function confirmDelete() {
    try {
      setDeleting(true);
      await dispatch(deleteSale(deleteId)).unwrap();
      toast.success("Sale deleted");
      dispatch(fetchSales());
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete sale");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales</h1>
          <div className="text-gray-400">Record & manage sales — dark theme</div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="px-3 py-2 rounded-md" style={{ background: THEME.accent, color: "#071126", fontWeight: 700 }}>
            Export CSV
          </button>
        </div>
      </div>

      {/* Add/Edit + Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add / Edit form */}
        <form
          onSubmit={editingId ? (e => { e.preventDefault(); saveEdit(); }) : submitSale}
          className="card p-5 col-span-1"
        >
          <h2 className="font-semibold mb-3">{editingId ? "Edit Sale" : "Add Sale"}</h2>

          <label className="text-sm text-gray-300">Product</label>
          {/* Use custom ProductSelect */}
          <div className="mb-3">
            <ProductSelect
              value={editingId ? editProductId : productId}
              onChange={(val) => (editingId ? setEditProductId(val) : setProductId(val))}
              products={products}
              placeholder="Search / choose product..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-300">Quantity</label>
              <input
                type="number"
                value={editingId ? editQuantity : quantity}
                onChange={(e) => (editingId ? setEditQuantity(e.target.value) : setQuantity(e.target.value))}
                className="w-full px-3 py-2 rounded-md bg-black/20 border border-white/10"
                min="0"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Unit Price</label>
              <input
                type="number"
                value={editingId ? (editUnitPrice || editUnitPriceFromProduct) : unitPrice}
                onChange={(e) => !editingId && setUnitPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-black/20 border border-white/10"
                disabled={editingId}
                min="0"
              />
            </div>
          </div>

          {/* Date field */}
          <div className="mt-3">
            <label className="text-sm text-gray-300">Date & time (optional)</label>
            <input
              type="datetime-local"
              value={editingId ? editSaleDate : saleDate}
              onChange={(e) => editingId ? setEditSaleDate(e.target.value) : setSaleDate(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-black/20 border border-white/10"
            />
            <div className="text-xs text-gray-500 mt-1">If empty, current time will be used.</div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-300">
              Total: <span className="font-semibold">{formatCurrency(editingId ? editTotal : addTotal)}</span>
            </div>

            <div className="flex gap-2">
              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setEditProductId(""); setEditQuantity(""); setEditUnitPrice(""); setEditSaleDate(""); }}
                  className="px-3 py-2 rounded-md border border-white/10"
                >
                  Cancel
                </button>
              )}
              <button type="submit" className="px-4 py-2 rounded-md" style={{ background: THEME.accent, color: "#071126", fontWeight: 700 }}>
                {editingId ? "Save" : "Add Sale"}
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-500 mt-3">Note: Add will validate stock before creating a sale.</div>
        </form>

        {/* Table */}
        <aside className="card p-4 col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <input placeholder="Search product..." value={searchText} onChange={(e) => { setSearchText(e.target.value); setPage(1); }} className="px-3 py-2 rounded-md bg-black/20 border border-white/10" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="text-sm text-gray-400 mr-1">Sort:</div>
              <button onClick={() => changeSort("createdAt")} className="min-w-[72px] text-center px-2 py-1 rounded-md border border-white/10 text-sm">Date</button>
              <button onClick={() => changeSort("productName")} className="min-w-[72px] text-center px-2 py-1 rounded-md border border-white/10 text-sm">Product</button>
              <button onClick={() => changeSort("quantity")} className="min-w-[72px] text-center px-2 py-1 rounded-md border border-white/10 text-sm">Qty</button>
              <button onClick={() => changeSort("totalAmount")} className="min-w-[72px] text-center px-2 py-1 rounded-md border border-white/10 text-sm">Total</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-400">
                <tr>
                  <th className="py-2">Product</th>
                  <th className="py-2">Qty</th>
                  <th className="py-2">Unit</th>
                  <th className="py-2">Total</th>
                  <th className="py-2">When</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((s) => (
                  <tr key={s.id} className="border-t border-white/6">
                    <td className="py-3">
                      <div className="font-medium">{s.productName}</div>
                      <div className="text-xs text-gray-400">SKU: {s.sku ?? "-"}</div>
                    </td>
                    <td className="py-3">{s.quantity}</td>
                    <td className="py-3">{formatCurrency(s.unitPrice)}</td>
                    <td className="py-3">{formatCurrency(s.totalAmount)}</td>
                    <td className="py-3 text-gray-400">{formatDate(getSaleDate(s))}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(s)} className="px-2 py-1 rounded-md border border-white/10 text-sm">Edit</button>
                        <button onClick={() => setDeleteId(s.id)} className="px-2 py-1 rounded-md text-white" style={{ background: THEME.danger }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && <div className="p-4 text-gray-400">No sales found.</div>}
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-400">Showing {filtered.length} results</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 rounded-md border border-white/10">Prev</button>
              <div className="text-sm">Page {page} / {pages}</div>
              <button onClick={() => setPage((p) => Math.min(pages, p + 1))} className="px-3 py-1 rounded-md border border-white/10">Next</button>
            </div>
          </div>
        </aside>
      </div>

      {/* Confirm delete modal */}
      <ConfirmDeleteModal
        open={!!deleteId}
        title="Delete Sale"
        message="Are you sure you want to delete this sale?"
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

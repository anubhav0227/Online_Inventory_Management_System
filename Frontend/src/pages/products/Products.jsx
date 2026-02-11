import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../stores/slices/productSlice";
import toast from "react-hot-toast";
import ConfirmDeleteModal from "../../components/ui/ConfirmDeleteModal";
import { motion } from "framer-motion";

/* ===== THEME ===== */
const THEME = {
  accent: "#00D1B2",
  danger: "#EF4444",
  warning: "#FBBF24",
};

export default function Products() {
  const dispatch = useDispatch();

  const { list: products = [], loading } = useSelector(
    (s) => s.products
  );

  /* ===== FORM STATE ===== */
  const [form, setForm] = useState({
    name: "",
    sku: "",
    costPrice: "",
    sellingPrice: "",
    quantity: "",
  });
  const [editingId, setEditingId] = useState(null);

  /* ===== UI STATE ===== */
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ===== LOAD ===== */
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  /* ===== FILTERED PRODUCTS ===== */
  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      `${p.name} ${p.sku}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [products, search]);

  /* ===== METRICS ===== */
  const metrics = useMemo(() => {
    const totalValue = products.reduce(
      (s, p) => s + p.sellingPrice * p.quantity,
      0
    );
    const avgPrice = products.length
      ? Math.round(
          products.reduce((s, p) => s + p.sellingPrice, 0) /
            products.length
        )
      : 0;
    const lowStock = products.filter(
      (p) => p.quantity <= 5
    ).length;

    return {
      total: products.length,
      lowStock,
      avgPrice,
      totalValue,
    };
  }, [products]);

  /* ===== SUBMIT ===== */
  const submitProduct = async (e) => {
    e.preventDefault();
    const { name, sku, costPrice, sellingPrice, quantity } = form;

    if (!name || !sku || !costPrice || !sellingPrice || !quantity) {
      toast.error("All fields are required");
      return;
    }

    const payload = {
      name: name.trim(),
      sku: sku.trim(),
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      quantity: Number(quantity),
    };

    try {
      if (editingId) {
        await dispatch(
          updateProduct({ id: editingId, data: payload })
        ).unwrap();
        toast.success("Product updated");
      } else {
        await dispatch(addProduct(payload)).unwrap();
        toast.success("Product added");
      }
      resetForm();
    } catch {
      toast.error("Failed to save product");
    }
  };

  /* ===== EDIT ===== */
  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      sku: p.sku,
      costPrice: p.costPrice,
      sellingPrice: p.sellingPrice,
      quantity: p.quantity,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ===== DELETE ===== */
  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await dispatch(deleteProduct(deleteId)).unwrap();
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      sku: "",
      costPrice: "",
      sellingPrice: "",
      quantity: "",
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-400">Manage inventory items</p>
        </div>

        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-md bg-black/30 border border-white/10"
        />
      </div>

      {/* ===== METRICS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard title="Products" value={metrics.total} />
        <MetricCard
          title="Low Stock"
          value={metrics.lowStock}
          color={THEME.warning}
        />
        <MetricCard
          title="Avg Price"
          value={`₹${metrics.avgPrice}`}
        />
        <MetricCard
          title="Inventory Value"
          value={`₹${metrics.totalValue.toLocaleString()}`}
          color={THEME.accent}
        />
      </div>

      {/* ===== MAIN GRID ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== FORM ===== */}
        <section className="bg-black/30 border border-white/10 rounded-xl p-5">
          <h2 className="font-semibold mb-4">
            {editingId ? "Edit Product" : "Add Product"}
          </h2>

          <form onSubmit={submitProduct} className="space-y-3">
            {["name", "sku", "costPrice", "sellingPrice", "quantity"].map(
              (field) => (
                <input
                  key={field}
                  type={field.includes("Price") || field === "quantity" ? "number" : "text"}
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-md bg-black/20 border border-white/10"
                />
              )
            )}

            <div className="flex justify-end gap-2 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-2 rounded-md border border-white/10"
                >
                  Cancel
                </button>
              )}
              <button
                className="px-4 py-2 rounded-md font-semibold"
                style={{ background: THEME.accent, color: "#071126" }}
              >
                {editingId ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </form>
        </section>

        {/* ===== LIST ===== */}
        <section className="lg:col-span-2 bg-black/30 border border-white/10 rounded-xl p-5">
          <h3 className="font-semibold mb-4">Product List</h3>

          {loading && <p className="text-gray-400">Loading...</p>}

          <div className="space-y-3">
            {filteredProducts.length === 0 && (
              <div className="text-gray-400">No products found</div>
            )}

            {filteredProducts.map((p) => {
              const profit = p.sellingPrice - p.costPrice;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-lg border border-white/10 flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm text-gray-400">
                      SKU: {p.sku}
                    </div>
                    <div className="text-sm mt-1">
                      ₹{p.sellingPrice} • Qty {p.quantity} • Profit ₹{profit}
                    </div>
                    {p.quantity <= 5 && (
                      <span className="inline-block mt-1 text-xs text-black px-2 py-0.5 rounded"
                        style={{ background: THEME.warning }}>
                        Low stock
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="px-3 py-1 rounded-md text-sm border border-white/10"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="px-3 py-1 rounded-md text-sm text-white"
                      style={{ background: THEME.danger }}
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ===== DELETE MODAL ===== */}
      <ConfirmDeleteModal
        open={!!deleteId}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

/* ===== METRIC CARD ===== */
function MetricCard({ title, value, color }) {
  return (
    <div className="bg-black/30 border border-white/10 rounded-xl p-4">
      <div className="text-sm text-gray-400">{title}</div>
      <div className="text-2xl font-bold mt-1" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

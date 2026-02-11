// src/components/dashboard/ProductTable.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function ProductTable({ products = [], onEdit = () => {}, onViewCompany = () => {} }) {
  const [page, setPage] = useState(1);
  const perPage = 8;
  const [sortBy, setSortBy] = useState({ key: "name", dir: "asc" });

  const sorted = useMemo(() => {
    const copy = [...products];
    const key = sortBy.key;
    copy.sort((a, b) => {
      const av = (a[key] ?? "").toString().toLowerCase();
      const bv = (b[key] ?? "").toString().toLowerCase();
      if (av < bv) return sortBy.dir === "asc" ? -1 : 1;
      if (av > bv) return sortBy.dir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [products, sortBy]);

  const pages = Math.max(1, Math.ceil(sorted.length / perPage));
  const pageData = sorted.slice((page - 1) * perPage, page * perPage);

  function toggleSort(key) {
    setSortBy((s) => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-400">Showing {sorted.length} products</div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-400">Sort by:</div>
          <button onClick={() => toggleSort("name")} className="px-3 py-1 rounded-md border border-white/6 text-sm">Name</button>
          <button onClick={() => toggleSort("price")} className="px-3 py-1 rounded-md border border-white/6 text-sm">Price</button>
          <button onClick={() => toggleSort("quantity")} className="px-3 py-1 rounded-md border border-white/6 text-sm">Qty</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-sm text-gray-400">
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Category</th>
              <th className="py-2">Price</th>
              <th className="py-2">Qty</th>
              <th className="py-2">Reorder</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {pageData.map((p) => (
              <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-white/6">
                <td className="py-3">{p.name}</td>
                <td className="py-3 text-gray-300">{p.cat || p.category || "General"}</td>
                <td className="py-3">${p.price ?? "—"}</td>
                <td className="py-3">{p.quantity ?? 0}</td>
                <td className="py-3">{p.reorderLevel ?? 5}</td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button onClick={() => onEdit(p)} className="px-3 py-1 rounded-md border border-white/10 text-sm">Edit</button>
                    <button onClick={() => onViewCompany(p.company || {})} className="px-3 py-1 rounded-md border border-white/10 text-sm">Company</button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-400">Page {page} of {pages}</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p-1))} className="px-3 py-1 rounded-md border border-white/10">Prev</button>
          <button onClick={() => setPage((p) => Math.min(pages, p+1))} className="px-3 py-1 rounded-md border border-white/10">Next</button>
        </div>
      </div>
    </div>
  );
}

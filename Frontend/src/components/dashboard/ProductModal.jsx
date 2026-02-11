// src/components/dashboard/ProductModal.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ProductModal({ product = {}, onClose = () => {} }) {
  const [form, setForm] = useState({
    name: product.name || "",
    price: product.price || 0,
    quantity: product.quantity || 0,
    cat: product.cat || product.category || "General",
    reorderLevel: product.reorderLevel || 5,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 max-w-2xl w-full bg-slate-900 rounded-xl p-6 border border-white/6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">{product?.id ? "Edit Product" : "Create Product"}</h3>
          <button onClick={onClose} className="text-gray-300">✕</button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="block text-sm">Name</label>
          <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full px-3 py-2 rounded-md bg-black/10 border border-white/6" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm">Price</label>
              <input type="number" value={form.price} onChange={(e)=>setForm({...form, price:Number(e.target.value)})} className="w-full px-3 py-2 rounded-md bg-black/10 border border-white/6" />
            </div>
            <div>
              <label className="block text-sm">Quantity</label>
              <input type="number" value={form.quantity} onChange={(e)=>setForm({...form, quantity:Number(e.target.value)})} className="w-full px-3 py-2 rounded-md bg-black/10 border border-white/6" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm">Category</label>
              <input value={form.cat} onChange={(e)=>setForm({...form, cat:e.target.value})} className="w-full px-3 py-2 rounded-md bg-black/10 border border-white/6" />
            </div>
            <div>
              <label className="block text-sm">Reorder Level</label>
              <input type="number" value={form.reorderLevel} onChange={(e)=>setForm({...form, reorderLevel:Number(e.target.value)})} className="w-full px-3 py-2 rounded-md bg-black/10 border border-white/6" />
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <button onClick={() => { alert("Save product simulated (mock)"); onClose(); }} className="px-4 py-2 rounded-md bg-teal-400 text-black">Save</button>
            <button onClick={onClose} className="px-4 py-2 rounded-md border border-white/10">Cancel</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

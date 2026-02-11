// src/components/dashboard/CompanyModal.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function CompanyModal({ company = {}, onClose = () => {} }) {
  const [form, setForm] = useState({
    name: company.name || "",
    email: company.email || "",
    active: company.active ?? true,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 max-w-2xl w-full bg-slate-900 rounded-xl p-6 border border-white/6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">{company?.id ? "Edit Company" : "Create Company"}</h3>
          <button onClick={onClose} className="text-gray-300">✕</button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="block text-sm">Name</label>
          <input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="w-full px-3 py-2 rounded-md bg-black/10 border border-white/6" />

          <label className="block text-sm">Email</label>
          <input value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} className="w-full px-3 py-2 rounded-md bg-black/10 border border-white/6" />

          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={(e)=>setForm({...form, active: e.target.checked})} /> Active</label>

          <div className="flex gap-2 mt-3">
            <button onClick={() => { alert("Save simulated (mock)."); onClose(); }} className="px-4 py-2 rounded-md bg-teal-400 text-black">Save</button>
            <button onClick={onClose} className="px-4 py-2 rounded-md border border-white/10">Cancel</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

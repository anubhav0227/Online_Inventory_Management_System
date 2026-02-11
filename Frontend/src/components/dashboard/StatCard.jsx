// src/components/dashboard/StatCard.jsx
import React from "react";
import { motion } from "framer-motion";

export default function StatCard({ title, value, accent = "#00D1B2" }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl border border-white/6 bg-black/30">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-300">{title}</div>
          <div className="text-2xl font-bold mt-2">{value}</div>
        </div>
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `${accent}22` }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="8" stroke={accent} strokeWidth="1.6" />
            <path d="M8 12h8" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

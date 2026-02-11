// src/layouts/AppLayout.jsx
import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/ui/Navbar";

/**
 * Modern AppLayout — dark theme, left nav, topbar, content area
 */

export default function AppLayout() {
  const user = useSelector((s) => s.auth?.user);
  const name = user?.name || "User";
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* SIDEBAR */}
      <aside className={`w-64 hidden md:block`} style={{ background: "linear-gradient(180deg, rgba(2,6,23,0.9), rgba(5,9,20,0.95))", borderRight: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="h-16 flex items-center px-5">
          <Link to="/" className="font-extrabold text-xl">
            <span style={{ color: "var(--accent-soft)" }}>Inventory</span><span style={{ color: "var(--accent)" }}>Pro</span>
          </Link>
        </div>

        <nav className="px-3 py-6 space-y-1">
          <NavItem to="/dashboard" label="Dashboard" />
          <NavItem to="/products" label="Products" />
          <NavItem to="/sales" label="Sales" />
          <NavItem to="/purchase" label="Purchase" />
          <NavItem to="/Profile" label="Profile" />
        </nav>

        <div className="mt-auto px-4 py-6 text-sm text-gray-400">
          Signed in as <div className="font-medium text-gray-200">{name}</div>
        </div>
      </aside>

      {/* MOBILE TOPBAR still handled inside Navbar - no duplication here */}

      {/* MAIN */}
      <main className="flex-1 page-shell p-0 overflow-auto">
        {/* top navbar */}
        <Navbar onToggleSidebar={() => setMobileSidebarOpen((v) => !v)} />

        {/* content wrapper */}
        <div className="max-w-7xl mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavItem({ to, label }) {
  return (
    <Link to={to} className="block px-4 py-3 rounded-md text-gray-200 hover:text-white" style={{ textDecoration: "none" }}>
      {label}
    </Link>
  );
}

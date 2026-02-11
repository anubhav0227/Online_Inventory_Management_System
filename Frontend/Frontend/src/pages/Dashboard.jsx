import React from "react";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const categories = useSelector((state) => state.categories?.list || []);
  const companies = useSelector((state) => state.companies?.list || []);
  const sales = useSelector((state) => state.sales?.list || []);
  const purchases = useSelector((state) => state.purchases?.list || []);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = user?.role?.toLowerCase();

  const isAdmin = role === "admin";
  const isCompany = role === "company";

  const totalCompanies = companies.length;
  const activeCompanies = companies.filter(
    (c) => c.status === "active" || c.active === true
  ).length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      {/* ===== COMPANY DASHBOARD ===== */}
      {isCompany && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl shadow border">
            <h2 className="text-xl font-bold">Categories</h2>
            <p className="text-3xl mt-3">{categories.length}</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow border">
            <h2 className="text-xl font-bold">Sales</h2>
            <p className="text-3xl mt-3">{sales.length}</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow border">
            <h2 className="text-xl font-bold">Purchase</h2>
            <p className="text-3xl mt-3">{purchases.length}</p>
          </div>
        </div>
      )}

      {/* ===== ADMIN DASHBOARD ===== */}
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-xl shadow border">
            <h2 className="text-xl font-bold">Total Companies</h2>
            <p className="text-3xl mt-3">{totalCompanies}</p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow border">
            <h2 className="text-xl font-bold">Active Companies</h2>
            <p className="text-3xl mt-3">{activeCompanies}</p>
          </div>
        </div>
      )}
    </div>
  );
}

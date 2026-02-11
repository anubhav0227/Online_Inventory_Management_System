import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import CategoryList from "./pages/categories/CategoryList";
import CategoryForm from "./pages/categories/CategoryForm";
import SalesList from "./pages/sales/SalesList";
import PurchaseList from "./pages/purchase/PurchaseList";
import CompanyRegister from "./pages/companies/CompanyRegister";
import AdminPanel from "./pages/admin/AdminPanel";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LandingPage from "./pages/LandingPage";
import Profile from "./pages/Profile";
import Products from "./pages/products/Products";
import CompaniesList from "./pages/companies/CompaniesList";
import ActivityLogs from "./pages/admin/ActivityLogs";


function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-300">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function RequireAuth({ children, role }) {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/companies/register" element={<CompanyRegister />} />

      <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
      <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />

      <Route path="/products" element={<AppLayout><Products /></AppLayout>} />

      <Route path="/categories" element={<AppLayout><CategoryList /></AppLayout>} />
      <Route path="/categories/new" element={<AppLayout><CategoryForm /></AppLayout>} />
      <Route path="/categories/edit/:id" element={<AppLayout><CategoryForm /></AppLayout>} />

      <Route path="/sales" element={<AppLayout><SalesList /></AppLayout>} />
      <Route path="/purchase" element={<AppLayout><PurchaseList /></AppLayout>} />

      {/* Admin-only companies list */}
      <Route
        path="/companies"
        element={
          <RequireAuth role="admin">
            <AppLayout><CompaniesList /></AppLayout>
          </RequireAuth>
        }
      />

      <Route
  path="/activity-logs"
  element={
    <RequireAuth role="admin">
      <AppLayout>
        <ActivityLogs />
      </AppLayout>
    </RequireAuth>
  }
/>


      <Route path="/admin" element={<RequireAuth role="admin"><AppLayout><AdminPanel /></AppLayout></RequireAuth>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

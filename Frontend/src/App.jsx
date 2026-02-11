import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Products from "./pages/products/Products";
import CategoryList from "./pages/categories/CategoryList";
import CategoryForm from "./pages/categories/CategoryForm";
import SalesList from "./pages/sales/SalesList";
import PurchaseList from "./pages/purchase/PurchaseList";
import CompanyRegister from "./pages/companies/CompanyRegister";
import CompaniesList from "./pages/companies/CompaniesList";
import AdminPanel from "./pages/admin/AdminPanel";
import ActivityLogs from "./pages/admin/ActivityLogs";

import RequireAuth from "./routes/RequireAuth";
import AppLayout from "./layouts/AppLayouts";

export default function App() {
  return (
    <Routes>

      {/* ===== PUBLIC ===== */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/companies/register" element={<CompanyRegister />} />

      {/* ===== AUTHENTICATED USERS ===== */}
      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/categories/new" element={<CategoryForm />} />
          <Route path="/categories/edit/:id" element={<CategoryForm />} />
          <Route path="/sales" element={<SalesList />} />
          <Route path="/purchase" element={<PurchaseList />} />
        </Route>
      </Route>

      {/* ===== ADMIN ONLY ===== */}
      <Route element={<RequireAuth role="admin" />}>
        <Route element={<AppLayout />}>
          <Route path="/companies" element={<CompaniesList />} />
          <Route path="/activity-logs" element={<ActivityLogs />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
      </Route>

      {/* ===== FALLBACK ===== */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

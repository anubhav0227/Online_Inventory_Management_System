// src/pages/companies/CompaniesList.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompanies, deleteCompany } from "../../stores/slices/companySlice";
import toast from "react-hot-toast";

export default function CompaniesList() {
  const dispatch = useDispatch();
  const { list: companies = [], loading } = useSelector((state) => state.companies || {});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchCompanies()).unwrap?.();
      toast.success("Refreshed");
    } catch {
      toast.error("Failed to refresh");
    } finally {
      setRefreshing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete company? This will remove company from list.")) return;
    try {
      await dispatch(deleteCompany(id)).unwrap?.();
      // fetch updated list (slice already removes in fulfilled, but keep sync)
      dispatch(fetchCompanies());
    } catch {
      toast.error("Failed to delete company");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Companies</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="px-3 py-2 bg-gray-200 rounded"
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-lg shadow p-4">
        {loading && <p className="text-sm text-gray-500">Loading companies...</p>}

        {companies.length === 0 && !loading && (
          <p className="text-gray-500">No companies registered yet.</p>
        )}

        <ul className="space-y-3">
          {companies.map((c) => (
            <li
              key={c.id}
              className="p-4 bg-gray-50 rounded flex justify-between items-start border"
            >
              <div>
                <div className="font-semibold">{c.name}</div>
                <div className="text-sm text-gray-600">{c.email}</div>
                {c.phone && <div className="text-xs text-gray-500 mt-1">Phone: {c.phone}</div>}
                {c.role && <div className="text-xs text-gray-500 mt-1">Role: {c.role}</div>}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleDelete(c.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

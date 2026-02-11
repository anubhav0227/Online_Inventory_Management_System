import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompanies,
  updateCompanyStatus,
} from "../../stores/slices/companySlice";
import toast from "react-hot-toast";

export default function CompaniesList() {
  const dispatch = useDispatch();

  const { list: companies = [], loading } = useSelector(
    (state) => state.companies
  );

  // ================= LOAD =================
  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  // ================= TOGGLE STATUS =================
  const toggleStatus = async (company) => {
    try {
      await dispatch(
        updateCompanyStatus({
          id: company.id,
          active: !company.active,
        })
      ).unwrap();

      toast.success(
        `Company ${company.active ? "disabled" : "enabled"}`
      );
    } catch {
      toast.error("Failed to update company status");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Registered Companies</h1>

        <button
          onClick={() => dispatch(fetchCompanies())}
          className="px-3 py-2 bg-gray-200 rounded"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="bg-white border rounded-lg shadow p-4">
        {loading && (
          <p className="text-sm text-gray-500">
            Loading companies...
          </p>
        )}

        {!loading && companies.length === 0 && (
          <p className="text-gray-500">
            No companies registered yet.
          </p>
        )}

        <ul className="space-y-3">
          {companies.map((c) => (
            <li
              key={c.id}
              className="p-4 bg-gray-50 rounded flex justify-between items-center border"
            >
              <div>
                <div className="font-semibold">
                  {c.name || "—"}
                </div>

                <div className="text-sm text-gray-600">
                  {c.username}
                </div>

                <div className="text-xs mt-1 text-gray-500">
                  Registered:{" "}
                  {c.createdAt
                    ? new Date(c.createdAt).toLocaleDateString()
                    : "—"}
                </div>

                <div className="text-xs mt-1">
                  Status:{" "}
                  <span
                    className={
                      c.active
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {c.active ? "Active" : "Disabled"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => toggleStatus(c)}
                className={`px-3 py-1 rounded text-sm text-white ${
                  c.active
                    ? "bg-red-500 hover:bg-red-400"
                    : "bg-green-500 hover:bg-green-400"
                }`}
              >
                {c.active ? "Disable" : "Enable"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

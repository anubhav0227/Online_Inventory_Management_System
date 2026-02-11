import React from "react";
import { useSelector } from "react-redux";

export default function ActivityLogs() {
  const companies = useSelector((state) => state.companies?.list || []);

  const logs = companies
    .slice()
    .reverse()
    .map((company, index) => ({
      id: index,
      message: `Company "${company.name}" registered`,
      time: company.createdAt
        ? new Date(company.createdAt).toLocaleString()
        : "Recently",
    }));

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Activity Logs</h1>

      <div className="bg-white rounded-xl shadow border p-6">
        {logs.length === 0 ? (
          <p className="text-gray-500">No activity found</p>
        ) : (
          <ul className="space-y-4">
            {logs.map((log) => (
              <li
                key={log.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="text-gray-700">{log.message}</span>
                <span className="text-sm text-gray-500">{log.time}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

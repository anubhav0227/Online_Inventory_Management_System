// src/components/dashboard/CompanyStatusChart.jsx
import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CompanyStatusChart({ active = 0, inactive = 0 }) {
  const total = active + inactive || 1;
  const data = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        data: [active, inactive],
        backgroundColor: ["#00D1B2", "#EF4444"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: { legend: { position: "bottom", labels: { color: "#cbd5e1" } }, tooltip: { enabled: true } },
    responsive: true,
  };

  return (
    <div>
      <h3 className="font-semibold mb-3">Company Status</h3>
      <Doughnut data={data} options={options} />
      <div className="mt-3 text-sm text-gray-400">Total: {total}</div>
    </div>
  );
}

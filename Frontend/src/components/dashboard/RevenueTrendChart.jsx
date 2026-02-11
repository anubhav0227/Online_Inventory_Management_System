// src/components/dashboard/RevenueTrendChart.jsx
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

/**
 * Fixed RevenueTrendChart
 * - container has explicit height so chart won't stretch indefinitely
 * - maintainAspectRatio = false so chart uses container height
 */
export default function RevenueTrendChart({ title = "Revenue", series = [] }) {
  const labels = series.map((_, i) => `Day ${i + 1}`);
  const data = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: series,
        borderColor: "#00D1B2",
        backgroundColor: "rgba(0,209,178,0.12)",
        tension: 0.25,
        pointRadius: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // <--- important: chart will fit its container
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(255,255,255,0.03)" } },
      y: { ticks: { color: "#cbd5e1" }, grid: { color: "rgba(255,255,255,0.03)" } },
    },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{title}</h3>
        <div className="text-sm text-gray-400">Last updated just now</div>
      </div>

      {/* Important: give the chart container a fixed height.
          You can change '260px' to any desired height (e.g., 220, 300).
          Using Tailwind: className="h-[260px]" would also work if Tailwind not purged.
      */}
      <div style={{ height: 260, minHeight: 200 }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

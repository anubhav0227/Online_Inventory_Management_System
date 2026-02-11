// src/components/dashboard/Sparkline.jsx
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip);

export default function Sparkline({ title = "", values = [], color = "#00D1B2" }) {
  const labels = values.map((_, i) => i + 1);
  const data = {
    labels,
    datasets: [
      {
        data: values,
        borderColor: color,
        backgroundColor: `${color}22`,
        fill: true,
        tension: 0.25,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    elements: { line: { borderWidth: 2 } },
    scales: { x: { display: false }, y: { display: false } },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="p-4 rounded-xl border border-white/6 bg-black/30">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-300">{title}</div>
          <div className="text-lg font-semibold">{values[values.length - 1] ?? 0}</div>
        </div>
        <div style={{ width: 120, height: 48 }}>
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

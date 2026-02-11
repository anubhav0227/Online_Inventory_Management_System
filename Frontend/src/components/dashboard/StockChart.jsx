// src/components/dashboard/StockChart.jsx
import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function StockChart({ products = [] }) {
  if (!products || products.length === 0) {
    return <div className="text-gray-400">No product stock data available.</div>;
  }

  const display = products.slice(0, 8); // limit so chart is readable
  const data = {
    labels: display.map((p) => p.name),
    datasets: [
      {
        label: "Stock",
        data: display.map((p) => Number(p.quantity || 0)),
        backgroundColor: "#6366f1",
      },
    ],
  };

  const options = {
    plugins: { legend: { display: false } },
    scales: { x: { ticks: { color: "#cbd5e1" } }, y: { ticks: { color: "#cbd5e1" } } },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ minHeight: 200 }}>
      <Bar data={data} options={options} />
    </div>
  );
}

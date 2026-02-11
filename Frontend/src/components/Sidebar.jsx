import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBuilding,
  FaClipboardList,
  FaBoxes,
  FaShoppingCart,
  FaTruck,
} from "react-icons/fa";

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role?.toLowerCase();

  let links = [];

  // ===== ADMIN MENU =====
  if (role === "admin") {
    links = [
      { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
      { name: "Companies", path: "/companies", icon: <FaBuilding /> },
      { name: "Activity Logs", path: "/activity-logs", icon: <FaClipboardList /> },
    ];
  }

  // ===== COMPANY MENU =====
  if (role === "company") {
    links = [
      { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
      { name: "Products", path: "/products", icon: <FaBoxes /> },
      { name: "Sales", path: "/sales", icon: <FaShoppingCart /> },
      { name: "Purchase", path: "/purchase", icon: <FaTruck /> },
    ];
  }

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-200 p-4">
      <ul className="space-y-3 mt-4">
        {links.map((item, i) => (
          <li key={i}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition
                ${
                  isActive
                    ? "bg-yellow-400 text-gray-900"
                    : "hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}

import React from "react";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>

      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <p><strong>User ID:</strong> {user?.id}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>
    </div>
  );
}

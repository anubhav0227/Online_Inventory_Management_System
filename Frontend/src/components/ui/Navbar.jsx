// src/components/ui/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../stores/slices/authSlice";
// import logout thunk if you have one, otherwise we'll navigate to /login
// import { logout as logoutAction } from "../../stores/slices/authSlice";

export default function Navbar({ onToggleSidebar }) {
  const user = useSelector((s) => s.auth?.user);
  const company = user?.companyName || user?.company || "";
  const name = user?.name || "User";
  const email = user?.email || "";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openUserMenu, setOpenUserMenu] = useState(false);

  function onLogout() {
    // if (dispatch && logoutAction) dispatch(logoutAction());
    // // otherwise just redirect to login
    // navigate("/login");
    
    dispatch(logout())
    setOpenUserMenu(false)
    navigate("/login");
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4 p-3 border-b border-white/6 bg-transparent">
        {/* LEFT: Home only */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-white" style={{ textDecoration: "none" }}>
            {/* simple Home icon (text) */}
            {/* <span aria-hidden className="inline-block w-6 text-center">🏠</span> */}
            <span className="hidden sm:inline text-lg">Home</span>
          </Link>
        </div>

        {/* RIGHT: profile + company + logout */}
        <div className="flex items-center gap-3">
          {/* Company name */}
          {company ? (
            <div className="hidden sm:flex flex-col text-right mr-2">
              <span className="text-sm text-gray-400">Company</span>
              <span className="text-sm font-medium text-white">{company}</span>
            </div>
          ) : null}

          {/* Avatar + dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenUserMenu((s) => !s)}
              className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/5"
              aria-haspopup="true"
              aria-expanded={openUserMenu}
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm text-white">
                {(name || "U")[0]}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-medium text-white">{name}</span>
                <span className="text-xs text-gray-400">{email}</span>
              </div>
            </button>

            {openUserMenu && (
              <div className="absolute right-0 mt-2 w-44 rounded-md bg-gray-900 border border-gray-700 shadow-lg z-50">
                <Link to="/profile" className="block px-3 py-2 text-sm hover:bg-gray-800">Profile</Link>
                <div className="border-t border-gray-700"></div>
                <button onClick={onLogout} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-800">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

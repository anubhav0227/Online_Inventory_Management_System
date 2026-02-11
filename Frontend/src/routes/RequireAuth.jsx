import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const RequireAuth = ({ role }) => {
  const user = useSelector((state) => state.auth.user);

  // ❌ Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔒 Role-based guard
  if (role && user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  // ✅ Allow access
  return <Outlet />;
};

export default RequireAuth;

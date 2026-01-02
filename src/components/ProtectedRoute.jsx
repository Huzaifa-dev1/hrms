// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("hrms_user")) || null;
  } catch {
    return null;
  }
};

export default function ProtectedRoute({ allow = [] }) {
  const user = getUser();

  // not logged in
  if (!user) return <Navigate to="/login" replace />;

  // role check (if allow provided)
  if (allow.length && !allow.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
}

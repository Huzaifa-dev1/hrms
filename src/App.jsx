// src/App.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Leaves from "./pages/Leaves";


// Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// ---- helpers (kept inside App.jsx to stay lite) ----
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("hrms_user")) || null;
  } catch {
    return null;
  }
};

const logout = () => {
  localStorage.removeItem("hrms_user");
  window.location.href = "/login";
};

// Protected wrapper with role support
function ProtectedRoute({ allow = [] }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;

  // if allow list provided, check role
  if (allow.length && !allow.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
}

// Layout wrapper (only for protected pages)
function AppLayout() {
  const user = getUser();

  return (
    <div className="app-shell page-anim">
      {/* Background layer (use your auth.jpg / gradient in CSS) */}
      <div className="app-bg" />

      <Navbar user={user} onLogout={logout} />

      <div className="app-body">
        <Sidebar role={user?.role} />
        <main className="app-content content-anim">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Simple pages for errors (kept inline to avoid extra files)
function NotFound() {
  return (
    <div className="center-page page-anim">
      <div className="glass-card">
        <h2>404 - Page Not Found</h2>
        <p className="muted">The page you’re looking for doesn’t exist.</p>
        <a className="btn primary" href="/dashboard">
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}

function NotAuthorized() {
  return (
    <div className="center-page page-anim">
      <div className="glass-card">
        <h2>403 - Not Authorized</h2>
        <p className="muted">You don’t have permission to access this page.</p>
        <a className="btn primary" href="/dashboard">
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}

// If user already logged in, avoid showing login page
function PublicLoginGuard() {
  const user = getUser();
  if (user) return <Navigate to="/dashboard" replace />;
  return <Login />;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<PublicLoginGuard />} />
      <Route path="/not-authorized" element={<NotAuthorized />} />

      {/* Protected layout */}
      <Route element={<ProtectedRoute allow={["Admin", "HR", "Employee"]} />}>
        <Route element={<AppLayout />}>
          {/* Dashboard for all roles */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Employees: Admin + HR */}
          <Route element={<ProtectedRoute allow={["Admin", "HR"]} />}>
            <Route path="/employees" element={<Employees />} />
          </Route>

          {/* Attendance: Admin only OR Admin + HR (your choice) */}
          <Route element={<ProtectedRoute allow={["Admin"]} />}>
            <Route path="/attendance" element={<Attendance />} />
          </Route>

          {/* Leaves: All roles */}
          <Route path="/leaves" element={<Leaves />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

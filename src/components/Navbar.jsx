// src/components/Navbar.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = useNavigate();
  const location = useLocation();

  const title = useMemo(() => {
    const path = location.pathname;
    if (path.includes("employees")) return "Employees";
    if (path.includes("attendance")) return "Attendance";
    if (path.includes("leaves")) return "Leaves";
    if (path.includes("dashboard")) return "Dashboard";
    return "HRMS Lite";
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // close mobile sheet on route change
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    if (typeof onLogout === "function") onLogout();
    else {
      localStorage.removeItem("hrms_user");
      nav("/login");
    }
  };

  return (
    <>
      <header className={`topbar ${scrolled ? "topbar--scrolled" : ""}`}>
        <div className="topbar__left">
          <button
            className="icon-btn only-mobile"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <Link to="/dashboard" className="brand">
            <span className="brand__dot" />
            <span className="brand__text">HRMS Lite</span>
          </Link>

          <div className="page-title">{title}</div>
        </div>

        <div className="topbar__right">
          <div className="chip hide-mobile">
            <span className="chip__role">{user?.role || "Guest"}</span>
          </div>

          <div className="user-pill">
            <div className="avatar">{(user?.name || "U")[0]?.toUpperCase()}</div>
            <div className="user-pill__meta hide-mobile">
              <div className="user-pill__name">{user?.name || "User"}</div>
              <div className="user-pill__sub muted">{user?.role || ""}</div>
            </div>
          </div>

          <button className="btn primary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="navsheet-backdrop" onClick={() => setMobileOpen(false)}>
          <div
            className="navsheet glass"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="navsheet__head">
              <div className="brand">
                <span className="brand__dot" />
                <span className="brand__text">HRMS Lite</span>
              </div>
              <button className="icon-btn" onClick={() => setMobileOpen(false)}>
                ✕
              </button>
            </div>

            <div className="navsheet__user">
              <div className="avatar lg">{(user?.name || "U")[0]?.toUpperCase()}</div>
              <div>
                <div style={{ fontWeight: 700 }}>{user?.name || "User"}</div>
                <div className="muted">{user?.role || ""}</div>
              </div>
            </div>

            <div className="navsheet__links">
              <Link className="navlink" to="/dashboard">
                Dashboard
              </Link>

              {(user?.role === "Admin" || user?.role === "HR") && (
                <Link className="navlink" to="/employees">
                  Employees
                </Link>
              )}

              {user?.role === "Admin" && (
                <Link className="navlink" to="/attendance">
                  Attendance
                </Link>
              )}

              <Link className="navlink" to="/leaves">
                Leaves
              </Link>

              <button className="btn primary" onClick={handleLogout} style={{ width: "100%", marginTop: 10 }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimal CSS for Navbar + Mobile sheet */}
      <style>{`
        .topbar{
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 64px;
          z-index: 50;
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding: 10px 16px;
          transition: background 220ms ease, border-color 220ms ease;
          background: rgba(10,14,22,0.35);
          border-bottom: 1px solid rgba(255,255,255,0.10);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .topbar--scrolled{
          background: rgba(10,14,22,0.55);
          border-bottom-color: rgba(255,255,255,0.14);
        }
        .topbar__left{ display:flex; align-items:center; gap: 12px; min-width: 0; }
        .topbar__right{ display:flex; align-items:center; gap: 10px; }
        .brand{ display:flex; align-items:center; gap: 10px; }
        .brand__dot{
          width: 12px; height: 12px; border-radius: 999px;
          background: linear-gradient(135deg, rgba(124,92,255,1), rgba(0,212,255,0.9));
          box-shadow: 0 0 0 5px rgba(124,92,255,0.12);
        }
        .brand__text{ font-weight: 800; letter-spacing: 0.2px; }
        .page-title{
          margin-left: 8px;
          padding-left: 10px;
          border-left: 1px solid rgba(255,255,255,0.12);
          color: rgba(234,240,255,0.9);
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .chip{
          padding: 7px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          font-size: 12px;
        }
        .chip__role{ font-weight: 700; }
        .user-pill{ display:flex; align-items:center; gap: 10px; }
        .avatar{
          width: 36px; height: 36px;
          border-radius: 999px;
          display:grid; place-items:center;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.06);
          font-weight: 800;
        }
        .avatar.lg{ width: 46px; height: 46px; }
        .user-pill__name{ font-weight: 800; line-height: 1.1; }
        .user-pill__sub{ font-size: 12px; margin-top: 2px; }

        .icon-btn{
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          color: var(--text);
          width: 38px; height: 38px;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 200ms ease, border-color 200ms ease;
        }
        .icon-btn:hover{ transform: translateY(-1px); border-color: rgba(255,255,255,0.22); }

        .only-mobile{ display:none; }
        .hide-mobile{ display:flex; }
        @media(max-width: 980px){
          .only-mobile{ display:inline-grid; place-items:center; }
          .hide-mobile{ display:none; }
          .page-title{ display:none; }
        }

        .navsheet-backdrop{
          position: fixed; inset: 0;
          z-index: 60;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display:flex;
          align-items: flex-start;
          justify-content: flex-start;
          padding: 10px;
          animation: fadeIn 200ms ease both;
        }
        .navsheet{
          width: min(340px, 92vw);
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.14);
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.06));
          box-shadow: 0 18px 60px rgba(0,0,0,0.55);
          padding: 12px;
          animation: fadeUp 260ms ease both;
        }
        .navsheet__head{
          display:flex; align-items:center; justify-content:space-between;
          padding: 6px 6px 10px;
          border-bottom: 1px solid rgba(255,255,255,0.10);
        }
        .navsheet__user{
          display:flex; align-items:center; gap: 12px;
          padding: 14px 8px;
        }
        .navsheet__links{ display:grid; gap: 8px; padding: 8px; }
        .navlink{
          padding: 12px 12px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.05);
          transition: transform 200ms ease, border-color 200ms ease;
          font-weight: 700;
        }
        .navlink:hover{ transform: translateY(-2px); border-color: rgba(255,255,255,0.20); }
      `}</style>
    </>
  );
}

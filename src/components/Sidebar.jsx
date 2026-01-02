// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";

export default function Sidebar({ role = "Employee" }) {
  const isAdmin = role === "Admin";
  const isHR = role === "HR";

  return (
    <>
      <aside className="sidebar glass hover-lift hide-mobile-sidebar">
        <div className="sidebar__top">
          <div className="sidebar__title">Menu</div>
          <div className="badge">{role}</div>
        </div>

        <nav className="side-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}>
            <span className="dot" /> Dashboard
          </NavLink>

          {(isAdmin || isHR) && (
            <NavLink to="/employees" className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}>
              <span className="dot" /> Employees
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/attendance" className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}>
              <span className="dot" /> Attendance
            </NavLink>
          )}

          <NavLink to="/leaves" className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}>
            <span className="dot" /> Leaves
          </NavLink>
        </nav>

        <div className="sidebar__hint muted">
          Tip: Use glass cards + hover lift for a modern UI.
        </div>
      </aside>

      <style>{`
        .hide-mobile-sidebar{ display:block; }
        @media(max-width: 980px){
          .hide-mobile-sidebar{ display:none; }
        }

        .sidebar{
          position: sticky;
          top: 82px;
          height: calc(100vh - 96px);
          padding: 14px;
          border-radius: 18px;
        }
        .sidebar__top{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap: 10px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255,255,255,0.10);
          margin-bottom: 12px;
        }
        .sidebar__title{
          font-weight: 900;
          letter-spacing: 0.2px;
        }
        .side-nav{
          display:grid;
          gap: 8px;
          margin-top: 12px;
        }
        .side-link{
          display:flex;
          align-items:center;
          gap: 10px;
          padding: 12px 12px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.05);
          font-weight: 750;
          transition: transform 220ms ease, border-color 220ms ease, background 220ms ease;
        }
        .side-link:hover{
          transform: translateY(-2px);
          border-color: rgba(255,255,255,0.20);
          background: rgba(255,255,255,0.07);
        }
        .side-link .dot{
          width: 10px; height: 10px; border-radius: 999px;
          background: rgba(255,255,255,0.18);
          box-shadow: 0 0 0 5px rgba(255,255,255,0.05);
        }
        .side-link.active{
          border-color: rgba(124,92,255,0.45);
          background: linear-gradient(135deg, rgba(124,92,255,0.18), rgba(0,212,255,0.10));
        }
        .side-link.active .dot{
          background: linear-gradient(135deg, rgba(124,92,255,1), rgba(0,212,255,0.9));
          box-shadow: 0 0 0 5px rgba(124,92,255,0.12);
        }
        .sidebar__hint{
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid rgba(255,255,255,0.10);
          font-size: 12px;
          line-height: 1.5;
        }
      `}</style>
    </>
  );
}

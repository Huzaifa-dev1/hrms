import { useMemo } from "react";
import { Storage, KEYS } from "../utils/storage";

export default function Dashboard() {
  const user = Storage.get(KEYS.USER, null);
  const employees = Storage.get(KEYS.EMP, []);
  const leaves = Storage.get(KEYS.LEAVES, []);
  const attendance = Storage.get(KEYS.ATT, []);

  const today = new Date().toISOString().slice(0, 10);

  const stats = useMemo(() => {
    const pending = leaves.filter((l) => l.status === "Pending").length;
    const presentToday = attendance.filter((a) => a.date === today && a.status === "Present").length;
    return { pending, presentToday };
  }, [leaves, attendance, today]);

  const recentLeaves = [...leaves].slice(-5).reverse();

  return (
    <div className="glass-card">
      <h2 className="mt-0">Welcome, {user?.name || "User"} 👋</h2>
      <p className="muted mb-16">Role: <b>{user?.role}</b></p>

      <div className="grid-4 stagger">
        <div className="glass-card hover-lift stagger-item">
          <div className="muted">Total Employees</div>
          <h2 className="mt-8 mb-0">{employees.length}</h2>
        </div>

        <div className="glass-card hover-lift stagger-item">
          <div className="muted">Pending Leaves</div>
          <h2 className="mt-8 mb-0">{stats.pending}</h2>
        </div>

        <div className="glass-card hover-lift stagger-item">
          <div className="muted">Present Today</div>
          <h2 className="mt-8 mb-0">{stats.presentToday}</h2>
        </div>

        <div className="glass-card hover-lift stagger-item">
          <div className="muted">Quick Tip</div>
          <p className="mb-0">Use Employees to assign dept/manager. Leaves for approval.</p>
        </div>
      </div>

      <div className="mt-16 glass-card">
        <h3 className="mt-0">Recent Leave Requests</h3>
        {recentLeaves.length === 0 ? (
          <p className="muted mb-0">No leave requests yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {recentLeaves.map((l) => (
              <div key={l.id} className="glass-card hover-lift" style={{ padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <div>
                    <b>{l.employeeName}</b> • <span className="muted">{l.type}</span>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {l.from} → {l.to}
                    </div>
                  </div>
                  <span className={`badge ${l.status === "Approved" ? "success" : l.status === "Rejected" ? "danger" : ""}`}>
                    {l.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

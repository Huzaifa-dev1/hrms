import { useMemo, useState } from "react";
import { Storage, KEYS } from "../utils/storage";

export default function Leaves() {
  const user = Storage.get(KEYS.USER, null);
  const isApprover = user?.role === "Admin" || user?.role === "HR";

  const [form, setForm] = useState({
    employeeName: user?.name || "",
    from: new Date().toISOString().slice(0, 10),
    to: new Date().toISOString().slice(0, 10),
    type: "Casual",
    reason: "",
  });

  const leaves = Storage.get(KEYS.LEAVES, []);

  const myLeaves = useMemo(() => {
    if (isApprover) return leaves;
    return leaves.filter((l) => l.employeeName === user?.name);
  }, [leaves, isApprover, user?.name]);

  const submitLeave = (e) => {
    e.preventDefault();
    if (!form.employeeName.trim() || !form.reason.trim()) return;

    const updated = [
      ...leaves,
      { id: crypto.randomUUID(), ...form, status: "Pending" },
    ];
    Storage.set(KEYS.LEAVES, updated);
    setForm({ ...form, reason: "" });
  };

  const setStatus = (id, status) => {
    const updated = leaves.map((l) => (l.id === id ? { ...l, status } : l));
    Storage.set(KEYS.LEAVES, updated);
  };

  return (
    <div className="glass-card">
      <div className="row">
        <div>
          <h2 className="mt-0 mb-0">Leaves</h2>
          <p className="muted">
            {isApprover ? "Approve / Reject leave requests." : "Apply for leave and track status."}
          </p>
        </div>
        <span className="badge">{user?.role}</span>
      </div>

      {/* Employee apply form */}
      {!isApprover && (
        <div className="mt-16 glass-card">
          <h3 className="mt-0">Apply Leave</h3>
          <form onSubmit={submitLeave}>
            <div className="grid-2">
              <div className="field">
                <div className="label">From</div>
                <input type="date" className="input" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} />
              </div>
              <div className="field">
                <div className="label">To</div>
                <input type="date" className="input" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} />
              </div>
              <div className="field">
                <div className="label">Type</div>
                <select className="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option>Casual</option>
                  <option>Sick</option>
                  <option>Annual</option>
                </select>
              </div>
              <div className="field">
                <div className="label">Employee</div>
                <input className="input" value={form.employeeName} disabled />
              </div>
            </div>

            <div className="field">
              <div className="label">Reason</div>
              <textarea
                className="textarea"
                rows="3"
                placeholder="Short reason..."
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
              />
            </div>

            <button className="btn primary">Submit Request</button>
          </form>
        </div>
      )}

      {/* Requests list */}
      <div className="mt-16">
        <h3 className="mt-0">{isApprover ? "All Requests" : "My Requests"}</h3>

        {myLeaves.length === 0 ? (
          <p className="muted mb-0">No leave requests found.</p>
        ) : (
          <div className="stagger" style={{ display: "grid", gap: 10 }}>
            {[...myLeaves].slice().reverse().map((l) => (
              <div key={l.id} className="glass-card hover-lift stagger-item" style={{ padding: 12 }}>
                <div className="row" style={{ alignItems: "center" }}>
                  <div>
                    <b>{l.employeeName}</b> • <span className="muted">{l.type}</span>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {l.from} → {l.to}
                    </div>
                    <div className="muted" style={{ fontSize: 12 }}>{l.reason}</div>
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <span className={`badge ${l.status === "Approved" ? "success" : l.status === "Rejected" ? "danger" : ""}`}>
                      {l.status}
                    </span>

                    {isApprover && l.status === "Pending" && (
                      <>
                        <button className="btn success" onClick={() => setStatus(l.id, "Approved")}>Approve</button>
                        <button className="btn danger" onClick={() => setStatus(l.id, "Rejected")}>Reject</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .row{
          display:flex;
          justify-content:space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
}

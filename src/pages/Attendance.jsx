import { useMemo, useState } from "react";
import { Storage, KEYS } from "../utils/storage";

export default function Attendance() {
  const employees = Storage.get(KEYS.EMP, []);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const attendance = Storage.get(KEYS.ATT, []);

  const todays = useMemo(() => {
    const map = new Map();
    attendance.filter((a) => a.date === date).forEach((a) => map.set(a.employeeId, a));
    return map;
  }, [attendance, date]);

  const setStatus = (employeeId, status) => {
    const all = Storage.get(KEYS.ATT, []);

    // remove existing record for same employee+date
    const filtered = all.filter((a) => !(a.employeeId === employeeId && a.date === date));
    filtered.push({ id: crypto.randomUUID(), employeeId, date, status });

    Storage.set(KEYS.ATT, filtered);
    // trigger rerender by updating state quickly
    setDate((d) => d);
  };

  const presentCount = attendance.filter((a) => a.date === date && a.status === "Present").length;

  return (
    <div className="glass-card">
      <div className="row">
        <div>
          <h2 className="mt-0 mb-0">Attendance</h2>
          <p className="muted">Mark Present / Absent for each employee.</p>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span className="badge">Present: {presentCount}</span>
          <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
      </div>

      <div className="mt-16" style={{ display: "grid", gap: 10 }}>
        {employees.map((emp) => {
          const record = todays.get(emp.id);
          const status = record?.status || "Not Marked";

          return (
            <div key={emp.id} className="glass-card hover-lift" style={{ padding: 12 }}>
              <div className="row" style={{ alignItems: "center" }}>
                <div>
                  <b>{emp.name}</b> <span className="muted">({emp.department})</span>
                  <div className="muted" style={{ fontSize: 12 }}>{emp.email}</div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <span className={`badge ${status === "Present" ? "success" : status === "Absent" ? "danger" : ""}`}>
                    {status}
                  </span>
                  <button className="btn success" onClick={() => setStatus(emp.id, "Present")}>Present</button>
                  <button className="btn danger" onClick={() => setStatus(emp.id, "Absent")}>Absent</button>
                </div>
              </div>
            </div>
          );
        })}
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

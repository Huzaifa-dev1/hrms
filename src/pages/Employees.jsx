import { useMemo, useState } from "react";
import Modal from "../components/Modal";
import { Storage, KEYS } from "../utils/storage";

const emptyForm = {
  id: "",
  name: "",
  email: "",
  department: "IT",
  manager: "Admin",
  role: "Employee",
  status: "Active",
  joined: new Date().toISOString().slice(0, 10),
};

export default function Employees() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const employees = Storage.get(KEYS.EMP, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return employees;
    return employees.filter((e) =>
      [e.name, e.email, e.department, e.manager, e.role].some((x) =>
        String(x || "").toLowerCase().includes(s)
      )
    );
  }, [employees, q]);

  const saveAll = (list) => Storage.set(KEYS.EMP, list);

  const onAdd = () => {
    setForm({ ...emptyForm, id: "" });
    setOpen(true);
  };

  const onEdit = (emp) => {
    setForm({ ...emp });
    setOpen(true);
  };

  const onDelete = (id) => {
    const ok = confirm("Delete this employee?");
    if (!ok) return;
    saveAll(employees.filter((e) => e.id !== id));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) return;

    if (form.id) {
      // edit
      const updated = employees.map((e) => (e.id === form.id ? form : e));
      saveAll(updated);
    } else {
      // add
      const newEmp = { ...form, id: crypto.randomUUID() };
      saveAll([...employees, newEmp]);
    }

    setOpen(false);
  };

  return (
    <div className="glass-card">
      <div className="row">
        <div>
          <h2 className="mt-0 mb-0">Employees</h2>
          <p className="muted">Add, edit, delete employees (saved in localStorage).</p>
        </div>

        <button className="btn primary" onClick={onAdd}>+ Add Employee</button>
      </div>

      <div className="row mt-12" style={{ alignItems: "center" }}>
        <input
          className="input"
          placeholder="Search by name, email, dept, manager..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="mt-16 grid-2 stagger">
        {filtered.map((emp, idx) => (
          <div key={emp.id} className="glass-card hover-lift stagger-item" style={{ padding: 14 }}>
            <div className="row" style={{ alignItems: "flex-start" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 900, fontSize: 16 }}>{emp.name}</div>
                <div className="muted" style={{ fontSize: 12 }}>{emp.email}</div>

                <div className="mt-12" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span className="badge">{emp.department}</span>
                  <span className="badge">{emp.role}</span>
                  <span className={`badge ${emp.status === "Active" ? "success" : "danger"}`}>{emp.status}</span>
                </div>

                <div className="muted mt-12" style={{ fontSize: 12 }}>
                  Manager: <b>{emp.manager}</b> • Joined: <b>{emp.joined}</b>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn" onClick={() => onEdit(emp)}>Edit</button>
                <button className="btn danger" onClick={() => onDelete(emp.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={open}
        title={form.id ? "Edit Employee" : "Add Employee"}
        onClose={() => setOpen(false)}
        footer={
          <>
            <button className="btn" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn primary" onClick={onSubmit}>Save</button>
          </>
        }
      >
        <form onSubmit={onSubmit}>
          <div className="grid-2">
            <div className="field">
              <div className="label">Name</div>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field">
              <div className="label">Email</div>
              <input className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="field">
              <div className="label">Department</div>
              <select className="select" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                <option>IT</option>
                <option>HR</option>
                <option>Finance</option>
                <option>Operations</option>
              </select>
            </div>

            <div className="field">
              <div className="label">Manager</div>
              <input className="input" value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} />
            </div>

            <div className="field">
              <div className="label">Role</div>
              <select className="select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option>Employee</option>
                <option>HR</option>
              </select>
            </div>

            <div className="field">
              <div className="label">Status</div>
              <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <div className="field">
            <div className="label">Joined Date</div>
            <input
              type="date"
              className="input"
              value={form.joined}
              onChange={(e) => setForm({ ...form, joined: e.target.value })}
            />
          </div>
        </form>
      </Modal>

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

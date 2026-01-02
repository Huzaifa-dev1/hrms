// src/utils/seed.js
import { Storage, KEYS } from "./storage";

export function seedIfNeeded() {
  const seeded = Storage.get(KEYS.SEEDED, false);
  if (seeded) return;

  const employees = [
    {
      id: crypto.randomUUID(),
      name: "Ali Raza",
      email: "ali@company.com",
      department: "IT",
      manager: "Sara Khan",
      role: "Employee",
      status: "Active",
      joined: "2025-01-10",
    },
    {
      id: crypto.randomUUID(),
      name: "Sara Khan",
      email: "sara@company.com",
      department: "HR",
      manager: "Admin",
      role: "HR",
      status: "Active",
      joined: "2024-10-02",
    },
  ];

  Storage.set(KEYS.EMP, employees);
  Storage.set(KEYS.ATT, []);
  Storage.set(KEYS.LEAVES, []);
  Storage.set(KEYS.SEEDED, true);
}

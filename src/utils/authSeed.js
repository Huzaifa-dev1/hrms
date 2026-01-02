import { Storage } from "./storage";

export function seedAuthUsers() {
  if (localStorage.getItem("hrms_users")) return;

  const users = [
    {
      id: 1,
      username: "admin",
      password: "admin123",
      role: "Admin",
      name: "System Admin",
    },
    {
      id: 2,
      username: "hr",
      password: "hr123",
      role: "HR",
      name: "HR Manager",
    },
    {
      id: 3,
      username: "employee",
      password: "emp123",
      role: "Employee",
      name: "Ali Raza",
    },
  ];

  Storage.set("hrms_users", users);
}

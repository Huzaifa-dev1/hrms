// src/utils/storage.js

export const KEYS = {
  USER: "hrms_user",
  USERS: "hrms_users",
  EMP: "hrms_employees",
  ATT: "hrms_attendance",
  LEAVES: "hrms_leaves",
  SEEDED: "hrms_seeded",
};

export const Storage = {
  get(key, fallback = null) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key) {
    localStorage.removeItem(key);
  },
};

// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = async (credentials) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    credentials: "include", // for cookies/session
  });
  return res.json();
};

export const getPosts = async () => {
  const res = await fetch(`${API_URL}/api/posts`, {
    credentials: "include",
  });
  return res.json();
};

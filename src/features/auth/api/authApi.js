import { setAuth, clearAuth } from "../../../services/authStorage";
import http from "../../../services/httpClient";

// Real implementation of login
export async function login({ email, password }) {
  // Expected backend endpoint: POST /auth/login
  // Expected response shape: { token: "...", user: { id, email, role, ... } }
  const data = await http.post("/auth/login", { email, password });

  // Persist locally
  setAuth(data.token, data.user);

  return data;
}

// Real implementation of register
export async function register({ first_name, last_name, email, password }) {
  const data = await http.post("/auth", {
    first_name,
    last_name,
    email,
    password,
  });

  return data;
}

export async function logout() {
  clearAuth(); // Delete saved token
}
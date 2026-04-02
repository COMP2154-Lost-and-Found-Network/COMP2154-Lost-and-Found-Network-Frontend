const TOKEN_KEY = "authToken"; //Keys used to store authentication data in LocalStorage
const USER_KEY = "authUser";

//This function saves authentication data to localStorage
export function setAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

//This function removes authentication data from localStorager (used during logout)
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

//Returns saved authentication token, or null if expired
export function getToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      clearAuth();
      return null;
    }
  } catch {
    // malformed token — clear it
    clearAuth();
    return null;
  }

  return token;
}

//Returns the saved user object from localStorage, or null if token is expired
export function getUser() {
  if (!getToken()) return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}
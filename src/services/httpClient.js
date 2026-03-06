const BASE_URL = import.meta.env.VITE_API_BASE_URL;

//Generic request wrapper used by all HTTP methods
async function request(path, { method = "GET", body, token } = {}) {
  if (!BASE_URL) {
    throw new Error("Api is not set. Check your .env file!");
  }

  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  //Try to parse JSON response
  let data = null;
  try {
    data = await res.json();
  } catch {
    //Ignore if response isn't JSON
  }

  if (!res.ok) {
    const msg = data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

//Public API used by the rest of the app
const http = {
  get: (path, opts) =>
    request(path, { ...opts, method: "GET" }),

  post: (path, body, opts) =>
    request(path, { ...opts, method: "POST", body }),

  put: (path, body, opts) =>
    request(path, { ...opts, method: "PUT", body }),

  patch: (path, body, opts) =>
    request(path, { ...opts, method: "PATCH", body }),

  delete: (path, opts) =>
    request(path, { ...opts, method: "DELETE" }),
};

export default http;
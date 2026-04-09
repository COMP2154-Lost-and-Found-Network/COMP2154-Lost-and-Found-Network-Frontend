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

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Unable to connect to the server. Please check your internet connection and try again.");
  }

  //Try to parse JSON response
  let data = null;
  try {
    data = await res.json();
  } catch {
    //Ignore if response isn't JSON
  }

  if (!res.ok) {
    const serverMsg = data?.message || data?.error;
    const fallbacks = {
      400: "Invalid request. Please check your input.",
      401: "Invalid email or password.",
      403: "You don't have permission to do this.",
      404: "The requested resource was not found.",
      409: "This record already exists.",
      500: "Something went wrong on the server. Please try again.",
    };
    const msg = serverMsg || fallbacks[res.status] || `Request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    throw err;
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
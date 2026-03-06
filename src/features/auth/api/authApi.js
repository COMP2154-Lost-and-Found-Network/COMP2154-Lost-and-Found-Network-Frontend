import { setAuth, clearAuth } from "../../../services/authStorage";
import http from "../../../services/httpClient";

//Determines if we are using the mock database (we don't have backend yet)
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === "true";

const mockUsers = [ //Just some mock users to test login functionality
  { id: 1, email: "admin@example.com", password: "admin123", role: "ADMIN" },
  { id: 2, email: "user@example.com", password: "user123", role: "USER" },
];

//Simulates latency for the mock database (good for simulating actual backend)
function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

//Generates a fake token (this would usually come from backend)
function makeToken(user) {
  return `mock-token-${user.id}-${Date.now()}`;
}

//Simulated login request
export async function mockLogin({ email, password }) {

  await delay(400);

  const user = mockUsers.find((u) => u.email === email); //Will be adjusted once backend exists
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password"); //Error in case no valid email or password is found
  }

  const safeUser = { id: user.id, email: user.email, role: user.role };
  const token = makeToken(user); //Generate a token

  setAuth(token, safeUser); //Save
  return { token, user: safeUser };
}

//Real implementation

async function realLogin({ email, password }) {
  // Expected backend endpoint: POST /auth/login
  // Expected response shape: { token: "...", user: { id, email, role, ... } }
  const data = await http.post("/auth/login", { email, password });

  // Persist locally
  setAuth(data.token, data.user);

  return data;
}

export async function mockRegister({ first_name, last_name, email, password }) {
  await delay(400);

  const existingUser = mockUsers.find((u) => u.email === email);
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const newUser = {
    id: mockUsers.length + 1,
    first_name,
    last_name,
    email,
    password,
    role: "USER",
  };

  mockUsers.push(newUser);

  return {
    message: "Registration successful",
    user: {
      id: newUser.id,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      role: newUser.role,
    },
  };
}

async function realRegister({ first_name, last_name, email, password }) {
  
  const data = await http.post("/auth", {
    first_name,
    last_name,
    email,
    password,
  });

  return data;
}

export async function logout() {
  clearAuth(); //Delete saved token
}

export async function login(credentials) {
  return USE_MOCK ? mockLogin(credentials) : realLogin(credentials); //Checking if to use mockLogin or realLogin
}

export async function register(data) {
  return USE_MOCK ? mockRegister(data) : realRegister(data); //Checking if to use mockRegister or realRegister
}
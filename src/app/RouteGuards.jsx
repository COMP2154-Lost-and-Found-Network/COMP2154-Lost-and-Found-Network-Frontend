import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

// TEMPORARY: bypass authentication 
export function RequireAuth({ children }) {
  return children;
}

// Blocks access unless user is logged in and has the ADMIN role
export function RequireAdmin({ children }) {
  const { isAuthed, user } = useAuth();

  if (!isAuthed) return <Navigate to="/login" replace />;
  if (user?.role !== "ADMIN") return <Navigate to="/" replace />;

  return children;
}
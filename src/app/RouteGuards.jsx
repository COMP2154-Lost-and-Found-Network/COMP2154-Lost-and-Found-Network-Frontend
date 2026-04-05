import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

// Protects private routes: if the user isn't authenticated, redirect to login
export function RequireAuth({ children }) {
  const { isAuthed } = useAuth();
  return isAuthed ? children : <Navigate to="/login" replace />;
}

// Blocks access unless user is logged in and has the ADMIN role
export function RequireAdmin({ children }) {
  const { isAuthed, user } = useAuth();

  if (!isAuthed) return <Navigate to="/login" replace />;
  if (user?.role?.toLowerCase() !== "admin") return <Navigate to="/" replace />;

  return children;
}
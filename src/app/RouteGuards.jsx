import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

//This is the method that protects private routes, if the user isn't authenticated for specific pages it will redirect them to the login page
export function RequireAuth({ children }) { 
  const { isAuthed } = useAuth(); //Access authentication state from context
  return isAuthed ? children : <Navigate to="/login" replace />; 
}

//Blocks access unless user is logged in and has the admin role

export function RequireAdmin({ children }) {
  const { isAuthed, user } = useAuth();

  if (!isAuthed) return <Navigate to="/login" replace />;
  if (user?.role !== "ADMIN") return <Navigate to="/" replace />;

  return children;
}
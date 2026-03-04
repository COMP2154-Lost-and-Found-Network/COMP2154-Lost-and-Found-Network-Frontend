import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import LoginForm from "../components/LoginForm";

//Returns login page 
export default function LoginPage() {
  //Gets login function from auth context
  const { login } = useAuth();
  //Redirects after successful login
  const navigate = useNavigate();
  //Tracks if login request is currently in progress
  const [isLoading, setIsLoading] = useState(false);
  //Stores any authentication error message
  const [error, setError] = useState("");

  //Handles form submission from loginform
  async function handleLogin(data) {
    try {
      setIsLoading(true);
      setError("");
      await login(data);
      navigate("/", { replace: true });
    } catch (e) {
      setError(e.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  }
  // Calls loginform component
  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} /> 
    </div>
  );
}
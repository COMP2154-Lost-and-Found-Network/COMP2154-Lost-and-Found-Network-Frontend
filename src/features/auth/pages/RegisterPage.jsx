import { useState } from "react";
import RegisterForm from "../components/RegisterForm.jsx";

export default function RegisterPage() {
  // Controls loading and error state for the register form
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(formData) {
    // Handles form submission 
    setError("");
    setIsLoading(true);
    try {
      console.log("RegisterPage handleRegister:", formData);
      // Connect to backend and redirect after success
    } catch (e) {
      setError(e?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Register</h1>
      <RegisterForm onSubmit={handleRegister} isLoading={isLoading} error={error} />
    </div>
  );
}
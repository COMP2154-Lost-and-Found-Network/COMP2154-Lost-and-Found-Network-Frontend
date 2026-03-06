import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import RegisterForm from "../components/RegisterForm.jsx";
import styles from "../styles/Auth.module.css";
import { register } from "../api/authApi";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(formData) {
    setError("");
    setIsLoading(true);

    try {
      await register(formData);
      navigate("/login", { replace: true });
    } catch (e) {
      setError(e?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Register</h1>

        <section className={styles.card}>
          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isLoading}
            error={error}
          />

          <div className={styles.authRow}>
            <span className={styles.authRowText}>Already have an account?</span>
            <Link className={styles.linkButton} to="/login">
              Sign in
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
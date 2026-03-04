import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import LoginForm from "../components/LoginForm";
import styles from "../styles/Auth.module.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Login</h1>

        <section className={styles.card}>

          <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />

          <div className={styles.authRow}>
            <span className={styles.authRowText}>Don’t have an account? </span>
            <Link className={styles.linkButton} to="/register">
              Register
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
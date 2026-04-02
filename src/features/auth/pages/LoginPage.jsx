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
      if (e.status === 401) {
        setError("The email or password you entered is incorrect. Please try again.");
      } else {
        setError(e.message || "Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.brandGroup}>
          <span className={styles.brandName}>Lost &amp; Found Network</span>
          <span className={styles.brandSub}>George Brown Polytechnic</span>
        </div>

        <section className={styles.card}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to your account to continue.</p>

          <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />

          <div className={styles.authRow}>
            <span className={styles.authRowText}>Don't have an account?</span>
            <Link className={styles.linkButton} to="/register">Register</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

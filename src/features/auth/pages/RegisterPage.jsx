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
      if (e.status === 409) {
        setError("An account with this email already exists. Please sign in instead.");
      } else {
        setError(e?.message || "Registration failed. Please try again.");
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
          <h1 className={styles.title}>Create an account</h1>
          <p className={styles.subtitle}>Register to report and claim items across campus.</p>

          <RegisterForm onSubmit={handleRegister} isLoading={isLoading} error={error} />

          <div className={styles.authRow}>
            <span className={styles.authRowText}>Already have an account?</span>
            <Link className={styles.linkButton} to="/login">Sign in</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

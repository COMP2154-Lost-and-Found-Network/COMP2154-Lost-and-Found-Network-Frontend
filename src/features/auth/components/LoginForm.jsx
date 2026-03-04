import { useState } from "react";
import styles from "../styles/Auth.module.css";

export default function LoginForm({ onSubmit, isLoading, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function submit(e) {
    e.preventDefault();
    onSubmit({ email, password });
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <label className={styles.field}>
        Email
        <input
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </label>

      <label className={styles.field}>
        Password
        <input
          className={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </label>

      {error ? <div className={styles.error}>{error}</div> : null}

      <button className={styles.button} type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>

      <div className={styles.hint}>
        Mock users:
        <div>admin@example.com / admin123</div>
        <div>user@example.com / user123</div>
      </div>
    </form>
  );
}
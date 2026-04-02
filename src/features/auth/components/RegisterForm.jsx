import { useState } from "react";
import { validateRegister } from "../utils/registerValidation.js";
import styles from "../styles/Auth.module.css";

export default function RegisterForm({ onSubmit, isLoading = false, error = "" }) {
  // Stores form field values
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  // Stores validation errors for each field
  const [errors, setErrors] = useState({});

  // Updates form state when user types in an input field
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Handles form submission and runs validation before calling onSubmit
  function handleSubmit(e) {
    e.preventDefault();

    // Run validation on current form values
    const validationErrors = validateRegister(form);
    setErrors(validationErrors);

    // Stop submission if there are validation errors
    if (Object.keys(validationErrors).length > 0) return;

    if (typeof onSubmit === "function") onSubmit(form);
  }

  // Render registration form UI
  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      <label className={styles.field} htmlFor="first_name">
        First Name
        <input
          className={styles.input}
          id="first_name"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          autoComplete="given-name"
        />
      </label>
      {errors.first_name && <div className={styles.error}>{errors.first_name}</div>}

      <label className={styles.field} htmlFor="last_name">
        Last Name
        <input
          className={styles.input}
          id="last_name"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          autoComplete="family-name"
        />
      </label>
      {errors.last_name && <div className={styles.error}>{errors.last_name}</div>}

      <label className={styles.field} htmlFor="email">
        Email
        <input
          className={styles.input}
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
        />
      </label>
      {errors.email && <div className={styles.error}>{errors.email}</div>}

      <label className={styles.field} htmlFor="password">
        Password
        <input
          className={styles.input}
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
        />
      </label>
      {errors.password && <div className={styles.error}>{errors.password}</div>}

      {error ? <div className={styles.error}>{error}</div> : null}

      <button className={styles.button} type="submit" disabled={isLoading}>
        {isLoading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
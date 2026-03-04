import { useState } from "react";
import { validateRegister } from "../utils/registerValidation.js";

export default function RegisterForm({ onSubmit, isLoading = false, error = "" }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateRegister(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    if (typeof onSubmit === "function") {
      onSubmit(form);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="first_name">First Name</label>
      <input
        id="first_name"
        name="first_name"
        value={form.first_name}
        onChange={handleChange}
      />
      {errors.first_name && <p style={{ color: "red" }}>{errors.first_name}</p>}

      <label htmlFor="last_name">Last Name</label>
      <input
        id="last_name"
        name="last_name"
        value={form.last_name}
        onChange={handleChange}
      />
      {errors.last_name && <p style={{ color: "red" }}>{errors.last_name}</p>}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
      />
      {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
      />
      {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

      {error ? <p style={{ color: "red" }}>{error}</p> : null}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
// Validates registration form fields
export function validateRegister(form) {
  const errors = {};

  // First name required
  if (!form.first_name || !form.first_name.trim()) {
    errors.first_name = "First name is required";
  }

  // Last name required
  if (!form.last_name || !form.last_name.trim()) {
    errors.last_name = "Last name is required";
  }

  // Email required
  if (!form.email || !form.email.trim()) {
    errors.email = "Email is required";
  } else {
    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      errors.email = "Invalid email format";
    }
  }

  // Password required
  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}

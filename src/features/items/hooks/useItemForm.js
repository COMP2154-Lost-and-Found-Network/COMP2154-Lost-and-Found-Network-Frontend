import { useState } from "react";
import { validateItemForm } from "../utils/itemValidation";

const INITIAL_VALUES = {
  category: "",
  description: "",
  date: "",
  campus: "",
  location: "",
  image: null,
};

export default function useItemForm(onSubmit, { imageRequired = false } = {}) {
  const [values, setValues] = useState({ ...INITIAL_VALUES });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function onFieldChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear field error when user edits
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  async function handleSubmit() {
    setFormError("");

    const validationErrors = validateItemForm(values, { imageRequired });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      await onSubmit(values);
    } catch (err) {
      setFormError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    values,
    errors,
    formError,
    submitting,
    onFieldChange,
    handleSubmit,
  };
}

/**
 * Validates the lost/found item report form fields.
 * Returns an object of field → error message (empty object = valid).
 */
export function validateItemForm(values, { imageRequired = false } = {}) {
  const errors = {};

  if (!values.category) {
    errors.category = "Category is required";
  }

  if (!values.description || !values.description.trim()) {
    errors.description = "Description is required";
  }

  if (!values.date) {
    errors.date = "Date is required";
  } else {
    const selected = new Date(values.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (selected > today) {
      errors.date = "Date cannot be in the future";
    }
  }

  if (!values.campus) {
    errors.campus = "Campus is required";
  }

  if (imageRequired && !values.image) {
    errors.image = "Image is required";
  }

  if (values.image) {
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (values.image.size > maxSize) {
      errors.image = "Image must be under 5 MB";
    }

    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowed.includes(values.image.type)) {
      errors.image = "Only JPEG, PNG, GIF, or WebP images are allowed";
    }
  }

  return errors;
}

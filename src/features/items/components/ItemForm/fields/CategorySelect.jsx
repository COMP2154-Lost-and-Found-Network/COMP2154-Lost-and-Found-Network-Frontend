import styles from "../ItemForm.module.css";

// Hardcoded for now — will come from backend later
const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Accessories",
  "Documents",
  "Keys",
  "Bags",
  "Books",
  "Other",
];

export default function CategorySelect({ value, onChange, error }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        Category <span className={styles.required}>*</span>
      </label>
      <select
        className={styles.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select a category</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  );
}

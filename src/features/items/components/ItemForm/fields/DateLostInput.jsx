import styles from "../ItemForm.module.css";

export default function DateLostInput({ value, onChange, error, label }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label || "Date Lost"} <span className={styles.required}>*</span>
      </label>
      <input
        className={styles.input}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  );
}

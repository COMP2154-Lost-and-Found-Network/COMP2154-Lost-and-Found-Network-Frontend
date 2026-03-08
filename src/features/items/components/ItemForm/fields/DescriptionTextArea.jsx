import styles from "../ItemForm.module.css";

export default function DescriptionTextArea({ value, onChange, error }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        Description <span className={styles.required}>*</span>
      </label>
      <textarea
        className={styles.textarea}
        placeholder="Provide details about the item (color, brand, distinctive features...)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  );
}

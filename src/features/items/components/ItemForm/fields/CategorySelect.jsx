import styles from "../ItemForm.module.css";

// IDs match the seeded categories in the database
const CATEGORIES = [
  { id: 1, name: "Electronics" },
  { id: 2, name: "Clothing" },
  { id: 3, name: "Accessories" },
  { id: 4, name: "Books & Notes" },
  { id: 5, name: "ID & Cards" },
  { id: 6, name: "Sports & Gym" },
  { id: 7, name: "Other" },
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
        onChange={(e) => onChange(Number(e.target.value) || "")}
      >
        <option value="">Select a category</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  );
}

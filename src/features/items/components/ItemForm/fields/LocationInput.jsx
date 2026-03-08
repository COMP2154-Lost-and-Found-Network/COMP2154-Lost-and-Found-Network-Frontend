import styles from "../ItemForm.module.css";

const CAMPUSES = [
  "St. James Campus",
  "Casa Loma Campus",
  "Waterfront Campus",
];

export default function LocationInput({ campus, location, onCampusChange, onLocationChange, campusError }) {
  return (
    <>
      <div className={styles.field}>
        <label className={styles.label}>
          Campus <span className={styles.required}>*</span>
        </label>
        <select
          className={styles.select}
          value={campus}
          onChange={(e) => onCampusChange(e.target.value)}
        >
          <option value="">Select a campus</option>
          {CAMPUSES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {campusError && <span className={styles.fieldError}>{campusError}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Location</label>
        <input
          className={styles.input}
          type="text"
          placeholder="e.g. Bathroom, Room 301, Cafeteria..."
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
        />
      </div>
    </>
  );
}

import styles from "../ItemForm.module.css";

// IDs match the seeded locations in the database
const LOCATIONS = [
  { id: 1, name: "St. James – Building A (Main)" },
  { id: 2, name: "St. James – Building B" },
  { id: 3, name: "St. James – Library" },
  { id: 4, name: "Casa Loma – Building C" },
  { id: 5, name: "Casa Loma – Building H (Gym)" },
  { id: 6, name: "Waterfront – Building W" },
];

export default function LocationInput({ locationId, locationDetails, onLocationIdChange, onLocationDetailsChange, locationError }) {
  return (
    <>
      <div className={styles.field}>
        <label className={styles.label}>
          Location <span className={styles.required}>*</span>
        </label>
        <select
          className={styles.select}
          value={locationId}
          onChange={(e) => onLocationIdChange(Number(e.target.value) || "")}
        >
          <option value="">Select a location</option>
          {LOCATIONS.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
        {locationError && <span className={styles.fieldError}>{locationError}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Specific Details</label>
        <input
          className={styles.input}
          type="text"
          placeholder="e.g. Bathroom, Room 301, Cafeteria..."
          value={locationDetails}
          onChange={(e) => onLocationDetailsChange(e.target.value)}
        />
      </div>
    </>
  );
}

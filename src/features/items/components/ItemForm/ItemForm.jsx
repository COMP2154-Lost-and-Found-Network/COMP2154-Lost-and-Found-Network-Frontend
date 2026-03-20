import CategorySelect from "./fields/CategorySelect";
import DescriptionTextArea from "./fields/DescriptionTextArea";
import DateLostInput from "./fields/DateLostInput";
import LocationInput from "./fields/LocationInput";
import ImageUpload from "./fields/ImageUpload";
import styles from "./ItemForm.module.css";

export default function ItemForm({
  values,
  errors,
  formError,
  submitting,
  onFieldChange,
  onSubmit,
  onCancel,
  dateLabel,
  imageRequired,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {formError && <div className={styles.formError}>{formError}</div>}

      <div className={styles.field}>
        <label className={styles.label}>
          Title <span className={styles.required}>*</span>
        </label>
        <input
          className={styles.input}
          type="text"
          placeholder="e.g. Black iPhone 13, Blue Backpack..."
          value={values.title}
          onChange={(e) => onFieldChange("title", e.target.value)}
        />
        {errors.title && <span className={styles.fieldError}>{errors.title}</span>}
      </div>

      <CategorySelect
        value={values.category_id}
        onChange={(v) => onFieldChange("category_id", v)}
        error={errors.category_id}
      />

      <DescriptionTextArea
        value={values.description}
        onChange={(v) => onFieldChange("description", v)}
        error={errors.description}
      />

      <DateLostInput
        value={values.date}
        onChange={(v) => onFieldChange("date", v)}
        error={errors.date}
        label={dateLabel}
      />

      <LocationInput
        locationId={values.location_id}
        locationDetails={values.location_details}
        onLocationIdChange={(v) => onFieldChange("location_id", v)}
        onLocationDetailsChange={(v) => onFieldChange("location_details", v)}
        locationError={errors.location_id}
      />

      <ImageUpload
        onChange={(file) => onFieldChange("image", file)}
        error={errors.image}
        required={imageRequired}
      />

      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Report"}
        </button>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

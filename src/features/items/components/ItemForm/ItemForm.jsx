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

      <CategorySelect
        value={values.category}
        onChange={(v) => onFieldChange("category", v)}
        error={errors.category}
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
        campus={values.campus}
        location={values.location}
        onCampusChange={(v) => onFieldChange("campus", v)}
        onLocationChange={(v) => onFieldChange("location", v)}
        campusError={errors.campus}
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

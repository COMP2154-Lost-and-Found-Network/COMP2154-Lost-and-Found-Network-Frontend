import { useRef, useState } from "react";
import styles from "../ItemForm.module.css";

export default function ImageUpload({ onChange, error, required }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  function handleFileChange(e) {
    const file = e.target.files[0] || null;
    onChange(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }

  function handleRemove() {
    onChange(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div className={styles.imageField}>
      <label className={styles.label}>
        Image {required ? <span className={styles.required}>*</span> : "(Optional)"}
      </label>
      <input
        ref={inputRef}
        className={styles.fileInput}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
      />
      {error && <span className={styles.fieldError}>{error}</span>}
      {preview && (
        <div className={styles.preview}>
          <img src={preview} alt="Preview" className={styles.previewImg} />
          <button
            type="button"
            className={styles.removeBtn}
            onClick={handleRemove}
            title="Remove image"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}

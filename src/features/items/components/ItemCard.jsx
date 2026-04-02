import { Link } from "react-router-dom";
import StatusPill from "./StatusPill";
import styles from "../styles/itemCard.module.css";

export default function ItemCard({ item, onSoftDelete, readOnly = false }) {
  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const imageSrc =
    item.imagePreview ||
    item.imageUrl ||
    (item.image_url
      ? `${import.meta.env.VITE_API_BASE_URL}${item.image_url}`
      : null);

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={item.title}
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder}>No Image</div>
        )}

        <div className={styles.meta}>
          <h3 className={styles.title}>{item.title}</h3>

          <p className={styles.description}>{item.description}</p>

          <div className={styles.details}>
            <div>
              <strong>Date:</strong> {formattedDate}
            </div>
            <div>
              <strong>Location:</strong> {item.location}
            </div>
          </div>

          <div className={styles.actions}>
            <Link to={`/items/${item.id}`} className={styles.primaryBtn}>
              Details
            </Link>

            {!readOnly && (
              <>
                <Link to={`/items/${item.id}/edit`} className={styles.secondaryBtn}>
                  Edit
                </Link>
                <button onClick={() => onSoftDelete?.(item.id)} className={styles.deleteBtn}>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.statusWrapper}>
        <StatusPill status={item.status} />
      </div>
    </div>
  );
}
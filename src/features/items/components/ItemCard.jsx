import { Link } from "react-router-dom";
import StatusPill from "./StatusPill";
import styles from "../styles/itemCard.module.css";

export default function ItemCard({ item, onSoftDelete, readOnly = false }) {
  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const rawUrl = item.imagePreview || item.imageUrl || item.image_url || null;
  const imageSrc = rawUrl && rawUrl.startsWith("http")
    ? rawUrl
    : rawUrl
      ? `${import.meta.env.VITE_API_BASE_URL}${rawUrl}`
      : null;

  const typeLabel = item.type
    ? item.type.charAt(0).toUpperCase() + item.type.slice(1).toLowerCase()
    : null;

  return (
    <div
      className={styles.card}
      style={{
        borderLeft: item.type?.toLowerCase() === "lost"
          ? "2px solid #dc2626"
          : item.type?.toLowerCase() === "found"
            ? "2px solid #16a34a"
            : undefined,
      }}
    >
      <div className={styles.topRow}>
        <div>
          {typeLabel && (
            <span className={styles.typeLabel}>{typeLabel.toUpperCase()}</span>
          )}
          <h3 className={styles.title}>{item.title}</h3>
        </div>
        <StatusPill status={item.status} />
      </div>

      {imageSrc ? (
        <img src={imageSrc} alt={item.title} className={styles.image} />
      ) : (
        <div className={styles.placeholder}>No Image</div>
      )}

      <p className={styles.description}>{item.description}</p>

      <div className={styles.details}>
        <div><strong>Date:</strong> {formattedDate}</div>
        <div><strong>Location:</strong> {item.location}</div>
      </div>

      <div className={styles.actions}>
        <Link to={`/items/${item.id}`} className={styles.primaryBtn}>
          View Details
        </Link>

        {!readOnly && item.status?.toLowerCase() === "active" && (
          <div className={styles.iconActions}>
            <Link to={`/items/${item.id}/edit`} className={styles.iconBtn} title="Edit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </Link>
            <button
              onClick={() => onSoftDelete?.(item.id)}
              className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
              title="Delete"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

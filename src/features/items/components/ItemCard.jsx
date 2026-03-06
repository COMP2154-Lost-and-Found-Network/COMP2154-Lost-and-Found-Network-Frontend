import { Link } from "react-router-dom";
import StatusPill from "./StatusPill";
import styles from "../styles/itemCard.module.css";

export default function ItemCard({ item, onSoftDelete }) {
  return (
    <div className={styles.card}>
      <div className={styles.left}>
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
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
              <strong>Date:</strong> {item.date}
            </div>
            <div>
              <strong>Location:</strong> {item.location}
            </div>
          </div>

          <div className={styles.actions}>
            <Link to={`/items/${item.id}`} className={styles.primaryBtn}>
              Details
            </Link>

            <Link
              to={`/items/${item.id}/edit`}
              className={styles.secondaryBtn}
            >
              Edit
            </Link>

            <button
              onClick={() => onSoftDelete?.(item.id)}
              className={styles.deleteBtn}
            >
              Soft Delete
            </button>
          </div>
        </div>
      </div>

      <div className={styles.statusWrapper}>
        <StatusPill status={item.status} />
      </div>
    </div>
  );
}
import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.text}>
          The page you are looking for does not exist.
        </p>

        <div className={styles.actions}>
          <Link to="/" className={styles.primaryBtn}>
            Go Home
          </Link>
          <Link to="/items" className={styles.secondaryBtn}>
            View Items
          </Link>
        </div>
      </div>
    </div>
  );
}

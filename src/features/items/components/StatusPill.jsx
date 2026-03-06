import styles from "../styles/statusPill.module.css";

export default function StatusPill({ status }) {
  const s = (status || "").toLowerCase();

  return (
    <span className={`${styles.pill} ${styles[s]}`}>
      {status}
    </span>
  );
}
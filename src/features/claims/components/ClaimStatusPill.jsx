import styles from "../styles/claimStatusPill.module.css";

export default function ClaimStatusPill({ status }) {
  const normalized = (status || "").toLowerCase();

  return (
    <span className={`${styles.pill} ${styles[normalized]}`}>
      {normalized}
    </span>
  );
}

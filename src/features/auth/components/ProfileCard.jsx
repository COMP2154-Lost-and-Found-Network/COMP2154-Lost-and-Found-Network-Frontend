import styles from "../styles/Profile.module.css";

export default function ProfileCard({ user }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>User Info</h3>

      <p>
        <strong>Name:</strong>{" "}
        {user?.first_name || "—"} {user?.last_name || ""}
      </p>

      <p>
        <strong>Email:</strong> {user?.email || "—"}
      </p>

      <p>
        <strong>Role:</strong> {user?.role || "user"}
      </p>
    </div>
  );
}
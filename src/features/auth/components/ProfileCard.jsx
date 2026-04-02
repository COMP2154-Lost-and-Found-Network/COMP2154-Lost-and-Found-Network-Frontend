import styles from "../styles/Profile.module.css";

export default function ProfileCard({ user }) {
  const initials = [user?.first_name?.[0], user?.last_name?.[0]]
    .filter(Boolean)
    .join("")
    .toUpperCase() || "?";

  return (
    <div className={styles.profileCard}>
      <div className={styles.avatar}>{initials}</div>
      <div className={styles.profileInfo}>
        <h2 className={styles.profileName}>
          {user?.first_name || "—"} {user?.last_name || ""}
        </h2>
        <p className={styles.profileEmail}>{user?.email || "—"}</p>
        <span className={styles.roleBadge}>{user?.role || "user"}</span>
      </div>
    </div>
  );
}

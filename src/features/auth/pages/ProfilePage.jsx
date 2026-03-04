import { useMemo } from "react";
import ProfileCard from "../components/ProfileCard";
import { useAuth } from "../../../context/useAuth";
import styles from "../styles/Profile.module.css";

//Choose badge style based on status text
function badgeClass(type, value) {
  const v = String(value || "").toLowerCase();

  if (type === "item") {
    if (v === "lost") return `${styles.badge} ${styles.badgeLost}`;
    if (v === "found") return `${styles.badge} ${styles.badgeFound}`;
  }

  if (type === "claim") {
    if (v === "pending") return `${styles.badge} ${styles.badgePending}`;
    if (v === "approved") return `${styles.badge} ${styles.badgeApproved}`;
  }

  return styles.badge;
}

export default function ProfilePage() {
  const { user } = useAuth();

  //Temporary mock data until backend is made
  const myItems = useMemo(
    () => [
      { id: 101, title: "Black wallet", status: "Lost", date: "2026-02-20" },
      { id: 102, title: "AirPods case", status: "Found", date: "2026-02-22" },
    ],
    []
  );

  const claimHistory = useMemo(
    () => [
      { id: 201, itemTitle: "Black wallet", claimStatus: "Pending", date: "2026-02-23" },
      { id: 202, itemTitle: "Laptop charger", claimStatus: "Approved", date: "2026-02-18" },
    ],
    []
  );

  return (
    <div className={styles.page}>
      <h1>Profile</h1>

      {/*User info*/}
      <ProfileCard user={user} />

      {/*My Items*/}
      <h2 className={styles.sectionTitle}>My Items</h2>
      {myItems.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <ul className={styles.list}>
          {myItems.map((item) => (
            <li key={item.id} className={styles.row}>
              <div className={styles.rowTop}>
                <div className={styles.rowTitle}>{item.title}</div>
                <span className={badgeClass("item", item.status)}>{item.status}</span>
              </div>

              <div className={styles.meta}>Date: {item.date}</div>
            </li>
          ))}
        </ul>
      )}

      {/*Claim History*/}
      <h2 className={styles.sectionTitle}>Claim History</h2>
      {claimHistory.length === 0 ? (
        <p>No claims yet.</p>
      ) : (
        <ul className={styles.list}>
          {claimHistory.map((c) => (
            <li key={c.id} className={styles.row}>
              <div className={styles.rowTop}>
                <div className={styles.rowTitle}>{c.itemTitle}</div>
                <span className={badgeClass("claim", c.claimStatus)}>{c.claimStatus}</span>
              </div>

              <div className={styles.meta}>Date: {c.date}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
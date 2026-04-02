import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import { useAuth } from "../../../context/useAuth";
import * as itemsApi from "../../items/api/itemsApi";
import * as claimsApi from "../../claims/api/claimsApi";
import styles from "../styles/Profile.module.css";

function badgeClass(type, value) {
  const v = String(value || "").toLowerCase();
  if (type === "item") {
    if (v === "lost") return `${styles.badge} ${styles.badgeLost}`;
    if (v === "found") return `${styles.badge} ${styles.badgeFound}`;
  }
  if (type === "claim") {
    if (v === "pending") return `${styles.badge} ${styles.badgePending}`;
    if (v === "approved") return `${styles.badge} ${styles.badgeApproved}`;
    if (v === "rejected") return `${styles.badge} ${styles.badgeRejected}`;
  }
  return styles.badge;
}

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [claimHistory, setClaimHistory] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [loadingClaims, setLoadingClaims] = useState(true);

  useEffect(() => {
    async function loadItems() {
      try {
        const data = await itemsApi.listMyItems();
        setMyItems(data);
      } catch {
        // silently fail — profile still shows
      } finally {
        setLoadingItems(false);
      }
    }

    async function loadClaims() {
      try {
        const data = await claimsApi.listMyClaims(user?.id);
        setClaimHistory(Array.isArray(data) ? data : []);
      } catch {
        // silently fail
      } finally {
        setLoadingClaims(false);
      }
    }

    loadItems();
    if (user?.id) loadClaims();
  }, [user?.id]);

  return (
    <div className={styles.page}>
      <h1>Profile</h1>

      <ProfileCard user={user} />

      <h2 className={styles.sectionTitle}>My Items</h2>
      {loadingItems ? (
        <p className={styles.meta}>Loading...</p>
      ) : myItems.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You haven't reported any items yet.</p>
          <Link to="/items/report-lost" className={styles.emptyLink}>Report an Item</Link>
        </div>
      ) : (
        <ul className={styles.list}>
          {myItems.map((item) => (
            <li key={item.id} className={styles.row}>
              <div className={styles.rowTop}>
                <Link to={`/items/${item.id}`} className={styles.rowTitle}>{item.title}</Link>
                <span className={badgeClass("item", item.type)}>{item.type}</span>
              </div>
              <div className={styles.meta}>
                {formatDate(item.date)} &middot; {item.location || "No location"}
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2 className={styles.sectionTitle}>Claim History</h2>
      {loadingClaims ? (
        <p className={styles.meta}>Loading...</p>
      ) : claimHistory.length === 0 ? (
        <div className={styles.emptyState}>
          <p>You haven't submitted any claims yet.</p>
          <Link to="/browse" className={styles.emptyLink}>Browse Items</Link>
        </div>
      ) : (
        <ul className={styles.list}>
          {claimHistory.map((c) => (
            <li key={c.id} className={styles.row}>
              <div className={styles.rowTop}>
                <Link to={`/claims/${c.id}`} className={styles.rowTitle}>
                  {c.item_title || `Claim #${c.id}`}
                </Link>
                <span className={badgeClass("claim", c.status)}>{c.status}</span>
              </div>
              <div className={styles.meta}>{formatDate(c.created_at)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

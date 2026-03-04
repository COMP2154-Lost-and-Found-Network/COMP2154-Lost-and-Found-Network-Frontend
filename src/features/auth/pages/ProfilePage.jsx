

import { useMemo } from "react";
import ProfileCard from "../components/ProfileCard";
import { useAuth } from "../../../context/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();

  // Temporary mock data until backend endpoints for items/claims are connected
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
    <div style={{ padding: 16 }}>
      <h1>Profile</h1>

      {/* User info */}
      <ProfileCard user={user} />

      <h2 style={{ marginTop: 24 }}>My Items</h2>
      {myItems.length === 0 ? (
        <p>No items yet.</p>
      ) : (
        <ul>
          {myItems.map((item) => (
            <li key={item.id}>
              <strong>{item.title}</strong> — {item.status} — {item.date}
            </li>
          ))}
        </ul>
      )}

      <h2 style={{ marginTop: 24 }}>Claim History</h2>
      {claimHistory.length === 0 ? (
        <p>No claims yet.</p>
      ) : (
        <ul>
          {claimHistory.map((c) => (
            <li key={c.id}>
              <strong>{c.itemTitle}</strong> — {c.claimStatus} — {c.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
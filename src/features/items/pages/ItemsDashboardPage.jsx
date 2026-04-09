import { Link, Navigate } from "react-router-dom";
import PageContainer from "../../../components/ui/PageContainer";
import { useAuth } from "../../../context/useAuth";
import useItems from "../hooks/useItems";
import ItemCard from "../components/ItemCard";
import { softDeleteItem } from "../api/itemsApi";
import styles from "../styles/itemsDashboard.module.css";

export default function ItemsDashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";

  if (isAdmin) return <Navigate to="/admin" replace />;
  const { items, isLoading, error, refresh } = useItems({ mine: true });

  async function softDelete(id) {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await softDeleteItem(id);
      refresh();
    } catch (e) {
      alert(e.message || "Failed to delete item");
    }
  }

  return (
    <PageContainer>
      <h1 className={styles.title}>My Dashboard</h1>
      <p className={styles.subtitle}>Items you have reported as lost or found.</p>

      {isLoading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!isLoading && !error && items.length === 0 && (
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>No items reported yet</p>
          <p className={styles.emptyText}>
            Once you report a lost or found item, it will appear here.
          </p>
          <Link to="/items/report-lost" className={styles.emptyLink}>
            Report an Item
          </Link>
        </div>
      )}

      <div className={styles.grid}>
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onSoftDelete={softDelete}
          />
        ))}
      </div>
    </PageContainer>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../../../components/ui/PageContainer";
import * as adminApi from "../api/adminApi";
import styles from "../styles/adminDashboardPage.module.css";

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setError("");
        const [data, recentItems] = await Promise.all([
          adminApi.getDashboardMetrics(),
          adminApi.getRecentActivity().catch(() => []),
        ]);

        setActivity(recentItems);

        setMetrics({
          totalItems: data?.itemStats?.Total_Items ?? 0,
          activeItems: data?.itemStats?.Active_Items ?? 0,
          claimedItems: data?.itemStats?.Claimed_Items ?? 0,
          totalClaims: data?.claimStats?.Total_Claims ?? 0,
          pendingClaims: data?.claimStats?.Pending_Claims ?? 0,
          approvedClaims: data?.claimStats?.Approved_Claims ?? 0,
          rejectedClaims: data?.claimStats?.Rejected_Claims ?? 0,
          escalatedClaims: data?.claimStats?.Escalated_Claims ?? 0,
        });
      } catch (e) {
        setError(e.message || "Failed to load dashboard");
      }
    }

    loadDashboard();
  }, []);

  const escalatedCount = metrics?.escalatedClaims ?? 0;

  return (
    <PageContainer>
      <div className={styles.wrapper}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Admin Dashboard</h1>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/admin/disputes" className={styles.manageBtn}>
              Disputes
            </Link>
            <Link to="/admin/items" className={styles.manageBtn}>
              Manage Items
            </Link>
            <Link to="/admin/manage-data" className={styles.manageBtn}>
              Categories &amp; Locations
            </Link>
          </div>
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}

        {escalatedCount > 0 && (
          <div className={styles.alertBanner}>
            <p className={styles.alertText}>
              {escalatedCount} escalated {escalatedCount === 1 ? "claim needs" : "claims need"} your attention.
            </p>
            <Link to="/admin/disputes" className={styles.alertLink}>
              Review now
            </Link>
          </div>
        )}

        <p className={styles.sectionLabel}>Items</p>
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Total Items</p>
            <p className={styles.metricValue}>
              {metrics ? metrics.totalItems : "..."}
            </p>
          </div>

          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Active</p>
            <p className={styles.metricValue}>
              {metrics ? metrics.activeItems : "..."}
            </p>
          </div>

          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Claimed</p>
            <p className={styles.metricValue}>
              {metrics ? metrics.claimedItems : "..."}
            </p>
          </div>
        </div>

        <p className={styles.sectionLabel}>Claims</p>
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Total Claims</p>
            <p className={styles.metricValue}>
              {metrics ? metrics.totalClaims : "..."}
            </p>
          </div>

          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Pending</p>
            <p className={styles.metricValue}>
              {metrics ? metrics.pendingClaims : "..."}
            </p>
          </div>

          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Approved</p>
            <p className={styles.metricValue}>
              {metrics ? metrics.approvedClaims : "..."}
            </p>
          </div>

          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Rejected</p>
            <p className={styles.metricValue}>
              {metrics ? metrics.rejectedClaims : "..."}
            </p>
          </div>

          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Escalated</p>
            <p className={styles.metricValue}>
              {metrics ? metrics.escalatedClaims : "..."}
            </p>
          </div>
        </div>

        {activity.length > 0 && (
          <>
            <p className={styles.sectionLabel}>Recent Activity</p>
            <div className={styles.activityCard}>
              <div className={styles.activityList}>
                {activity.map((item) => (
                  <div key={item.id} className={styles.activityItem}>
                    <div>
                      <p className={styles.activityTitle}>{item.title}</p>
                      <p className={styles.activityMeta}>
                        {(item.type || "").toUpperCase()} &middot; {item.location || item.display_name || "Unknown location"}
                      </p>
                    </div>
                    <p className={styles.activityDate}>
                      {formatDate(item.date || item.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}

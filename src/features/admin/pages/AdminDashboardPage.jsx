import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../../../components/ui/PageContainer";
import * as adminApi from "../api/adminApi";
import styles from "../styles/adminDashboardPage.module.css";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setError("");
        const data = await adminApi.getDashboardMetrics();

        // Map backend shape { itemStats: {...}, claimStats: {...} }
        // to frontend display values
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

  return (
    <PageContainer>
      <div className={styles.wrapper}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Admin Dashboard</h1>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Link to="/admin/disputes" className={styles.manageBtn}>
              Disputes
            </Link>
            <Link to="/admin/manage-data" className={styles.manageBtn}>
              Manage Categories &amp; Locations
            </Link>
          </div>
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}

        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Total Items</p>
            <p className={styles.metricValue}>
              {metrics ? metrics.totalItems : "..."}
            </p>
          </div>

          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Active Items</p>
            <p className={styles.metricValue}>
              {metrics ? metrics.activeItems : "..."}
            </p>
          </div>

          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Claimed Items</p>
            <p className={styles.metricValue}>
              {metrics ? metrics.claimedItems : "..."}
            </p>
          </div>

          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Total Claims</p>
            <p className={styles.metricValue}>
              {metrics ? metrics.totalClaims : "..."}
            </p>
          </div>

          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Pending Claims</p>
            <p className={styles.metricValue}>
              {metrics ? metrics.pendingClaims : "..."}
            </p>
          </div>

          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Escalated</p>
            <p className={styles.metricValue}>
              {metrics ? metrics.escalatedClaims : "..."}
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

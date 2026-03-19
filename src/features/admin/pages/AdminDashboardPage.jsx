import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../../../components/ui/PageContainer";
import * as adminApi from "../api/adminApi";
import styles from "../styles/adminDashboardPage.module.css";

function formatDateTime(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString();
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setError("");
        const [metricsData, activityData] = await Promise.all([
          adminApi.getDashboardMetrics(),
          adminApi.getRecentActivity(),
        ]);

        setMetrics(metricsData);
        setActivity(activityData);
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

          <Link to="/admin/manage-data" className={styles.manageBtn}>
            Manage Categories & Locations
          </Link>
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
            <p className={styles.metricLabel}>Active Claims</p>
            <p className={styles.metricValue}>
              {metrics ? metrics.activeClaims : "..."}
            </p>
          </div>
        </div>

        <div className={styles.activityCard}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>

          <div className={styles.activityList}>
            {activity.map((item) => (
              <div key={item.id} className={styles.activityItem}>
                <div>
                  <p className={styles.activityTitle}>{item.title}</p>
                  <p className={styles.activityMeta}>
                    {item.type.toUpperCase()} item • {item.location_display_name}
                  </p>
                </div>

                <p className={styles.activityDate}>
                  {formatDateTime(item.created_at)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

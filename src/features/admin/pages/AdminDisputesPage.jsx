import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../../../components/ui/PageContainer";
import * as adminApi from "../api/adminApi";
import styles from "../styles/adminDisputesPage.module.css";

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString();
}

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("open");

  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolvingId, setResolvingId] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [actionInProgress, setActionInProgress] = useState(false);

  async function loadDisputes() {
    try {
      setError("");
      setIsLoading(true);
      const data = await adminApi.listDisputes();
      setDisputes(data ?? []);
    } catch (e) {
      setError(e.message || "Failed to load disputes");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDisputes();
  }, []);

  function openResolveModal(disputeId) {
    setResolvingId(disputeId);
    setResolutionNotes("");
    setShowResolveModal(true);
  }

  async function handleResolve() {
    if (!resolutionNotes.trim()) return;
    try {
      setActionInProgress(true);
      await adminApi.resolveDispute(resolvingId, resolutionNotes.trim());
      setShowResolveModal(false);
      setResolvingId(null);
      setResolutionNotes("");
      await loadDisputes();
    } catch (e) {
      alert(e.message || "Failed to resolve dispute");
    } finally {
      setActionInProgress(false);
    }
  }

  const filtered = disputes.filter((d) => {
    if (filter === "all") return true;
    if (filter === "open") return d.status === "open" || d.status === "escalated" || d.status === "pending";
    if (filter === "resolved") return d.status === "resolved" || d.status === "approved" || d.status === "rejected";
    return d.status === filter;
  });

  return (
    <PageContainer>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Disputes</h1>
        <p className={styles.subtitle}>
          Review and resolve ownership disputes escalated by item reporters or claimants.
        </p>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.tabs}>
          <button
            className={filter === "open" ? styles.tabActive : styles.tab}
            onClick={() => setFilter("open")}
          >
            Open
          </button>
          <button
            className={filter === "resolved" ? styles.tabActive : styles.tab}
            onClick={() => setFilter("resolved")}
          >
            Resolved
          </button>
          <button
            className={filter === "all" ? styles.tabActive : styles.tab}
            onClick={() => setFilter("all")}
          >
            All
          </button>
        </div>

        {isLoading && <p>Loading...</p>}

        {!isLoading && !error && filtered.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>
              {filter === "open" ? "No open disputes" : "No disputes found"}
            </p>
            <p className={styles.emptyText}>
              {filter === "open"
                ? "All disputes have been resolved."
                : "No disputes match this filter."}
            </p>
          </div>
        )}

        <div className={styles.list}>
          {filtered.map((dispute) => (
            <div key={dispute.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.itemTitle}>{dispute.item_title}</h2>
                  <p className={styles.parties}>
                    Claimant: {dispute.claimant_first_name
                      ? `${dispute.claimant_first_name} ${dispute.claimant_last_name || ""}`.trim()
                      : dispute.claimant_name || `Claimant #${dispute.claimant_id}`}
                    {dispute.reporter_first_name && (
                      <> &middot; Reporter: {`${dispute.reporter_first_name} ${dispute.reporter_last_name || ""}`.trim()}</>
                    )}
                  </p>
                </div>
                <span
                  className={
                    ["open", "escalated", "pending"].includes(dispute.status)
                      ? styles.statusOpen
                      : styles.statusResolved
                  }
                >
                  {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                </span>
              </div>

              <p className={styles.meta}>
                Opened: {formatDate(dispute.created_at)}
                {dispute.resolved_at && ` · Resolved: ${formatDate(dispute.resolved_at)}`}
              </p>

              <div className={styles.reason}>
                <strong>Verification Details:</strong> {dispute.verification_details || dispute.reason || "No details provided"}
              </div>

              {dispute.status === "resolved" && dispute.resolution_notes && (
                <div className={styles.resolution}>
                  <strong>Resolution:</strong> {dispute.resolution_notes}
                </div>
              )}

              <div className={styles.actions}>
                {["open", "escalated", "pending"].includes(dispute.status) && (
                  <Link to={`/admin/disputes/${dispute.id}`} className={styles.resolveBtn} style={{ textDecoration: "none" }}>
                    Resolve Dispute
                  </Link>
                )}
                <Link to={`/items/${dispute.item_id}`} className={styles.viewBtn}>
                  View Item
                </Link>
              </div>
            </div>
          ))}
        </div>

        {showResolveModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
              <h2 style={{ marginTop: 0 }}>Resolve Dispute</h2>
              <p style={{ color: "#6b7280", fontSize: 14 }}>
                Describe the resolution — how ownership was verified and the outcome.
              </p>
              <textarea
                className={styles.textarea}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="e.g. Verified ownership through student ID found inside item. Approved claim for..."
                rows={5}
              />
              <div className={styles.modalActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowResolveModal(false);
                    setResolvingId(null);
                    setResolutionNotes("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className={styles.resolveBtn}
                  onClick={handleResolve}
                  disabled={actionInProgress || !resolutionNotes.trim()}
                >
                  Submit Resolution
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageContainer from "../../../components/ui/PageContainer";
import * as adminApi from "../api/adminApi";
import * as itemsApi from "../../items/api/itemsApi";
import styles from "../styles/adminDisputeDetail.module.css";

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString();
}

function formatDateTime(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString();
}

export default function AdminDisputeDetailPage() {
  const { disputeId } = useParams();

  const [dispute, setDispute] = useState(null);
  const [item, setItem] = useState(null);
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [actionInProgress, setActionInProgress] = useState(false);

  async function loadData() {
    try {
      setError("");
      setIsLoading(true);

      const disputeData = await adminApi.getDisputeById(disputeId);
      setDispute(disputeData);

      const [itemData, claimsData] = await Promise.all([
        itemsApi.getItemById(disputeData.item_id).catch(() => null),
        adminApi.getClaimsForItem(disputeData.item_id).catch(() => []),
      ]);

      setItem(itemData);
      setClaims(claimsData ?? []);
    } catch (e) {
      setError(e.message || "Failed to load dispute");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [disputeId]);

  async function handleResolve() {
    if (!selectedClaimId) return;
    try {
      setActionInProgress(true);
      await adminApi.resolveDispute(selectedClaimId, resolutionNotes.trim());
      setShowResolveModal(false);
      setSelectedClaimId("");
      setResolutionNotes("");
      await loadData();
    } catch (e) {
      alert(e.message || "Failed to resolve dispute");
    } finally {
      setActionInProgress(false);
    }
  }

  if (isLoading) {
    return (
      <PageContainer>
        <p>Loading...</p>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <p className={styles.error}>{error}</p>
      </PageContainer>
    );
  }

  if (!dispute) return null;

  const statusClass =
    dispute.status === "open" ? styles.statusOpen : styles.statusResolved;

  return (
    <PageContainer>
      <div className={styles.wrapper}>
        <Link to="/admin/disputes" className={styles.backLink}>
          &larr; Back to Disputes
        </Link>

        {/* Dispute overview */}
        <div className={styles.card}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.title}>{dispute.item_title}</h1>
              <p className={styles.meta}>
                Dispute #{dispute.id} &middot; Opened {formatDate(dispute.created_at)}
                {dispute.resolved_at && ` · Resolved ${formatDate(dispute.resolved_at)}`}
              </p>
              <p className={styles.meta}>
                Reporter: {dispute.reporter_name} &middot; Claimant: {dispute.claimant_name}
              </p>
            </div>
            <span className={statusClass}>
              {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
            </span>
          </div>

          <h2 className={styles.sectionTitle}>Dispute Reason</h2>
          <div className={styles.reason}>{dispute.reason}</div>

          {dispute.status === "resolved" && dispute.resolution_notes && (
            <>
              <h2 className={styles.sectionTitle} style={{ marginTop: 20 }}>
                Resolution
              </h2>
              <div className={styles.resolution}>{dispute.resolution_notes}</div>
            </>
          )}
        </div>

        {/* Item details */}
        {item && (
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Item Details</h2>
            <div className={styles.itemSection}>
              <p className={styles.text}>
                <strong>Title:</strong> {item.title}
              </p>
              <p className={styles.text}>
                <strong>Description:</strong> {item.description || "N/A"}
              </p>
              <p className={styles.text}>
                <strong>Type:</strong> {item.type?.toUpperCase()}
              </p>
              <p className={styles.text}>
                <strong>Location:</strong> {item.location || item.location_details || "N/A"}
              </p>
              <p className={styles.text}>
                <strong>Date:</strong> {formatDate(item.date)}
              </p>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{ maxWidth: 300, borderRadius: 8, marginTop: 8 }}
                />
              )}
            </div>
          </div>
        )}

        {/* All claims side-by-side */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>
            All Claims on This Item ({claims.length})
          </h2>

          {claims.length === 0 ? (
            <p className={styles.text} style={{ color: "#6b7280" }}>
              No claims found for this item.
            </p>
          ) : (
            <div className={styles.claimsGrid}>
              {claims.map((claim) => {
                const isDisputed = String(claim.id) === String(dispute.claim_id);
                return (
                  <div
                    key={claim.id}
                    className={
                      isDisputed ? styles.claimCardDisputed : styles.claimCard
                    }
                  >
                    <div className={styles.claimHeader}>
                      <div>
                        <p className={styles.claimantName}>
                          {claim.claimant_name || `Claimant #${claim.claimant_id}`}
                          {isDisputed && (
                            <span className={styles.disputedTag}>Disputed</span>
                          )}
                        </p>
                      </div>
                      <span
                        className={
                          claim.status === "approved"
                            ? styles.statusApproved
                            : claim.status === "rejected"
                              ? styles.statusRejected
                              : styles.statusPending
                        }
                      >
                        {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                      </span>
                    </div>

                    <div className={styles.verification}>
                      {claim.verification_details || "No verification provided"}
                    </div>

                    <p className={styles.claimMeta}>
                      Submitted: {formatDateTime(claim.created_at)}
                    </p>

                    {dispute.status === "open" && claim.status !== "approved" && (
                      <button
                        className={styles.resolveBtn}
                        style={{ marginTop: 10, fontSize: 12, padding: "6px 14px" }}
                        disabled={actionInProgress}
                        onClick={async () => {
                          if (!window.confirm(`Assign this item to ${claim.claimant_name || "this claimant"}?`)) return;
                          try {
                            setActionInProgress(true);
                            await adminApi.assignClaim(claim.id, claim.claimant_id);
                            await loadData();
                          } catch (e) {
                            alert(e.message || "Failed to assign claim");
                          } finally {
                            setActionInProgress(false);
                          }
                        }}
                      >
                        Assign to This Claimant
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        {dispute.status === "open" && (
          <div className={styles.actions}>
            <button
              className={styles.resolveBtn}
              onClick={() => setShowResolveModal(true)}
            >
              Resolve Dispute
            </button>
            <Link to={`/items/${dispute.item_id}`} className={styles.secondaryBtn}>
              View Item Page
            </Link>
          </div>
        )}

        {/* Resolve modal */}
        {showResolveModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
              <h2 style={{ marginTop: 0 }}>Resolve Dispute</h2>
              <p style={{ color: "#6b7280", fontSize: 14 }}>
                Select the claim to approve. All other claims on this item will be automatically rejected.
              </p>

              <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 6 }}>
                Approve Claim
              </label>
              <select
                value={selectedClaimId}
                onChange={(e) => setSelectedClaimId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                  fontSize: 14,
                  marginBottom: 16,
                  boxSizing: "border-box",
                }}
              >
                <option value="">Select a claim to approve...</option>
                {claims.map((c) => (
                  <option key={c.id} value={c.id}>
                    Claim #{c.id} — {c.claimant_name || c.claimant_first_name || `Claimant #${c.claimant_id}`}
                  </option>
                ))}
              </select>

              <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 6 }}>
                Feedback (optional)
              </label>
              <textarea
                className={styles.textarea}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="e.g. Verified ownership through student ID..."
                rows={4}
              />
              <div className={styles.modalActions}>
                <button
                  className={styles.secondaryBtn}
                  onClick={() => {
                    setShowResolveModal(false);
                    setSelectedClaimId("");
                    setResolutionNotes("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className={styles.resolveBtn}
                  onClick={handleResolve}
                  disabled={actionInProgress || !selectedClaimId}
                >
                  Approve &amp; Resolve
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

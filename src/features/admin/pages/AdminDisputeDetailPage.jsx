import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageContainer from "../../../components/ui/PageContainer";
import * as adminApi from "../api/adminApi";
import * as itemsApi from "../../items/api/itemsApi";
import * as claimsApi from "../../claims/api/claimsApi";
import styles from "../styles/adminDisputeDetail.module.css";

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminDisputeDetailPage() {
  const { disputeId } = useParams();

  const [dispute, setDispute] = useState(null);
  const [item, setItem] = useState(null);
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState("");
  const [selectedRejectClaimId, setSelectedRejectClaimId] = useState("");
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
      const claimsList = Array.isArray(claimsData) ? claimsData : claimsData?.data || [];
      setClaims(claimsList);
    } catch (e) {
      setError(e.message || "Failed to load dispute");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [disputeId]);

  async function handleApprove() {
    if (!selectedClaimId) return;
    try {
      setActionInProgress(true);
      await adminApi.resolveDispute(selectedClaimId, resolutionNotes.trim());
      setShowApproveModal(false);
      setSelectedClaimId("");
      setResolutionNotes("");
      await loadData();
    } catch (e) {
      alert(e.message || "Failed to approve claim");
    } finally {
      setActionInProgress(false);
    }
  }

  async function handleReject() {
    if (!selectedRejectClaimId) return;
    try {
      setActionInProgress(true);
      await claimsApi.rejectClaim(selectedRejectClaimId, resolutionNotes.trim());
      setShowRejectModal(false);
      setSelectedRejectClaimId("");
      setResolutionNotes("");
      await loadData();
    } catch (e) {
      alert(e.message || "Failed to reject claim");
    } finally {
      setActionInProgress(false);
    }
  }

  if (isLoading) {
    return <PageContainer><p>Loading...</p></PageContainer>;
  }

  if (error) {
    return <PageContainer><p className={styles.error}>{error}</p></PageContainer>;
  }

  if (!dispute) return null;

  const isOpen = ["open", "escalated", "pending"].includes(dispute.status);

  const claimantName = dispute.claimant_first_name
    ? `${dispute.claimant_first_name} ${dispute.claimant_last_name || ""}`.trim()
    : dispute.claimant_name || `Claimant #${dispute.claimant_id}`;

  const itemType = item?.type
    ? item.type.charAt(0).toUpperCase() + item.type.slice(1).toLowerCase()
    : null;

  const rawUrl = item?.imageUrl || item?.image_url || null;
  const imageSrc = rawUrl && rawUrl.startsWith("http")
    ? rawUrl
    : rawUrl
      ? `${import.meta.env.VITE_API_BASE_URL}${rawUrl}`
      : null;

  return (
    <PageContainer>
      <div className={styles.wrapper}>
        <Link to="/admin/disputes" className={styles.backLink}>
          &larr; Back to Disputes
        </Link>

        {/* Header */}
        <div className={styles.card}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.title}>
                {dispute.item_title || item?.title || `Dispute #${dispute.id}`}
              </h1>
              <p className={styles.meta}>
                Dispute #{dispute.id} &middot; Opened {formatDate(dispute.created_at)}
              </p>
              <p className={styles.meta}>
                Claimant: {claimantName}
                {dispute.reporter_first_name && (
                  <> &middot; Reporter: {`${dispute.reporter_first_name} ${dispute.reporter_last_name || ""}`.trim()}</>
                )}
              </p>
            </div>
            <span className={isOpen ? styles.statusOpen : styles.statusResolved}>
              {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
            </span>
          </div>

          {dispute.escalation_reason && (
            <>
              <h2 className={styles.sectionTitle}>Escalation Reason</h2>
              <div className={styles.reason}>{dispute.escalation_reason}</div>
            </>
          )}

          {dispute.status === "resolved" && dispute.resolution_notes && (
            <>
              <h2 className={styles.sectionTitle} style={{ marginTop: 20 }}>Resolution</h2>
              <div className={styles.resolution}>{dispute.resolution_notes}</div>
            </>
          )}
        </div>

        {/* Side-by-side: Item Details | Claim Details */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Review Comparison</h2>
          <div className={styles.comparisonGrid}>
            <div className={styles.comparisonPanel}>
              <h3 className={styles.panelTitle}>Item Details</h3>
              <p className={styles.text}><strong>Title:</strong> {item?.title || "N/A"}</p>
              <p className={styles.text}><strong>Description:</strong> {item?.description || "N/A"}</p>
              {itemType && <p className={styles.text}><strong>Type:</strong> {itemType}</p>}
              <p className={styles.text}><strong>Location:</strong> {item?.location || item?.location_details || "N/A"}</p>
              <p className={styles.text}><strong>Date:</strong> {formatDate(item?.date)}</p>
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt={item?.title}
                  style={{ width: "100%", borderRadius: 10, marginTop: 12, border: "1px solid #e5e7eb" }}
                />
              )}
            </div>

            <div className={styles.comparisonPanel}>
              <h3 className={styles.panelTitle}>Claim Details</h3>
              <p className={styles.text}><strong>Claimant:</strong> {claimantName}</p>
              <p className={styles.text}><strong>Submitted:</strong> {formatDateTime(dispute.created_at)}</p>
              <p className={styles.text}><strong>Verification:</strong> {dispute.verification_details || "No details provided"}</p>
              <p className={styles.text}><strong>Claim ID:</strong> {dispute.id}</p>
              <p className={styles.text}><strong>Status:</strong> {dispute.status}</p>
            </div>
          </div>
        </div>

        {/* All claims on this item */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>
            All Claims on This Item ({claims.length})
          </h2>

          {claims.length === 0 ? (
            <p className={styles.text} style={{ color: "#6b7280" }}>
              No other claims found for this item.
            </p>
          ) : (
            <div className={styles.claimsGrid}>
              {claims.map((claim) => {
                const isThis = String(claim.id) === String(dispute.id);
                const name = claim.claimant_first_name
                  ? `${claim.claimant_first_name} ${claim.claimant_last_name || ""}`.trim()
                  : claim.claimant_name || `Claimant #${claim.claimant_id}`;
                return (
                  <div
                    key={claim.id}
                    className={isThis ? styles.claimCardDisputed : styles.claimCard}
                  >
                    <div className={styles.claimHeader}>
                      <p className={styles.claimantName}>
                        {name}
                        {isThis && <span className={styles.disputedTag}>This Claim</span>}
                      </p>
                      <span
                        className={
                          claim.status === "approved" ? styles.statusApproved
                            : claim.status === "rejected" ? styles.statusRejected
                              : claim.status === "escalated" ? styles.statusOpen
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
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        {isOpen && (
          <div className={styles.actions}>
            <button
              className={styles.resolveBtn}
              onClick={() => setShowApproveModal(true)}
            >
              Approve a Claim
            </button>
            <button
              className={styles.secondaryBtn}
              onClick={() => setShowRejectModal(true)}
              style={{ cursor: "pointer" }}
            >
              Reject a Claim
            </button>
            <Link to={`/items/${dispute.item_id}`} className={styles.secondaryBtn}>
              View Item Page
            </Link>
          </div>
        )}

        {/* Approve modal */}
        {showApproveModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
              <h2 style={{ marginTop: 0 }}>Approve a Claim</h2>
              <p style={{ color: "#6b7280", fontSize: 14 }}>
                Select the rightful owner. All other claims on this item will be automatically rejected.
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
                {claims.map((c) => {
                  const n = c.claimant_first_name
                    ? `${c.claimant_first_name} ${c.claimant_last_name || ""}`.trim()
                    : c.claimant_name || `Claimant #${c.claimant_id}`;
                  return (
                    <option key={c.id} value={c.id}>
                      Claim #{c.id} — {n}
                    </option>
                  );
                })}
              </select>

              <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 6 }}>
                Resolution Notes (optional)
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
                    setShowApproveModal(false);
                    setSelectedClaimId("");
                    setResolutionNotes("");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  className={styles.resolveBtn}
                  onClick={handleApprove}
                  disabled={actionInProgress || !selectedClaimId}
                >
                  {actionInProgress ? "Processing..." : "Approve & Resolve"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject all modal */}
        {showRejectModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
              <h2 style={{ marginTop: 0 }}>Reject a Claim</h2>
              <p style={{ color: "#6b7280", fontSize: 14 }}>
                Select the claim to reject and provide a reason for the claimant.
              </p>

              <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 6 }}>
                Reject Claim
              </label>
              <select
                value={selectedRejectClaimId}
                onChange={(e) => setSelectedRejectClaimId(e.target.value)}
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
                <option value="">Select a claim to reject...</option>
                {claims.map((c) => {
                  const n = c.claimant_first_name
                    ? `${c.claimant_first_name} ${c.claimant_last_name || ""}`.trim()
                    : c.claimant_name || `Claimant #${c.claimant_id}`;
                  return (
                    <option key={c.id} value={c.id}>
                      Claim #{c.id} — {n}
                    </option>
                  );
                })}
              </select>

              <label style={{ display: "block", fontWeight: 600, fontSize: 14, marginBottom: 6 }}>
                Rejection Reason
              </label>
              <textarea
                className={styles.textarea}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="e.g. Claimant could not verify ownership details..."
                rows={4}
              />
              <div className={styles.modalActions}>
                <button
                  className={styles.secondaryBtn}
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedRejectClaimId("");
                    setResolutionNotes("");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  style={{
                    padding: "10px 20px",
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                    opacity: actionInProgress || !selectedRejectClaimId || !resolutionNotes.trim() ? 0.5 : 1,
                  }}
                  onClick={handleReject}
                  disabled={actionInProgress || !selectedRejectClaimId || !resolutionNotes.trim()}
                >
                  {actionInProgress ? "Processing..." : "Reject Claim"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

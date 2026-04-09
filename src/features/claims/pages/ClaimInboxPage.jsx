import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../../../components/ui/PageContainer";
import ClaimStatusPill from "../components/ClaimStatusPill";
import * as claimsApi from "../api/claimsApi";
import styles from "../styles/claimInbox.module.css";

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ClaimInboxPage() {
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null); // { type: "approve"|"reject", claimId, claimantName }
  const [actionError, setActionError] = useState("");

  async function loadClaims() {
    try {
      setError("");
      setIsLoading(true);
      const data = await claimsApi.getClaimsInbox();
      setClaims(data ?? []);
    } catch (e) {
      setError(e.message || "Failed to load claims inbox");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadClaims();
  }, []);

  async function handleConfirmAction() {
    if (!confirmModal) return;
    const { type, claimId } = confirmModal;
    try {
      setActioningId(claimId);
      setActionError("");
      if (type === "approve") {
        await claimsApi.approveClaim(claimId);
      }
      setConfirmModal(null);
      await loadClaims();
    } catch (e) {
      setActionError(e.message || `Failed to ${type} claim`);
    } finally {
      setActioningId(null);
    }
  }

  return (
    <PageContainer>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Claims Inbox</h1>
        <p className={styles.subtitle}>
          Review incoming claims submitted for items you reported.
        </p>

        {isLoading && <p>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!isLoading && !error && claims.length === 0 && (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>No incoming claims</p>
            <p className={styles.emptyText}>
              When someone submits a claim on one of your items, it will appear here.
            </p>
          </div>
        )}

        <div className={styles.list}>
          {claims.map((claim) => (
            <div key={claim.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.itemTitle}>{claim.item_title}</h2>
                  <p className={styles.claimant}>
                    Claimed by {claim.claimant_first_name} {claim.claimant_last_name}
                  </p>
                </div>
                <ClaimStatusPill status={claim.status} />
              </div>

              <p className={styles.meta}>Submitted: {formatDate(claim.created_at)}</p>

              <div className={styles.verification}>
                <strong>Verification:</strong> {claim.verification_details}
              </div>

              <div className={styles.actions}>
                {claim.status === "pending" && (
                  <>
                    <button
                      className={styles.approveBtn}
                      onClick={() => setConfirmModal({
                        type: "approve",
                        claimId: claim.id,
                        claimantName: `${claim.claimant_first_name || ""} ${claim.claimant_last_name || ""}`.trim(),
                      })}
                      disabled={actioningId === claim.id}
                    >
                      Approve
                    </button>
                  </>
                )}
                <Link to={`/claims/${claim.id}`} className={styles.viewBtn}>
                  Review Details
                </Link>
                <Link to={`/items/${claim.item_id}`} className={styles.viewBtn}>
                  View Item
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Confirmation modal */}
        {confirmModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
              <h2 className={styles.modalTitle}>
                {confirmModal.type === "approve" ? "Approve Claim" : "Reject Claim"}
              </h2>
              <p className={styles.modalText}>
                {confirmModal.type === "approve"
                  ? `Are you sure you want to approve this claim${confirmModal.claimantName ? ` from ${confirmModal.claimantName}` : ""}? The claimant will be notified and your contact details will be shared.`
                  : `Are you sure you want to reject this claim${confirmModal.claimantName ? ` from ${confirmModal.claimantName}` : ""}?`}
              </p>

              {actionError && <p className={styles.modalError}>{actionError}</p>}

              <div className={styles.modalActions}>
                <button
                  className={styles.modalCancel}
                  onClick={() => { setConfirmModal(null); setActionError(""); }}
                >
                  Cancel
                </button>
                <button
                  className={confirmModal.type === "approve" ? styles.approveBtn : styles.rejectBtn}
                  onClick={handleConfirmAction}
                  disabled={actioningId}
                >
                  {actioningId ? "Processing..." : confirmModal.type === "approve" ? "Yes, Approve" : "Yes, Reject"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

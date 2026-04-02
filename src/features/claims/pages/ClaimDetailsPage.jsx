import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PageContainer from "../../../components/ui/PageContainer";
import { useAuth } from "../../../context/useAuth";
import * as claimsApi from "../api/claimsApi";
import * as itemsApi from "../../items/api/itemsApi";
import ClaimStatusPill from "../components/ClaimStatusPill";
import styles from "../styles/claimDetailsPage.module.css";

function formatDateTime(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString();
}

export default function ClaimDetailsPage() {
  const { claimId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [claim, setClaim] = useState(null);
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState("");

  async function loadClaim() {
    try {
      setError("");
      setIsLoading(true);
      const claimData = await claimsApi.getMyClaimById(claimId, user?.id);
      setClaim(claimData);

      if (claimData.item_id) {
        try {
          const itemData = await itemsApi.getItemById(claimData.item_id);
          setItem(itemData);
        } catch {
          // item fetch is supplementary — don't block the page
        }
      }
    } catch (e) {
      setError(e.message || "Failed to load claim");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadClaim();
  }, [claimId]);

  async function handleWithdraw() {
    if (!window.confirm("Withdraw this claim? This cannot be undone.")) return;
    try {
      setActionInProgress(true);
      await claimsApi.withdrawClaim(claimId, user.id);
      navigate(`/claims/${claimId}/withdrawn-success`);
    } catch (e) {
      alert(e.message || "Failed to withdraw claim");
    } finally {
      setActionInProgress(false);
    }
  }

  async function handleApprove() {
    if (!window.confirm("Approve this claim? The claimant will be notified.")) return;
    try {
      setActionInProgress(true);
      await claimsApi.approveClaim(claimId);
      await loadClaim();
    } catch (e) {
      alert(e.message || "Failed to approve claim");
    } finally {
      setActionInProgress(false);
    }
  }

  async function handleSubmitRejection() {
    try {
      setActionInProgress(true);
      await claimsApi.rejectClaim(claimId);
      setShowRejectModal(false);
      setRejectFeedback("");
      await loadClaim();
    } catch (e) {
      alert(e.message || "Failed to reject claim");
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

  if (!claim) return null;

  const isOwner = item && item.user_id === user?.id;
  const isClaimant = claim.claimant_id === user?.id;

  return (
    <PageContainer>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.title}>
                {claim.item_title || item?.title || `Claim #${claim.id}`}
              </h1>
              <p className={styles.meta}>
                Submitted: {formatDateTime(claim.created_at)}
              </p>
            </div>
            <ClaimStatusPill status={claim.status} />
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Review Comparison</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: "16px",
              }}
            >
              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "16px",
                  background: "#ffffff",
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: "12px" }}>Item Details</h3>
                <p className={styles.text}>
                  <strong>Title:</strong> {item?.title || claim.item_title || "N/A"}
                </p>
                <p className={styles.text}>
                  <strong>Description:</strong> {item?.description || "N/A"}
                </p>
                <p className={styles.text}>
                  <strong>Location:</strong> {item?.location || item?.location_details || "N/A"}
                </p>
                <p className={styles.text}>
                  <strong>Date:</strong> {formatDateTime(item?.date || claim.created_at)}
                </p>
                {item?.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{ width: "100%", borderRadius: 8, marginTop: 8 }}
                  />
                )}
              </div>

              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "16px",
                  background: "#ffffff",
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: "12px" }}>Claim Details</h3>
                <p className={styles.text}>
                  <strong>Claimant:</strong>{" "}
                  {claim.claimant_first_name
                    ? `${claim.claimant_first_name} ${claim.claimant_last_name}`
                    : `Claimant #${claim.claimant_id}`}
                </p>
                <p className={styles.text}>
                  <strong>Submitted:</strong> {formatDateTime(claim.created_at)}
                </p>
                <p className={styles.text}>
                  <strong>Verification:</strong>{" "}
                  {claim.verification_details || "No details provided"}
                </p>
                <p className={styles.text}>
                  <strong>Claim ID:</strong> {claim.id}
                </p>
              </div>
            </div>
          </div>

          {claim.status === "rejected" && claim.reporter_feedback && (
            <div className={styles.feedbackBox}>
              <h2 className={styles.sectionTitle}>Feedback</h2>
              <p className={styles.feedbackText}>{claim.reporter_feedback}</p>
            </div>
          )}

          {claim.status === "approved" && claim.contact_shared_at && (
            <div className={styles.feedbackBox}>
              <h2 className={styles.sectionTitle}>Contact Information</h2>
              <p className={styles.text}>
                <strong>Contact Shared:</strong> {formatDateTime(claim.contact_shared_at)}
              </p>
            </div>
          )}

          <div className={styles.actions}>
            {isClaimant && (
              <Link to="/claims" className={styles.backBtn}>
                Back to My Claims
              </Link>
            )}

            {isOwner && (
              <Link to="/claims/inbox" className={styles.backBtn}>
                Back to Claims Inbox
              </Link>
            )}

            {!isClaimant && !isOwner && (
              <Link to="/claims" className={styles.backBtn}>
                Back
              </Link>
            )}

            {isClaimant && claim.status === "pending" && (
              <button
                type="button"
                className={styles.rejectBtn}
                onClick={handleWithdraw}
                disabled={actionInProgress}
              >
                Withdraw Claim
              </button>
            )}

            {isOwner && claim.status === "pending" && (
              <>
                <button
                  type="button"
                  className={styles.approveBtn}
                  onClick={handleApprove}
                  disabled={actionInProgress}
                >
                  Approve Claim
                </button>
                <button
                  type="button"
                  className={styles.rejectBtn}
                  onClick={() => setShowRejectModal(true)}
                  disabled={actionInProgress}
                >
                  Reject Claim
                </button>
              </>
            )}
          </div>

          {showRejectModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalBox}>
                <h2 style={{ marginTop: 0 }}>Reject Claim</h2>
                <p className={styles.text}>
                  Add feedback explaining why this claim is being rejected.
                </p>
                <textarea
                  value={rejectFeedback}
                  onChange={(e) => setRejectFeedback(e.target.value)}
                  placeholder="Enter rejection feedback here..."
                  rows={5}
                  className={styles.textarea}
                />
                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.backBtn}
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectFeedback("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={styles.rejectBtn}
                    onClick={handleSubmitRejection}
                    disabled={actionInProgress}
                  >
                    Submit Rejection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

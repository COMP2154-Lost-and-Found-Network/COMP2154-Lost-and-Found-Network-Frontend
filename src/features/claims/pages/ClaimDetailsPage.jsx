import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PageContainer from "../../../components/ui/PageContainer";
import { useAuth } from "../../../context/useAuth";
import * as claimsApi from "../api/claimsApi";
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
  const [error, setError] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState("");

  useEffect(() => {
    setError("");

    setClaim({
      id: claimId,

      // IDs
      item_id: "123",
      claimant_id: "456",

      // Item info
      item_title: "Black Leather Wallet",
      item_description: "A black leather wallet found near the campus library entrance.",
      item_location: "Library entrance near the benches",
      item_date: "2026-03-18T14:30:00Z",

      // Claimant info
      claimant_name: "John Doe",
      contact_name: "John Doe",
      contact_email: "john.doe@example.com",
      contact_phone: "(416) 555-0123",

      // Claim info
      status: "pending",
      created_at: "2026-03-20T10:00:00Z",
      updated_at: "2026-03-20T10:00:00Z",
      reviewed_at: null,
      contact_shared_at: null,

      // Verification
      verification_details:
        "Claimant stated the wallet contains two credit cards, a student ID, and described the inner lining color correctly.",

      // Feedback (for rejected case)
      rejection_feedback: "",
    });
  }, [claimId]);

  async function handleWithdraw() {
    try {
      await claimsApi.withdrawClaim(claimId, user.id);
      navigate(`/claims/${claimId}/withdrawn-success`);
    } catch (e) {
      alert(e.message || "Failed to withdraw claim");
    }
  }

  function handleOpenRejectModal() {
    setShowRejectModal(true);
  }

  function handleSubmitRejection() {
    setClaim((prev) => ({
      ...prev,
      status: "rejected",
      rejection_feedback: rejectFeedback.trim(),
    }));
    setShowRejectModal(false);
    setRejectFeedback("");
  }

  function handleApproveClaim() {
    setClaim((prev) => ({
      ...prev,
      status: "approved",
      contact_shared_at: new Date().toISOString(),
    }));
  }

  if (error) {
    return (
      <PageContainer>
        <p className={styles.error}>{error}</p>
      </PageContainer>
    );
  }

  if (!claim) {
    return (
      <PageContainer>
        <p>Loading...</p>
      </PageContainer>
    );
  }

  const itemDetails = {
    title: claim.item_title || "Unknown Item",
    description:
      claim.item_description ||
      claim.item_summary ||
      "Item description will appear here once the review flow is fully connected.",
    location:
      claim.location_details ||
      claim.item_location ||
      "Location details will appear here once connected.",
    date: claim.item_date || claim.created_at,
  };

  const claimantDetails = {
    name: claim.claimant_name || `Claimant #${claim.claimant_id || "N/A"}`,
    submittedAt: claim.created_at,
    verification:
      claim.verification_details ||
      "Verification details will appear here once connected.",
  };

  return (
    <PageContainer>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className={styles.headerRow}>
            <div>
              <h1 className={styles.title}>{claim.item_title}</h1>
              <p className={styles.meta}>
                Created: {formatDateTime(claim.created_at)}
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
                  <strong>Title:</strong> {itemDetails.title}
                </p>
                <p className={styles.text}>
                  <strong>Description:</strong> {itemDetails.description}
                </p>
                <p className={styles.text}>
                  <strong>Location:</strong> {itemDetails.location}
                </p>
                <p className={styles.text}>
                  <strong>Date:</strong> {formatDateTime(itemDetails.date)}
                </p>
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
                  <strong>Claimant:</strong> {claimantDetails.name}
                </p>
                <p className={styles.text}>
                  <strong>Submitted:</strong> {formatDateTime(claimantDetails.submittedAt)}
                </p>
                <p className={styles.text}>
                  <strong>Verification:</strong> {claimantDetails.verification}
                </p>
                <p className={styles.text}>
                  <strong>Claim ID:</strong> {claim.id}
                </p>
              </div>
            </div>
          </div>

          {claim.status === "rejected" && (
            <div className={styles.feedbackBox}>
              <h2 className={styles.sectionTitle}>Finder Feedback</h2>
              <p className={styles.feedbackText}>
                {claim.rejection_feedback || "No feedback provided"}
              </p>
            </div>
          )}
          {claim.status === "approved" && (
            <div className={styles.feedbackBox}>
              <h2 className={styles.sectionTitle}>Contact Information</h2>
              <p className={styles.text}>
                <strong>Name:</strong> {claim.contact_name || claim.claimant_name}
              </p>
              <p className={styles.text}>
                <strong>Email:</strong> {claim.contact_email || "N/A"}
              </p>
              <p className={styles.text}>
                <strong>Phone:</strong> {claim.contact_phone || "N/A"}
              </p>
              <p className={styles.text}>
                <strong>Contact Shared:</strong> {formatDateTime(claim.contact_shared_at)}
              </p>
            </div>
          )}

          <div className={styles.actions}>
            <Link to="/claims/inbox" className={styles.backBtn}>
              Back to Claims Inbox
            </Link>

            {claim.status === "pending" && (
              <>
                <button
                  type="button"
                  className={styles.approveBtn}
                  onClick={handleApproveClaim}
                >
                  Approve Claim
                </button>

                <button
                  type="button"
                  className={styles.rejectBtn}
                  onClick={handleOpenRejectModal}
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

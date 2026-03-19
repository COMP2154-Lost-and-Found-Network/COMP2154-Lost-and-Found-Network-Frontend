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

  useEffect(() => {
    async function loadClaim() {
      try {
        setError("");
        const data = await claimsApi.getMyClaimById(claimId, user.id);
        setClaim(data);
      } catch (e) {
        setError(e.message || "Failed to load claim details");
      }
    }

    if (user?.id) {
      loadClaim();
    }
  }, [claimId, user]);

  async function handleWithdraw() {
    try {
      await claimsApi.withdrawClaim(claimId, user.id);
      navigate(`/claims/${claimId}/withdrawn-success`);
    } catch (e) {
      alert(e.message || "Failed to withdraw claim");
    }
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
            <h2 className={styles.sectionTitle}>Verification Details</h2>
            <p className={styles.text}>{claim.verification_details}</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Claim Metadata</h2>
            <div className={styles.detailsGrid}>
              <div>
                <strong>Claim ID:</strong> {claim.id}
              </div>
              <div>
                <strong>Item ID:</strong> {claim.item_id}
              </div>
              <div>
                <strong>Claimant ID:</strong> {claim.claimant_id}
              </div>
              <div>
                <strong>Status:</strong> {claim.status}
              </div>
              <div>
                <strong>Created At:</strong> {formatDateTime(claim.created_at)}
              </div>
              <div>
                <strong>Updated At:</strong> {formatDateTime(claim.updated_at)}
              </div>
              <div>
                <strong>Reviewed At:</strong> {formatDateTime(claim.reviewed_at)}
              </div>
              <div>
                <strong>Contact Shared At:</strong> {formatDateTime(claim.contact_shared_at)}
              </div>
            </div>
          </div>

          {claim.status === "rejected" && (
            <div className={styles.feedbackBox}>
              <h2 className={styles.sectionTitle}>Finder Feedback</h2>
              <p className={styles.feedbackText}>
                {claim.reporter_feedback || "No feedback provided"}
              </p>
            </div>
          )}

          <div className={styles.actions}>
            <Link to="/claims" className={styles.backBtn}>
              Back to My Claims
            </Link>

            {claim.status === "pending" && (
              <button
                className={styles.withdrawBtn}
                onClick={handleWithdraw}
              >
                Withdraw Claim
              </button>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageContainer from "../../../components/ui/PageContainer";
import ClaimStatusPill from "../components/ClaimStatusPill";
import * as claimsApi from "../api/claimsApi";
import styles from "../styles/claimInbox.module.css";

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString();
}

export default function ClaimInboxPage() {
  const [claims, setClaims] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState(null);

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

  async function handleApprove(claimId) {
    if (!window.confirm("Approve this claim? The claimant will be notified.")) return;
    try {
      setActioningId(claimId);
      await claimsApi.approveClaim(claimId);
      await loadClaims();
    } catch (e) {
      alert(e.message || "Failed to approve claim");
    } finally {
      setActioningId(null);
    }
  }

  async function handleReject(claimId) {
    if (!window.confirm("Reject this claim?")) return;
    try {
      setActioningId(claimId);
      await claimsApi.rejectClaim(claimId);
      await loadClaims();
    } catch (e) {
      alert(e.message || "Failed to reject claim");
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
                      onClick={() => handleApprove(claim.id)}
                      disabled={actioningId === claim.id}
                    >
                      Approve
                    </button>
                    <button
                      className={styles.rejectBtn}
                      onClick={() => handleReject(claim.id)}
                      disabled={actioningId === claim.id}
                    >
                      Reject
                    </button>
                  </>
                )}
                <Link to={`/items/${claim.item_id}`} className={styles.viewBtn}>
                  View Item
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

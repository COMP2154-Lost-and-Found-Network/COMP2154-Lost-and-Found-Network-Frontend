import { Link, useNavigate } from "react-router-dom";
import PageContainer from "../../../components/ui/PageContainer";
import { useAuth } from "../../../context/useAuth";
import * as claimsApi from "../api/claimsApi";
import useClaims from "../hooks/useClaims";
import ClaimStatusPill from "../components/ClaimStatusPill";
import styles from "../styles/myClaimsPage.module.css";

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString();
}

export default function MyClaimsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { claims, isLoading, error, refreshClaims } = useClaims(user?.id);

  async function handleWithdraw(claimId) {
    try {
      await claimsApi.withdrawClaim(claimId, user.id);
      await refreshClaims();
      navigate(`/claims/${claimId}/withdrawn-success`);
    } catch (e) {
      alert(e.message || "Failed to withdraw claim");
    }
  }

  return (
    <PageContainer>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>My Claims</h1>
        <p className={styles.subtitle}>
          Track the current status of the claims you have submitted.
        </p>

        {isLoading && <p>Loading...</p>}
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.list}>
          {claims.map((claim) => (
            <div key={claim.id} className={styles.card}>
              <div className={styles.headerRow}>
                <div>
                  <h2 className={styles.itemTitle}>{claim.item_title}</h2>
                  <p className={styles.meta}>
                    Submitted: {formatDate(claim.created_at)}
                  </p>
                </div>

                <ClaimStatusPill status={claim.status} />
              </div>

              <p className={styles.claimText}>
                {claim.verification_details}
              </p>

              <div className={styles.actions}>
                <Link
                  to={`/claims/${claim.id}`}
                  className={styles.detailsBtn}
                >
                  Details
                </Link>

                {claim.status === "pending" && (
                  <button
                    className={styles.withdrawBtn}
                    onClick={() => handleWithdraw(claim.id)}
                  >
                    Withdraw Claim
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

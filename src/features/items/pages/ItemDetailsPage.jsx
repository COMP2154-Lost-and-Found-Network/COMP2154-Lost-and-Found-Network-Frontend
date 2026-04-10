import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PageContainer from "../../../components/ui/PageContainer";
import { useAuth } from "../../../context/useAuth";
import * as itemsApi from "../api/itemsApi";
import * as claimsApi from "../../claims/api/claimsApi";
import StatusPill from "../components/StatusPill";
import styles from "../styles/itemDetails.module.css";

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ItemDetailsPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [myClaim, setMyClaim] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadItem() {
      try {
        setError("");
        const data = await itemsApi.getItemById(itemId);
        setItem(data);

        // Check if the logged-in user has a claim on this item
        if (user?.id) {
          try {
            const claims = await claimsApi.listMyClaims(user.id);
            const match = (Array.isArray(claims) ? claims : []).find(
              (c) => String(c.item_id) === String(itemId)
            );
            if (match) setMyClaim(match);
          } catch {
            // silently fail — claim check is supplementary
          }
        }
      } catch (e) {
        setError(e.message || "Failed to load item");
      }
    }
    loadItem();
  }, [itemId, user?.id]);

  if (error) {
    return (
      <PageContainer>
        <p style={{ color: "crimson" }}>{error}</p>
      </PageContainer>
    );
  }

  if (!item) {
    return (
      <PageContainer>
        <p>Loading...</p>
      </PageContainer>
    );
  }

  const isOwner = item.user_id === user?.id;
  const typeLabel = item.type
    ? item.type.charAt(0).toUpperCase() + item.type.slice(1).toLowerCase()
    : null;
  const isLost = item.type?.toLowerCase() === "lost";

  const rawUrl = item.imageUrl || item.image_url || null;
  const imageSrc = rawUrl && rawUrl.startsWith("http")
    ? rawUrl
    : rawUrl
      ? `${import.meta.env.VITE_API_BASE_URL}${rawUrl}`
      : null;

  return (
    <PageContainer>
      <div className={styles.wrapper}>
        <button onClick={() => navigate(-1)} className={styles.backLink}>&larr; Back</button>

        <div
          className={styles.card}
          style={{ borderTop: `3px solid ${isLost ? "#dc2626" : "#16a34a"}` }}
        >
          {/* Header */}
          <div className={styles.header}>
            <div>
              {typeLabel && (
                <span className={isLost ? styles.typeLost : styles.typeFound}>
                  {typeLabel}
                </span>
              )}
              <h1 className={styles.title}>{item.title}</h1>
            </div>
            <StatusPill status={item.status} />
          </div>

          {/* Body — two columns if image, single column if not */}
          <div className={imageSrc ? styles.body : styles.bodySingle}>
            {imageSrc && (
              <div className={styles.imageCol}>
                <img src={imageSrc} alt={item.title} className={styles.image} />
              </div>
            )}

            <div className={styles.infoCol}>
              <p className={styles.description}>{item.description}</p>

              <div className={styles.metaGrid}>
                {item.category && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Category</span>
                    <span className={styles.metaValue}>{item.category}</span>
                  </div>
                )}
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>{isLost ? "Date Lost" : "Date Found"}</span>
                  <span className={styles.metaValue}>{formatDate(item.date)}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Location</span>
                  <span className={styles.metaValue}>{item.location || "N/A"}</span>
                </div>
                {item.location_details && (
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Specific Details</span>
                    <span className={styles.metaValue}>{item.location_details}</span>
                  </div>
                )}
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Reported</span>
                  <span className={styles.metaValue}>{formatDate(item.created_at)}</span>
                </div>
              </div>

              {/* User's claim status on this item */}
              {myClaim && (
                <div style={{
                  padding: "14px 16px",
                  borderRadius: 10,
                  background: myClaim.status === "approved" ? "#f0fdf4"
                    : myClaim.status === "rejected" ? "#fef2f2"
                      : "#eff6ff",
                  border: `1px solid ${myClaim.status === "approved" ? "#86efac"
                    : myClaim.status === "rejected" ? "#fecaca"
                      : "#bfdbfe"}`,
                }}>
                  <p style={{ margin: "0 0 4px", fontWeight: 600, fontSize: 14, color: "#111827" }}>
                    Your claim: {myClaim.status.charAt(0).toUpperCase() + myClaim.status.slice(1)}
                  </p>
                  {myClaim.status === "rejected" && myClaim.reporter_feedback && (
                    <p style={{ margin: 0, fontSize: 14, color: "#374151" }}>
                      Feedback: {myClaim.reporter_feedback}
                    </p>
                  )}
                  <Link
                    to={`/claims/${myClaim.id}`}
                    style={{ fontSize: 13, fontWeight: 600, color: "#2563eb", textDecoration: "none", marginTop: 8, display: "inline-block" }}
                  >
                    View Claim Details
                  </Link>
                </div>
              )}

              {/* Actions */}
              <div className={styles.actions}>
                {item.type?.toLowerCase() === "found" && !isOwner && item.status?.toLowerCase() === "active" && !myClaim && (
                  <button
                    className={styles.claimBtn}
                    onClick={() => navigate(`/items/${itemId}/claim`)}
                  >
                    Claim This Item
                  </button>
                )}

                {item.type?.toLowerCase() === "found" && !isOwner && item.status?.toLowerCase() === "active" && myClaim && (
                  <button
                    className={styles.editBtn}
                    disabled
                    style={{ opacity: 0.7, cursor: "not-allowed" }}
                  >
                    You submitted a claim
                  </button>
                )}

                {isOwner && (item.status?.toLowerCase() === "active" || user?.role?.toLowerCase() === "admin") && (
                  <Link to={`/items/${item.id}/edit`} className={styles.editBtn}>
                    Edit Item
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

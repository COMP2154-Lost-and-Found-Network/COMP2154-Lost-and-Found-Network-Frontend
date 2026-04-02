import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageContainer from "../../../components/ui/PageContainer";
import { useAuth } from "../../../context/useAuth";
import * as claimsApi from "../api/claimsApi";
import ClaimForm from "../components/ClaimForm";
import { validateClaimForm } from "../utils/claimValidation";
import { getToken } from "../../../services/authStorage";
import styles from "../styles/claimSubmitPage.module.css";

export default function ClaimSubmitPage() {
  const { itemId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [verificationDetails, setVerificationDetails] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedClaimId, setSubmittedClaimId] = useState(null);

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateClaimForm({ verification_details: verificationDetails });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setErrors({});
      setSubmitError("");
      setIsSubmitting(true);

      let image_url = null;
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const uploadRes = await fetch(`${BASE_URL}/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` },
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error("We couldn't upload your image right now. Please try again or submit without an image.");
        image_url = uploadData.url;
      }

      const claim = await claimsApi.submitClaim(
        itemId,
        { verification_details: verificationDetails, image_url },
        user.id
      );

      setSubmittedClaimId(claim.id);
    } catch (e) {
      setSubmitError(e.message || "Failed to submit claim");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submittedClaimId) {
    return (
      <div style={pageStyles.page}>
        <div style={pageStyles.successCard}>
          <div style={pageStyles.checkCircle}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <h1 style={pageStyles.successTitle}>Claim Submitted!</h1>
          <p style={pageStyles.successText}>
            Your claim has been submitted successfully. You'll be notified once it's reviewed.
          </p>

          <div style={pageStyles.successActions}>
            <button
              style={pageStyles.primaryBtn}
              onClick={() => navigate(`/claims/${submittedClaimId}`)}
            >
              View My Claim
            </button>
            <Link to="/claims" style={pageStyles.outlineBtn}>
              All My Claims
            </Link>
            <Link to={`/items/${itemId}`} style={pageStyles.outlineBtn}>
              Back to Item
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageContainer>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h1 className={styles.title}>Submit a Claim</h1>
          <p className={styles.subtitle}>Item #{itemId}</p>

          {submitError && <p className={styles.error}>{submitError}</p>}

          <ClaimForm
            value={verificationDetails}
            onChange={setVerificationDetails}
            error={errors.verification_details}
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/items/${itemId}`)}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </PageContainer>
  );
}

const pageStyles = {
  page: {
    maxWidth: 700,
    margin: "0 auto",
    padding: "32px 16px",
  },
  successCard: {
    background: "#fff",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: "48px 24px",
    textAlign: "center",
    marginTop: 32,
  },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    border: "3px solid #16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 800,
    margin: "0 0 12px",
  },
  successText: {
    color: "#6b7280",
    fontSize: 15,
    margin: "0 0 28px",
    lineHeight: 1.5,
  },
  successActions: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  primaryBtn: {
    display: "inline-block",
    padding: "10px 20px",
    background: "#2563eb",
    color: "white",
    borderRadius: 6,
    border: "none",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
  outlineBtn: {
    display: "inline-block",
    padding: "10px 20px",
    background: "white",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    textDecoration: "none",
    fontWeight: 600,
    fontSize: 14,
  },
};

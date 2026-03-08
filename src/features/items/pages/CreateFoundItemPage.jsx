import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ItemForm from "../components/ItemForm/ItemForm";
import useItemForm from "../hooks/useItemForm";
import { createItem } from "../api/itemsApi";

export default function CreateFoundItemPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  async function handleFormSubmit(values) {
    await createItem({ ...values, type: "FOUND" });
    setSubmitted(true);
  }

  const { values, errors, formError, submitting, onFieldChange, handleSubmit } =
    useItemForm(handleFormSubmit, { imageRequired: true });

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.successCard}>
          <div style={styles.checkCircle}>
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

          <h1 style={styles.successTitle}>Submission Successful!</h1>
          <p style={styles.successText}>
            Your found item report has been submitted successfully. We'll notify
            you if the owner comes forward.
          </p>

          <div style={styles.successActions}>
            <Link to="/items" style={styles.primaryBtn}>
              View Found Items
            </Link>
            <Link to="/items/report-found" style={styles.outlineBtn} onClick={(e) => {
              e.preventDefault();
              setSubmitted(false);
            }}>
              Report Another Item
            </Link>
            <Link to="/profile" style={styles.outlineBtn}>
              Go to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Report Found Item</h1>
      <div style={styles.card}>
        <ItemForm
          values={values}
          errors={errors}
          formError={formError}
          submitting={submitting}
          onFieldChange={onFieldChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/items")}
          dateLabel="Date Found"
          imageRequired
        />
      </div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "32px 16px",
  },
  heading: {
    fontSize: 28,
    fontWeight: 800,
    marginTop: 0,
    marginBottom: 24,
  },
  card: {
    background: "#fff",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: 24,
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
    textDecoration: "none",
    fontWeight: 600,
    fontSize: 14,
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

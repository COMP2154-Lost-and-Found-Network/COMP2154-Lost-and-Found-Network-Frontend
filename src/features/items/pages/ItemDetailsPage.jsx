import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PageContainer from "../../../components/ui/PageContainer";
import * as itemsApi from "../api/itemsApi";
import StatusPill from "../components/StatusPill";
import styles from "../styles/itemDetails.module.css";

export default function ItemDetailsPage() {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadItem() {
      try {
        setError("");
        const data = await itemsApi.getItemById(itemId);
        setItem(data);
      } catch (e) {
        setError(e.message || "Failed to load item");
      }
    }

    loadItem();
  }, [itemId]);

  function handleClaim() {
    alert("Claim item button does nothing for now.");
  }

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

  return (
    <PageContainer>
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>{item.title}</h1>
            <StatusPill status={item.status} />
          </div>

          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className={styles.image}
            />
          ) : (
            <div className={styles.placeholder}>No Image</div>
          )}

          <p className={styles.description}>{item.description}</p>

          <div className={styles.details}>
            <div>
              <strong>Date:</strong> {item.date}
            </div>
            <div>
              <strong>Location:</strong> {item.location}
            </div>
            <div>
              <strong>Status:</strong> {item.status}
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.claimBtn} onClick={handleClaim}>
              Claim Item
            </button>

            <Link to={`/items/${item.id}/edit`} className={styles.editBtn}>
              Edit
            </Link>

            <Link to="/items" className={styles.backLink}>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
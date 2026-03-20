import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageContainer from "../../../components/ui/PageContainer";
import * as itemsApi from "../api/itemsApi";
import styles from "../styles/editItem.module.css";

export default function EditItemPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [locationId, setLocationId] = useState("");
  const [locationDetails, setLocationDetails] = useState("");
  const [status, setStatus] = useState("active");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const LOCATIONS = [
    { id: 1, name: "St. James – Building A (Main)" },
    { id: 2, name: "St. James – Building B" },
    { id: 3, name: "St. James – Library" },
    { id: 4, name: "Casa Loma – Building C" },
    { id: 5, name: "Casa Loma – Building H (Gym)" },
    { id: 6, name: "Waterfront – Building W" },
  ];

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadItem() {
      try {
        setError("");
        const item = await itemsApi.getItemById(itemId);

        setTitle(item.title || "");
        setDescription(item.description || "");
        setDate(item.date ? new Date(item.date).toISOString().split("T")[0] : "");
        setLocationId(item.location_id || "");
        setLocationDetails(item.location_details || "");
        setStatus(item.status || "active");
        setImageUrl(item.imageUrl || "");
      } catch (e) {
        setError(e.message || "Failed to load item");
      } finally {
        setIsLoading(false);
      }
    }

    loadItem();
  }, [itemId]);

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    // Temporary local preview for frontend/mock mode
    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");

      await itemsApi.updateItem(itemId, {
        title,
        description,
        date,
        location_id: locationId,
        location: locationDetails,
        status,
        imageFile,
      });

      navigate(`/items/${itemId}`);
    } catch (e) {
      setError(e.message || "Failed to update item");
    }
  }

  if (isLoading) {
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
          <h1 className={styles.title}>Edit Item</h1>

          {error ? <p className={styles.error}>{error}</p> : null}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>Title</label>
              <input
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Date</label>
              <input
                className={styles.input}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Location</label>
              <select
                className={styles.select}
                value={locationId}
                onChange={(e) => setLocationId(Number(e.target.value) || "")}
              >
                <option value="">Select a location</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Specific Details</label>
              <input
                className={styles.input}
                placeholder="e.g. Bathroom, Room 301, Cafeteria..."
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Status</label>
              <select
                className={styles.select}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="active">ACTIVE</option>
                <option value="claimed">CLAIMED</option>
                <option value="expired">EXPIRED</option>
                <option value="archived">ARCHIVED</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Image</label>

              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className={styles.previewImage}
                />
              ) : (
                <div className={styles.noImage}>No Image</div>
              )}

              <input
                className={styles.fileInput}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className={styles.actions}>
              <button className={styles.saveBtn} type="submit">
                Save Changes
              </button>

              <Link to={`/items/${itemId}`} className={styles.cancelBtn}>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}
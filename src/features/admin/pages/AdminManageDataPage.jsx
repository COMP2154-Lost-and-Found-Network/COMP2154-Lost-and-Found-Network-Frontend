import { useEffect, useState } from "react";
import PageContainer from "../../../components/ui/PageContainer";
import * as adminApi from "../api/adminApi";
import styles from "../styles/adminManageDataPage.module.css";

const CAMPUS_OPTIONS = ["St. James", "Casa Loma", "Waterfront", "Online"];

export default function AdminManageDataPage() {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryIsActive, setCategoryIsActive] = useState(true);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const [campus, setCampus] = useState("St. James");
  const [buildingName, setBuildingName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [editingLocationId, setEditingLocationId] = useState(null);

  const [categoryFormError, setCategoryFormError] = useState("");
  const [locationFormError, setLocationFormError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setError("");

        const [categoriesData, locationsData] = await Promise.all([
          adminApi.listCategories(),
          adminApi.listLocations(),
        ]);

        setCategories(categoriesData);
        setLocations(locationsData);
      } catch (e) {
        setError(e.message || "Failed to load admin data");
      }
    }

    load();
  }, []);

  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [successMessage]);

  async function refresh() {
    try {
      setError("");

      const [categoriesData, locationsData] = await Promise.all([
        adminApi.listCategories(),
        adminApi.listLocations(),
      ]);

      setCategories(categoriesData);
      setLocations(locationsData);
    } catch (e) {
      setError(e.message || "Failed to refresh data");
    }
  }

  async function handleCategorySubmit(e) {
    e.preventDefault();
    setCategoryFormError("");

    if (!categoryName.trim() || !categoryDescription.trim()) {
      setCategoryFormError("Please fill in all category fields.");
      return;
    }

    const payload = {
      name: categoryName.trim(),
      description: categoryDescription.trim(),
      is_active: categoryIsActive,
    };

    try {
      if (editingCategoryId) {
        await adminApi.updateCategory(editingCategoryId, payload);
        setSuccessMessage("Category updated successfully.");
      } else {
        await adminApi.addCategory(payload);
        setSuccessMessage("Category added successfully.");
      }

      resetCategoryForm();
      await refresh();
    } catch (e) {
      setError(e.message || "Failed to save category");
    }
  }

  async function handleDeactivateCategory(categoryId) {
    try {
      await adminApi.deactivateCategory(categoryId);
      setSuccessMessage("Category deactivated successfully.");
      await refresh();
    } catch (e) {
      setError(e.message || "Failed to deactivate category");
    }
  }

  async function handleActivateCategory(categoryId) {
    try {
      await adminApi.activateCategory(categoryId);
      setSuccessMessage("Category activated successfully.");
      await refresh();
    } catch (e) {
      setError(e.message || "Failed to activate category");
    }
  }

  function startEditCategory(category) {
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
    setCategoryDescription(category.description || "");
    setCategoryIsActive(category.is_active);
    setCategoryFormError("");
  }

  function resetCategoryForm() {
    setEditingCategoryId(null);
    setCategoryName("");
    setCategoryDescription("");
    setCategoryIsActive(true);
    setCategoryFormError("");
  }

  async function handleLocationSubmit(e) {
    e.preventDefault();
    setLocationFormError("");

    if (!campus.trim() || !buildingName.trim() || !displayName.trim()) {
      setLocationFormError("Please fill in all required location fields.");
      return;
    }

    const payload = {
      campus: campus.trim(),
      building_name: buildingName.trim(),
      room_number: roomNumber.trim(),
      display_name: displayName.trim(),
      is_active: isActive,
    };

    try {
      if (editingLocationId) {
        await adminApi.updateLocation(editingLocationId, payload);
        setSuccessMessage("Location updated successfully.");
      } else {
        await adminApi.addLocation(payload);
        setSuccessMessage("Location added successfully.");
      }

      resetLocationForm();
      await refresh();
    } catch (e) {
      setError(e.message || "Failed to save location");
    }
  }

  async function handleDeactivateLocation(locationId) {
    try {
      await adminApi.deactivateLocation(locationId);
      setSuccessMessage("Location deactivated successfully.");
      await refresh();
    } catch (e) {
      setError(e.message || "Failed to deactivate location");
    }
  }

  async function handleActivateLocation(locationId) {
    try {
      await adminApi.activateLocation(locationId);
      setSuccessMessage("Location activated successfully.");
      await refresh();
    } catch (e) {
      setError(e.message || "Failed to activate location");
    }
  }

  function startEditLocation(location) {
    setEditingLocationId(location.id);
    setCampus(location.campus);
    setBuildingName(location.building_name);
    setRoomNumber(location.room_number || "");
    setDisplayName(location.display_name);
    setIsActive(location.is_active);
    setLocationFormError("");
  }

  function resetLocationForm() {
    setEditingLocationId(null);
    setCampus("St. James");
    setBuildingName("");
    setRoomNumber("");
    setDisplayName("");
    setIsActive(true);
    setLocationFormError("");
  }

  return (
    <PageContainer>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Manage Categories & Locations</h1>

        {error ? <p className={styles.error}>{error}</p> : null}
        {successMessage ? <div className={styles.toast}>{successMessage}</div> : null}

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Categories</h2>

            <form className={styles.form} onSubmit={handleCategorySubmit}>
              <div className={styles.field}>
                <label className={styles.label}>Name</label>
                <input
                  className={styles.input}
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Description</label>
                <textarea
                  className={styles.textarea}
                  value={categoryDescription}
                  onChange={(e) => setCategoryDescription(e.target.value)}
                />
              </div>

              <div className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={categoryIsActive}
                  onChange={(e) => setCategoryIsActive(e.target.checked)}
                />
                <span>Active</span>
              </div>

              {categoryFormError ? (
                <p className={styles.formError}>{categoryFormError}</p>
              ) : null}

              <div className={styles.actions}>
                <button className={styles.primaryBtn} type="submit">
                  {editingCategoryId ? "Update Category" : "Add Category"}
                </button>

                {editingCategoryId && (
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={resetCategoryForm}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            <div className={styles.list}>
              {categories.map((category) => (
                <div key={category.id} className={styles.listItem}>
                  <div className={styles.itemContent}>
                    <p className={styles.itemTitle}>{category.name}</p>
                    <p className={styles.itemMeta}>{category.description}</p>
                    <p className={styles.itemMeta}>
                      Status: {category.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>

                  <div className={styles.itemActions}>
                    <button
                      className={styles.secondaryBtn}
                      onClick={() => startEditCategory(category)}
                    >
                      Edit
                    </button>

                    {category.is_active ? (
                      <button
                        className={styles.warningBtn}
                        onClick={() => handleDeactivateCategory(category.id)}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        className={styles.activateBtn}
                        onClick={() => handleActivateCategory(category.id)}
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Locations</h2>

            <form className={styles.form} onSubmit={handleLocationSubmit}>
              <div className={styles.field}>
                <label className={styles.label}>Campus</label>
                <select
                  className={styles.input}
                  value={campus}
                  onChange={(e) => setCampus(e.target.value)}
                >
                  {CAMPUS_OPTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Building Name</label>
                <input
                  className={styles.input}
                  value={buildingName}
                  onChange={(e) => setBuildingName(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Room Number</label>
                <input
                  className={styles.input}
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Display Name</label>
                <input
                  className={styles.input}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <span>Active</span>
              </div>

              {locationFormError ? (
                <p className={styles.formError}>{locationFormError}</p>
              ) : null}

              <div className={styles.actions}>
                <button className={styles.primaryBtn} type="submit">
                  {editingLocationId ? "Update Location" : "Add Location"}
                </button>

                {editingLocationId && (
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={resetLocationForm}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            <div className={styles.list}>
              {locations.map((location) => (
                <div key={location.id} className={styles.listItem}>
                  <div className={styles.itemContent}>
                    <p className={styles.itemTitle}>{location.display_name}</p>
                    <p className={styles.itemMeta}>
                      {location.campus} • {location.building_name}
                      {location.room_number ? ` • ${location.room_number}` : ""}
                    </p>
                    <p className={styles.itemMeta}>
                      Status: {location.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>

                  <div className={styles.itemActions}>
                    <button
                      className={styles.secondaryBtn}
                      onClick={() => startEditLocation(location)}
                    >
                      Edit
                    </button>

                    {location.is_active ? (
                      <button
                        className={styles.warningBtn}
                        onClick={() => handleDeactivateLocation(location.id)}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        className={styles.activateBtn}
                        onClick={() => handleActivateLocation(location.id)}
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}

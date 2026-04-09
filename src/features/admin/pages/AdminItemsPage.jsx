import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import http from "../../../services/httpClient";
import { getToken } from "../../../services/authStorage";
import styles from "../styles/adminItemsPage.module.css";

function formatDate(dateValue) {
  if (!dateValue) return "N/A";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function typeBadge(type) {
  const t = (type || "").toLowerCase();
  return `${styles.badge} ${t === "lost" ? styles.badgeLost : styles.badgeFound}`;
}

function statusBadge(status) {
  const s = (status || "").toLowerCase();
  const map = {
    active: styles.badgeActive,
    claimed: styles.badgeClaimed,
    archived: styles.badgeArchived,
    escalated: styles.badgeEscalated,
  };
  return `${styles.badge} ${map[s] || ""}`;
}

export default function AdminItemsPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [selectedItem, setSelectedItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const [itemsData, categoriesData, locationsData] = await Promise.all([
          http.get("/admin/items", { token: getToken() }),
          http.get("/categories", { token: getToken() }),
          http.get("/locations", { token: getToken() }),
        ]);

        setItems(
          Array.isArray(itemsData) ? itemsData
            : Array.isArray(itemsData?.data) ? itemsData.data
              : []
        );
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setLocations(Array.isArray(locationsData) ? locationsData : locationsData?.data || []);
      } catch (err) {
        setError(err.message || "Failed to load items.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const categoryMap = useMemo(() => {
    return categories.reduce((acc, c) => { acc[c.id] = c.name; return acc; }, {});
  }, [categories]);

  const normalizedItems = useMemo(() => {
    return items.map((item) => ({
      ...item,
      category_name: item.category_name || item.category || categoryMap[item.category_id] || "Uncategorized",
      display_type: (item.type || "unknown").toLowerCase(),
      display_status: (item.status || "unknown").toLowerCase(),
      display_location: item.location || item.location_details || item.display_name || "N/A",
    }));
  }, [items, categoryMap]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return normalizedItems.filter((item) => {
      const matchesSearch = !q
        || (item.title || "").toLowerCase().includes(q)
        || (item.description || "").toLowerCase().includes(q)
        || (item.display_location || "").toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || item.display_status === statusFilter;
      const matchesType = typeFilter === "all" || item.display_type === typeFilter;
      const matchesCategory = categoryFilter === "all" || item.category_name === categoryFilter;
      return matchesSearch && matchesStatus && matchesType && matchesCategory;
    });
  }, [normalizedItems, search, statusFilter, typeFilter, categoryFilter]);

  function handleOpenEdit(item) {
    setSelectedItem({
      ...item,
      category_id: item.category_id || "",
      location_id: item.location_id || "",
      type: item.display_type === "unknown" ? "lost" : item.display_type,
      status: item.display_status === "unknown" ? "active" : item.display_status,
      location_details: item.location_details || "",
    });
    setShowEditModal(true);
  }

  async function handleSaveEdit() {
    if (!selectedItem) return;
    setIsSaving(true);
    try {
      await http.put(
        `/admin/item/${selectedItem.id}`,
        {
          title: selectedItem.title,
          description: selectedItem.description,
          date: selectedItem.date ? String(selectedItem.date).slice(0, 10) : null,
          category_id: Number(selectedItem.category_id) || null,
          location_id: Number(selectedItem.location_id) || null,
          type: selectedItem.type,
          status: selectedItem.status,
          location_details: selectedItem.location_details || "",
        },
        { token: getToken() }
      );
      // Refresh list
      const refreshed = await http.get("/admin/items", { token: getToken() });
      setItems(Array.isArray(refreshed) ? refreshed : refreshed?.data || []);
      setShowEditModal(false);
      setSelectedItem(null);
    } catch (err) {
      alert(err.message || "Failed to update item.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(itemId) {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await http.delete(`/admin/item/${itemId}`, { token: getToken() });
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      alert(err.message || "Failed to delete item.");
    }
  }

  if (loading) {
    return <div className={styles.page}><p>Loading items...</p></div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Manage Items</h1>
          <p className={styles.subtitle}>Review, edit, and remove item listings.</p>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <input
        type="text"
        placeholder="Search by title, description, or location..."
        className={styles.searchInput}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className={styles.filters}>
        <select className={styles.select} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="claimed">Claimed</option>
          <option value="archived">Archived</option>
        </select>

        <select className={styles.select} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <select className={styles.select} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      <p className={styles.count}>
        Showing {filteredItems.length} of {normalizedItems.length} items
      </p>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Type</th>
            <th>Status</th>
            <th>Date</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length === 0 ? (
            <tr>
              <td colSpan="7" className={styles.emptyRow}>No items found.</td>
            </tr>
          ) : (
            filteredItems.map((item) => (
              <tr key={item.id}>
                <td data-label="Title">
                  <Link to={`/items/${item.id}`} className={styles.itemTitle}>{item.title || "Untitled"}</Link>
                </td>
                <td data-label="Category">{item.category_name}</td>
                <td data-label="Type">
                  <span className={typeBadge(item.display_type)}>{item.display_type}</span>
                </td>
                <td data-label="Status">
                  <span className={statusBadge(item.display_status)}>{item.display_status}</span>
                </td>
                <td data-label="Date">{formatDate(item.date)}</td>
                <td data-label="Location">{item.display_location}</td>
                <td data-label="Actions">
                  <div className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => handleOpenEdit(item)} title="Edit">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(item.id)} title="Delete">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showEditModal && selectedItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2>Edit Item</h2>

            <div className={styles.modalForm}>
              <div className={styles.field}>
                <label className={styles.label}>Title</label>
                <input
                  className={styles.input}
                  value={selectedItem.title || ""}
                  onChange={(e) => setSelectedItem({ ...selectedItem, title: e.target.value })}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Description</label>
                <textarea
                  className={styles.input}
                  value={selectedItem.description || ""}
                  onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
                  rows={3}
                  style={{ resize: "vertical", minHeight: 80 }}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Category</label>
                <select
                  className={styles.input}
                  value={selectedItem.category_id || ""}
                  onChange={(e) => setSelectedItem({ ...selectedItem, category_id: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Location</label>
                <select
                  className={styles.input}
                  value={selectedItem.location_id || ""}
                  onChange={(e) => setSelectedItem({ ...selectedItem, location_id: e.target.value })}
                >
                  <option value="">Select Location</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>{l.display_name || l.name || `Location ${l.id}`}</option>
                  ))}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Date</label>
                <input
                  className={styles.input}
                  type="date"
                  value={selectedItem.date ? String(selectedItem.date).slice(0, 10) : ""}
                  onChange={(e) => setSelectedItem({ ...selectedItem, date: e.target.value })}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Type</label>
                <select
                  className={styles.input}
                  value={selectedItem.type || "lost"}
                  onChange={(e) => setSelectedItem({ ...selectedItem, type: e.target.value })}
                >
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Status</label>
                <select
                  className={styles.input}
                  value={selectedItem.status || "active"}
                  onChange={(e) => setSelectedItem({ ...selectedItem, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="claimed">Claimed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => { setShowEditModal(false); setSelectedItem(null); }}>
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleSaveEdit} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

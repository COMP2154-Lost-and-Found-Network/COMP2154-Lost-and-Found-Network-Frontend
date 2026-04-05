import { useEffect, useMemo, useState } from "react";
import http from "../../../services/httpClient";
import { getToken } from "../../../services/authStorage";

function formatDate(dateValue) {
  if (!dateValue) return "N/A";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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
          Array.isArray(itemsData)
            ? itemsData
            : Array.isArray(itemsData?.data)
              ? itemsData.data
              : Array.isArray(itemsData?.items)
                ? itemsData.items
                : []
        );

        setCategories(
          Array.isArray(categoriesData)
            ? categoriesData
            : Array.isArray(categoriesData?.categories)
              ? categoriesData.categories
              : []
        );

        setLocations(
          Array.isArray(locationsData)
            ? locationsData
            : Array.isArray(locationsData?.locations)
              ? locationsData.locations
              : Array.isArray(locationsData?.data)
                ? locationsData.data
                : []
        );
      } catch (err) {
        setError(err.message || "Failed to load admin items.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const categoryMap = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  }, [categories]);

  const normalizedItems = useMemo(() => {
    return items.map((item) => ({
      ...item,
      category_name:
        item.category_name ||
        item.category ||
        categoryMap[item.category_id] ||
        "Uncategorized",
      display_type: item.type ? item.type.toLowerCase() : "unknown",
      display_status: item.status ? item.status.toLowerCase() : "unknown",
      display_location:
        item.location || item.location_details || item.display_name || "N/A",
    }));
  }, [items, categoryMap]);

  const filteredItems = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return normalizedItems.filter((item) => {
      const matchesSearch =
        !searchValue ||
        (item.title || "").toLowerCase().includes(searchValue) ||
        (item.description || "").toLowerCase().includes(searchValue) ||
        (item.display_location || "").toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" || item.display_status === statusFilter;

      const matchesType =
        typeFilter === "all" || item.display_type === typeFilter;

      const matchesCategory =
        categoryFilter === "all" || item.category_name === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesCategory
      );
    });
  }, [normalizedItems, search, statusFilter, typeFilter, categoryFilter]);

  function handleOpenEdit(item) {
    setSelectedItem({
      ...item,
      category_id: item.category_id || "",
      location_id: item.location_id || "",
      type: item.display_type === "unknown" ? "lost" : item.display_type,
      status:
        item.display_status === "unknown" ? "active" : item.display_status,
      location_details: item.location_details || item.display_location || "",
    });
    setShowEditModal(true);
  }

  function handleCloseEdit() {
    setShowEditModal(false);
    setSelectedItem(null);
  }

  async function handleSaveEdit() {
    if (!selectedItem) return;

    setIsSaving(true);
    try {
      const updated = await http.put(
        `/admin/item/${selectedItem.id}`,
        {
          title: selectedItem.title,
          description: selectedItem.description,
          date: selectedItem.date
            ? String(selectedItem.date).slice(0, 10)
            : null,
          category_id: Number(selectedItem.category_id) || null,
          location_id: Number(selectedItem.location_id) || null,
          type: selectedItem.type,
          status: selectedItem.status,
          location_details: selectedItem.location_details || "",
        },
        { token: getToken() }
      );

      const selectedCategory = categories.find(
        (category) => Number(category.id) === Number(selectedItem.category_id)
      );
      const selectedLocation = locations.find(
        (location) => Number(location.id) === Number(selectedItem.location_id)
      );

      const mergedUpdatedItem = {
        ...updated,
        ...selectedItem,
        category_id: Number(selectedItem.category_id) || null,
        location_id: Number(selectedItem.location_id) || null,
        category:
          selectedCategory?.name ||
          updated?.category ||
          selectedItem.category_name ||
          "Uncategorized",
        location:
          selectedLocation?.display_name ||
          selectedLocation?.name ||
          updated?.location ||
          selectedItem.display_location ||
          "N/A",
      };

      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...item, ...mergedUpdatedItem } : item
        )
      );
      handleCloseEdit();
    } catch (err) {
      alert(err.message || "Failed to update item.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(itemId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmed) return;

    try {
      await http.delete(`/admin/item/${itemId}`, { token: getToken() });
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      alert(err.message || "Failed to delete item.");
    }
  }

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading admin items...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin: Manage Items</h1>
      <p style={{ marginTop: "4px", color: "#4b5563" }}>
        Review, edit, and remove item listings.
      </p>

      {error && (
        <div
          style={{
            marginTop: "16px",
            marginBottom: "16px",
            padding: "12px 14px",
            borderRadius: "10px",
            background: "#fee2e2",
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search by title, description, or location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="claimed">Claimed</option>
          <option value="archived">Archived</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <table border="1" cellPadding="10" style={{ width: "100%" }}>
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
              <td colSpan="7" style={{ textAlign: "center" }}>
                No items found.
              </td>
            </tr>
          ) : (
            filteredItems.map((item) => (
              <tr key={item.id}>
                <td>{item.title || "Untitled"}</td>
                <td>{item.category_name}</td>
                <td>{item.display_type}</td>
                <td>{item.display_status}</td>
                <td>{formatDate(item.date)}</td>
                <td>{item.display_location}</td>
                <td>
                  <button onClick={() => handleOpenEdit(item)}>Edit</button>
                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showEditModal && selectedItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "520px",
            }}
          >
            <h2>Edit Item</h2>

            <div style={{ display: "grid", gap: "12px" }}>
              <input
                type="text"
                value={selectedItem.title || ""}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, title: e.target.value })
                }
                placeholder="Title"
              />

              <textarea
                value={selectedItem.description || ""}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    description: e.target.value,
                  })
                }
                placeholder="Description"
                rows={4}
              />

              <select
                value={selectedItem.location_id || ""}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    location_id: e.target.value,
                  })
                }
              >
                <option value="">Select Location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.display_name || location.name || `Location ${location.id}`}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={selectedItem.location_details || ""}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    location_details: e.target.value,
                  })
                }
                placeholder="Location details"
              />

              <input
                type="date"
                value={selectedItem.date ? String(selectedItem.date).slice(0, 10) : ""}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, date: e.target.value })
                }
              />

              <select
                value={selectedItem.category_id || ""}
                onChange={(e) =>
                  setSelectedItem({
                    ...selectedItem,
                    category_id: e.target.value,
                  })
                }
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedItem.type || "lost"}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, type: e.target.value })
                }
              >
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>

              <select
                value={selectedItem.status || "active"}
                onChange={(e) =>
                  setSelectedItem({ ...selectedItem, status: e.target.value })
                }
              >
                <option value="active">Active</option>
                <option value="claimed">Claimed</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button onClick={handleCloseEdit}>Cancel</button>
              <button onClick={handleSaveEdit} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
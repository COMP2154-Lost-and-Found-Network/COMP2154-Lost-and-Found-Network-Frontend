import { useEffect, useState } from "react";
import ItemCard from "../components/ItemCard";
import { getToken } from "../../../services/authStorage";
import "../../../styles/BrowsePage.css";

export default function BrowsePage() {
  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedDateFilter, setSelectedDateFilter] = useState("All Dates");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All Types");
  const [selectedCampusFilter, setSelectedCampusFilter] = useState("All Campuses");

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError("");

      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

        if (!apiBaseUrl) {
          throw new Error("API is not set. Check your .env file.");
        }

        const token = getToken();
        const response = await fetch(`${apiBaseUrl}/items`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          throw new Error("Failed to load items.");
        }

        const data = await response.json();
        const rawItems = Array.isArray(data) ? data : data.data || data.items || [];

        const categoryMap = {
          1: "Electronics",
          2: "Clothing",
          3: "Accessories",
          4: "Books & Notes",
          5: "ID & Cards",
          6: "Sports & Gym",
          7: "Other",
        };

        const normalizedItems = rawItems.map((item) => ({
          id: item.id,
          title: item.title || "Untitled Item",
          description: item.description || "",
          location:
            item.location ||
            item.location_details ||
            item.display_name ||
            "Unknown Location",
          campus:
            item.campus ||
            item.campus_name ||
            item.display_name ||
            "Unknown Campus",
          date: item.date || "",
          category:
            item.category ||
            item.category_name ||
            categoryMap[item.category_id] ||
            "Other",
          type: item.type
            ? item.type.charAt(0).toUpperCase() + item.type.slice(1)
            : "Lost",
          status: item.status
            ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
            : "Active",
          imagePreview: item.imagePreview || item.image_url || "",
          image_url: item.image_url || "",
          imageUrl: item.imageUrl || item.image_url || "",
        }));

        setItems(normalizedItems);
      } catch (err) {
        setError(err.message || "Failed to load items.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "All Categories" ||
      item.category === selectedCategory;

    const matchesCampus =
      selectedCampusFilter === "All Campuses" ||
      item.campus === selectedCampusFilter;

    const search = debouncedSearchTerm.toLowerCase();

    const matchesSearch =
      (item.title || "").toLowerCase().includes(search) ||
      (item.description || "").toLowerCase().includes(search) ||
      (item.location || "").toLowerCase().includes(search);

    const itemDate = item.date ? new Date(item.date) : null;
    const now = new Date();
    const diffTime = itemDate ? now - itemDate : null;
    const diffDays = diffTime ? diffTime / (1000 * 60 * 60 * 24) : null;

    const matchesDate =
      selectedDateFilter === "All Dates" ||
      (itemDate && selectedDateFilter === "Last 24 Hours" && diffDays <= 1) ||
      (itemDate && selectedDateFilter === "Last Week" && diffDays <= 7) ||
      (itemDate && selectedDateFilter === "Last Month" && diffDays <= 30);

    const matchesStatus =
      selectedStatusFilter === "All Types" ||
      (item.type || "").toLowerCase() === selectedStatusFilter.toLowerCase();

    return (
      matchesCategory &&
      matchesCampus &&
      matchesSearch &&
      matchesDate &&
      matchesStatus
    );
  });

  return (
    <div className="browse-page">
      {/* Header with title + view toggle */}
      <div className="browse-header">
        <h1>Lost &amp; Found Listings</h1>
        <div className="browse-view-toggle">
          <button
            className={view === "grid" ? "toggle-active" : ""}
            onClick={() => setView("grid")}
          >
            Grid
          </button>
          <button
            className={view === "list" ? "toggle-active" : ""}
            onClick={() => setView("list")}
          >
            List
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="browse-search">
        <input
          type="text"
          placeholder="Search by title, description, or location..."
          className="browse-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Inline filters */}
      <div className="browse-filters">
        <select
          className="browse-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option>All Categories</option>
          <option>Electronics</option>
          <option>Clothing</option>
          <option>Accessories</option>
          <option>Books &amp; Notes</option>
          <option>ID &amp; Cards</option>
          <option>Sports &amp; Gym</option>
          <option>Other</option>
        </select>

        <select
          className="browse-select"
          value={selectedCampusFilter}
          onChange={(e) => setSelectedCampusFilter(e.target.value)}
        >
          <option>All Campuses</option>
          <option>Casa Loma</option>
          <option>St. James</option>
          <option>Waterfront</option>
        </select>

        <select
          className="browse-select"
          value={selectedDateFilter}
          onChange={(e) => setSelectedDateFilter(e.target.value)}
        >
          <option>All Dates</option>
          <option>Last 24 Hours</option>
          <option>Last Week</option>
          <option>Last Month</option>
        </select>

        <select
          className="browse-select"
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
        >
          <option>All Types</option>
          <option>Lost</option>
          <option>Found</option>
        </select>
      </div>

      {/* Items */}
      <div className={`browse-items ${view === "grid" ? "grid-view" : "list-view"}`}>
        {loading ? (
          <p className="browse-loading">Loading items...</p>
        ) : error ? (
          <div className="browse-message-card">{error}</div>
        ) : filteredItems.length === 0 ? (
          <div className="browse-message-card">No items found.</div>
        ) : (
          filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={{ ...item, status: item.status || "active" }}
              readOnly
            />
          ))
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function Navbar() {
  const { user, isAuthed, logout } = useAuth();
  const navigate = useNavigate();
  const [reportOpen, setReportOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = user?.role === "ADMIN";

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setReportOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  return (
    <nav style={styles.nav}>
      {/* Left side */}
      <div style={styles.left}>
        <strong style={styles.brand}>Lost & Found</strong>

        {/* Logged-in user links */}
        {isAuthed && (
          <>
            <Link style={styles.link} to="/items">
              Dashboard
            </Link>

            {/* Report dropdown */}
            <div ref={dropdownRef} style={styles.dropdown}>
              <span
                style={styles.dropdownTrigger}
                onClick={() => setReportOpen((o) => !o)}
              >
                Report ▾
              </span>
              {reportOpen && (
                <div style={styles.dropdownMenu}>
                  <Link
                    style={styles.dropdownItem}
                    to="/items/report-lost"
                    onClick={() => setReportOpen(false)}
                  >
                    Report Lost Item
                  </Link>
                  <Link
                    style={styles.dropdownItem}
                    to="/items/report-found"
                    onClick={() => setReportOpen(false)}
                  >
                    Report Found Item
                  </Link>
                </div>
              )}
            </div>

            <Link style={styles.link} to="/browse">
              Browse Items
            </Link>

            <Link style={styles.link} to="/claims">
              Claims
            </Link>
            <Link style={styles.link} to="/profile">
              Profile
            </Link>
          </>
        )}

        {/* Admin-only links */}
        {isAuthed && isAdmin && (
          <>
            <Link style={styles.link} to="/admin">
              Admin
            </Link>
            <Link style={styles.link} to="/admin/manage-data">
              Manage Data
            </Link>
          </>
        )}
      </div>

      {/* Right side */}
      <div style={styles.right}>
        {!isAuthed ? (
          <>
            <Link style={styles.link} to="/login">
              Login
            </Link>
            <Link style={styles.link} to="/register">
              Register
            </Link>
          </>
        ) : (
          <>
            <span style={styles.userText}>
              {user?.email} ({user?.role})
            </span>
            <button style={styles.logoutBtn} onClick={handleLogout}>
              Log out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: "#2563EB",
    color: "white",
    padding: "14px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    display: "flex",
    gap: 18,
    alignItems: "center",
  },
  right: {
    display: "flex",
    gap: 14,
    alignItems: "center",
  },
  brand: {
    fontSize: 16,
    letterSpacing: 0.3,
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: 500,
  },
  dropdown: {
    position: "relative",
  },
  dropdownTrigger: {
    color: "white",
    fontWeight: 500,
    cursor: "pointer",
    userSelect: "none",
  },
  dropdownMenu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    background: "white",
    borderRadius: 8,
    boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
    minWidth: 180,
    zIndex: 100,
    overflow: "hidden",
  },
  dropdownItem: {
    display: "block",
    padding: "10px 16px",
    color: "#111827",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: 14,
  },
  userText: {
    fontSize: 14,
    opacity: 0.95,
  },
  logoutBtn: {
    background: "white",
    color: "#2563EB",
    border: "none",
    padding: "6px 12px",
    borderRadius: 4,
    cursor: "pointer",
    fontWeight: 600,
  },
};

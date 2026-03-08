import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function Navbar() {
  const { user, isAuthed, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "ADMIN";

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <nav style={styles.nav}>
      {/* Left side */}
      <div style={styles.left}>
        <strong style={styles.brand}>Lost & Found</strong>

        <Link style={styles.link} to="/">
          Browse
        </Link>

        {/* Logged-in user links */}
        {isAuthed && (
          <>
            <Link style={styles.link} to="/items/report-lost">
              Lost Items
            </Link>
            <Link style={styles.link} to="/items/report-found">
              Found Items
            </Link>
            <Link style={styles.link} to="/items">
              Dashboard
            </Link>
            <Link style={styles.link} to="/profile">
              Profile
            </Link>
          </>
        )}

        {/* Admin-only link */}
        {isAuthed && isAdmin && (
          <Link style={styles.link} to="/admin">
            Admin
          </Link>
        )}

        {/* Claims link */}
        {isAuthed && (
          <Link style={styles.link} to="/items">
            Claims
          </Link>
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
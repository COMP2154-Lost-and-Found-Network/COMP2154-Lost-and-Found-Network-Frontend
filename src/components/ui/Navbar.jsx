import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function Navbar() {
  const { isAuthed, user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "ADMIN";
  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        <Link to="/">Browse</Link>
        {isAuthed && <Link to="/profile">Profile</Link>}

        {/* Admin-only links */}
        {isAuthed && isAdmin && (
          <>
            <Link to="/admin">Admin</Link>
            <Link to="/admin/items">Manage Items</Link>
            <Link to="/admin/claims">Manage Claims</Link>
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {isAuthed ? (
          <>
            <span style={{ fontSize: 14 }}>
              {user?.email} ({user?.role})
            </span>
            <button onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
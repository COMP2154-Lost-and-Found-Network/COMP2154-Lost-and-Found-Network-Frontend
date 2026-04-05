import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import styles from "./Navbar.module.css";

const ChevronDown = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ marginLeft: 4, verticalAlign: "middle" }}
  >
    <path d="M3 4.5L6 7.5L9 4.5" />
  </svg>
);

function Dropdown({ label, items, isOpen, onToggle, onClose, dropdownRef, active }) {
  return (
    <div ref={dropdownRef} className={styles.dropdown}>
      <span
        className={`${styles.dropdownTrigger} ${active ? styles.linkActive : ""}`}
        onClick={onToggle}
      >
        {label}
        <ChevronDown />
      </span>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {items.map((item) => (
            <Link
              key={item.to}
              className={styles.dropdownItem}
              to={item.to}
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { user, isAuthed, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [claimsOpen, setClaimsOpen] = useState(false);
  const reportRef = useRef(null);
  const claimsRef = useRef(null);

  const isAdmin = user?.role?.toLowerCase() === "admin";

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (reportRef.current && !reportRef.current.contains(e.target)) {
        setReportOpen(false);
      }
      if (claimsRef.current && !claimsRef.current.contains(e.target)) {
        setClaimsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setReportOpen(false);
    setClaimsOpen(false);
  }, [location.pathname]);

  async function handleLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  function isActivePath(path) {
    if (path === "/items") return location.pathname === "/items";
    return location.pathname === path || location.pathname.startsWith(path + "/");
  }

  function navLink(to, label) {
    return (
      <Link
        className={`${styles.link} ${isActivePath(to) ? styles.linkActive : ""}`}
        to={to}
      >
        {label}
      </Link>
    );
  }

  const initials =
    [user?.first_name?.[0], user?.last_name?.[0]]
      .filter(Boolean)
      .join("")
      .toUpperCase() || "?";

  return (
    <div className={styles.navWrapper}>
      <div className={styles.navBar}>
        <Link to={isAuthed ? "/browse" : "/"} className={styles.brand}>
          Lost &amp; Found
        </Link>

        {/* Hamburger — mobile only */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 12h18" />
              <path d="M3 6h18" />
              <path d="M3 18h18" />
            </svg>
          )}
        </button>

        {/* Links — inline on desktop, slide-down on mobile */}
        <div className={`${styles.links} ${menuOpen ? styles.linksOpen : ""}`}>
          {isAuthed && (
            <>
              {navLink("/items", "Dashboard")}
              {navLink("/browse", "Browse")}

              <Dropdown
                label="Report"
                items={[
                  { to: "/items/report-lost", label: "Report Lost Item" },
                  { to: "/items/report-found", label: "Report Found Item" },
                ]}
                isOpen={reportOpen}
                onToggle={() => { setReportOpen((o) => !o); setClaimsOpen(false); }}
                onClose={() => setReportOpen(false)}
                dropdownRef={reportRef}
                active={location.pathname.startsWith("/items/report")}
              />

              <Dropdown
                label="Claims"
                items={[
                  { to: "/claims", label: "My Claims" },
                  { to: "/claims/inbox", label: "Claims Inbox" },
                ]}
                isOpen={claimsOpen}
                onToggle={() => { setClaimsOpen((o) => !o); setReportOpen(false); }}
                onClose={() => setClaimsOpen(false)}
                dropdownRef={claimsRef}
                active={location.pathname.startsWith("/claims")}
              />

              {isAdmin && navLink("/admin/items", "Admin Items")}
            </>
          )}

          {/* Mobile-only user section */}
          <div className={styles.rightMobile}>
            {!isAuthed ? (
              <>
                <Link className={styles.link} to="/login">Sign In</Link>
                <Link className={styles.registerBtn} to="/register">Register</Link>
              </>
            ) : (
              <>
                <Link to="/profile" className={styles.userArea}>
                  <span className={styles.avatar}>{initials}</span>
                  <span className={styles.userName}>{user?.first_name || "Profile"}</span>
                </Link>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                  Log out
                </button>
              </>
            )}
          </div>
        </div>

        {/* Desktop-only right section */}
        <div className={styles.right}>
          {!isAuthed ? (
            <>
              <Link className={styles.link} to="/login">Sign In</Link>
              <Link className={styles.registerBtn} to="/register">Register</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className={styles.userArea}>
                <span className={styles.avatar}>{initials}</span>
                <span className={styles.userName}>{user?.first_name || "Profile"}</span>
              </Link>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer
      style={{
        background: "#1E40AF",
        color: "white",
        padding: "16px 24px",
        marginTop: "auto",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>© {new Date().getFullYear()} Lost & Found Network</span>

        <div style={{ display: "flex", gap: 16 }}>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </div>
    </footer>
  );
}
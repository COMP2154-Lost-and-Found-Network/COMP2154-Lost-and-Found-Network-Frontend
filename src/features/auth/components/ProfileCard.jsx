export default function ProfileCard({ user }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 12, borderRadius: 8 }}>
      <h3 style={{ marginTop: 0 }}>User Info</h3>
      <p><strong>Name:</strong> {user?.first_name || "—"} {user?.last_name || ""}</p>
      <p><strong>Email:</strong> {user?.email || "—"}</p>
      <p><strong>Role:</strong> {user?.role || "user"}</p>
    </div>
  );
}
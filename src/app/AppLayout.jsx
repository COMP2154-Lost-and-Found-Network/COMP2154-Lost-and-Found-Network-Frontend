import { Outlet } from "react-router-dom";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";

export default function AppLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#F3F4F6",
      }}
    >
      <Navbar />

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
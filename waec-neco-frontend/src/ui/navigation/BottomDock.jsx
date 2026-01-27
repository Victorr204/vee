import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function BottomDock({ user }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMobile) return null; // 🚫 Hide on tablet/desktop

  return (
    <div style={styles.dock}>
      <DockLink to="/" label="Home" active={location.pathname === "/"} />
      <DockLink to="/test" label="Test" active={location.pathname === "/test"} />
      <DockLink to="/community" label="Community" active={location.pathname === "/community"} />
      {user && <DockLink to="/profile" label="Profile" active={location.pathname === "/profile"} />}
    </div>
  );
}

function DockLink({ to, label, active }) {
  return (
    <Link
      to={to}
      style={{
        ...styles.link,
        color: active ? "#10b981" : "#9ca3af",
      }}
    >
      {label}
    </Link>
  );
}

const styles = {
  dock: {
     position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  height: 70,
  background: "#111827",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  borderTop: "1px solid #1f2937",
  zIndex: 1000,
  boxShadow: "0 -2px 10px rgba(0,0,0,0.4)",
  },
  link: {
    textDecoration: "none",
    fontSize: 14,
  },
};

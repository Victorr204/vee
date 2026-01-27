import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";

export default function FloatingNavbar({ user, onLogout }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={styles.navbar}>
      <img src={logo} alt="logo" style={styles.logo} />

      {/* DESKTOP NAVIGATION */}
      {!isMobile && (
        <div style={styles.links}>
          <Link to="/">Home</Link>
          <Link to="/test">Practice Test</Link>
          <Link to="/community">Community</Link>

          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <Link to="/profile">Profile</Link>
              <button onClick={onLogout} style={styles.logoutBtn}>Logout</button>
            </>
          )}
        </div>
      )}

      {/* MOBILE AUTH ONLY */}
      {isMobile && (
        <div style={styles.links}>
          {!user ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <Link to="/profile">Profile</Link>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  navbar: {
     position: "fixed", 
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    background: "#111827",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    zIndex: 1000,
    boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
  },
  logo: { height: 40 },
  links: { display: "flex", gap: 20, alignItems: "center" },
  logoutBtn: {
    background: "transparent",
    border: "1px solid #ef4444",
    color: "#ef4444",
    padding: "6px 12px",
    borderRadius: 6,
    cursor: "pointer",
  },
};

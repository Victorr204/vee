import { useEffect, useState } from "react";

export default function TopNotification() {
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const checkNotice = () => {
      const stored = JSON.parse(localStorage.getItem("top_notification"));
      if (!stored) {
        setNotice(null);
        return;
      }

      if (Date.now() > stored.expiresAt) {
        localStorage.removeItem("top_notification");
        setNotice(null);
        return;
      }

      setNotice(stored);
    };

    checkNotice();

    // Keep checking in case admin deletes or updates it
    const interval = setInterval(checkNotice, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!notice) return null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.marquee}>
        <span style={styles.text}>{notice.message}</span>
        <span style={styles.text}>{notice.message}</span>
      </div>

      <div style={styles.bell}>🔔</div>
    </div>
  );
}
const styles = {
  wrapper: {
    position: "sticky",
    top: 0,
    zIndex: 9999,
    background: "transparent",
    color: "#fafafaff",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    height: 40,
  },

  marquee: {
    display: "flex",
    whiteSpace: "nowrap",
    animation: "scrollLeft 20s linear infinite",
    flex: 1,
  },

  text: {
    paddingRight: 50,
    fontWeight: 600,
  },

  bell: {
    padding: "0 15px",
    fontSize: 18,
    background: "transparent",
    height: "100%",
    display: "flex",
    alignItems: "center",
  },
};

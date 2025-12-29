import { useEffect, useState } from "react";

export default function TopNotification() {
  const [notice, setNotice] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [adBlocked, setAdBlocked] = useState(false);

  useEffect(() => {
    /* -------- Check for stored notification -------- */
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


  /* ---------- ADBLOCK DETECTION ---------- */
  useEffect(() => {
    const bait = document.createElement("div");
    bait.className = "adsbox ad-banner adsbygoogle";
    bait.style.height = "1px";
    document.body.appendChild(bait);

    setTimeout(() => {
      if (bait.offsetHeight === 0) {
        setAdBlocked(true);
      }
      document.body.removeChild(bait);
    }, 100);
  }, []);

  if (!notice && !adBlocked) return null;

  const message = adBlocked
    ? "⚠️ Please disable Ad Blocker to support Exam Sharp School and view important updates."
    : notice.message;

  if (!notice) return null;

  return (
    <div style={styles.wrapper}
     onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      >


      <div style={styles.marqueeContainer}>
        <div
       style={{
          ...styles.marquee,
          animationPlayState: isPaused ? "paused" : "running",
        }}
        >
        <span style={styles.text}>{notice.message}</span>
        <span style={styles.text}>{notice.message}</span>
      </div>
      </div>

      <div style={styles.bell}>{adBlocked ? "🚫" : "🔔"}</div>
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
   marqueeContainer: {
    flex: 1,
    overflow: "hidden",
    height: "100%",
  },

  marquee: {
    display: "flex",
    whiteSpace: "nowrap",
    animation: "scrollLeft 20s linear infinite",
     flexGrow: 1,
    minWidth: 0, 
  },

  text: {
    paddingTop: 5,
    paddingRight: 50,
    fontWeight: 600,
    flexShrink: 0,
  },

  bell: {
    flexShrink: 0,         
    background: "transparent",
    width: 20,
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
  },
};

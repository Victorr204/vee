import { useEffect, useState } from "react";

export default function AdBlockNotice() {
  const [adBlocked, setAdBlocked] = useState(false);

  useEffect(() => {
    const testAd = document.createElement("div");
    testAd.className = "adsbygoogle";
    testAd.style.height = "1px";
    testAd.style.position = "absolute";
    testAd.style.left = "-999px";

    document.body.appendChild(testAd);

    setTimeout(() => {
      if (
        testAd.offsetHeight === 0 ||
        testAd.clientHeight === 0 ||
        getComputedStyle(testAd).display === "none"
      ) {
        setAdBlocked(true);
      }

      document.body.removeChild(testAd);
    }, 100);
  }, []);

  if (!adBlocked) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.box}>
        <h2>Ad Blocker Detected</h2>
        <p>
          Exam Sharp School depends on ads to stay free for students.
          Please disable your ad blocker to continue using this site.
        </p>

        <ol style={{ textAlign: "left" }}>
          <li>Open your ad blocker extension</li>
          <li>Disable it for this site</li>
          <li>Refresh the page</li>
        </ol>

        <button
          style={styles.button}
          onClick={() => window.location.reload()}
        >
          I’ve Disabled It
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  box: {
    background: "#111827",
    color: "#fff",
    padding: 30,
    borderRadius: 12,
    maxWidth: 420,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    padding: "12px 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};

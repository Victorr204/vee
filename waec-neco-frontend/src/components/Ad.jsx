import { useEffect } from "react";

export default function Ad({ slot }) {
  useEffect(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (e) {}
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", textAlign: "center", margin: "20px 0" }}
      /* ============= GOOGLE AD CLIENT ID  (replace slot and ca-pub) ========== */
      data-ad-client="ca-pub-9942550938838021"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

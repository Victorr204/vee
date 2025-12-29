export default function Terms() {
  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h1>Terms of Service</h1>

      <p>
        By accessing WAEC & NECO Prep, you agree to these Terms of Service.
      </p>

      <h3>Educational Purpose</h3>
      <p>
        All materials provided are for educational and revision purposes only.
        We do not claim affiliation with WAEC, NECO, or any examination body.
      </p>

      <h3>Premium Access</h3>
      <p>
        Some practice tests may require activation. Payments are handled
        externally, and access is granted after verification.
      </p>

      <h3>Prohibited Use</h3>
      <ul>
        <li>No misuse of content</li>
        <li>No attempt to bypass access restrictions</li>
        <li>No redistribution of materials</li>
      </ul>

      <h3>Limitation of Liability</h3>
      <p>
        We are not responsible for exam outcomes or decisions based on the use
        of this platform.
      </p>

      <p>Last updated: {new Date().toDateString()}</p>
    </div>
  );
}

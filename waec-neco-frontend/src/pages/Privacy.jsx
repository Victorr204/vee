export default function Privacy() {
  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h1>Privacy Policy</h1>

      <p>
        This Privacy Policy explains how we collect, use, and protect your
        information when you use EXAM SHARP SCHOOL.
      </p>

      <h3>Information We Collect</h3>
      <ul>
        <li>Basic usage data (pages visited, interactions)</li>
        <li>Anonymous cookies for analytics and advertising</li>
      </ul>

      <h3>Cookies & Advertising</h3>
      <p>
        We use Google AdSense and other third-party services that may use cookies
        to display relevant advertisements. Google may use the DoubleClick
        cookie to serve ads based on user visits.
      </p>

      <p>
        Users may opt out of personalized advertising by visiting Google Ads
        Settings.
      </p>

      <h3>Data Protection</h3>
      <p>
        We do not sell or share personal data with third parties except as
        required for service delivery and legal compliance.
      </p>

      <h3>Consent</h3>
      <p>
        By using this website, you consent to this Privacy Policy.
      </p>

      <p>Last updated: {new Date().toDateString()}</p>
    </div>
  );
}

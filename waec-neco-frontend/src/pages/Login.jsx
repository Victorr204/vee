import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setSEO } from "../utils/seo";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  setSEO({
    title: "Login | Exam Sharp School",
    description: "Login to your Exam Sharp School account",
  });

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://waec-neco-backend.vercel.app/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>

      {error && <p style={styles.error}>{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleLogin} disabled={loading} style={styles.btn}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <p style={{ marginTop: 10 }}>
        No account? <Link to="/register">Create one</Link>
      </p>
    </div>
  );
}
/* ----------------- STYLES ----------------- */
const styles = {
  container: {
    maxWidth: 400,
    margin: "80px auto",
    padding: 30,
    background: "#111827",
    borderRadius: 8,
    color: "#fff",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  btn: {
    width: "100%",
    padding: 12,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
};
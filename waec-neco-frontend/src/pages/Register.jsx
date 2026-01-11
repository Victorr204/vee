import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setSEO } from "../utils/seo";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  setSEO({
    title: "Register | Exam Sharp School",
    description: "Create your Exam Sharp School account",
  });

  const handleRegister = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
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
        throw new Error(data.message || "Registration failed");
      }

      alert("Account created successfully. Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create Account</h2>

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

      <button onClick={handleRegister} disabled={loading} style={styles.btn}>
        {loading ? "Creating..." : "Create Account"}
      </button>

      <p style={{ marginTop: 10 }}>
        Already have an account? <Link to="/login">Login</Link>
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
    background: "#10b981",
    color: "#000",
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
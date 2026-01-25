import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { setSEO } from "../utils/seo";

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  

  /* Redirect if already logged in */
  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  /* SEO */
  useEffect(() => {
    setSEO({
      title: "Login | Exam Sharp School",
      description: "Login to your Exam Sharp School account",
    });
  }, []);

  /* EMAIL LOGIN */
  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );
      navigate("/");
    } catch (err) {
      setError(err.message.replace("Firebase:", ""));
    } finally {
      setLoading(false);
    }
  };

  /* GOOGLE LOGIN */
  const handleGoogle = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setError(err.message.replace("Firebase:", ""));
    } finally {
      setLoading(false);
    }
  };

  /* APPLE LOGIN */
  const handleApple = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new OAuthProvider("apple.com");
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setError(err.message.replace("Firebase:", ""));
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

      <button
        onClick={handleLogin}
        disabled={loading}
        style={styles.btn}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <div style={styles.divider}>OR</div>

      <button onClick={handleGoogle} style={styles.googleBtn}>
        Continue with Google
      </button>

      <button onClick={handleApple} style={styles.appleBtn}>
        Continue with Apple
      </button>

      <p style={{ marginTop: 12 }}>
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
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
    border: "1px solid #333",
    background: "#1f2937",
    color: "#fff",
  },
  btn: {
    width: "100%",
    padding: 12,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginBottom: 10,
  },
  googleBtn: {
    width: "100%",
    padding: 12,
    background: "#fff",
    color: "#000",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginBottom: 10,
  },
  appleBtn: {
    width: "100%",
    padding: 12,
    background: "#000",
    color: "#fff",
    border: "1px solid #333",
    borderRadius: 6,
    cursor: "pointer",
  },
  divider: {
    margin: "15px 0",
    opacity: 0.6,
  },
  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
};
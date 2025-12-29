import { useEffect, useState } from "react";
import { setSEO } from "../utils/seo";

/* ================= ONLINE TRACKING CONSTANTS (ADDED) ================= */
const ONLINE_KEY = "community_online_users";
const USER_ID = "user_" + Math.random().toString(36).slice(2);
const ONLINE_TIMEOUT = 2 * 60 * 1000; // 2 minutes

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");

  /* ================= ONLINE COUNT STATE (ADDED) ================= */
  const [onlineCount, setOnlineCount] = useState(1);

  useEffect(() => {
    setSEO({
      title: "EXAM SHARP SHCOOL Community discussion - WAEC & NECO Prep",
      description:
        "Student engage in discussion, share tips, and motivate each other in our community forum.",
    });

    const stored = JSON.parse(localStorage.getItem("community_posts")) || [];
    const now = Date.now();

    // Remove posts older than 24 hours (86400000 ms)
    const filtered = stored.filter((p) => now - p.createdAt < 86400000);

    setPosts(filtered);
    localStorage.setItem("community_posts", JSON.stringify(filtered));
  }, []);

  /* ================= ONLINE PRESENCE EFFECT (ADDED) ================= */
  useEffect(() => {
    const updateOnlineStatus = () => {
      const now = Date.now();
      const stored = JSON.parse(localStorage.getItem(ONLINE_KEY)) || {};

      stored[USER_ID] = now;

      // Remove inactive users
      Object.keys(stored).forEach((id) => {
        if (now - stored[id] > ONLINE_TIMEOUT) {
          delete stored[id];
        }
      });

      localStorage.setItem(ONLINE_KEY, JSON.stringify(stored));
      setOnlineCount(Object.keys(stored).length || 1);
    };

    updateOnlineStatus();
    const interval = setInterval(updateOnlineStatus, 30000); // every 30s

    return () => {
      const stored = JSON.parse(localStorage.getItem(ONLINE_KEY)) || {};
      delete stored[USER_ID];
      localStorage.setItem(ONLINE_KEY, JSON.stringify(stored));
      clearInterval(interval);
    };
  }, []);

  const addPost = () => {
    if (!text.trim()) return;

    const newPost = {
      id: Date.now(),
      message: text,
      likes: 0,
      createdAt: Date.now(),
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem("community_posts", JSON.stringify(updated));
    setText("");
  };

  const likePost = (id) => {
    const updated = posts.map((p) =>
      p.id === id ? { ...p, likes: p.likes + 1 } : p
    );
    setPosts(updated);
    localStorage.setItem("community_posts", JSON.stringify(updated));
  };

  return (
    <div style={styles.container}>
      <h2>Student Community</h2>
      <p>Discuss questions, share tips, motivate each other.</p>

      {/* ================= ONLINE COUNT DISPLAY (ADDED) ================= */}
      <p style={{ fontWeight: "bold", color: "#10b981", marginBottom: 20 }}>
        🟢 {onlineCount} student{onlineCount > 1 ? "s" : ""} online
      </p>

      <div style={styles.wrapper}>
        {/* Input Area */}
        <div style={styles.inputArea}>
          <textarea
            placeholder="Ask a question or share a tip..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={styles.textarea}
          />
          <button onClick={addPost} style={styles.btn}>
            Post
          </button>
        </div>

        {/* Posts */}
        <div style={styles.posts}>
          {posts.map((p) => (
            <div key={p.id} style={styles.post}>
              <p>{p.message}</p>
              <button onClick={() => likePost(p.id)}>👍 {p.likes}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES (UNCHANGED) ================= */
const styles = {
  container: {
    maxWidth: 900,
    margin: "auto",
    padding: 20,
  },
  wrapper: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    flexWrap: "wrap",
  },
  inputArea: {
    flex: "1 1 300px",
    minWidth: 250,
    display: "flex",
    flexDirection: "column",
  },
  posts: {
    flex: "2 1 400px",
    minWidth: 300,
  },
  textarea: {
    width: "100%",
    height: 80,
    marginBottom: 10,
    padding: 10,
    resize: "vertical",
  },
  btn: {
    padding: "10px 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  post: {
    background: "#3a3030ff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    wordBreak: "break-word",
  },

  '@media (max-width: 768px)': {
    wrapper: {
      flexDirection: "column",
    },
    inputArea: {
      width: "100%",
    },
    posts: {
      width: "100%",
    },
  },
};

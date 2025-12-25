import { useEffect, useState } from "react";

export default function Community() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("communityPosts")) || [];
    setPosts(saved);
  }, []);

  const postMessage = () => {
    if (!name || !message) return;

    const newPost = {
      id: Date.now(),
      name,
      message,
      time: new Date().toLocaleString(),
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem("communityPosts", JSON.stringify(updated));

    setMessage("");
  };

  return (
    <section style={{ marginTop: 50 }}>
      <h2>Community Discussion</h2>
      <p>Ask questions. Help others. Learn together.</p>

      <input
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />

      <textarea
        placeholder="Write a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={styles.textarea}
      />

      <button onClick={postMessage} style={styles.btn}>
        Post
      </button>

      <div style={{ marginTop: 30 }}>
        {posts.map((p) => (
          <div key={p.id} style={styles.post}>
            <strong>{p.name}</strong>
            <small style={{ float: "right" }}>{p.time}</small>
            <p>{p.message}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },
  textarea: {
    width: "100%",
    padding: 10,
    height: 80,
  },
  btn: {
    marginTop: 10,
    padding: "8px 20px",
    cursor: "pointer",
  },
  post: {
    background: "#fff",
    padding: 15,
    borderRadius: 6,
    marginBottom: 10,
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
};

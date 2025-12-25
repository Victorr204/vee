import { useEffect, useState } from "react";
import { getStoredQuestions } from "../utils/storage";
import { Link } from "react-router-dom";

export default function Home() {
  const [questions, setQuestions] = useState([]);

 useEffect(() => {
  const all = getStoredQuestions();
  const freeOnly = all.filter(q => !q.isTest);
  setQuestions(freeOnly);
}, []);


  return (
    <div style={styles.container}>
      {/* HERO */}
      <header style={styles.hero}>
        <h1>WAEC & NECO Past Questions</h1>
        <p>Study freely. Practice smarter. Test yourself when ready.</p>

        <Link to="/test">
          <button style={styles.primaryBtn}>Take Practice Test</button>
        </Link>
      </header>

      {/* QUESTIONS (FREE) */}
      <section>
        <h2 style={styles.sectionTitle}>Past Questions</h2>

        {questions.map((q) => (
          <div key={q.id} style={styles.card}>
            <h3>
              {q.subject} — {q.exam} {q.type} ({q.year})
            </h3>

            <p style={{ fontSize: 16, whiteSpace: "pre-line" }}>
  {q.text}
</p>

            {q.answer && (
  <p style={styles.answer}>
    <strong>Answer:</strong>
    <br />
    {q.answer}
  </p>
)}

          </div>
        ))}
      </section>

      {/* COMMUNITY */}
      <section style={styles.communityBox}>
        <h2>Student Community</h2>
        <p>
          Join discussions, exam tips, subject help, and motivation.
        </p>

        <Link to="/community">
          <button style={styles.secondaryBtn}>Enter Community</button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <a
          href="https://wa.me/234XXXXXXXXXX?text=I%20want%20to%20activate%20test%20access"
          target="_blank"
        >
          Pay Admin on WhatsApp
        </a>

        <span style={{ margin: "0 10px" }}>|</span>

        <Link to="/admin">Admin</Link>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 900,
    margin: "auto",
    padding: 20,
  },
  hero: {
    textAlign: "center",
    marginBottom: 40,
  },
  sectionTitle: {
    marginBottom: 20,
  },
  card: {
    background: "#0a0a0aff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  answer: {
    background: "#171817ff",
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  primaryBtn: {
    padding: "14px 30px",
    fontSize: 16,
    backgroundColor: "#2563eb",
    color: "#ffffffff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "12px 25px",
    background: "#10b981",
    color: "#1d1a1aff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  communityBox: {
    marginTop: 60,
    padding: 30,
    background: "#474543ff",
    borderRadius: 12,
    textAlign: "center",
  },
  footer: {
    marginTop: 60,
    textAlign: "center",
    fontSize: 14,
    color: "#555",
  },
};

import { useEffect, useState } from "react";
import { isTestActivated } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { getStoredQuestions } from "../utils/storage";

export default function Test() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (!isTestActivated()) {
      navigate("/activate", { replace: true });
      return;
    }

    // Load only test questions
    const testQuestions = getStoredQuestions().filter((q) => q.isTest);
    setQuestions(testQuestions);
  }, []);

  if (!questions.length) return <p>No exam questions available</p>;

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h2>Practice Test Questions</h2>

      {questions.map((q) => (
        <div key={q.id} style={styles.card}>
          <h3>
            {q.subject} — {q.exam} ({q.type})
          </h3>

          {/* QUESTION */}
          <p style={{ whiteSpace: "pre-line", fontSize: 16 }}>{q.text}</p>

          {/* IMAGES */}
          {q.images?.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="question"
              style={{ width: "100%", marginTop: 10 }}
            />
          ))}

          {/* ANSWER */}
          {q.answer && (
            <div style={styles.answer}>
              <strong>Answer:</strong>
              <br />
              {q.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    background: "#443e3eff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  answer: {
    background: "#1f201fff",
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
  },
};

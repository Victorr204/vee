import { useEffect, useState } from "react";
import { SUBJECTS, PRACTICAL_SUBJECTS } from "../data/config";
import {
  getStoredQuestions,
  saveQuestions,
  getActivationCodes,
  saveActivationCodes,
} from "../utils/storage";

const ADMIN_PIN = "4321";

export default function Admin() {
  /* ---------------- AUTH ---------------- */
  const [pin, setPin] = useState("");
  const [ok, setOk] = useState(false);

  /* ---------------- DATA ---------------- */
  const [questions, setQuestions] = useState([]);
  const [codes, setCodes] = useState([]);

  /* ---------------- FORM ---------------- */
  const [exam, setExam] = useState("WAEC");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("Objective");
  const [year, setYear] = useState(new Date().getFullYear());

  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [images, setImages] = useState([]);
  const [isTest, setIsTest] = useState(false);

  /* ---------------- LOAD ---------------- */
  useEffect(() => {
    setQuestions(getStoredQuestions());
    setCodes(getActivationCodes());
  }, []);

  /* ---------------- ACTIVATION CODES ---------------- */
  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();
    const updated = [...codes, code];
    setCodes(updated);
    saveActivationCodes(updated);
    alert("Generated Code: " + code);
  };

  const deleteCode = (code) => {
    const updated = codes.filter((c) => c !== code);
    setCodes(updated);
    saveActivationCodes(updated);
  };

  /* ---------------- IMAGE UPLOAD ---------------- */
  const handleImages = (files) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () =>
        setImages((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  /* ---------------- SAVE QUESTION ---------------- */
  const saveQuestion = () => {
    if (!subject || !questionText || !year) {
      alert("Subject, Question and Year are required");
      return;
    }

    const newQuestion = {
      id: Date.now(),
      exam,
      subject,
      type,
      year,
      text: questionText,
      answer: answerText,
      images,
      isTest,
      createdAt: new Date().toLocaleString(),
    };

    const updated = [newQuestion, ...questions];
    setQuestions(updated);
    saveQuestions(updated);

    /* RESET FORM */
    setQuestionText("");
    setAnswerText("");
    setImages([]);
    setIsTest(false);

    alert("Question saved successfully");
  };

  const deleteQuestion = (id) => {
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    saveQuestions(updated);
  };

  /* ---------------- LOGIN ---------------- */
  if (!ok) {
    return (
      <div style={{ padding: 40, maxWidth: 400, margin: "auto" }}>
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Admin PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          style={{ width: "100%", padding: 10 }}
        />
        <button
          style={{ marginTop: 10 }}
          onClick={() => pin === ADMIN_PIN && setOk(true)}
        >
          Login
        </button>
      </div>
    );
  }

  /* ---------------- DASHBOARD ---------------- */
  return (
    <div style={{ maxWidth: 1000, margin: "auto", padding: 20 }}>
      <h2>Admin Dashboard</h2>

      {/* ================= ACTIVATION CODES ================= */}
      <section style={box}>
        <h3>Activation Codes (Test Access)</h3>
        <button onClick={generateCode}>Generate Code</button>
        <ul>
          {codes.map((c) => (
            <li key={c}>
              {c} <button onClick={() => deleteCode(c)}>❌</button>
            </li>
          ))}
        </ul>
      </section>

      {/* ================= ADD QUESTION ================= */}
      <section style={box}>
        <h3>Add Question</h3>

        {/* EXAM / SUBJECT / YEAR */}
        <div style={row}>
          <select value={exam} onChange={(e) => setExam(e.target.value)}>
            <option>WAEC</option>
            <option>NECO</option>
          </select>

          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">Select Subject</option>
            {SUBJECTS[exam].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>Objective</option>
            <option>Theory</option>
            {PRACTICAL_SUBJECTS.includes(subject) && (
              <option>Practical</option>
            )}
          </select>

          <select value={year} onChange={(e) => setYear(e.target.value)}>
            {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map(
              (y) => (
                <option key={y}>{y}</option>
              )
            )}
          </select>
        </div>

        {/* QUESTION */}
        <h4>Question</h4>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          rows={6}
          placeholder="Paste QUESTION here..."
          style={textarea}
        />

        {/* ANSWER */}
        <h4>Answer</h4>
        <textarea
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          rows={4}
          placeholder="Paste ANSWER here..."
          style={textarea}
        />

        {/* IMAGES */}
        <h4>Images (optional)</h4>
        <input
          type="file"
          multiple
          accept="image/*"
          capture="environment"
          onChange={(e) => handleImages(e.target.files)}
        />

        {/* TEST TOGGLE */}
        <label style={{ display: "block", marginTop: 10 }}>
          <input
            type="checkbox"
            checked={isTest}
            onChange={(e) => setIsTest(e.target.checked)}
          />{" "}
          Mark as Test Question (Locked)
        </label>

        <button onClick={saveQuestion} style={{ marginTop: 10 }}>
          Save Question
        </button>
      </section>

      {/* ================= PREVIEW ================= */}
      <section style={box}>
        <h3>Saved Questions Preview</h3>

        {questions.map((q) => (
          <div key={q.id} style={card}>
            <h4>
              {q.subject} — {q.exam} ({q.type}) {q.year} {q.isTest && "🔒"}
            </h4>

            <p style={{ whiteSpace: "pre-line" }}>{q.text}</p>

            {q.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="question"
                style={{ width: "100%", marginTop: 10 }}
              />
            ))}

            {!q.isTest && q.answer && (
              <div style={answerBox}>
                <strong>Answer:</strong>
                <br />
                {q.answer}
              </div>
            )}

            {/* DELETE BUTTON */}
            <button
              onClick={() => deleteQuestion(q.id)}
              style={{ marginTop: 5, backgroundColor: "#c0392b", color: "#fff", padding: 5 }}
            >
              Delete Question
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const box = {
  background: "#443e3eff",
  padding: 20,
  borderRadius: 8,
  marginBottom: 30,
};

const row = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const textarea = {
  width: "100%",
  padding: 10,
};

const card = {
  background: "#363232ff",
  padding: 15,
  borderRadius: 8,
  marginBottom: 15,
};

const answerBox = {
  background: "#242924ff",
  padding: 10,
  borderRadius: 5,
  marginTop: 10,
};

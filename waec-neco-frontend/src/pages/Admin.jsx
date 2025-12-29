import { useEffect, useState } from "react";
import { SUBJECTS, PRACTICAL_SUBJECTS } from "../data/config";
import {
  getStoredQuestions,
  saveQuestions,
  getActivationCodes,
  saveActivationCodes,
} from "../utils/storage";

const ADMIN_PIN = "09037306845";

export default function Admin() {
  /* ---------------- AUTH ---------------- */
  const [pin, setPin] = useState("");
  const [ok, setOk] = useState(false);

  /* ---------------- DATA ---------------- */
  const [questions, setQuestions] = useState([]);
  const [codes, setCodes] = useState([]);

  /* ---------------- FORM (Home/Old) ---------------- */
  const [exam, setExam] = useState("WAEC");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("Objective");
  const [year, setYear] = useState(new Date().getFullYear());
  const [isTest, setIsTest] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [images, setImages] = useState([]);

  /* ---------------- FORM (CBT) ---------------- */
  const [cbtExam, setCbtExam] = useState("WAEC");
  const [cbtSubject, setCbtSubject] = useState("");
  const [cbtType, setCbtType] = useState("Objective");
  const [cbtYear, setCbtYear] = useState(new Date().getFullYear());

  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    options: ["", "", "", ""],
    answer: "",
    images: [],
  });
  const [cbtQuestions, setCbtQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);

  /* ---------------- LOAD ---------------- */
  useEffect(() => {
    setQuestions(getStoredQuestions());
    setCodes(getActivationCodes());
    setAllQuestions(getStoredQuestions());
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
  const handleImages = (files, isCbt = false) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (isCbt) {
          setCurrentQuestion((prev) => ({ ...prev, images: [...prev.images, reader.result] }));
        } else {
          setImages((prev) => [...prev, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  /* ---------------- SAVE HOME QUESTION ---------------- */
  const saveQuestion = () => {
    if (!subject || !questionText) {
      alert("Subject and Question are required");
      return;
    }
    const newQuestion = {
      id: Date.now(),
      exam,
      subject,
      type,
      year,
      text: questionText,
      answer: answerText || "",
      images,
      isTest,
      createdAt: new Date().toISOString(),
    };
    const updated = [newQuestion, ...questions];
    setQuestions(updated);
    saveQuestions(updated);

    setQuestionText("");
    setAnswerText("");
    setImages([]);
    setIsTest(false);
    setSubject("");
    setType("Objective");
    alert("Question saved successfully for CBT");
  };

  /* ---------------- DELETE QUESTION ---------------- */
  const deleteQuestion = (id) => {
    const updated = questions.filter((q) => q.id !== id);
    setQuestions(updated);
    saveQuestions(updated);
  };

  /* ---------------- CBT FUNCTIONS ---------------- */
  const nextCbtQuestion = () => {
    if (!currentQuestion.text || (cbtType === "Objective" && !currentQuestion.answer)) {
      alert("Question text and answer are required.");
      return;
    }
    setCbtQuestions((prev) => [
      ...prev,
      { ...currentQuestion, exam: cbtExam, subject: cbtSubject, type: cbtType, year: cbtYear, id: Date.now() },
    ]);
    setCurrentQuestion({ text: "", options: ["", "", "", ""], answer: "", images: [] });
  };

  const saveAllCbtQuestions = () => {
    if (currentQuestion.text) {
      setCbtQuestions((prev) => [
        ...prev,
        { ...currentQuestion, exam: cbtExam, subject: cbtSubject, type: cbtType, year: cbtYear, id: Date.now() },
      ]);
    }
    const updated = [...allQuestions, ...cbtQuestions];
    saveQuestions(updated);
    setAllQuestions(updated);
    setCbtQuestions([]);
    setCurrentQuestion({ text: "", options: ["", "", "", ""], answer: "", images: [] });
    alert("All CBT questions saved successfully!");
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
        <button style={{ marginTop: 10 }} onClick={() => pin === ADMIN_PIN && setOk(true)}>
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

      {/* ================= ADD HOME QUESTION ================= */}
      <section style={box}>
        <h3>Add Question (Home / Existing Form)</h3>
        {/* --- existing form --- */}
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
            {PRACTICAL_SUBJECTS.includes(subject) && <option>Practical</option>}
          </select>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>
        <textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} rows={6} style={textarea} placeholder="Paste question here..." />
        <textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)} rows={4} style={textarea} placeholder="Paste answer here..." />
        <input type="file" multiple accept="image/*" onChange={(e) => handleImages(e.target.files)} />
        <label style={{ display: "block", marginTop: 10 }}>
          <input type="checkbox" checked={isTest} onChange={(e) => setIsTest(e.target.checked)} /> Mark as Test Question
        </label>
        <button onClick={saveQuestion} style={{ marginTop: 10 }}>Save Question</button>
      </section>

      {/* ================= CBT QUESTION ENTRY ================= */}
      <section style={box}>
        <h3>Add CBT Questions (Sequential Entry)</h3>
        <div style={row}>
          <select value={cbtExam} onChange={(e) => setCbtExam(e.target.value)}>
            <option>WAEC</option>
            <option>NECO</option>
          </select>
          <select value={cbtSubject} onChange={(e) => setCbtSubject(e.target.value)}>
            <option value="">Select Subject</option>
            {SUBJECTS[cbtExam].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select value={cbtType} onChange={(e) => setCbtType(e.target.value)}>
            <option>Objective</option>
            <option>Theory</option>
          </select>
          <select value={cbtYear} onChange={(e) => setCbtYear(e.target.value)}>
            {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i).map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </div>

        <textarea
          placeholder="Question text..."
          value={currentQuestion.text}
          onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, text: e.target.value }))}
          rows={4}
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        <input type="file" multiple accept="image/*" onChange={(e) => handleImages(e.target.files, true)} />

        {cbtType === "Objective" && (
          <>
            <h4>Options</h4>
            {currentQuestion.options.map((opt, idx) => (
              <input key={idx} placeholder={`Option ${String.fromCharCode(65 + idx)}`} value={currentQuestion.options[idx]} onChange={(e) => {
                const updatedOpts = [...currentQuestion.options];
                updatedOpts[idx] = e.target.value;
                setCurrentQuestion(prev => ({ ...prev, options: updatedOpts }));
              }} style={{ display: "block", marginBottom: 5, width: "100%", padding: 5 }} />
            ))}
            <h4>Correct Answer</h4>
            <select value={currentQuestion.answer} onChange={(e) => setCurrentQuestion(prev => ({ ...prev, answer: e.target.value }))}>
              <option value="">Select Correct Answer</option>
              {["A","B","C","D"].map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </>
        )}
        {cbtType === "Theory" && (
          <>
            <h4>Answer</h4>
            <textarea rows={3} placeholder="Theory answer" value={currentQuestion.answer} onChange={(e) => setCurrentQuestion(prev => ({ ...prev, answer: e.target.value }))} style={{ width: "100%", padding: 10, marginTop: 5 }} />
          </>
        )}
        <div style={{ marginTop: 20 }}>
          <button onClick={nextCbtQuestion} style={{ marginRight: 10 }}>Next Question</button>
          <button onClick={saveAllCbtQuestions}>Done / Save All</button>
        </div>

        {/* Preview CBT Questions */}
        <section style={{ marginTop: 20 }}>
          <h4>Preview CBT Questions</h4>
          {cbtQuestions.map((q, i) => (
            <div key={i} style={{ background: "#333", color: "#fff", padding: 10, borderRadius: 5, marginBottom: 5 }}>
              <p><strong>Q{i+1}:</strong> {q.text}</p>
              {q.type === "Objective" && <ul>{q.options.map((o, idx) => <li key={idx}>{String.fromCharCode(65+idx)}: {o}</li>)}<strong>Answer:</strong> {q.answer}</ul>}
              {q.type === "Theory" && <p><strong>Answer:</strong> {q.answer}</p>}
              {q.images?.map((img, idx) => <img key={idx} src={img} alt="question" style={{ width: "100%", marginTop: 5 }} />)}
            </div>
          ))}
        </section>
      </section>

      {/* ================= PREVIEW HOME QUESTIONS ================= */}
      <section style={box}>
        <h3>Saved Questions Preview (Home)</h3>
        {questions.map(q => (
          <div key={q.id} style={card}>
            <h4>{q.subject} — {q.exam} ({q.type}) {q.year} {q.isTest && "🔒"}</h4>
            <p style={{ whiteSpace: "pre-line" }}>{q.text}</p>
            {q.images?.map((img,i) => <img key={i} src={img} alt="question" style={{ width:"100%", marginTop:10 }} />)}
            {q.answer && !q.isTest && <div style={answerBox}><strong>Answer:</strong><br/>{q.answer}</div>}
            <button onClick={()=>deleteQuestion(q.id)} style={{ marginTop:5, backgroundColor:"#c0392b", color:"#fff", padding:5 }}>Delete Question</button>
          </div>
        ))}
      </section>
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const box = { background:"#443e3eff", padding:20, borderRadius:8, marginBottom:30 };
const row = { display:"flex", gap:10, flexWrap:"wrap" };
const textarea = { width:"100%", padding:10 };
const card = { background:"#363232ff", padding:15, borderRadius:8, marginBottom:15 };
const answerBox = { background:"#242924ff", padding:10, borderRadius:5, marginTop:10 };

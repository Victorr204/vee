//admin page
import { useEffect, useState } from "react";
import { SUBJECTS, PRACTICAL_SUBJECTS } from "../data/config";
import { apiFetch } from "../services/api";



export default function Admin() {
  /* ---------------- AUTH ---------------- */
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
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


  /* ----------------ADMIN NOTIFICATION ---------------- */
  const [message, setMessage] = useState("");
  const [duration, setDuration] = useState(60);
  const [active, setActive] = useState(null);

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

  


  /* =========Notifications================= */
const postNotification = async () => {
  const res = await apiFetch("/api/admin/notifications", {
    method: "POST",
    body: JSON.stringify({ message, duration }),
  });

  setActive(res);
  setMessage("");
};

/* ---------------- DELETE NOTIFICATION ---------------- */
 const deleteNotification = async () => {
  await apiFetch("/api/admin/notifications", { method: "DELETE" });
  setActive(null);
};



  /* ---------------- LOAD ---------------- */
  useEffect(() => {
  async function loadAdminData() {
    try {
      const q = await apiFetch("/api/admin/questions");
      const c = await apiFetch("/api/admin/codes");
      const n = await apiFetch("/api/admin/notifications");

      setQuestions(q);
      setAllQuestions(q);
      setCodes(c);
      setActive(n);
    } catch {
      alert("Unauthorized");
      localStorage.removeItem("token");
      window.location.reload();
    }
  }

  loadAdminData();
}, []);
  

  /* ---------------- ACTIVATION CODES ---------------- */
 const generateCode = async () => {
  const res = await apiFetch("/api/admin/generate-code", {
    method: "POST",
  });

  setCodes(prev => [...prev, res.code]);
};


/* ---------------- DELETE CODE ---------------- */
 const deleteCode = async (code) => {
  await apiFetch(`/api/admin/generate-code?code=${code}`, {
    method: "DELETE",
  });

  setCodes(prev => prev.filter(c => c !== code));
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
 const saveQuestion = async () => {
  if (!subject || !questionText) {
    alert("Subject and Question required");
    return;
  }

  const payload = {
    exam,
    subject,
    type,
    year,
    text: questionText,
    answer: answerText,
    images,
    isTest,
  };

  const saved = await apiFetch("/api/admin/questions", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  setQuestions(prev => [saved, ...prev]);
  setQuestionText("");
  setAnswerText("");
  setImages([]);
};




  /* ---------------- DELETE QUESTION ---------------- */
const deleteQuestion = async (id) => {
  await apiFetch(`/api/admin/questions?id=${id}`, {
    method: "DELETE",
  });

  setQuestions(prev => prev.filter(q => q._id !== id));
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

/* ---------- SAVE ALL CBT QUESTIONS ------------ */
const saveAllCbtQuestions = async () => {
  const payload = [...cbtQuestions];

  await apiFetch("/api/admin/tests", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  setCbtQuestions([]);
  alert("CBT questions saved globally");
};




  /* ---------------- LOGIN ---------------- */

const loginAdmin = async () => {
  try {
    const res = await apiFetch("/api/auth/admin-login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem("token", res.token);
    setOk(true);
  } catch (err) {
    alert("Invalid admin credentials");
  }
};


 if (!ok) {
  return (
    <div style={{ padding: 40, maxWidth: 400, margin: "auto" }}>
      <h2>Admin Login</h2>

      <input
        placeholder="Admin Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 10 }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <button style={{ marginTop: 10 }} onClick={loginAdmin}>
        Login
      </button>
    </div>
  );
}


  /* ---------------- DASHBOARD ---------------- */
  return (
    <div style={{ maxWidth: 1000, margin: "auto", padding: 20 }}>
      <h2>Admin Dashboard</h2>

      {/* ================= TOP NOTIFICATION ================= */}<h3>Top Notification</h3>

      <textarea
        placeholder="Type notification message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={styles.textarea}
      />

      <label>
        Duration (minutes):
        <input
          type="number"
          min={1}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </label>

      <button onClick={postNotification} style={styles.btn}>
        Post Notification
      </button>

      {active && (
        <>
          <p style={{ marginTop: 10 }}>
            <b>Active:</b> {active.message}
          </p>
          <button onClick={deleteNotification} style={styles.delete}>
            Delete Notification
          </button>
        </>
      )}

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


const styles = {
  box: {
    background: "#111827",
    padding: 20,
    borderRadius: 10,
    maxWidth: 500,
  },
  textarea: {
    width: "100%",
    height: 80,
    marginBottom: 10,
    padding: 10,
  },
  btn: {
    padding: "10px 15px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  delete: {
    marginTop: 10,
    background: "#dc2626",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};

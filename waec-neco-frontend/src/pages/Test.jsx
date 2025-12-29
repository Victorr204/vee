import { useEffect, useState, useRef } from "react";
import { getStoredQuestions } from "../utils/storage";
import { isTestActivated } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { setSEO } from "../utils/seo";

const optionLetters = ["A", "B", "C", "D", "E"];


export default function Test() {
  const navigate = useNavigate();

  /* ----------------- STATE ----------------- */
  const [allQuestions, setAllQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [subject, setSubject] = useState("ALL");
  const [exam, setExam] = useState("ALL");
  const [year, setYear] = useState("ALL");
  const [mode, setMode] = useState("");
  const [numQuestions, setNumQuestions] = useState(50);
  const [timeMinutes, setTimeMinutes] = useState(30);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [aiExplanations, setAIExplanations] = useState({});
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const [score, setScore] = useState(0);
  const [showReview, setShowReview] = useState(false);

  const [showCalculator, setShowCalculator] = useState(false);
  const [calcInput, setCalcInput] = useState("");

  /* ----------------- SEO + LOAD ----------------- */
  useEffect(() => {
    setSEO({
      title: "EXAM SHARP SCHOOL CBT Test | WAEC & NECO",
      description: "Interactive CBT system for WAEC & NECO past questions",
    });

    if (!isTestActivated()) {
      navigate("/activate", { replace: true });
      return;
    }

    const stored = getStoredQuestions();

    const cbtQuestions = stored.filter(
      (q) => (q.options && q.options.length) || (q.type === "Theory" && q.answer)
    );

    setAllQuestions(cbtQuestions);
    setFilteredQuestions(cbtQuestions);
  }, []);
  /* =======AI EXPLANATION FUNCTION ======= */
  const getAIExplanation = async (q) => {
  const res = await fetch("https://waec-neco-backend.vercel.app/api/ai/explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question: q.text,
      options: q.options,
      correctAnswer: q.answer,
    }),
  });

  const data = await res.json();
  return data.explanation;
};


  /* ----------------- FILTERS ----------------- */
  const applyFilters = () => {
    let data = [...allQuestions];
    if (subject !== "ALL") data = data.filter((q) => q.subject === subject);
    if (exam !== "ALL") data = data.filter((q) => q.exam === exam);
    if (year !== "ALL") data = data.filter((q) => q.year === year);
    if (numQuestions > 0) data = data.slice(0, numQuestions);
    setFilteredQuestions(data);
  };

  useEffect(() => {
    applyFilters();
  }, [subject, exam, year, numQuestions]);

  /* ----------------- TIMER ----------------- */
  useEffect(() => {
    if (started && mode === "Real") {
      setTimer(timeMinutes * 60);
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started]);

  /* ----------------- ANSWERS ----------------- */
  const handleAnswer = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const finishTest = () => {
    clearInterval(timerRef.current);
    let correct = 0;

    filteredQuestions.forEach((q) => {
      if (!q.options) return;

      const correctIndex = optionLetters.indexOf(
        q.answer?.toUpperCase()
      );
      const userIndex = q.options.indexOf(answers[q.id]);

      if (correctIndex === userIndex) correct += 1;
    });

    setScore(correct);
    setShowReview(true);
  };

  /* ----------------- FETCH AI EXPLANATION ----------------- */
  const fetchAIExplanation = async (q) => {
  if (aiExplanations[q.id]) return;

  setAIExplanations(prev => ({
    ...prev,
    [q.id]: "Loading explanation...",
  }));

  try {
    const explanation = await getAIExplanation(q);
    setAIExplanations(prev => ({
      ...prev,
      [q.id]: explanation,
    }));
  } catch {
    setAIExplanations(prev => ({
      ...prev,
      [q.id]: "Failed to load explanation.",
    }));
  }
};


  /* ----------------- CALCULATOR ----------------- */
  const handleCalcClick = (val) => {
    if (val === "C") setCalcInput("");
    else if (val === "=") {
      try {
        setCalcInput(eval(calcInput).toString());
      } catch {
        setCalcInput("Error");
      }
    } else setCalcInput((prev) => prev + val);
  };

  /* ----------------- START TEST ----------------- */
  const startTest = () => {
    if (!mode || subject === "ALL" || exam === "ALL") {
      alert("Please select Mode, Subject, and Exam before starting the test.");
      return;
    }
    setStarted(true);
  };

  /* ----------------- RENDER ----------------- */
  if (!started) {
    return (
      <div style={styles.container}>
        <h2>Start CBT</h2>

        <div style={styles.filtersContainer}>
          <label>
            Mode:
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="">Select Mode</option>
              <option value="Practice">Practice</option>
              <option value="Real">Real</option>
            </select>
          </label>

          <label>
            Subject:
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option>ALL</option>
              {[...new Set(allQuestions.map((q) => q.subject))].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>

          <label>
            Exam:
            <select value={exam} onChange={(e) => setExam(e.target.value)}>
              <option>ALL</option>
              <option>WAEC</option>
              <option>NECO</option>
            </select>
          </label>

          <label>
            Year:
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option>ALL</option>
              {[
                ...new Set(
                  allQuestions
                    .filter(
                      (q) => subject === "ALL" || q.subject === subject
                    )
                    .map((q) => q.year)
                ),
              ].map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </label>

          <label>
            Number of Questions:
            <input
              type="number"
              min={1}
              max={filteredQuestions.length}
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
            />
          </label>

          {mode === "Real" && (
            <label>
              Time (minutes):
              <input
                type="number"
                min={30}
                max={120}
                value={timeMinutes}
                onChange={(e) => setTimeMinutes(e.target.value)}
              />
            </label>
          )}
        </div>

        <button onClick={startTest} style={styles.primaryBtn}>
          Start Test
        </button>
      </div>
    );
  }

  if (showReview) {
    const grade = (score / filteredQuestions.length) * 100;
    return (
      <div style={styles.container}>
        <h2>Test Review</h2>
        <p>
          Score: {score} / {filteredQuestions.length} ({grade.toFixed(2)}%)
        </p>

        {filteredQuestions.map((q, i) => {
          const correctIndex = optionLetters.indexOf(
            q.answer?.toUpperCase()
          );
          const userIndex = q.options?.indexOf(answers[q.id]);

          return (
            <div
              key={q.id}
              style={{
                marginBottom: 20,
                backgroundColor:
                  correctIndex === userIndex ? "#28312dff" : "#fee2e2",
                padding: 10,
                borderRadius: 6,
              }}
            >
              <h4>
                Q{i + 1}. {q.subject} — {q.exam} ({q.type})
              </h4>
              <p>{q.text}</p>

              <p>
                <b>Your Answer:</b>{" "}
                {userIndex > -1
                  ? `${optionLetters[userIndex]}. ${answers[q.id]}`
                  : "No Answer"}
              </p>
              <p>
                <b>Correct Answer:</b>{" "}
                {optionLetters[correctIndex]}. {q.options?.[correctIndex]}
              </p>

              <p>
                <b>Explanation:</b>{" "}
                {aiExplanations[q.id] || "Click 'Show Explanation' to view"}
              </p>

              {mode === "Practice" && !aiExplanations[q.id] && (
                <button
                  style={styles.secondaryBtn}
                  onClick={() => fetchAIExplanation(q)}
                >
                  Show Explanation
                </button>
              )}
            </div>
          );
        })}

        <button
          onClick={() => window.location.reload()}
          style={styles.primaryBtn}
        >
          Restart Test
        </button>
      </div>
    );
  }

  const q = filteredQuestions[currentIndex];

  return (
    <div style={styles.container}>
      <h3>
        {q.subject} — {q.exam} ({q.type})
      </h3>

      <p>{q.text}</p>

      {q.options && (
        <div>
          {q.options.map((opt, i) => {
            const correctIndex = optionLetters.indexOf(
              q.answer?.toUpperCase()
            );
            const isSelected = answers[q.id] === opt;

            let bg = "#2563eb";
            if (mode === "Practice" && isSelected && i === correctIndex)
              bg = "#10b981";
            else if (mode === "Practice" && isSelected)
              bg = "#c0392b";

            return (
              <button
                key={i}
                onClick={() => handleAnswer(q.id, opt)}
                style={{ ...styles.optionBtn, backgroundColor: bg }}
              >
                {optionLetters[i]}. {opt}
              </button>
            );
          })}
        </div>
      )}

      {mode === "Practice" && (
  <>
    <button
      onClick={() => fetchAIExplanation(q)}
      style={styles.secondaryBtn}
    >
      Show Explanation
    </button>

    {aiExplanations[q.id] && (
      <div style={styles.explanation}>
        {aiExplanations[q.id]}
      </div>
    )}
  </>
)}


      <div style={styles.navigation}>
        {currentIndex > 0 && (
          <button onClick={() => setCurrentIndex(currentIndex - 1)}>Prev</button>
        )}
        {currentIndex < filteredQuestions.length - 1 && (
          <button onClick={() => setCurrentIndex(currentIndex + 1)}>Next</button>
        )}
        {currentIndex === filteredQuestions.length - 1 && (
          <button onClick={finishTest}>Finish</button>
        )}
      </div>
    </div>
  );
}

/* ----------------- STYLES (UNCHANGED) ----------------- */
const styles = {
  container: {
    maxWidth: 900,
    margin: "auto",
    padding: 20,
  },
  primaryBtn: {
    padding: "10px 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "10px 15px",
    background: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginTop: 10,
  },
  optionBtn: {
    padding: "10px 15px",
    margin: "5px 0",
    borderRadius: 6,
    color: "#fff",
    border: "none",
    width: "100%",
    cursor: "pointer",
  },
  navigation: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 15,
  },
  filtersContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
    gap: 12,
    marginBottom: 25,
  },

  explanation: {
  marginTop: 10,
  padding: 12,
  background: "#111827",
  color: "#e5e7eb",
  borderRadius: 6,
  lineHeight: 1.6,
}

};

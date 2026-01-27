// Home.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setSEO } from "../utils/seo";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { fetchPublicQuestions } from "../services/questions";

import PageContainer from "../ui/layout/PageContainer";
import FloatingNavbar from "../ui/navigation/FloatingNavbar";
import BottomDock from "../ui/navigation/BottomDock";
import Section from "../ui/components/Section";
import Card from "../ui/components/Card";
import Button from "../ui/components/Button";



import TopNotification from "../components/TopNotification";
import banner from "../assets/banner.png";
import logo from "../assets/logo.png";

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showCount, setShowCount] = useState(3);
  const [examFilter, setExamFilter] = useState("ALL");
  const [subjectFilter, setSubjectFilter] = useState("ALL");

  const [menuOpen, setMenuOpen] = useState(false);

  /* ================= SEO ================= */
  useEffect(() => {
    setSEO({
      title: "EXAM SHARP SCHOOL WAEC & NECO Past Questions",
      description:
        "Study WAEC & NECO past questions for free. Practice tests available. Community discussion included.",
    });
  }, []);

  /* ================= LOAD QUESTIONS ================= */
  useEffect(() => {
    async function loadQuestions() {
      try {
        const data = await fetchPublicQuestions();
        const freeOnly = data.filter((q) => q.isTest === false);
        setQuestions(freeOnly);
        setFiltered(freeOnly);
      } catch (err) {
        console.error(err);
      }
    }
    loadQuestions();
  }, []);

  /* ================= FILTER ================= */
  const applyFilter = (exam, subject) => {
    let data = [...questions];
    if (exam !== "ALL") data = data.filter((q) => q.exam === exam);
    if (subject !== "ALL") data = data.filter((q) => q.subject === subject);
    setFiltered(data);
  };

   /* ================= SHOW MORE ================= */
  const showMore = () => setShowCount(prev => prev + 3);

  /* ================= UNIQUE SUBJECTS ================= */
  const subjects = [...new Set(questions.map(q => q.subject))];

   /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

 return (
  <PageContainer>
    {/* 🔝 FLOATING NAVBAR (Desktop/Tablet) */}
    <FloatingNavbar user={user} onLogout={handleLogout} />

    {/* 📰 TOP NOTIFICATION */}
    <div style={{ marginTop: 90 }}>
      <TopNotification />
    </div>

    {/* 🎯 HERO */}
    <Section>
      <div style={{ textAlign: "center" }}>
        <img src={banner} alt="banner" style={{ width: "100%", borderRadius: 12 }} />
        <p style={{ color: "#9ca3af", marginTop: 15 }}>
          Study freely. Practice smarter. Test yourself when ready.
        </p>
        <div style={{ marginTop: 15 }}>
          <Link to="/test">
            <Button variant="primary">Take Practice Test</Button>
          </Link>
        </div>
      </div>
    </Section>

    {/* 📚 FREE QUESTIONS */}
    <Section title="Past Questions (Free)">
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <select
          value={examFilter}
          onChange={(e) => {
            setExamFilter(e.target.value);
            applyFilter(e.target.value, subjectFilter);
          }}
          style={filterStyle}
        >
          <option value="ALL">All Exams</option>
          <option value="WAEC">WAEC</option>
          <option value="NECO">NECO</option>
        </select>

        <select
          value={subjectFilter}
          onChange={(e) => {
            setSubjectFilter(e.target.value);
            applyFilter(examFilter, e.target.value);
          }}
          style={filterStyle}
        >
          <option value="ALL">All Subjects</option>
          {subjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {filtered.slice(0, showCount).map((q, i) => (
        <Card key={q.id} hover>
          <h3>{i + 1}. {q.subject} — {q.exam}</h3>
          <p style={{ color: "#9ca3af" }}>{q.text}</p>
        </Card>
      ))}

      {showCount < filtered.length && (
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <Button variant="secondary" onClick={() => setShowCount(p => p + 3)}>
            More Questions
          </Button>
        </div>
      )}
    </Section>

    {/* 🎯 SUBJECT SHORTCUTS */}
    <Section title="More For You">
      <p style={{ color: "#9ca3af" }}>Click a subject to view related questions:</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 15 }}>
        {subjects.map(sub => (
          <Button
            key={sub}
            variant="ghost"
            onClick={() => {
              setSubjectFilter(sub);
              applyFilter(examFilter, sub);
            }}
          >
            {sub}
          </Button>
        ))}
      </div>
    </Section>

    {/* 💬 COMMUNITY CTA */}
    <Section>
      <Card style={{ textAlign: "center", background: "#1f2937" }}>
        <h2>Student Community</h2>
        <p style={{ color: "#9ca3af" }}>
          Discuss exams, share tips, and motivate each other.
        </p>
        <Link to="/community">
          <Button variant="secondary" style={{ marginTop: 10 }}>
            Enter Community
          </Button>
        </Link>
      </Card>
    </Section>

    {/* 📱 MOBILE BOTTOM DOCK */}
    <BottomDock user={user} />

    {/* 🦶 FOOTER */}
    <footer style={footerStyle}>
      <p>
        Need Premium Practice Access{" "}
        <a
          href="https://wa.me/2349037306845?text=I%20want%20to%20activate%20test%20access"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#10b981" }}
        >
          Pay Admin on WhatsApp
        </a>
      </p>

      <p style={{ marginTop: 8 }}>
        <Link to="/about">About</Link> · <Link to="/privacy">Privacy</Link> ·{" "}
        <Link to="/terms">Terms</Link> · <Link to="/contact">Contact</Link>
      </p>

      <p style={{ marginTop: 10, color: "#6b7280" }}>
        © {new Date().getFullYear()} Exam Sharp School
      </p>
    </footer>
  </PageContainer>
);

}

/* ================= STYLES ================= */
const filterStyle = {
  padding: 10,
  borderRadius: 8,
  background: "#111827",
  color: "#fff",
  border: "1px solid #1f2937",
};

const footerStyle = {
  textAlign: "center",
  padding: "40px 20px 120px",
  fontSize: 14,
  color: "#9ca3af",
};

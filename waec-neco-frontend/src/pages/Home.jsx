// Home.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setSEO } from "../utils/seo";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { fetchPublicQuestions } from "../services/questions";


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
    <div style={styles.page}>
      {/* ================= HEADER ================= */}
      <header style={styles.header}>
        <img src={logo} style={styles.logo} alt="logo" />
                {/* Desktop Nav */}
        <nav style={styles.navDesktop}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/test" style={styles.navLink}>Practice Test</Link>
          <Link to="/community" style={styles.navLink}>Community</Link>

          {!user ? (
            <>
              <Link to="/login" style={styles.navLink}>Login</Link>
              <Link to="/register" style={styles.navLink}>Register</Link>
            </>
          ) : (
            <>
              <Link to="/profile" style={styles.navLink}>Profile</Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={styles.hamburger}
        >
          ☰
        </button>
      </header>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/test" onClick={() => setMenuOpen(false)}>Practice Test</Link>
          <Link to="/community" onClick={() => setMenuOpen(false)}>Community</Link>

          {!user ? (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          ) : (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={handleLogout} style={styles.mobileLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      )}

      {/* ================= TOP ================= */}
      <div style={styles.adBanner}>
        <TopNotification />
      </div>

      {/* ================= HERO ================= */}
      <section style={styles.hero}>
        <img src={banner} style={styles.banner} alt="banner" />
        <p>Study freely. Practice smarter. Test yourself when ready.</p>
        <Link to="/test">
          <button style={styles.primaryBtn}>Take Practice Test</button>
        </Link>
      </section>

      {/* ================= QUESTIONS ================= */}
      <section style={styles.container}>
        <h2>Past Questions (Free)</h2>

        <div style={styles.filters}>
          <select
            value={examFilter}
            onChange={(e) => {
              setExamFilter(e.target.value);
              applyFilter(e.target.value, subjectFilter);
            }}
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
          >
            <option value="ALL">All Subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {filtered.slice(0, showCount).map((q, i) => (
          <div key={q.id} style={styles.card}>
            <h3>{i + 1}. {q.subject} — {q.exam}</h3>
            <p>{q.text}</p>
          </div>
        ))}

        {showCount < filtered.length && (
          <button style={styles.secondaryBtn} onClick={() => setShowCount(p => p + 3)}>
            More Questions
          </button>
        )}
      </section>

       {/* ================= MORE FOR YOU ================= */}
      <section style={styles.moreForYou}>
        <h2>More For You</h2>
        <p>Click a subject to view related questions:</p>
        <div style={styles.subjectsWrapper}>
          {subjects.map(sub => (
            <button
              key={sub}
              style={styles.subjectBtn}
              onClick={() => { setSubjectFilter(sub); applyFilter(examFilter, sub); }}
            >
              {sub}
            </button>
          ))}
        </div>
      </section>

      {/* ================= INLINE AD ================= */}
      <div style={styles.inlineAd}>
        
      </div>

      {/* ================= COMMUNITY CTA ================= */}
      <section style={styles.communityBox}>
        <h2>Student Community</h2>
        <p>Discuss exams, share tips, and motivate each other.</p>

        <Link to="/community">
          <button style={styles.secondaryBtn}>Enter Community</button>
        </Link>
      </section>

      {/* ================= FOOTER AD ================= */}
      <div style={styles.footerAd}>
       
      </div>

      {/* ================= FOOTER ================= */}
      <footer style={styles.footer}>
        <p>
          Need Premium Practice Access?{" "}
          <a
            href="https://wa.me/2349037306845?text=I%20want%20to%20activate%20test%20access"
            target="_blank"
            rel="noreferrer"
          >
            Pay Admin on WhatsApp
          </a>
        </p>
         <p>
    <Link to="/about">About</Link> ·{" "}
    <Link to="/privacy">Privacy Policy</Link> ·{" "}
    <Link to="/terms">Terms</Link> ·{" "}
    <Link to="/contact">Contact</Link>
  </p>

        <p style={{ marginTop: 10 }}>
          © {new Date().getFullYear()} Exam Sharp School ·{" "}
          <Link to="/admin">Admin</Link>
        </p>
      </footer>

    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: { background: "#0f0f0f", color: "#fff" },

  header: {
    display: "flex",
    alignItems: "center",
    padding: 15,
    background: "#111827",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  hamburger: {
    marginLeft: "auto",
    fontSize: 22,
    background: "none",
    color: "#fff",
    border: "none",
    display: "none",
  },
   navDesktop: {
    display: "flex",
    gap: 15,
  },

  
  mobileMenu: {
    background: "#020617",
    padding: 15,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  mobileLogout: {
    background: "#ef4444",
    border: "none",
    padding: 10,
    borderRadius: 6,
    color: "#fff",
  },

  nav: {
    display: "flex",
    gap: 15,
    marginLeft: "auto",
  },

  navOpen: {
    position: "absolute",
    top: 60,
    right: 10,
    background: "#111827",
    flexDirection: "column",
    padding: 15,
  },

  navLink: { color: "#fff", textDecoration: "none" },

  logoutBtn: {
    background: "transparent",
    border: "1px solid #ef4444",
    color: "#ef4444",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
  },



  primaryBtn: {
    background: "#2563eb",
    color: "#fff",
    padding: "12px 25px",
    border: "none",
    borderRadius: 6,
  },

  secondaryBtn: {
    background: "#10b981",
    padding: "10px 20px",
    border: "none",
    borderRadius: 6,
  },

  adBanner: {
    background: "#1f2937",
    padding: 10,
    textAlign: "center",
  },


hero: {
    textAlign: "center",
    padding: "40px 20px",
  },

  container: {
    maxWidth: 900,
    margin: "auto",
    padding: 20,
  },

  sectionTitle: {
    marginBottom: 20,
  },

  filters: {
    display: "flex",
    gap: 15,
    marginBottom: 25,
    flexWrap: "wrap",
  },

  filterSelect: {
    padding: 10,
    borderRadius: 6,
  },

 card: {
  background: "#111827",
  padding: 18,
  borderRadius: 10,
  marginBottom: 25,
  lineHeight: 1.7,
  fontSize: 15,
},


  image: {
    width: "100%",
    marginTop: 10,
    borderRadius: 6,
  },

  answer: {
    background: "#1f2937",
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
  },



  inlineAd: {
    maxWidth: 900,
    margin: "40px auto",
    padding: 20,
    background: "#1f2937",
    textAlign: "center",
  },

  communityBox: {
    margin: "60px auto",
    maxWidth: 900,
    padding: 30,
    background: "#111827",
    borderRadius: 12,
    textAlign: "center",
  },

  footerAd: {
    background: "#1f2937",
    padding: 15,
    textAlign: "center",
  },

  footer: {
    padding: 20,
    textAlign: "center",
    fontSize: 14,
    background: "#020617",
  },
  banner:{
    width: '100%',
    height: 'auto',
  },
  logo:{
    width: '40%',
    height: 'auto',
  },
 

};

/* ================= MOBILE ================= */
styles["@media(max-width: 768px)"] = {
  navDesktop: { display: "none" },
  hamburger: { display: "block" },
};

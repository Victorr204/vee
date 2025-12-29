import { useEffect, useState } from "react";
import { getStoredQuestions } from "../utils/storage";
import { Link } from "react-router-dom";
import { setSEO } from "../utils/seo";
import banner from "../assets/banner.png";
import logo from "../assets/logo.png";


export default function Home() {
  const [questions, setQuestions] = useState([]); // FREE ONLY (base)
  const [filtered, setFiltered] = useState([]);  // FILTERED VIEW

  const [showCount, setShowCount] = useState(3); // number of questions initially

  const [examFilter, setExamFilter] = useState("ALL");
  const [subjectFilter, setSubjectFilter] = useState("ALL");

  /* ================= LOAD FREE QUESTIONS ONLY ================= */
  useEffect(() => {
     setSEO({
    title: "EXAM SHARP SCHOOL WAEC & NECO Past Questions (Free & Practice Tests)",
    description:
      "Study WAEC & NECO past questions for free. Practice tests available. Community discussion included.",
  });
  

    const all = getStoredQuestions();
    const freeOnly = all.filter(q => q.isTest === false);

    setQuestions(freeOnly);
    setFiltered(freeOnly);
  }, []);

  /* ================= APPLY FILTER ================= */
  const applyFilter = (exam, subject) => {
    let data = [...questions]; // questions === FREE ONLY

    if (exam !== "ALL") {
      data = data.filter(q => q.exam === exam);
    }

    if (subject !== "ALL") {
      data = data.filter(q => q.subject === subject);
    }

    setFiltered(data);
  };
  /* ================= SHOW MORE ================= */
  const showMore = () => setShowCount(prev => prev + 3);

  /* ================= UNIQUE SUBJECTS ================= */
  const subjects = [...new Set(questions.map(q => q.subject))];
  

  return (
    <div style={styles.page}>
      {/* ================= HEADER ================= */}
      <header style={styles.header}>
        <h2 style={{ margin: 0 }}> <img src={logo} style={styles.logo} alt="logo" /> </h2>

        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/test" style={styles.navLink}>Practice Test</Link>
          <Link to="/community" style={styles.navLink}>Community</Link>
        </nav>
      </header>

      {/* ================= TOP AD ================= */}
      <div style={styles.adBanner}>
        
      </div>

      {/* ================= HERO ================= */}
      <section style={styles.hero}>
        <h1><img src={banner} style={styles.banner} alt="banner" /></h1>
        <p>Study freely. Practice smarter. Test yourself when ready.</p>

        <Link to="/test">
          <button style={styles.primaryBtn}>Take Practice Test</button>
        </Link>
      </section>

      {/* ================= QUESTIONS ================= */}
      <section style={styles.container}>
        <h2 style={styles.sectionTitle}>Past Questions (Free)</h2>

        {/* FILTERS */}
        <div style={styles.filters}>
          <select
            value={examFilter}
            onChange={(e) => { const v = e.target.value; setExamFilter(v); applyFilter(v, subjectFilter); }}
            style={styles.filterSelect}
          >
            <option value="ALL">All Exams</option>
            <option value="WAEC">WAEC</option>
            <option value="NECO">NECO</option>
          </select>

          <select
            value={subjectFilter}
            onChange={(e) => { const v = e.target.value; setSubjectFilter(v); applyFilter(examFilter, v); }}
            style={styles.filterSelect}
          >
            <option value="ALL">All Subjects</option>
            {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
          </select>
        </div>

        {filtered.length === 0 && <p>No questions match your filter.</p>}

        {/* ✅ SHOW LIMITED QUESTIONS */}
        {filtered.slice(0, showCount).map((q, index) => (
          <div key={q.id} style={styles.card}>
            <h3>{index + 1}. {q.subject} — {q.exam} {q.type} ({q.year})</h3>
            <p style={{ whiteSpace: "pre-line" }}>{q.text}</p>
            {q.images?.map((img, i) => <img key={i} src={img} alt="question" style={styles.image} />)}
            {q.answer && (
              <div style={styles.answer}>
                <strong>Answer:</strong><br />{q.answer}
              </div>
            )}
          </div>
        ))}

        {/* Show More Button */}
        {showCount < filtered.length && (
          <button style={styles.secondaryBtn} onClick={showMore}>More Questions</button>
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
          © {new Date().getFullYear()} WAEC & NECO Prep ·{" "}
          <Link to="/admin">Admin</Link>
        </p>
      </footer>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    background: "#0f0f0f",
    color: "#fff",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    background: "#111827",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  nav: {
    display: "flex",
    gap: 15,
  },

  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: 14,
  },

  adBanner: {
    background: "#1f2937",
    padding: 15,
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

  primaryBtn: {
    padding: "14px 30px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },

  secondaryBtn: {
    padding: "12px 25px",
    background: "#10b981",
    color: "#000",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
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
  }
};

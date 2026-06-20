import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import './index.css';
import logoImg from './logo.jpg';
import heroHeartImg from './assets/hero_heart_3d.png';
import Booking from './Booking.jsx';
import Admin from './Admin.jsx';
import Auth from './Auth.jsx';
/* ── QUIZ DATA ─────────────────────────────────────── */
const QUIZ = [
  {
    q: "When you think about going to a doctor, what's the first feeling that comes up?",
    hint: "Take your time. We're here to understand your concerns, not judge them.",
    msg: "Getting started is the hardest part.",
    opts: [
      { icon: "", title: "Dread", text: "I'm afraid of what they might discover", val: "fear" },
      { icon: "", title: "Embarrassment", text: "I'm worried about what others will think", val: "stigma" },
      { icon: "", title: "Busy Schedule", text: "I genuinely don't have enough time", val: "time" },
      { icon: "", title: "Financial Concerns", text: "I'm worried treatment will be expensive", val: "cost" },
    ],
  },
  {
    q: "If someone close to you had the same symptoms, would you tell them to see a doctor?",
    hint: "There's no wrong answer. Honest responses help provide better guidance.",
    msg: "You're halfway to understanding your healthcare barriers.",
    opts: [
      { icon: "", title: "Yes, immediately", text: "Their health matters more than anything", val: "denial" },
      { icon: "", title: "Probably", text: "But I'd understand if they hesitated", val: "stigma" },
      { icon: "", title: "Maybe", text: "It depends on how serious it seems", val: "denial" },
      { icon: "", title: "Wait and see", text: "I'd tell them to give it some time first", val: "fear" },
    ],
  },
  {
    q: "Have you searched your symptoms online in the last month?",
    hint: "Online searches often hide underlying worry.",
    msg: "Just one more step after this.",
    opts: [
      { icon: "", title: "Yes, multiple times", text: "It's been worrying me a lot", val: "fear" },
      { icon: "", title: "Once or twice", text: "I was just curious", val: "denial" },
      { icon: "", title: "No", text: "I prefer not to know", val: "fear" },
      { icon: "", title: "Yes, it scared me", text: "The results made me more anxious", val: "fear" },
    ],
  },
  {
    q: "What would make it easiest for you to take a first step toward care?",
    hint: "Choose what resonates most right now.",
    msg: "Almost done! We'll prepare your personalized insights.",
    opts: [
      { icon: "", title: "Price Transparency", text: "Knowing exactly what it will cost beforehand", val: "cost" },
      { icon: "", title: "Total Privacy", text: "A way to go without anyone knowing", val: "stigma" },
      { icon: "", title: "Convenience", text: "A 15 minute appointment from my phone", val: "time" },
      { icon: "", title: "Clear Expectations", text: "Someone explaining what to expect", val: "fear" },
    ],
  },
];

const RESULTS = {
  fear: {
    id: "fear",
    label: "Fear of diagnosis",
    color: "#993C1D", bg: "#FAECE7",
    name: "Your barrier: fear of what you might hear",
    body: "This is the most common reason people delay: not laziness, not negligence. The mind protects itself by avoiding confirmation of something it fears. But research consistently shows: the earlier you go, the more options you have.",
    steps: [
      "Start with a telemedicine call, no travel, less pressure",
      "Ask the doctor only to explain what they see, you control the pace",
      "Bring someone you trust if that helps",
      "Remember: most symptoms turn out to be manageable or benign",
    ],
  },
  stigma: {
    id: "stigma",
    label: "Social stigma",
    color: "#854F0B", bg: "#FAEEDA",
    name: "Your barrier: fear of what others will think",
    body: "Stigma is real; in India, health carries social weight. But seeking care is one of the most private things you can do. You don't owe anyone an explanation, and with anonymous telemedicine, no one needs to know.",
    steps: [
      "Use a telemedicine platform, no one you know will see you",
      "Most doctors maintain strict confidentiality",
      "You can describe it as a 'routine check' if asked",
      "Untreated illness is far harder to hide than a consultation",
    ],
  },
  time: {
    id: "time",
    label: "Time constraint",
    color: "#3C3489", bg: "#EEEDFE",
    name: "Your barrier: you're genuinely too busy",
    body: "This one's real. But healthcare has changed: telemedicine consultations take 15 to 20 minutes and can happen during lunch or after 9pm. Your health, if it fails, takes away all the time you've been saving.",
    steps: [
      "Book an after hours telemedicine slot tonight",
      "Try Practo, Tata 1mg, or MFine for same day appointments",
      "Ask your employer, many offer free health consultations",
      "Schedule it like a meeting you cannot cancel",
    ],
  },
  cost: {
    id: "cost",
    label: "Cost concern",
    color: "#085041", bg: "#E1F5EE",
    name: "Your barrier: worry about what it will cost",
    body: "This is one of the most solvable barriers. India's PHCs provide free consultations. Ayushman Bharat covers ₹5 lakh per year for eligible families. The first step rarely costs what people fear it will.",
    steps: [
      "Find your nearest PHC, most consultations are free",
      "Check PMJAY eligibility at pmjay.gov.in",
      "Ask specifically for generic medicine options (Jan Aushadhi)",
      "Use eSanjeevani, free government telemedicine",
    ],
  },
  denial: {
    id: "denial",
    label: "Denial / uncertainty",
    color: "#444441", bg: "#F1EFE8",
    name: "Your barrier: hoping it goes away on its own",
    body: "The mind defaults to optimism when action feels uncertain. Sometimes symptoms do resolve, but the problem is not knowing which ones will. A single consultation gives you certainty, and certainty is almost always less scary than the unknown.",
    steps: [
      "Set a rule: if it persists more than 2 weeks, you check",
      "Book a consultation now while you're thinking about it",
      "You don't need to be certain something's wrong to get checked",
      "Think of it as a 'clear bill of health' appointment",
    ],
  },
};

/* Content fetched from API */
/* ── NAV ───────────────────────────────────────────── */
function Nav({ tab, setTab, dark, setDark, authStatus, setAuthStatus }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const navBackground = useTransform(
    scrollY,
    [0, 50],
    ["rgba(var(--bg-rgb), 0)", "rgba(var(--bg-rgb), 0.9)"]
  );
  const navShadow = useTransform(
    scrollY,
    [0, 50],
    ["none", "0 4px 20px rgba(0,0,0,0.05)"]
  );
  const navPadding = useTransform(
    scrollY,
    [0, 50],
    ["1.5rem 2rem", "1rem 2rem"]
  );

  const tabs = ["home", "quiz", "stories", "plans", "chat"];
  if (authStatus.loggedIn && authStatus.role === 'patient') tabs.push("booking");
  if (authStatus.loggedIn && authStatus.role === 'doctor') tabs.push("admin");

  const handleAuthAction = () => {
    if (authStatus.loggedIn) {
      setAuthStatus({ loggedIn: false, role: null, user: null });
      setTab('home');
    } else {
      setTab('auth');
    }
  };
  return (
    <motion.nav 
      className="nav"
      style={{
        background: navBackground,
        boxShadow: navShadow,
        padding: navPadding,
        backdropFilter: "blur(8px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="nav-logo" onClick={() => setTab("home")}>
        <img src={logoImg} alt="CareBridge AI Logo" className="nav-logo-img" />
        CareBridge AI
      </motion.button>
      <div className="nav-tabs">
        {tabs.map((t) => (
          <button key={t} className={`nav-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "chat" ? "Talk to AI" : t.charAt(0).toUpperCase() + t.slice(1)}
            {tab === t && (
              <motion.div layoutId="nav-indicator" className="nav-active-indicator" style={{ position: 'absolute', bottom: -5, left: 0, right: 0, height: 2, background: 'var(--brand)' }} />
            )}
          </button>
        ))}
      </div>
      <div className="nav-right">
        {authStatus.loggedIn && <span className="nav-username">Hi, {authStatus.user?.name.split(' ')[0]}</span>}
        <button className="nav-auth-btn" onClick={handleAuthAction}>
          {authStatus.loggedIn ? "Logout" : "Login"}
        </button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="theme-toggle" onClick={() => setDark(!dark)}>
          {dark ? "☀️" : "🌙"} <span>{dark ? "Light" : "Dark"}</span>
        </motion.button>
        <button className="nav-mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="nav-mobile-menu"
          >
            {tabs.map((t) => (
              <button key={t} onClick={() => { setTab(t); setMenuOpen(false); }}>
                {t === "chat" ? "Talk to AI" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

/* ── COUNT UP STAT ─────────────────────────────────── */
function CountUpStat({ endValue, label, suffix = "", prefix = "", fadeOnly = false, duration = 2000, heading, colorClass = "" }) {
  const [count, setCount] = useState(fadeOnly ? endValue : 0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (hasStarted && !fadeOnly && typeof endValue === "number" && endValue > 0) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(ease * endValue));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(endValue);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [hasStarted, endValue, duration, fadeOnly]);

  return (
    <motion.div 
      variants={fadeUpVariant}
      onViewportEnter={() => setHasStarted(true)}
      viewport={{ once: true, amount: 0.2 }}
      className={`impact-card ${colorClass}`}
    >
      {heading && <div className="impact-heading">{heading}</div>}
      <div className="impact-num">{prefix}{count}{suffix}</div>
      <div className="impact-label">{label}</div>
    </motion.div>
  );
}

/* ── HOME ──────────────────────────────────────────── */
function Home({ setTab, barriers = [] }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="page-home"
    >
      <div className="hero">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="hero-left"
        >
          <motion.div variants={fadeUpVariant} className="eyebrow"><span className="pulse-dot" />Healthcare access · India</motion.div>
          <motion.h1 variants={fadeUpVariant}>You deserve care.<br /><em>Let's make it easy</em> to ask for it.</motion.h1>
          <motion.p variants={fadeUpVariant} className="hero-sub">CareBridge understands why people hesitate (fear, cost, stigma) and meets you where you are. No judgment. Real next steps.</motion.p>
          <motion.div variants={fadeUpVariant} className="hero-actions">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-primary" onClick={() => setTab("quiz")}>Find your barrier →</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-outline" onClick={() => setTab("chat")}>Talk it through</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-outline" onClick={() => setTab("plans")}>View Care Plans</motion.button>
          </motion.div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="hero-right hero-graphic-container"
        >
          <motion.div 
            animate={{ scale: [1, 1.05, 1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut", repeatDelay: 1 }}
            className="hero-graphic-wrapper" 
            style={{ 
              position: 'relative', 
              width: '360px', 
              height: '360px', 
              borderRadius: '50%', 
              overflow: 'hidden', 
              boxShadow: '0 20px 40px rgba(139,94,60,0.2)',
              border: '6px solid var(--surface)'
            }}
          >
            <img src={heroHeartImg} alt="Realistic Heart and Stethoscope" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
        </motion.div>
      </div>

      <div className="trust-strip">
        {["100% anonymous, no account needed", "Supports Hindi, English & regional languages", "Powered by Gemini AI, backed by human care", "Linked to Ayushman Bharat & PMJAY"].map((t) => (
          <div key={t} className="trust-item"><span className="trust-dot" />{t}</div>
        ))}
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="section impact-section"
      >
        <motion.div variants={fadeUpVariant} className="section-label">Impact in Numbers</motion.div>
        <motion.h2 variants={fadeUpVariant} className="section-title">Making Healthcare More Accessible</motion.h2>
        <motion.p variants={fadeUpVariant} className="section-desc">CareBridge AI is designed to reduce barriers to care and empower users with intelligent guidance and seamless healthcare access.</motion.p>
        <motion.div variants={staggerContainer} className="impact-grid">
          <CountUpStat endValue={67} suffix="%" label="People delay medical care due to emotional or practical barriers." heading="Delayed Care" colorClass="impact-bg-1" />
          <CountUpStat endValue={54} suffix="%" label="Report feeling more confident after understanding their options." heading="Increased Confidence" colorClass="impact-bg-2" />
          <CountUpStat endValue={6} label="Key psychological barriers to care actively addressed by our AI." heading="Key Barriers" colorClass="impact-bg-3" />
          <CountUpStat endValue="24/7" fadeOnly={true} label="Always-available assistance and health information." heading="Always Available" colorClass="impact-bg-4" />
        </motion.div>
      </motion.div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="section barriers-section"
      >
        <motion.div variants={fadeUpVariant} className="section-label">Understanding hesitation</motion.div>
        <motion.h2 variants={fadeUpVariant} className="section-title">The six barriers CareBridge addresses</motion.h2>
        <motion.p variants={fadeUpVariant} className="section-desc">These aren't excuses, they are real psychological patterns. Recognising yours is the first step toward care.</motion.p>

        <motion.div variants={staggerContainer} className="barriers-grid">
          {barriers.map((b) => (
            <motion.div 
              key={b.name} 
              variants={fadeUpVariant}
              whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(0,0,0,0.06)", borderColor: "rgba(139, 94, 60, 0.2)" }}
              className="barrier-card"
            >
              <div className="barrier-hero-img-wrapper">
                <img src={b.icon} className="barrier-hero-img" alt={b.name} />
              </div>
              <div className="barrier-card-content">
                <div className="barrier-name">{b.name}</div>
                <div className="barrier-desc">{b.desc}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">CareBridge</div>
            <div className="footer-note">Bridging the gap between symptoms and care, one conversation at a time.</div>
          </div>
          <div className="footer-note" style={{ textAlign: "right" }}>
            Not a medical service. Always consult a licensed professional.<br />
            Anonymous · No account needed · Built for India
          </div>
        </div>
        <div className="crisis-banner">
          🆘 <strong>In crisis?</strong> iCall: 9152987821 · Vandrevala: 1860 2662 345 · NIMHANS: 080 46110007 · Snehi: 044 24640050
        </div>
      </footer>
    </motion.div>
  );
}

/* ── QUIZ ──────────────────────────────────────────── */
function Quiz({ setTab, quizResult, setQuizResult }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOpt, setSelectedOpt] = useState(null);

  const pick = (val, idx) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    const newAns = [...answers, val];
    setTimeout(() => {
      setAnswers(newAns);
      setSelectedOpt(null);
      if (step === QUIZ.length - 1) {
        const counts = newAns.reduce((acc, v) => { acc[v] = (acc[v] || 0) + 1; return acc; }, {});
        const top = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        
        fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ barrierId: top, answers: newAns })
        }).catch(err => console.error("Analytics error:", err));

        setQuizResult(RESULTS[top]);
      } else {
        setStep(step + 1);
      }
    }, 600);
  };

  const reset = () => { setStep(0); setAnswers([]); setQuizResult(null); setSelectedOpt(null); };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="page-inner quiz-page-bg"
    >
      <div className="quiz-header-block">
        <motion.h2 variants={fadeUpVariant} initial="hidden" animate="show" className="section-title">What's really holding you back?</motion.h2>
        <motion.p variants={fadeUpVariant} initial="hidden" animate="show" transition={{ delay: 0.1 }} className="quiz-subtitle">Answer four quick questions to discover the biggest barrier preventing you from seeking healthcare. There are no right or wrong answers.</motion.p>
        <motion.div variants={fadeUpVariant} initial="hidden" animate="show" transition={{ delay: 0.2 }} className="quiz-trust-badge">
          🔒 Anonymous • Secure • No Judgment • Takes Less Than 90 Seconds
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {!quizResult ? (
          <motion.div 
            key={`step-${step}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="card quiz-card"
          >
          <div className="quiz-progress-wrapper">
            <div className="quiz-progress-circles">
              {QUIZ.map((_, i) => (
                <React.Fragment key={i}>
                  <div className={`quiz-circle ${i < step ? "done" : i === step ? "active" : ""}`} />
                  {i < QUIZ.length - 1 && <div className={`quiz-line ${i < step ? "done" : ""}`} />}
                </React.Fragment>
              ))}
            </div>
            <div className="quiz-progress-msg">{QUIZ[step].msg}</div>
          </div>
          
          <div className="quiz-q">{QUIZ[step].q}</div>
          <div className="quiz-hint">{QUIZ[step].hint}</div>
          <div className="quiz-opts-premium">
            {QUIZ[step].opts.map((o, idx) => (
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                key={o.text} 
                className={`quiz-opt-card ${selectedOpt === idx ? 'selected' : ''}`} 
                onClick={() => pick(o.val, idx)}
              >
                <div className="opt-content">
                  <div className="opt-title">{o.title}</div>
                  <div className="opt-text">{o.text}</div>
                </div>
                <div className={`opt-check ${selectedOpt === idx ? 'visible' : ''}`}>✓</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div 
          key="result"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="card result-card-premium"
        >
          <div className="result-top-indicator">Analysis Complete • 92% Confidence</div>
          <div className="result-header">
            <div className="result-pre-title">Your Primary Barrier</div>
            <div className="result-tag" style={{ background: quizResult.bg, color: quizResult.color }}>{quizResult.label}</div>
          </div>
          
          <p className="result-body">{quizResult.body}</p>
          
          <div className="steps-premium-box">
            <div className="steps-label">Recommended Next Steps</div>
            <div className="result-steps-clean">
              {quizResult.steps.map((s, i) => (
                <div key={i} className="result-step-clean">
                  <span className="step-check">✓</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="result-actions-stack">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-primary btn-large" onClick={() => setTab("chat")}>Talk to CareBridge AI</motion.button>
            {quizResult === RESULTS.cost && (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-primary" onClick={() => setTab("plans")}>View Care Plans →</motion.button>
            )}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-outline" onClick={reset}>Retake quiz</motion.button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── STORIES ───────────────────────────────────────── */
function Stories({ stories = [], setTab, quizResult }) {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedStory, setExpandedStory] = useState(null);

  const categories = ["All", "Cost", "Stigma", "Time", "Fear", "Distance", "Denial"];

  const getRecommendedCategory = () => {
    if (!quizResult) return null;
    if (quizResult.id === "masculinity") return "Stigma";
    const match = categories.find(c => c.toLowerCase() === quizResult.id?.toLowerCase());
    return match || null;
  };

  const recCat = getRecommendedCategory();

  let displayStories = [...stories];

  // Apply Search
  if (searchQuery) {
    displayStories = displayStories.filter(s => 
      s.quote.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply Filter
  if (filter !== "All") {
    displayStories = displayStories.filter(s => s.category === filter);
  }

  // Prioritize Recommended
  if (recCat && filter === "All" && !searchQuery) {
    displayStories.sort((a, b) => {
      if (a.category === recCat && b.category !== recCat) return -1;
      if (a.category !== recCat && b.category === recCat) return 1;
      return 0;
    });
  }



  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="page-inner page-stories"
    >
      <motion.div variants={fadeUpVariant} initial="hidden" animate="show">
        <div className="section-label">Real voices</div>
        <h2 className="section-title">People just like you who took the step</h2>
        <p className="section-desc">Names changed for privacy, but the journeys are real.</p>
      </motion.div>

      {/* Search & Filters */}
      <div className="stories-controls">
        <div className="stories-search-wrapper">
          <span className="search-icon"></span>
          <input 
            type="text" 
            className="stories-search" 
            placeholder="Find a story that resonates with you..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="stories-filters">
          {categories.map(c => (
            <button 
              key={c} 
              className={`filter-chip ${filter === c ? 'active' : ''}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="stories-grid-premium"
      >
        {displayStories.length === 0 ? (
          <motion.div variants={fadeUpVariant} className="no-stories">No stories found matching your criteria.</motion.div>
        ) : (
          displayStories.map((s, i) => {
            const isSimilar = recCat && s.category === recCat;
            const isExpanded = expandedStory === s.name;
            return (
              <motion.div 
                key={s.name} 
                variants={fadeUpVariant}
                whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}
                layout
                className={`story-card-premium ${isSimilar ? 'similar-highlight' : ''}`}
              >
                {isSimilar && <div className="similar-badge">Similar to You</div>}
                <div className="story-premium-header">
                  <div className="story-tag-premium" style={{ background: s.tagBg, color: s.tagColor }}>{s.tag}</div>
                </div>
                
                <p className={`story-premium-quote ${isExpanded ? 'expanded' : ''}`}>
                  "{s.quote}"
                </p>
                
                {s.quote.length > 120 && (
                  <button className="read-more-btn" onClick={() => setExpandedStory(isExpanded ? null : s.name)}>
                    {isExpanded ? 'Read Less' : 'Read More'}
                  </button>
                )}

                <div className="story-premium-footer">
                  <div className="story-premium-name">{s.name}</div>
                  <div className="story-premium-outcome">
                    <span className="outcome-check">✓</span> {s.outcome}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>

      {/* CTA SECTION */}
      <motion.div 
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        className="stories-cta"
      >
        <h2>Your journey can start today.</h2>
        <p>Thousands of people overcome healthcare barriers by taking one small first step. Discover yours in under 90 seconds.</p>
        <div className="cta-actions">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-primary btn-large" onClick={() => setTab("quiz")}>Take the Barrier Quiz</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-outline btn-large" onClick={() => setTab("chat")}>Talk to CareBridge AI</motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── CARE PLANS ────────────────────────────────────── */
function CarePlans({ setTab }) {
  const steps = [
    { icon: "👤", title: "Create Your Account", desc: "Sign up securely and set up your personal health profile in minutes." },
    { icon: "🤖", title: "Describe Symptoms", desc: "Use the AI-powered assistant to explain your concerns and receive intelligent guidance." },
    { icon: "🩺", title: "Connect with Pros", desc: "Book appointments or consult verified medical experts based on your needs." },
    { icon: "📈", title: "Track Wellness", desc: "Manage appointments, monitor progress, and keep your healthcare journey organized." },
  ];

  const plans = [
    { name: "Starter", desc: "Best for individuals beginning their digital healthcare journey.", features: ["AI symptom guidance", "Appointment scheduling", "Health reminders", "Secure profile management"], btn: "Get Started", pop: false },
    { name: "Family", desc: "Designed for households managing multiple family members.", features: ["Everything in Starter", "Multiple patient profiles", "Shared health records", "Priority appointment booking", "Family health dashboard"], btn: "Choose Family Plan", pop: true },
    { name: "Premium", desc: "Ideal for users seeking an enhanced healthcare experience.", features: ["Everything in Family", "Priority support", "Advanced health insights", "Faster consultation access", "Comprehensive wellness tracking"], btn: "Explore Premium", pop: false },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="page-inner page-plans"
    >
      <div className="section-label">How It Works</div>
      <h2 className="section-title">Transforming your healthcare journey</h2>
      <p className="section-desc">Experience a seamless path to better health, from intelligent symptom guidance to professional consultations.</p>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="timeline-grid"
      >
        {steps.map((s, i) => (
          <motion.div variants={fadeUpVariant} key={i} className="timeline-step">
            <div className="timeline-icon">{s.icon}</div>
            <div className="timeline-title">{s.title}</div>
            <div className="timeline-desc">{s.desc}</div>
            {i < steps.length - 1 && <div className="timeline-arrow">→</div>}
          </motion.div>
        ))}
      </motion.div>

      <div className="section-label" style={{ marginTop: "4.5rem" }}>Care Plans</div>
      <h2 className="section-title">Choose the right plan for you</h2>
      <p className="section-desc">Empower your healthcare journey with AI-driven guidance and seamless care.</p>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="plans-grid"
      >
        {plans.map((p, i) => (
          <motion.div 
            variants={fadeUpVariant}
            whileHover={{ y: -8, boxShadow: "0 12px 24px rgba(0,0,0,0.08)" }}
            key={p.name} 
            className={`plan-card card ${p.pop ? 'plan-popular' : ''}`}
          >
            {p.pop && <div className="plan-badge">Most Popular</div>}
            <div className="plan-name">{p.name}</div>
            <div className="plan-desc">{p.desc}</div>
            <ul className="plan-features">
              {p.features.map(f => <li key={f}><span className="feature-check">✓</span> {f}</li>)}
            </ul>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`btn ${p.pop ? 'btn-primary' : 'btn-outline'} plan-btn`} onClick={() => setTab("chat")}>{p.btn}</motion.button>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        variants={fadeUpVariant}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        className="cta-banner"
      >
        <h3>Ready to take control of your health?</h3>
        <p>Empower your healthcare journey with AI-driven guidance, seamless appointment booking, and personalized care—all in one secure platform.</p>
        <div className="cta-actions">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-primary" onClick={() => setTab("quiz")}>Start Your Journey</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-outline" onClick={() => setTab("booking")}>Book a Consultation</motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── CHAT ──────────────────────────────────────────── */
function Chat() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi there 👋 I'm CareBridge. Whatever's making you hesitate about seeing a doctor, I'm here to listen, not lecture. What's been on your mind?" },
  ]);
  const [input, setInput] = useState("");
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleFeedback = (rating) => {
    const API_URL = import.meta.env.DEV ? `http://${window.location.hostname}:3001` : "https://carebridge-ai-vhp0.onrender.com";
    fetch(`${API_URL}/api/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "chat", rating, comment: "" })
    }).catch(e => console.error(e));
    setFeedbackGiven(true);
  };
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const msgsRef = useRef(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, loading]);

  const sendMsg = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    const newMsgs = [...messages, { role: "user", text: msg }];
    setMessages(newMsgs);
    setLoading(true);
    const newHist = [...history, { role: "user", content: msg }];
    try {
      const API_URL = import.meta.env.DEV ? `http://${window.location.hostname}:3001` : "https://carebridge-ai-vhp0.onrender.com";
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history: newHist }),
      });
      const data = await res.json();

      // Rate limited
      if (res.status === 429) {
        setMessages([...newMsgs, { role: "bot", text: `⏳ ${data.message}` }]);
        setLoading(false);
        return;
      }

      const reply = data.reply || data.result || "I'm here, can you tell me a bit more about what's stopping you?";
      setHistory([...newHist, { role: "assistant", content: reply }]);
      setMessages([...newMsgs, { role: "bot", text: reply }]);
    } catch {
      setMessages([...newMsgs, { role: "bot", text: "I'm having trouble connecting right now. What's on your mind about seeing a doctor?" }]);
    }
    setLoading(false);
  };

  const QUICK = ["I keep putting it off", "I'm scared of bad news", "I can't afford it", "I don't have time"];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="page-inner page-chat"
    >
      <div className="section-label">Talk it through</div>
      <h2 className="section-title">CareBridge is here for you</h2>
      <p className="section-desc">No forms, no registration. An honest conversation, in English, Hindi, or however you're comfortable.</p>

      <div className="chat-shell">
        <div className="chat-header">
          <div className="chat-avatar">🌉</div>
          <div className="chat-meta">
            <div className="chat-name">CareBridge AI</div>
            <div className="chat-status">Listens without judgment</div>
          </div>
          <div className="online-dot" />
        </div>

        <div className="chat-messages" ref={msgsRef}>
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`msg msg-${m.role}`}
              >
                <div className="msg-bubble">{m.text}</div>
              </motion.div>
            ))}
            {loading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="msg msg-bot"
              >
                <div className="msg-bubble typing-bubble">
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} />
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} />
                  <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {messages.length < 3 && (
          <div className="chat-quick">
            {QUICK.map((c) => (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={c} className="quick-chip" onClick={() => sendMsg(c)}>{c}</motion.button>
            ))}
          </div>
        )}

        {messages.length > 2 && !feedbackGiven && (
          <div className="chat-feedback" style={{ padding: "0.5rem", textAlign: "center", fontSize: "0.8rem", color: "var(--text-soft)", borderTop: "1px solid var(--border)" }}>
            Was this conversation helpful? 
            <button onClick={() => handleFeedback(1)} style={{ background: "none", border: "none", cursor: "pointer", marginLeft: "10px", fontSize: "1.2rem" }}>👍</button>
            <button onClick={() => handleFeedback(-1)} style={{ background: "none", border: "none", cursor: "pointer", marginLeft: "10px", fontSize: "1.2rem" }}>👎</button>
          </div>
        )}

        <div className="chat-input-row">
          <input
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMsg()}
            placeholder="Type how you're feeling…"
          />
          <button className="chat-send" onClick={() => sendMsg()} disabled={!input.trim() || loading}>➤</button>
        </div>
      </div>

      <div className="crisis-banner" style={{ marginTop: "1rem" }}>
        🆘 <strong>In crisis?</strong> Call iCall: 9152987821 · Vandrevala: 1860 2662 345 · NIMHANS: 080 46110007
      </div>
    </motion.div>
  );
}

/* ── APP ───────────────────────────────────────────── */
export default function App() {
  const [tab, setTab] = useState("home");
  const [authStatus, setAuthStatus] = useState({ loggedIn: false, role: null, user: null });
  const [dark, setDark] = useState(false);
  const [content, setContent] = useState({ barriers: [], stories: [] });
  const [loading, setLoading] = useState(true);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const API_URL = import.meta.env.DEV ? `http://${window.location.hostname}:3001` : "https://carebridge-ai-vhp0.onrender.com";
    fetch(`${API_URL}/api/content`)
      .then(res => res.json())
      .then(data => {
        setContent({ barriers: data.barriers || [], stories: data.stories || [] });
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load content", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>Loading CareBridge...</div>;

  return (
    <>
      <Nav tab={tab} setTab={setTab} dark={dark} setDark={setDark} authStatus={authStatus} setAuthStatus={setAuthStatus} />
      <AnimatePresence mode="wait">
        {tab === "home" && <Home key="home" setTab={setTab} barriers={content.barriers} />}
        {tab === "quiz" && <Quiz key="quiz" setTab={setTab} quizResult={quizResult} setQuizResult={setQuizResult} />}
        {tab === "stories" && <Stories key="stories" setTab={setTab} stories={content.stories} quizResult={quizResult} />}
        {tab === "plans" && <CarePlans key="plans" setTab={setTab} />}
        {tab === "chat" && <Chat key="chat" />}
        {tab === "auth" && <Auth key="auth" setAuthStatus={setAuthStatus} setTab={setTab} />}
        {tab === "booking" && (authStatus.loggedIn ? <Booking key="booking" setTab={setTab} /> : <Auth key="auth" setAuthStatus={setAuthStatus} setTab={setTab} />)}
        {tab === "admin" && (authStatus.role === "doctor" ? <Admin key="admin" /> : <Auth key="auth" setAuthStatus={setAuthStatus} setTab={setTab} />)}
      </AnimatePresence>
    </>
  );
}

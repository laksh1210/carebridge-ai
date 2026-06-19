import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import logoImg from './logo.jpg';

/* ── QUIZ DATA ─────────────────────────────────────── */
const QUIZ = [
  {
    q: "When you think about going to a doctor, what's the first feeling that comes up?",
    hint: "Take your time. We're here to understand your concerns, not judge them.",
    msg: "Getting started is the hardest part.",
    opts: [
      { icon: "😟", title: "Dread", text: "I'm afraid of what they might discover", val: "fear" },
      { icon: "😳", title: "Embarrassment", text: "I'm worried about what others will think", val: "stigma" },
      { icon: "💼", title: "Busy Schedule", text: "I genuinely don't have enough time", val: "time" },
      { icon: "💰", title: "Financial Concerns", text: "I'm worried treatment will be expensive", val: "cost" },
    ],
  },
  {
    q: "If someone close to you had the same symptoms, would you tell them to see a doctor?",
    hint: "There's no wrong answer. Honest responses help provide better guidance.",
    msg: "You're halfway to understanding your healthcare barriers.",
    opts: [
      { icon: "🫂", title: "Yes, immediately", text: "Their health matters more than anything", val: "denial" },
      { icon: "🤝", title: "Probably", text: "But I'd understand if they hesitated", val: "stigma" },
      { icon: "⚖️", title: "Maybe", text: "It depends on how serious it seems", val: "denial" },
      { icon: "⏳", title: "Wait and see", text: "I'd tell them to give it some time first", val: "fear" },
    ],
  },
  {
    q: "Have you searched your symptoms online in the last month?",
    hint: "Online searches often hide underlying worry.",
    msg: "Just one more step after this.",
    opts: [
      { icon: "🔍", title: "Yes, multiple times", text: "It's been worrying me a lot", val: "fear" },
      { icon: "🤔", title: "Once or twice", text: "I was just curious", val: "denial" },
      { icon: "🙈", title: "No", text: "I prefer not to know", val: "fear" },
      { icon: "😰", title: "Yes, it scared me", text: "The results made me more anxious", val: "fear" },
    ],
  },
  {
    q: "What would make it easiest for you to take a first step toward care?",
    hint: "Choose what resonates most right now.",
    msg: "Almost done! We'll prepare your personalized insights.",
    opts: [
      { icon: "💸", title: "Price Transparency", text: "Knowing exactly what it will cost beforehand", val: "cost" },
      { icon: "🕶️", title: "Total Privacy", text: "A way to go without anyone knowing", val: "stigma" },
      { icon: "📱", title: "Convenience", text: "A 15 minute appointment from my phone", val: "time" },
      { icon: "🗺️", title: "Clear Expectations", text: "Someone explaining what to expect", val: "fear" },
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
function Nav({ tab, setTab, dark, setDark }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const tabs = ["home", "quiz", "stories", "plans", "chat"];
  return (
    <nav className="nav">
      <button className="nav-logo" onClick={() => setTab("home")}>
        <img src={logoImg} alt="CareBridge AI Logo" className="nav-logo-img" />
        CareBridge AI
      </button>
      <div className="nav-tabs">
        {tabs.map((t) => (
          <button key={t} className={`nav-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "chat" ? "Talk to AI" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="nav-right">
        <button className="theme-toggle" onClick={() => setDark(!dark)}>
          {dark ? "☀️" : "🌙"} <span>{dark ? "Light" : "Dark"}</span>
        </button>
        <button className="nav-mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </div>
      {menuOpen && (
        <div className="nav-mobile-menu">
          {tabs.map((t) => (
            <button key={t} onClick={() => { setTab(t); setMenuOpen(false); }}>
              {t === "chat" ? "Talk to AI" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
/* ── COUNT UP STAT ─────────────────────────────────── */
function CountUpStat({ endValue, label, suffix = "", prefix = "", fadeOnly = false, duration = 2000, heading, colorClass = "" }) {
  const [count, setCount] = useState(fadeOnly ? endValue : 0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && !fadeOnly && typeof endValue === "number" && endValue > 0) {
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
  }, [isVisible, endValue, duration, fadeOnly]);

  return (
    <div ref={ref} className={`impact-card ${isVisible ? 'fade-in-up' : ''} ${colorClass}`} style={{ opacity: isVisible ? 1 : 0 }}>
      {heading && <div className="impact-heading">{heading}</div>}
      <div className="impact-num">{prefix}{count}{suffix}</div>
      <div className="impact-label">{label}</div>
    </div>
  );
}

/* ── HOME ──────────────────────────────────────────── */
function Home({ setTab, barriers = [] }) {
  return (
    <div className="page-home">
      <div className="hero">
        <div className="hero-left">
          <div className="eyebrow"><span className="pulse-dot" />Healthcare access · India</div>
          <h1>You deserve care.<br /><em>Let's make it easy</em> to ask for it.</h1>
          <p className="hero-sub">CareBridge understands why people hesitate (fear, cost, stigma) and meets you where you are. No judgment. Real next steps.</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => setTab("quiz")}>Find your barrier →</button>
            <button className="btn btn-outline" onClick={() => setTab("chat")}>Talk it through</button>
            <button className="btn btn-outline" onClick={() => setTab("plans")}>View Care Plans</button>
          </div>
        </div>
        <div className="hero-right hero-graphic-container">
          <div className="hero-float">78% feel better after first step ✓</div>
          <div className="css-compass">
            <div className="css-compass-inner">
              <div className="css-compass-core" />
            </div>
          </div>
        </div>
      </div>

      <div className="trust-strip">
        {["100% anonymous, no account needed", "Supports Hindi, English & regional languages", "Powered by Gemini AI, backed by human care", "Linked to Ayushman Bharat & PMJAY"].map((t) => (
          <div key={t} className="trust-item"><span className="trust-dot" />{t}</div>
        ))}
      </div>

      <div className="section impact-section">
        <div className="section-label">Impact in Numbers</div>
        <h2 className="section-title">Making Healthcare More Accessible</h2>
        <p className="section-desc">CareBridge AI is designed to reduce barriers to care and empower users with intelligent guidance and seamless healthcare access.</p>
        <div className="impact-grid">
          <CountUpStat endValue={67} suffix="%" label="People delay medical care due to emotional or practical barriers." heading="Delayed Care" colorClass="impact-bg-1" />
          <CountUpStat endValue={54} suffix="%" label="Report feeling more confident after understanding their options." heading="Increased Confidence" colorClass="impact-bg-2" />
          <CountUpStat endValue={6} label="Key psychological barriers to care actively addressed by our AI." heading="Key Barriers" colorClass="impact-bg-3" />
          <CountUpStat endValue="24/7" fadeOnly={true} label="Always-available assistance and health information." heading="Always Available" colorClass="impact-bg-4" />
        </div>
      </div>

      <div className="section barriers-section">
        <div className="section-label">Understanding hesitation</div>
        <h2 className="section-title">The six barriers CareBridge addresses</h2>
        <p className="section-desc">These aren't excuses, they are real psychological patterns. Recognising yours is the first step toward care.</p>

        <div className="barriers-grid">
          {barriers.map((b) => (
            <div key={b.name} className="barrier-card">
              <div className="barrier-hero-img-wrapper">
                <img src={b.icon} className="barrier-hero-img" alt={b.name} />
              </div>
              <div className="barrier-card-content">
                <div className="barrier-name">{b.name}</div>
                <div className="barrier-desc">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
    </div>
  );
}

/* ── QUIZ ──────────────────────────────────────────── */
function Quiz({ setTab, quizResult, setQuizResult }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const pick = (val, idx) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(idx);
    const newAns = [...answers, val];
    
    setTimeout(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setAnswers(newAns);
        setSelectedOpt(null);
        setIsTransitioning(false);
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
      }, 300);
    }, 600);
  };

  const reset = () => { setStep(0); setAnswers([]); setQuizResult(null); setSelectedOpt(null); setIsTransitioning(false); };

  return (
    <div className="page-inner quiz-page-bg">
      <div className="quiz-header-block">
        <h2 className="section-title">What's really holding you back?</h2>
        <p className="quiz-subtitle">Answer four quick questions to discover the biggest barrier preventing you from seeking healthcare. There are no right or wrong answers.</p>
        <div className="quiz-trust-badge">
          🔒 Anonymous • Secure • No Judgment • Takes Less Than 90 Seconds
        </div>
      </div>

      {!quizResult ? (
        <div className={`card quiz-card ${isTransitioning ? 'fade-out' : 'fade-in-up'}`}>
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
              <button 
                key={o.text} 
                className={`quiz-opt-card ${selectedOpt === idx ? 'selected' : ''}`} 
                onClick={() => pick(o.val, idx)}
              >
                <div className="opt-icon">{o.icon}</div>
                <div className="opt-content">
                  <div className="opt-title">{o.title}</div>
                  <div className="opt-text">{o.text}</div>
                </div>
                <div className={`opt-check ${selectedOpt === idx ? 'visible' : ''}`}>✓</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="card result-card-premium fade-in-up">
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
            <button className="btn btn-primary btn-large" onClick={() => setTab("chat")}>Talk to CareBridge AI</button>
            {quizResult === RESULTS.cost && (
              <button className="btn btn-primary" onClick={() => setTab("plans")}>View Care Plans →</button>
            )}
            <button className="btn btn-outline" onClick={reset}>Retake quiz</button>
          </div>
        </div>
      )}
    </div>
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

  const getIcon = (cat) => {
    switch (cat) {
      case 'Cost': return '💰';
      case 'Stigma': return '🤝';
      case 'Time': return '⏳';
      case 'Fear': return '🛡️';
      case 'Distance': return '🗺️';
      case 'Denial': return '🌤️';
      default: return '💬';
    }
  };

  return (
    <div className="page-inner page-stories">
      <div className="section-label">Real voices</div>
      <h2 className="section-title">People just like you who took the step</h2>
      <p className="section-desc">Names changed for privacy, but the journeys are real.</p>

      {/* Search & Filters */}
      <div className="stories-controls">
        <div className="stories-search-wrapper">
          <span className="search-icon">🔍</span>
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

      <div className="stories-grid-premium">
        {displayStories.length === 0 ? (
          <div className="no-stories">No stories found matching your criteria.</div>
        ) : (
          displayStories.map((s, i) => {
            const isSimilar = recCat && s.category === recCat;
            const isExpanded = expandedStory === s.name;
            return (
              <div 
                key={s.name} 
                className={`story-card-premium fade-in-up ${isSimilar ? 'similar-highlight' : ''}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {isSimilar && <div className="similar-badge">✨ Similar to You</div>}
                <div className="story-premium-header">
                  <div className="story-cat-icon">{getIcon(s.category)}</div>
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
              </div>
            );
          })
        )}
      </div>

      {/* CTA SECTION */}
      <div className="stories-cta fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h2>Your journey can start today.</h2>
        <p>Thousands of people overcome healthcare barriers by taking one small first step. Discover yours in under 90 seconds.</p>
        <div className="cta-actions">
          <button className="btn btn-primary btn-large" onClick={() => setTab("quiz")}>Take the Barrier Quiz</button>
          <button className="btn btn-outline btn-large" onClick={() => setTab("chat")}>Talk to CareBridge AI</button>
        </div>
      </div>
    </div>
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
    <div className="page-inner page-plans">
      <div className="section-label">How It Works</div>
      <h2 className="section-title">Transforming your healthcare journey</h2>
      <p className="section-desc">Experience a seamless path to better health, from intelligent symptom guidance to professional consultations.</p>

      <div className="timeline-grid">
        {steps.map((s, i) => (
          <div key={i} className="timeline-step fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
            <div className="timeline-icon">{s.icon}</div>
            <div className="timeline-title">{s.title}</div>
            <div className="timeline-desc">{s.desc}</div>
            {i < steps.length - 1 && <div className="timeline-arrow">→</div>}
          </div>
        ))}
      </div>

      <div className="section-label" style={{ marginTop: "4.5rem" }}>Care Plans</div>
      <h2 className="section-title">Choose the right plan for you</h2>
      <p className="section-desc">Empower your healthcare journey with AI-driven guidance and seamless care.</p>

      <div className="plans-grid">
        {plans.map((p, i) => (
          <div key={p.name} className={`plan-card card ${p.pop ? 'plan-popular' : ''} fade-in`} style={{ animationDelay: `${i * 0.15}s` }}>
            {p.pop && <div className="plan-badge">Most Popular</div>}
            <div className="plan-name">{p.name}</div>
            <div className="plan-desc">{p.desc}</div>
            <ul className="plan-features">
              {p.features.map(f => <li key={f}><span className="feature-check">✓</span> {f}</li>)}
            </ul>
            <button className={`btn ${p.pop ? 'btn-primary' : 'btn-outline'} plan-btn`} onClick={() => setTab("chat")}>{p.btn}</button>
          </div>
        ))}
      </div>

      <div className="cta-banner fade-in">
        <h3>Ready to take control of your health?</h3>
        <p>Empower your healthcare journey with AI-driven guidance, seamless appointment booking, and personalized care—all in one secure platform.</p>
        <div className="cta-actions">
          <button className="btn btn-primary" onClick={() => setTab("quiz")}>Start Your Journey</button>
          <button className="btn btn-outline" onClick={() => setTab("chat")}>Book a Consultation</button>
        </div>
      </div>
    </div>
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
    <div className="page-inner page-chat">
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
          {messages.map((m, i) => (
            <div key={i} className={`msg msg-${m.role}`}>
              <div className="msg-bubble">{m.text}</div>
            </div>
          ))}
          {loading && (
            <div className="msg msg-bot">
              <div className="msg-bubble typing-bubble">
                <span /><span /><span />
              </div>
            </div>
          )}
        </div>

        {messages.length < 3 && (
          <div className="chat-quick">
            {QUICK.map((c) => (
              <button key={c} className="quick-chip" onClick={() => sendMsg(c)}>{c}</button>
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
    </div>
  );
}

/* ── APP ───────────────────────────────────────────── */
export default function App() {
  const [tab, setTab] = useState("home");
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
      <Nav tab={tab} setTab={setTab} dark={dark} setDark={setDark} />
      {tab === "home" && <Home setTab={setTab} barriers={content.barriers} />}
      {tab === "quiz" && <Quiz setTab={setTab} quizResult={quizResult} setQuizResult={setQuizResult} />}
      {tab === "stories" && <Stories setTab={setTab} stories={content.stories} quizResult={quizResult} />}
      {tab === "plans" && <CarePlans setTab={setTab} />}
      {tab === "chat" && <Chat />}
    </>
  );
}

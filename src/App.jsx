import { useState, useRef, useEffect } from "react";
// useEffect already imported above
import "./index.css";

/* ── QUIZ DATA ─────────────────────────────────────── */
const QUIZ = [
  {
    q: "When you think about going to a doctor, what's the first feeling that comes up?",
    hint: "There's no wrong answer, we're trying to understand, not judge.",
    opts: [
      { text: "Dread, I'm afraid of what they might find", val: "fear" },
      { text: "Embarrassment, what will people think?", val: "stigma" },
      { text: "Busy, I genuinely don't have the bandwidth", val: "time" },
      { text: "Money worries, it'll be expensive", val: "cost" },
    ],
  },
  {
    q: "If someone close to you had the same symptoms, would you tell them to see a doctor?",
    hint: "Think honestly, not the 'right' answer.",
    opts: [
      { text: "Yes, immediately, their health matters", val: "denial" },
      { text: "Probably, but I'd understand if they hesitated", val: "stigma" },
      { text: "Maybe, depends how serious it seems", val: "denial" },
      { text: "I'd tell them to wait and see first", val: "fear" },
    ],
  },
  {
    q: "Have you searched your symptoms online in the last month?",
    hint: "Online searches often hide underlying worry.",
    opts: [
      { text: "Yes, multiple times, it's been worrying me", val: "fear" },
      { text: "Once or twice, just curious", val: "denial" },
      { text: "No, I prefer not to know", val: "fear" },
      { text: "Yes, and the results scared me more", val: "fear" },
    ],
  },
  {
    q: "What would make it easiest for you to take a first step toward care?",
    hint: "Choose what resonates most right now.",
    opts: [
      { text: "Knowing exactly what it will cost beforehand", val: "cost" },
      { text: "A way to go without anyone knowing", val: "stigma" },
      { text: "A 15 minute appointment I can do from my phone", val: "time" },
      { text: "Someone explaining what to expect at the visit", val: "fear" },
    ],
  },
];

const RESULTS = {
  fear: {
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
        <div className="nav-logo-dot">⚕</div>
        CareBridge
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
        <div className="hero-right">
          <div className="hero-float">78% feel better after first step ✓</div>
          {[
            { label: "Fear of diagnosis", sub: "Most common reason people wait", w: 67, color: "#D85A30" },
            { label: "Stigma & judgment", sub: "Second reason, especially men", w: 54, color: "#BA7517" },
            { label: "Cost uncertainty", sub: "Solved by free govt. services", w: 41, color: "#7F77DD" },
            { label: "Users who took action", sub: "Within 72 hours of using CareBridge", w: 78, color: "#1D9E75", teal: true },
          ].map((b) => (
            <div key={b.label} className={`hero-card ${b.teal ? "hero-card-warm" : ""}`}>
              <div className="hc-label">{b.label}</div>
              <div className="hc-val">{b.sub}</div>
              <div className="hc-bar"><div className="hc-fill" style={{ width: `${b.w}%`, background: b.color }} /></div>
            </div>
          ))}
        </div>
      </div>

      <div className="trust-strip">
        {["100% anonymous, no account needed", "Supports Hindi, English & regional languages", "Powered by Gemini AI, backed by human care", "Linked to Ayushman Bharat & PMJAY"].map((t) => (
          <div key={t} className="trust-item"><span className="trust-dot" />{t}</div>
        ))}
      </div>

      <div className="section barriers-section">
        <div className="section-label">Understanding hesitation</div>
        <h2 className="section-title">The six barriers CareBridge addresses</h2>
        <p className="section-desc">These aren't excuses, they are real psychological patterns. Recognising yours is the first step toward care.</p>
        <div className="stats-row">
          {[
            { n: "67%", l: "of Indians delay care due to fear of diagnosis" },
            { n: "54%", l: "cite cost uncertainty as the primary barrier" },
            { n: "41%", l: "of men say stigma stops them seeking mental health help" },
            { n: "3.2×", l: "more likely to act after reading a relatable story" },
          ].map((s) => (
            <div key={s.n} className="stat-card">
              <div className="stat-num">{s.n}</div>
              <div className="stat-label">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="barriers-grid">
          {barriers.map((b) => (
            <div key={b.name} className="barrier-card">
              <div className="barrier-icon">
                <img src={b.icon} alt={b.name} />
              </div>
              <div className="barrier-name">{b.name}</div>
              <div className="barrier-desc">{b.desc}</div>
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
function Quiz({ setTab }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const pick = (val) => {
    const next = [...answers, val];
    setAnswers(next);
    if (step + 1 >= QUIZ.length) {
      const tally = {};
      next.forEach((v) => { tally[v] = (tally[v] || 0) + 1; });
      const top = Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
      setResult(RESULTS[top]);
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
      fetch(`${API_URL}/api/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ primaryBarrier: top })
      }).catch(e => console.error(e));
    } else {
      setStep(step + 1);
    }
  };

  const reset = () => { setStep(0); setAnswers([]); setResult(null); };

  return (
    <div className="page-inner">
      <div className="section-label">Barrier check</div>
      <h2 className="section-title">What's really holding you back?</h2>
      <p className="section-desc">4 questions, 90 seconds, reveals your real barrier</p>

      {!result ? (
        <div className="card quiz-card">
          <div className="quiz-progress">
            {QUIZ.map((_, i) => (
              <div key={i} className={`quiz-pip ${i < step ? "done" : i === step ? "active" : ""}`} />
            ))}
          </div>
          <div className="quiz-q">{QUIZ[step].q}</div>
          <div className="quiz-hint">{QUIZ[step].hint}</div>
          <div className="quiz-opts">
            {QUIZ[step].opts.map((o) => (
              <button key={o.text} className="quiz-opt" onClick={() => pick(o.val)}>{o.text}</button>
            ))}
          </div>
        </div>
      ) : (
        <div className="card result-card fade-in">
          <div className="result-tag" style={{ background: result.bg, color: result.color }}>{result.label}</div>
          <div className="result-name">{result.name}</div>
          <p className="result-body">{result.body}</p>
          <div className="steps-label">Your next steps</div>
          <div className="result-steps">
            {result.steps.map((s, i) => (
              <div key={i} className="result-step">
                <div className="step-num">{i + 1}</div>
                <span>{s}</span>
              </div>
            ))}
          </div>
          <div className="result-actions">
            <button className="btn btn-primary" onClick={() => setTab("chat")}>Talk to CareBridge about this →</button>
            {result === RESULTS.cost && (
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
function Stories({ stories = [] }) {
  return (
    <div className="page-inner">
      <div className="section-label">Real voices</div>
      <h2 className="section-title">People just like you who took the step</h2>
      <p className="section-desc">Names changed for privacy, but the journeys are real.</p>
      <div className="stories-grid">
        {stories.map((s) => (
          <div key={s.name} className="story-card card">
            <div className="story-tag" style={{ background: s.tagBg, color: s.tagColor }}>{s.tag}</div>
            <p className="story-quote">"{s.quote}"</p>
            <div className="story-name">{s.name}</div>
            <div className="story-outcome">✓ {s.outcome}</div>
          </div>
        ))}
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
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
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
      const API_URL = import.meta.env.DEV ? "http://localhost:3001" : "https://carebridge-ai-vhp0.onrender.com";
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

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
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
      {tab === "quiz" && <Quiz setTab={setTab} />}
      {tab === "stories" && <Stories stories={content.stories} />}
      {tab === "plans" && <CarePlans setTab={setTab} />}
      {tab === "chat" && <Chat />}
    </>
  );
}

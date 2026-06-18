import { useState } from "react";
import "./index.css";

const EXAMPLE_PROMPTS = [
  "I've had chest pain for weeks but I'm scared of bad news.",
  "I keep postponing my check-up because I can't afford the bills.",
  "I feel embarrassed about my symptoms and don't want to talk about them.",
  "I've been ignoring my mental health because of stigma.",
];

function getScoreColor(score) {
  if (score < 30) return "#16a34a";
  if (score < 60) return "#e09a2f";
  return "#e05252";
}

function Navbar({ onLogoClick }) {
  return (
    <nav className="nav">
      <button onClick={onLogoClick} className="nav-logo" style={{ background: "none", border: "none", cursor: "pointer" }}>
        <div className="dot">⚕</div>
        CareBridge
      </button>
      <button className="nav-link" onClick={onLogoClick}>Home</button>
    </nav>
  );
}

function LandingPage({ onStart }) {
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-left">
          <div className="hero-eyebrow">
            <span className="pulse" />
            AI-Powered Healthcare Support
          </div>
          <h1>
            Bridge the gap between <span>hesitation</span> and care
          </h1>
          <p className="hero-desc">
            CareBridge helps you understand what's holding you back from seeking
            medical attention — and gives you a clear, compassionate path forward.
          </p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={onStart}>
              Start Assessment →
            </button>
            <button className="btn-secondary" onClick={onStart}>
              How it works
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card-stack">
            <div className="hcard-behind" />
            <div className="hcard hcard-main">
              <div className="hcard-label">Analysis Result</div>
              <div className="hcard-barrier">Financial Concern</div>
              <div className="hcard-score-row">
                <div className="score-num">72</div>
                <div className="score-bar-wrap">
                  <div className="score-bar-fill" style={{ width: "72%" }} />
                </div>
              </div>
              <div className="hcard-quote">
                "Cost anxiety is a common and valid barrier. Let's find a way to move forward together."
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="stats-strip">
        <div className="stat-item">
          <div className="stat-num">38%</div>
          <div className="stat-label">Adults delay care due to fear</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">1 in 4</div>
          <div className="stat-label">Skip care due to cost</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">2 min</div>
          <div className="stat-label">Average assessment time</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">100%</div>
          <div className="stat-label">Free & confidential</div>
        </div>
      </div>

      <section className="features">
        <div className="section-label">How it works</div>
        <h2>Understanding what holds you back</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Share your situation</h3>
            <p>Describe what's stopping you from seeking care — in your own words, at your own pace.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>AI identifies barriers</h3>
            <p>Gemini AI analyzes your hesitation and pinpoints the root cause — fear, cost, stigma, or time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>Get a clear next step</h3>
            <p>Receive tailored encouragement and a practical, actionable first step toward getting care.</p>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <strong>CareBridge AI</strong> — Emotional support and guidance only. Not a substitute for professional medical advice.
      </footer>
    </div>
  );
}

function AssessmentPage({ onBack }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function analyzeMessage() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("https://carebridge-ai-vhp0.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      try {
        const cleaned = data.result
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        const parsed = JSON.parse(cleaned);
        setResult(parsed);
      } catch {
        setResult({
          primaryBarrier: "Analysis Complete",
          hesitationScore: 0,
          summary: data.result,
          encouragement: "",
          nextStep: "",
        });
      }
    } catch {
      setError("Could not connect to the analysis server. Please try again.");
    }

    setLoading(false);
  }

  const score = result?.hesitationScore ?? 0;
  const scoreColor = getScoreColor(score);

  return (
    <div className="assessment-page">
      <button className="back-btn" onClick={onBack}>
        ← Back to home
      </button>

      <div className="page-header">
        <div className="section-label">CareBridge Assessment</div>
        <h1>What's holding you back?</h1>
        <p>
          Share what's been stopping you from seeking medical care. Our AI will
          identify your barrier and help you take the next step.
        </p>
      </div>

      {!result && !loading && (
        <div className="input-card">
          <label className="input-label">Describe your situation</label>
          <textarea
            className="care-textarea"
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Example: I've had chest pain for a week but I'm scared of what the doctor might find. I keep putting it off..."
          />
          <div className="char-count">{text.length} characters</div>

          <div style={{ marginTop: "1rem" }}>
            <div className="input-label" style={{ marginBottom: "0.5rem" }}>Or try an example</div>
            <div className="prompts-row">
              {EXAMPLE_PROMPTS.map((p) => (
                <button key={p} className="prompt-chip" onClick={() => setText(p)}>
                  {p.length > 50 ? p.slice(0, 50) + "…" : p}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ marginTop: "1rem", padding: "0.875rem 1rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#991b1b", fontSize: "0.875rem" }}>
              ⚠️ {error}
            </div>
          )}

          <button
            className="analyze-btn"
            onClick={analyzeMessage}
            disabled={!text.trim()}
          >
            Analyze my situation →
          </button>
        </div>
      )}

      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          <h3>Analyzing your situation…</h3>
          <p>Our AI is identifying your barriers and preparing guidance.</p>
        </div>
      )}

      {result && (
        <div className="results-card">
          <div className="results-header">
            <div className="label">Primary Barrier Identified</div>
            <h2>{result.primaryBarrier}</h2>
          </div>

          <div className="results-body">
            <div className="result-section">
              <div className="result-section-label">Hesitation Score</div>
              <div className="score-display">
                <div className="big-score">
                  {score}<span>/100</span>
                </div>
                <div className="score-details">
                  <div className="score-label-row">
                    <span>Low hesitation</span>
                    <span>High hesitation</span>
                  </div>
                  <div className="score-bar-lg">
                    <div
                      className="score-fill-lg"
                      style={{ width: `${score}%`, background: scoreColor }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {result.summary && (
              <div className="result-section">
                <div className="result-section-label">Summary</div>
                <div className="result-section-value">{result.summary}</div>
              </div>
            )}

            {result.encouragement && (
              <div className="result-section">
                <div className="result-section-label">Encouragement</div>
                <div className="encouragement-box">{result.encouragement}</div>
              </div>
            )}

            {result.nextStep && (
              <div className="result-section">
                <div className="result-section-label">Your next step</div>
                <div className="nextstep-box">➡️ {result.nextStep}</div>
              </div>
            )}

            <div className="disclaimer">
              ⚠️ CareBridge AI provides emotional support and educational guidance only. It does not diagnose diseases or replace professional medical advice. If you are experiencing a medical emergency, please call 112 or visit your nearest hospital immediately.
            </div>
          </div>

          <div className="results-footer">
            <button
              className="reset-btn"
              onClick={() => { setText(""); setResult(null); setError(null); }}
            >
              ↺ New assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("landing");

  return (
    <>
      <Navbar onLogoClick={() => setPage("landing")} />
      {page === "landing"
        ? <LandingPage onStart={() => setPage("assessment")} />
        : <AssessmentPage onBack={() => setPage("landing")} />
      }
    </>
  );
}

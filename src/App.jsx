import { useState } from "react";

function App() {
  const [started, setStarted] = useState(false);
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function analyzeMessage() {
    setLoading(true);

    try {
      const response = await fetch("https://carebridge-ai-vhp0.onrender.com/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const data = await response.json();

      try {
        const cleaned = data.result
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        const parsed = JSON.parse(cleaned);
        setResult(parsed);
      } catch (e) {
        console.error(e);

        setResult({
          primaryBarrier: "Unable to identify",
          hesitationScore: 0,
          summary: data.result,
          encouragement: "",
          nextStep: "",
        });
      }
    } catch (err) {
      console.error(err);

      setResult({
        primaryBarrier: "Connection Error",
        hesitationScore: 0,
        summary: "Could not connect to the AI server.",
        encouragement: "",
        nextStep: "",
      });
    }

    setLoading(false);
  }

  if (!started) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f172a",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "52px" }}>🩺 CareBridge AI</h1>

          <p style={{ fontSize: "22px", maxWidth: "700px" }}>
            Helping people overcome fear, stigma, and hesitation to seek timely
            healthcare support.
          </p>

          <button
            onClick={() => setStarted(true)}
            style={{
              marginTop: "30px",
              padding: "14px 28px",
              fontSize: "20px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "48px" }}>🧠 CareBridge Assessment</h1>

        <p style={{ fontSize: "20px" }}>
          Tell us why you've been delaying medical care:
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Example: I've had chest pain for a week but I'm scared to visit a doctor."
          style={{
            width: "800px",
            maxWidth: "95%",
            padding: "15px",
            fontSize: "18px",
            borderRadius: "12px",
          }}
        />
      </div>

      <div style={{ textAlign: "center", marginTop: "25px" }}>
        <button
          onClick={analyzeMessage}
          disabled={loading}
          style={{
            padding: "12px 30px",
            fontSize: "18px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {result && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "35px",
          }}
        >
          <div
            style={{
              background: "#1e293b",
              padding: "30px",
              borderRadius: "15px",
              width: "800px",
              maxWidth: "95%",
            }}
          >
            <h2>🧠 Primary Barrier</h2>
            <p>{result.primaryBarrier}</p>

            <h2>📊 Hesitation Score</h2>
            <p>{result.hesitationScore}/100</p>

            <div
              style={{
                width: "100%",
                background: "#475569",
                height: "12px",
                borderRadius: "999px",
                marginBottom: "25px",
              }}
            >
              <div
                style={{
                  width: `${result.hesitationScore}%`,
                  height: "12px",
                  background: "#22c55e",
                  borderRadius: "999px",
                }}
              />
            </div>

            <h2>💬 Summary</h2>
            <p>{result.summary}</p>

            <h2>❤️ Encouragement</h2>
            <p>{result.encouragement}</p>

            <h2>➡️ Next Step</h2>
            <p>{result.nextStep}</p>

            <hr style={{ margin: "25px 0" }} />

            <p
              style={{
                color: "#cbd5e1",
                fontSize: "14px",
              }}
            >
              ⚠️ CareBridge AI provides emotional support and educational
              guidance only. It does not diagnose diseases or replace
              professional medical advice.
            </p>

            <div style={{ textAlign: "center", marginTop: "25px" }}>
              <button
                onClick={() => {
                  setText("");
                  setResult(null);
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                New Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import db from "./db.js";
import "./seed.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/* ── PRIORITY 1: RATE LIMITING ─────────────────────────
   In-memory store: 5 requests per IP per 30 minutes.
   No extra packages needed.
─────────────────────────────────────────────────────── */
const rateLimitStore = new Map();
const RATE_LIMIT = 5;
const WINDOW_MS = 30 * 60 * 1000; // 30 minutes

function rateLimit(req, res, next) {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    // New window
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return next();
  }

  if (entry.count >= RATE_LIMIT) {
    const retryAfterMins = Math.ceil((WINDOW_MS - (now - entry.windowStart)) / 60000);
    return res.status(429).json({
      error: "rate_limited",
      message: `You've reached the limit of ${RATE_LIMIT} requests per 30 minutes. Please try again in ${retryAfterMins} minute${retryAfterMins !== 1 ? "s" : ""}.`,
      retryAfterMinutes: retryAfterMins,
    });
  }

  entry.count++;
  next();
}

// Clean up old entries every 30 mins to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now - entry.windowStart > WINDOW_MS) rateLimitStore.delete(ip);
  }
}, WINDOW_MS);

/* ── PRIORITY 2: CRISIS DETECTION ─────────────────────
   Scans message for crisis keywords before hitting Gemini.
   Returns immediate resources without AI call.
─────────────────────────────────────────────────────── */
const CRISIS_KEYWORDS = [
  "suicide", "suicidal", "kill myself", "end my life", "want to die",
  "don't want to live", "no reason to live", "self harm", "self-harm",
  "cutting myself", "hurt myself", "overdose", "can't go on",
  "khatam kar loon", "jeena nahi", "mar jaana", "khud ko hurt",
];

function detectCrisis(text) {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((kw) => lower.includes(kw));
}

const CRISIS_RESPONSE = {
  primaryBarrier: "Crisis detected",
  hesitationScore: 100,
  summary: "What you're feeling right now is real, and you don't have to face it alone. Please reach out to a crisis line immediately: trained counsellors are available 24/7 and will listen without judgment.",
  encouragement: "You matter. Asking for help is the bravest thing you can do right now.",
  nextStep: "Call iCall now: 9152987821 · Vandrevala Foundation: 1860 2662 345 · NIMHANS: 080 46110007",
  isCrisis: true,
};

/* ── PRIORITY 3: CONTENT API ───────────────────────── */
app.get("/api/content", (req, res) => {
  try {
    const rows = db.prepare("SELECT key, value FROM content").all();
    const content = {};
    for (const row of rows) {
      content[row.key] = JSON.parse(row.value);
    }
    res.json(content);
  } catch (error) {
    console.error("[ERROR]", error);
    res.status(500).json({ error: "Failed to fetch content" });
  }
});

/* ── PRIORITY 4: QUIZ RESULT API ───────────────────── */
app.post("/api/quiz", (req, res) => {
  try {
    const { primaryBarrier } = req.body;
    if (!primaryBarrier) {
      return res.status(400).json({ error: "Primary barrier is required" });
    }
    const stmt = db.prepare("INSERT INTO quiz_results (primary_barrier) VALUES (@primaryBarrier)");
    stmt.run({ primaryBarrier });
    res.json({ success: true });
  } catch (error) {
    console.error("[ERROR]", error);
    res.status(500).json({ error: "Failed to save quiz result" });
  }
});

/* ── PRIORITY 5: FEEDBACK API ──────────────────────── */
app.post("/api/feedback", (req, res) => {
  try {
    const { source, rating, comment } = req.body;
    if (!source || rating === undefined) {
      return res.status(400).json({ error: "Source and rating are required" });
    }
    const stmt = db.prepare("INSERT INTO feedback (source, rating, comment) VALUES (@source, @rating, @comment)");
    stmt.run({ source, rating, comment: comment || null });
    res.json({ success: true });
  } catch (error) {
    console.error("[ERROR]", error);
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

/* ── /analyze ENDPOINT ─────────────────────────────── */
app.post("/analyze", rateLimit, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Crisis check — skip Gemini entirely
    if (detectCrisis(message)) {
      console.log("[CRISIS] Detected crisis keywords — returning resources immediately.");
      return res.json({ result: JSON.stringify(CRISIS_RESPONSE) });
    }

    const prompt = `
You are CareBridge AI.

Do NOT diagnose diseases.

Determine the PRIMARY emotional barrier based only on what the user explicitly says.

Rules:
- If the user expresses fear of bad news or diagnosis → "Fear of diagnosis"
- If the user says treatment is too expensive → "Cost concerns"
- If the user fears judgment or embarrassment → "Social stigma"
- If the user is too busy → "Lack of time"
- If the user minimizes symptoms or assumes they will disappear → "Denial"
- If the user simply reports symptoms without expressing an emotional reason → "Uncertainty"

Do not invent emotions that the user did not mention.

Respond ONLY with raw JSON.
Do NOT use markdown or code fences.

Return exactly this structure:

{
  "primaryBarrier": "string",
  "hesitationScore": 0,
  "summary": "Maximum 2 sentences.",
  "encouragement": "Maximum 2 sentences.",
  "nextStep": "Maximum 1 sentence."
}

User:
${message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ result: response.text });
  } catch (error) {
    console.error("[ERROR]", error);
    res.status(500).json({ result: "Server error while analyzing the message." });
  }
});

/* ── /chat ENDPOINT ────────────────────────────────── */
app.post("/chat", rateLimit, async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Crisis check
    if (detectCrisis(message)) {
      return res.json({
        reply: "I'm really glad you reached out. What you're feeling sounds very serious: please call iCall right now: **9152987821**. They're available 24/7 and will listen without judgment. You don't have to go through this alone. 💙",
        isCrisis: true,
      });
    }

    const systemPrompt = `You are CareBridge, a warm, empathetic AI assistant helping people in India overcome emotional and psychological barriers to seeking healthcare. Speak naturally, like a trusted, knowledgeable friend.

Goals:
1. Identify the user's real emotional barrier (fear, stigma, cost, time, masculinity norms, denial)
2. Validate their feelings without judgment
3. Gently educate them about what seeking care actually involves
4. Give one concrete, doable next step

Key facts:
* PHCs are free in India
* Ayushman Bharat / PMJAY covers ₹5 lakh/year hospitalisation
* eSanjeevani is free government telemedicine
* Jan Aushadhi medicines are 50 to 80% cheaper
* Basic GP consult: ₹200 to ₹400 in most Indian cities
* Mental health crisis lines: iCall 9152987821, Vandrevala 1860 2662 345

Rules:
* 3 to 4 sentences max unless explaining something specific
* Never give a medical diagnosis
* Ask one follow-up question at the end
* Empathy first, information second
* Match the user's language: if they write Hindi, respond in Hindi`;

    let contents;
    if (history && Array.isArray(history) && history.length > 0) {
      contents = history.map(h => ({
        role: h.role === "assistant" ? "model" : "user",
        parts: [{ text: h.content }]
      }));
    } else {
      contents = [{ role: "user", parts: [{ text: message }] }];
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt
      }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("[ERROR]", error);
    res.status(500).json({ reply: "I'm having trouble connecting right now. Please try again in a moment." });
  }
});

/* ── APPOINTMENTS API ────────────────────────────── */
app.post("/api/appointments", rateLimit, (req, res) => {
  try {
    const { name, email, phone, consultation_type, date, time, notes } = req.body;
    
    if (!name || !email || !phone || !consultation_type || !date || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking_id = 'CB-' + Math.floor(10000 + Math.random() * 90000);

    const stmt = db.prepare(`
      INSERT INTO appointments (booking_id, name, email, phone, consultation_type, date, time, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(booking_id, name, email, phone, consultation_type, date, time, notes || "");

    res.json({ success: true, booking_id });
  } catch (error) {
    console.error("[ERROR]", error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
});

app.get("/api/appointments", (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM appointments ORDER BY created_at DESC").all();
    res.json(rows);
  } catch (error) {
    console.error("[ERROR]", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

/* ── SERVER ────────────────────────────────────────── */
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/analyze", async (req, res) => {
  try {
    const { message } = req.body;

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

    res.json({
      result: response.text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      result: "Server error while analyzing the message.",
    });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
import express from "express";
import { extractAppointmentInfoGemini } from "../services/gemini.js";
import { extractAppointmentInfoGroq } from "../services/groq.js";
import { extractAppointmentInfoFallback } from "../services/aiFallback.js";

const router = express.Router();

router.post("/intake", async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Text required" });
  }

  // 1️⃣ Try Gemini
  try {
    const data = await extractAppointmentInfoGemini(text);
    return res.json({ source: "gemini", data });
  } catch (e) {
    console.warn("Gemini failed");
  }

  // 2️⃣ Try Groq
  try {
    const data = await extractAppointmentInfoGroq(text);
    return res.json({ source: "groq", data });
  } catch (e) {
    console.warn("Groq failed", e.message);
  }

  // 3️⃣ Absolute fallback
  const data = extractAppointmentInfoFallback(text);
  return res.json({ source: "fallback", data });
});

export default router;

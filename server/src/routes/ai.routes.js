import express from "express";
import { extractAppointmentInfoGemini } from "../services/gemini.js";
import { extractAppointmentInfoGroq } from "../services/groq.js";
import { extractAppointmentInfoFallback } from "../services/aiFallback.js";

const router = express.Router();

/**
 * ===============================
 * AI INTAKE (Hindi / Hinglish / English)
 * ===============================
 */
router.post("/intake", async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length < 3) {
    return res.status(400).json({
      message: "Symptoms text required"
    });
  }

  // 1️⃣ Try Gemini
  try {
    const data = await extractAppointmentInfoGemini(text);
    return res.json({
      source: "gemini",
      data
    });
  } catch (err) {
    console.warn("⚠️ Gemini failed");
  }

  // 2️⃣ Try Groq
  try {
    const data = await extractAppointmentInfoGroq(text);
    return res.json({
      source: "groq",
      data
    });
  } catch (err) {
    console.warn("⚠️ Groq failed");
  }

  // 3️⃣ Absolute fallback (never fails)
  const data = extractAppointmentInfoFallback(text);

  return res.json({
    source: "fallback",
    data
  });
});

export default router;

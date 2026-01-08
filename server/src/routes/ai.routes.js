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

  // 1️⃣ Gemini
  try {
    const data = await extractAppointmentInfoGemini(text);
    return res.json({
      source: "gemini",
      data
    });
  } catch {
    console.warn("⚠️ Gemini failed");
  }

  // 2️⃣ Groq
  try {
    const data = await extractAppointmentInfoGroq(text);
    return res.json({
      source: "groq",
      data
    });
  } catch {
    console.warn("⚠️ Groq failed");
  }

  // 3️⃣ Fallback (ALWAYS SAFE)
  const data = extractAppointmentInfoFallback(text);
  return res.json({
    source: "fallback",
    data
  });
});

export default router;

import axios from "axios";

export const extractAppointmentInfoGemini = async (text) => {
  if (
    process.env.GEMINI_DISABLED === "true" ||
    !process.env.GEMINI_API_KEY
  ) {
    throw new Error("Gemini disabled or API key missing");
  }

  const url =
    "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent";

  const response = await axios.post(
    url,
    {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are a medical appointment intake assistant for a clinic.

Your responsibilities:
- Understand symptoms written in English, Hindi, or Hinglish.
- Rewrite them into SIMPLE, CLEAR medical English.
- Do NOT diagnose.
- Do NOT exaggerate.
- The summary must be editable by the patient.

Return ONLY valid JSON.
No markdown. No explanation.

Schema:
{
  "aiSummary": "1–2 sentence rewritten symptom summary",
  "urgency": "low" | "medium" | "high",
  "preferredDateTime": null
}

Patient input:
"""${text}"""
`
            }
          ]
        }
      ]
    },
    {
      params: {
        key: process.env.GEMINI_API_KEY
      },
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  const raw =
    response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!raw) {
    throw new Error("Empty Gemini response");
  }

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("Invalid JSON from Gemini");
  }

  return JSON.parse(match[0]);
};

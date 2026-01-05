import axios from "axios";

export const extractAppointmentInfoGemini = async (text) => {
  // 🔴 HARD STOP if Gemini is disabled
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
You are a medical appointment intake assistant.

Return ONLY valid JSON.
No markdown. No explanation.

Schema:
{
  "symptoms": string,
  "preferredDateTime": string | null,
  "urgency": "low" | "medium" | "high"
}

Text:
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

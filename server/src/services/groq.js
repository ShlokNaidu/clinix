import Groq from "groq-sdk";

let groqClient = null;

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not loaded");
  }

  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }

  return groqClient;
};

export const extractAppointmentInfoGroq = async (text) => {
  const groq = getGroqClient();

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    temperature: 0.2,

    messages: [
      {
        role: "system",
        content: `
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
`
      },
      {
        role: "user",
        content: text
      }
    ]
  });

  const raw = completion.choices[0].message.content;

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("Invalid JSON from Groq");
  }

  return JSON.parse(match[0]);
};

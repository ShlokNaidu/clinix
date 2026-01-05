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
    // openai/gpt-oss-120b

    messages: [
      {
        role: "system",
        content: `
You are a medical appointment intake assistant.

Return ONLY valid JSON.
No markdown. No explanation.

Schema:
{
  "symptoms": string,
  "preferredDateTime": string | null,
  "urgency": "low" | "medium" | "high"
}
`
      },
      {
        role: "user",
        content: text
      }
    ],
    temperature: 0.2
  });

  const raw = completion.choices[0].message.content;

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("Invalid JSON from Groq");
  }

  return JSON.parse(match[0]);
};

import Groq from "groq-sdk";

let groq;

function getGroq() {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY missing");
    }
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
  }
  return groq;
}

export const summarizeMedicalPdf = async (text) => {
  const client = getGroq();

  const completion = await client.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [
      {
        role: "user",
        content: `Summarize this medical document:\n\n${text}`
      }
    ]
  });

  return completion.choices[0].message.content;
};

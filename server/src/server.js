import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ .env is inside /server
dotenv.config({
  path: path.resolve(__dirname, "../.env")
});

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
  console.log("GROQ KEY LOADED:", !!process.env.GROQ_API_KEY);
  console.log("ENV CHECK:", {
  GROQ: !!process.env.GROQ_API_KEY,
  GEMINI: !!process.env.GEMINI_API_KEY
});

});

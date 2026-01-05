import fs from "fs";
import { createRequire } from "module";
import Tesseract from "tesseract.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

/**
 * Extract text from PDF
 * - Try pdf-parse
 * - Fallback to OCR if needed
 */
export const extractPdfText = async (filePath) => {
  const buffer = fs.readFileSync(filePath);

  // -------- Try pdf-parse --------
  try {
    const parsed = await pdfParse(buffer);

    if (parsed.text && parsed.text.trim().length > 50) {
      console.log("✅ Text extracted using pdf-parse");
      return parsed.text;
    }

    console.log("⚠️ PDF text too small, switching to OCR");
  } catch (err) {
    console.error("pdf-parse failed:", err.message);
  }

  // -------- OCR fallback --------
  try {
    const ocrResult = await Tesseract.recognize(
      filePath,
      "eng"
    );

    console.log("✅ Text extracted using OCR");
    return ocrResult.data.text;
  } catch (ocrErr) {
    console.error("OCR failed:", ocrErr.message);
    return "";
  }
};

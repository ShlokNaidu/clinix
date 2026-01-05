import express from "express";
import Appointment from "../models/Appointment.js";
import { protect } from "../middleware/auth.js";
import pdfUpload from "../middleware/pdfUpload.js";
import fs from "fs";
import path from "path";
import { extractPdfText } from "../utils/pdfExtractor.js";
import { summarizeMedicalPdf } from "../services/aiPdfSummary.js";

const router = express.Router();

// ===============================
// BOOK APPOINTMENT (PUBLIC)
// ===============================
router.post("/", pdfUpload.single("pdf"), async (req, res) => {
  try {
    let aiMeta = null;
    if (req.body.aiMeta) {
      try {
        aiMeta = JSON.parse(req.body.aiMeta);
      } catch {
        aiMeta = null;
      }
    }

    const appointment = await Appointment.create({
      clinic: req.body.clinic,
      slotTime: new Date(req.body.slotTime),
      symptoms: req.body.symptoms,
      patient: {
        name: req.body.name,
        email: req.body.email
      },
      aiMeta
    });

    // ===============================
    // HANDLE PDF + AI SUMMARY
    // ===============================
    if (req.file) {
      const finalDir = `uploads/appointments/${appointment._id}`;
      fs.mkdirSync(finalDir, { recursive: true });

      const finalPath = `${finalDir}/${req.file.filename}`;
      fs.renameSync(req.file.path, finalPath);

      appointment.medicalPdf = `/${finalPath}`;

      try {
        const extractedText = await extractPdfText(finalPath);

        if (extractedText && extractedText.length > 50) {
          const summary = await summarizeMedicalPdf(extractedText);
          appointment.aiSummary = summary;
        } else {
          appointment.aiSummary = "AI summary not available (empty document)";
        }
      } catch (err) {
        console.error("AI summary failed:", err.message);
        appointment.aiSummary = "AI summary not available";
      }

      await appointment.save();
    }

    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// ===============================
// GET APPOINTMENTS FOR A CLINIC
// ===============================
router.get("/clinic/:clinicId", async (req, res) => {
  try {
    const appointments = await Appointment.find({
      clinic: req.params.clinicId
    }).select("slotTime");

    res.json(appointments);
  } catch {
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

// ===============================
// DOCTOR DASHBOARD
// ===============================
router.get("/doctor", protect(["doctor"]), async (req, res) => {
  const doctorId = req.user.id;

  const appointments = await Appointment.find()
    .populate({
      path: "clinic",
      match: { doctor: doctorId },
      select: "name specialization"
    });

  res.json(appointments.filter(a => a.clinic));
});

// ===============================
// DOWNLOAD PDF
// ===============================
router.get("/:id/pdf", protect(["doctor"]), async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate("clinic");

  if (!appointment) {
    return res.status(404).json({ message: "Not found" });
  }

  if (appointment.clinic.doctor.toString() !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  res.sendFile(path.resolve("." + appointment.medicalPdf));
});

export default router;

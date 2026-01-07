import express from "express";
import Clinic from "../models/Clinic.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

/**
 * ===============================
 * CREATE CLINIC (DOCTOR ONLY)
 * ===============================
 */
router.post(
  "/",
  protect(["doctor"]),
  upload.single("photo"),
  async (req, res) => {
    try {
      let photos = [];

      // 🔍 DEBUG (keep for now)
      console.log("UPLOAD DEBUG:", {
        hasFile: !!req.file,
        mimetype: req.file?.mimetype,
        size: req.file?.size
      });

      // 📸 Upload image to Cloudinary
      if (req.file) {
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
          "base64"
        )}`;

        const result = await cloudinary.uploader.upload(base64Image, {
          folder: "clinix/clinics",
          resource_type: "image"
        });

        photos.push(result.secure_url);
      }

      // 🏥 Create clinic
      const clinic = await Clinic.create({
        name: req.body.name,
        specialization: req.body.specialization,
        address: req.body.address,
        workingHours: {
          start: req.body.startTime,
          end: req.body.endTime
        },
        doctor: req.user.id,
        photos
      });

      res.status(201).json(clinic);
    } catch (err) {
      console.error("❌ CREATE CLINIC ERROR:", err);
      res.status(500).json({
        message: "Failed to create clinic",
        error: err.message
      });
    }
  }
);

/**
 * ===============================
 * GET ALL CLINICS (PUBLIC)
 * ===============================
 */
router.get("/", async (req, res) => {
  try {
    const clinics = await Clinic.find()
      .populate("doctor", "name email")
      .sort({ createdAt: -1 });

    res.json(clinics);
  } catch (err) {
    console.error("❌ FETCH CLINICS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch clinics" });
  }
});

/**
 * ===============================
 * GET SINGLE CLINIC
 * ===============================
 */
router.get("/:id", async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id).populate(
      "doctor",
      "name email"
    );

    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    res.json(clinic);
  } catch (err) {
    console.error("❌ FETCH CLINIC ERROR:", err);
    res.status(500).json({ message: "Failed to fetch clinic" });
  }
});

export default router;

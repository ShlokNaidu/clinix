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

  // 🧠 Multer wrapper to catch errors properly
  (req, res, next) => {
    upload.single("photo")(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "Image size must be less than 2MB"
          });
        }

        if (err.message?.includes("Only image files")) {
          return res.status(400).json({
            message: "Only image files are allowed"
          });
        }

        return res.status(400).json({
          message: err.message || "Image upload failed"
        });
      }

      next();
    });
  },

  // 🚀 Controller
  async (req, res) => {
    try {
      const {
        name,
        specialization,
        address,
        startTime,
        endTime,
        location // 👈 comes from frontend
      } = req.body;

      // 🛑 Validation
      if (!name || !specialization || !address || !startTime || !endTime) {
        return res.status(400).json({
          message: "All fields except photo are required"
        });
      }

      const normalizedName = name.trim().toLowerCase();

      let photos = [];

      // 📸 Cloudinary upload
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

      // 📍 Parse location safely
      let parsedLocation = undefined;
      if (location) {
        try {
          parsedLocation = JSON.parse(location);
        } catch {
          return res.status(400).json({
            message: "Invalid location format"
          });
        }
      }

      // 🏥 Create clinic
      const clinic = await Clinic.create({
        name: normalizedName,
        specialization,
        address,
        workingHours: {
          start: startTime,
          end: endTime
        },
        doctor: req.user.id,
        photos,
        location: parsedLocation
      });

      res.status(201).json(clinic);
    } catch (err) {
      console.error("❌ CREATE CLINIC ERROR:", err);

      if (err.code === 11000) {
        return res.status(409).json({
          message: "A clinic with this name already exists"
        });
      }

      res.status(500).json({
        message: "Failed to create clinic"
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

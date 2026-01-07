import express from "express";
import Clinic from "../models/Clinic.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

/* =========================
   CREATE CLINIC (DOCTOR)
========================= */
router.post(
  "/",
  protect(["doctor"]),
  upload.single("photo"),
  async (req, res) => {
    try {
      let photos = [];

      if (req.file) {
        const result = await cloudinary.uploader.upload(
          `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
          { folder: "clinix/clinics" }
        );

        photos.push(result.secure_url);
      }

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
      console.error("CREATE CLINIC ERROR:", err);
      res.status(500).json({ message: "Failed to create clinic" });
    }
  }
);

/* =========================
   GET ALL CLINICS (PUBLIC)
========================= */
router.get("/", async (req, res) => {
  try {
    const clinics = await Clinic.find()
      .populate("doctor", "name email");

    res.json(clinics);
  } catch (err) {
    console.error("FETCH CLINICS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch clinics" });
  }
});

/* =========================
   GET SINGLE CLINIC
========================= */
router.get("/:id", async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id)
      .populate("doctor", "name email");

    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    res.json(clinic);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch clinic" });
  }
});

export default router;

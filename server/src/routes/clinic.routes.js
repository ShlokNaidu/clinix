import express from "express";
import Clinic from "../models/Clinic.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

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

      res.json(clinic);
    } catch (err) {
      console.error("CREATE CLINIC ERROR:", err);
      res.status(500).json({ message: "Failed to create clinic" });
    }
  }
);

export default router;

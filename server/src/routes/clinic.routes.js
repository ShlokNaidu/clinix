import express from "express";
import Clinic from "../models/Clinic.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Create clinic (Doctor only)


// Create clinic (Doctor only)
router.post(
  "/",
  protect(["doctor"]),
  upload.single("photo"),
  async (req, res) => {
    try {
      const clinic = await Clinic.create({
        name: req.body.name,
        specialization: req.body.specialization,
        address: req.body.address,
        workingHours: {
          start: req.body.startTime,
          end: req.body.endTime
        },
        doctor: req.user.id,

        photos: req.file ? [req.file.path] : [] // for cloudinary support change 

      });

      res.json(clinic);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Get all clinics (public)
router.get("/", async (req, res) => {
  const clinics = await Clinic.find().populate("doctor", "name email");
  res.json(clinics);
});
router.get("/:id", async (req, res) => {
  const clinic = await Clinic.findById(req.params.id)
    .populate("doctor", "name email");

  if (!clinic) {
    return res.status(404).json({ message: "Clinic not found" });
  }

  res.json(clinic);
});

export default router;

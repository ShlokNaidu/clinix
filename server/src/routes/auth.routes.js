import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashed,
    role
  });

  res.json(user);
});


// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, role: user.role });
});
router.post("/patient-login", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Find existing patient
    let user = await User.findOne({ email, role: "patient" });

    // Create patient if not exists
    if (!user) {
      user = await User.create({
        name,
        email,
        password: "patient_no_password", // dummy, not used
        role: "patient"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: "patient" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, role: "patient" });
  } catch (err) {
    console.error("Patient login error:", err);
    res.status(500).json({ message: "Patient login failed" });
  }
});
export default router;

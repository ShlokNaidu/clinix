import express from "express";
import cors from "cors";
// import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import clinicRoutes from "./routes/clinic.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import aiRoutes from "./routes/ai.routes.js";

import path from "path";





// dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/clinics", clinicRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
  res.send("Clinix API running");
});

export default app;

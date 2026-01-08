import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import clinicRoutes from "./routes/clinic.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import aiRoutes from "./routes/ai.routes.js";

const app = express();

/* ================= CORS CONFIG ================= */
const allowedOrigins = [
  "https://clinix-frontend.web.app",
  "http://localhost:5173" // for local dev
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// 🔥 IMPORTANT: handle preflight
app.options("*", cors());

/* ================= MIDDLEWARE ================= */
app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/clinics", clinicRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("Clinix API running");
});

export default app;
                                                                                                            
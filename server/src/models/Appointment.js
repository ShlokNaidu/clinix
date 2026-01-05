import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      name: String,
      email: String
    },
    clinic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinic"
    },
    aiMeta: {
      urgency: {
        type: String,
        enum: ["low", "medium", "high"]
      },
      preferredDateTime: String,
      source: String // gemini | groq | fallback
    },
    aiSummary: {
      type: String,
      default: null
    },
    slotTime: Date,
    symptoms: String,
    medicalPdf: String,
    status: {
      type: String,
      default: "booked"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);

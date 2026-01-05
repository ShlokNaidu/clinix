import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialization: { type: String, required: true },

    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    address: {
      type: String,
      required: true
    },

    workingHours: {
      start: { type: String, required: true },
      end: { type: String, required: true }
    },

    photos: [String] // store file paths / URLs
  },
  { timestamps: true }
);

export default mongoose.model("Clinic", clinicSchema);

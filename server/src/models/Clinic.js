import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true // ✅ IMPORTANT
    },
    specialization: String,
    address: String,
    workingHours: {
      start: String,
      end: String
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    photos: [String]
  },
  { timestamps: true }
);

// 🔥 Ensure index exists
clinicSchema.index({ name: 1 }, { unique: true });

export default mongoose.model("Clinic", clinicSchema);


import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true // ✅ ONLY index needed
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

export default mongoose.model("Clinic", clinicSchema);

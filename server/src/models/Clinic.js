import mongoose from "mongoose";

const clinicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    specialization: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    workingHours: {
      start: String,
      end: String
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    photos: [String],

    // 📍 For map support (important)
    location: {
      lat: Number,
      lng: Number
    }
  },
  { timestamps: true }
);

export default mongoose.model("Clinic", clinicSchema);

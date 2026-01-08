import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AddClinic() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    address: "",
    startTime: "",
    endTime: "",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2 MB");
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      e.target.value = "";
      return;
    }

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
    toast.success("Image selected");
  };

  const handleSubmit = async () => {
    if (!form.name || !form.specialization || !form.address) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      toast.loading("Saving clinic…", { id: "clinic" });

      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (photo) data.append("photo", photo);

      await api.post("/clinics", data);

      toast.success("Clinic added successfully", {
        id: "clinic",
      });
      navigate("/doctor/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to add clinic. Please try again.",
        { id: "clinic" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full p-8 rounded-xl shadow">
        <h2 className="text-2xl font-bold text-center mb-6">
          Add Clinic
        </h2>

        <input
          name="name"
          placeholder="Clinic Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          name="specialization"
          placeholder="Specialization"
          value={form.specialization}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            type="time"
            name="startTime"
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="time"
            name="endTime"
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="mb-3"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="h-40 w-full object-cover rounded mb-3"
          />
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded"
        >
          {loading ? "Saving…" : "Save Clinic"}
        </button>
      </div>
    </div>
  );
}

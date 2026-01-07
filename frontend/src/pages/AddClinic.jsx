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

  /* ---------------- IMAGE HANDLER ---------------- */
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ❌ size check (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      e.target.value = "";
      setPhoto(null);
      setPreview(null);
      return;
    }

    // ❌ type check
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      e.target.value = "";
      setPhoto(null);
      setPreview(null);
      return;
    }

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (!form.name || !form.specialization || !form.address) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (photo) data.append("photo", photo);

      await api.post("/clinics", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Clinic added successfully");
      navigate("/doctor/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create clinic");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-md p-8">
        {/* HEADER */}
        <h2 className="text-2xl font-bold text-center mb-2">Add Clinic</h2>
        <p className="text-center text-gray-500 mb-6">
          Enter clinic details below
        </p>

        {/* CLINIC NAME */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Clinic Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* SPECIALIZATION */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Specialization
          </label>
          <input
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ADDRESS */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Address
          </label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* WORKING HOURS */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Working Hours
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="time"
              name="startTime"
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg"
            />
            <input
              type="time"
              name="endTime"
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* PHOTO */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Clinic Photo (optional)
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full text-sm"
          />

          {/* PREVIEW */}
          {preview && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1">Preview:</p>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg border"
              />
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Clinic"}
        </button>

        <button
          onClick={() => navigate("/doctor/dashboard")}
          className="block mx-auto mt-4 text-sm text-gray-500 hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

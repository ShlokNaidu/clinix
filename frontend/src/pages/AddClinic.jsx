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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) =>
        data.append(k, v)
      );
      if (photo) data.append("photo", photo);

      await api.post("/clinics", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Clinic added successfully");
      navigate("/doctor/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-md p-8">
        {/* HEADER */}
        <h2 className="text-2xl font-bold text-center mb-2">
          Add Clinic
        </h2>
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
            placeholder="ABC Clinic"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* SPECIALIZATION */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Specialization
          </label>
          <input
            name="specialization"
            placeholder="Dentist, Cardiologist, etc."
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ADDRESS */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Address
          </label>
          <input
            name="address"
            placeholder="Clinic address"
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* WORKING HOURS */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Working Hours
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="startTime"
              type="time"
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="endTime"
              type="time"
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* PHOTO */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Clinic Photo (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full text-sm"
          />
        </div>

        {/* ACTIONS */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Save Clinic
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

import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

/* 🔧 Fix default marker icon issue */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

/* 📍 MAP CLICK HANDLER */
function LocationPicker({ location, setLocation }) {
  useMapEvents({
    click(e) {
      setLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
      toast.success("Location selected on map");
    }
  });

  return location ? <Marker position={[location.lat, location.lng]} /> : null;
}

export default function AddClinic() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    address: "",
    startTime: "",
    endTime: ""
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  /* 📍 Clinic location */
  const [location, setLocation] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* 🖼️ IMAGE HANDLER */
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      e.target.value = "";
      return;
    }

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  /* 🚀 SUBMIT */
  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.specialization ||
      !form.address ||
      !form.startTime ||
      !form.endTime
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!location) {
      toast.error("Please select clinic location on map");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      data.append("location", JSON.stringify(location));

      if (photo) data.append("photo", photo);

      await api.post("/clinics", data, {
        headers: { "Content-Type": "multipart/form-data" }
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
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Add Clinic
        </h2>

        {/* CLINIC NAME */}
        <input
          name="name"
          placeholder="Clinic Name"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded-lg"
        />

        {/* SPECIALIZATION */}
        <input
          name="specialization"
          placeholder="Specialization"
          value={form.specialization}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 border rounded-lg"
        />

        {/* ADDRESS */}
        <input
          name="address"
          placeholder="Clinic Address"
          value={form.address}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-lg"
        />

        {/* 🗺️ MAP */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-600 mb-2">
            Select Clinic Location (click on map)
          </p>

          <MapContainer
            center={[22.7196, 75.8577]} // Indore default
            zoom={13}
            style={{ height: "300px", width: "100%" }}
            className="rounded-lg"
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationPicker
              location={location}
              setLocation={setLocation}
            />
          </MapContainer>

          {location && (
            <p className="text-xs text-gray-500 mt-1">
              Selected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </p>
          )}
        </div>

        {/* WORKING HOURS */}
        <div className="grid grid-cols-2 gap-4 mb-4">
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

        {/* PHOTO */}
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
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
        )}

        {/* ACTION */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Clinic"}
        </button>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

/* 🔧 Leaflet icon fix */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

/* ---------------- SKELETON CARD ---------------- */
function ClinicSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md animate-pulse h-[420px]">
      <div className="h-48 bg-gray-300" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="h-10 bg-gray-300 rounded mt-6" />
      </div>
    </div>
  );
}

export default function Clinics() {
  const navigate = useNavigate();

  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");

  const cardRefs = useRef({});

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await api.get("/clinics");
        setClinics(res.data);
      } catch {
        console.error("Failed to load clinics");
      } finally {
        setLoading(false);
      }
    };

    fetchClinics();
  }, []);

  /* ================= UNIQUE SPECIALIZATIONS ================= */
  const specializations = useMemo(() => {
    const set = new Set(clinics.map(c => c.specialization).filter(Boolean));
    return Array.from(set);
  }, [clinics]);

  /* ================= FILTER ================= */
  const filteredClinics = clinics.filter(c => {
    const nameMatch = c.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const specMatch = specialization
      ? c.specialization === specialization
      : true;

    return nameMatch && specMatch;
  });

  /* ================= MAP CENTER ================= */
  const mapCenter = filteredClinics[0]?.location
    ? [filteredClinics[0].location.lat, filteredClinics[0].location.lng]
    : [22.7196, 75.8577]; // Indore fallback

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8 space-y-8">
      {/* ================= MAP ================= */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "350px", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredClinics.map(c => (
            c.location && (
              <Marker
                key={c._id}
                position={[c.location.lat, c.location.lng]}
                eventHandlers={{
                  click: () => {
                    const el = cardRefs.current[c._id];
                    if (el) {
                      el.scrollIntoView({ behavior: "smooth", block: "center" });
                      el.classList.add("ring-2", "ring-blue-500");
                      setTimeout(() => {
                        el.classList.remove("ring-2", "ring-blue-500");
                      }, 1500);
                    }
                  }
                }}
              >
                <Popup>
                  <b>{c.name}</b>
                  <br />
                  {c.specialization}
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <h2 className="text-3xl font-bold flex-1">
          Available Clinics
        </h2>

        <input
          placeholder="Search clinic name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 border rounded-lg"
        />

        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className="w-full sm:w-56 px-4 py-2 border rounded-lg"
        >
          <option value="">All Specializations</option>
          {specializations.map(spec => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>

      {/* ================= GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <ClinicSkeleton key={i} />
          ))}

        {!loading &&
          filteredClinics.map(c => (
            <div
              key={c._id}
              ref={(el) => (cardRefs.current[c._id] = el)}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition flex flex-col h-[420px]"
            >
              <ClinicImage src={c.photos?.[0]} />

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-semibold mb-1">
                  {c.name}
                </h3>

                <p className="text-sm text-gray-600">
                  {c.specialization}
                </p>

                <p className="text-sm text-gray-500">
                  {c.address}
                </p>

                <p className="text-sm text-gray-500 mb-4">
                  {c.workingHours?.start} – {c.workingHours?.end}
                </p>

                <button
                  onClick={() => navigate(`/clinics/${c._id}`)}
                  className="mt-auto w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  View Clinic
                </button>
              </div>
            </div>
          ))}
      </div>

      {!loading && filteredClinics.length === 0 && (
        <p className="text-center text-gray-500">
          No clinics found
        </p>
      )}
    </div>
  );
}

/* ================= IMAGE WITH BLUR ================= */
function ClinicImage({ src }) {
  const [loaded, setLoaded] = useState(false);

  if (!src) {
    return (
      <div className="h-48 bg-gray-300 flex items-center justify-center">
        No Image
      </div>
    );
  }

  return (
    <div className="relative h-48 overflow-hidden">
      <div
        className={`absolute inset-0 bg-gray-300 transition-opacity ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />

      <img
        src={src}
        alt="Clinic"
        onLoad={() => setLoaded(true)}
        className={`w-full h-48 object-cover transition ${
          loaded ? "blur-0" : "blur-md scale-105"
        }`}
      />
    </div>
  );
}

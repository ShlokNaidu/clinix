import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

/* ---------------- SKELETON CARD ---------------- */
function ClinicSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse h-[420px]">
      <div className="w-full h-48 bg-gray-300"></div>

      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>

        <div className="mt-6 h-10 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

export default function Clinics() {
  const [clinics, setClinics] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await api.get("/clinics");
        setClinics(res.data);
      } catch (err) {
        console.error("Failed to load clinics");
      } finally {
        setLoading(false);
      }
    };
    fetchClinics();
  }, []);

  const filteredClinics = clinics.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h2 className="text-3xl font-bold">Available Clinics</h2>

        <input
          type="text"
          placeholder="Search clinic name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* SKELETONS */}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <ClinicSkeleton key={i} />
          ))}

        {/* REAL DATA */}
        {!loading &&
          filteredClinics.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col h-[420px]"
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
                  className="mt-auto w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  View Clinic
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* EMPTY STATE */}
      {!loading && filteredClinics.length === 0 && (
        <p className="text-center text-gray-500 mt-12">
          No clinics found
        </p>
      )}
    </div>
  );
}

/* ---------------- IMAGE WITH BLUR ---------------- */
function ClinicImage({ src }) {
  const [loaded, setLoaded] = useState(false);

  if (!src) {
    return (
      <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-500">
        No Image
      </div>
    );
  }

  return (
    <div className="relative w-full h-48 overflow-hidden">
      {/* BLUR PLACEHOLDER */}
      <div
        className={`absolute inset-0 bg-gray-300 transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />

      <img
        src={`https://clinix-5qt7.onrender.com${src}`}
        alt="Clinic"
        onLoad={() => setLoaded(true)}
        className={`w-full h-48 object-cover transition duration-500 ${
          loaded ? "blur-0 scale-100" : "blur-md scale-105"
        }`}
      />
    </div>
  );
}

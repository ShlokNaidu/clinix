import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Clinics() {
  const [clinics, setClinics] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClinics = async () => {
      const res = await api.get("/clinics");
      setClinics(res.data);
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

      {/* CLINIC GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-1">
        {filteredClinics.map((c) => (
          <div
            key={c._id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col h-[420px] p-2"
          >

            {/* IMAGE COVER */}
            {c.photos?.length > 0 && (
              <img
                src={`http://localhost:5000${c.photos[0]}`}
                alt="Clinic"
                className="w-full h-48 object-cover rounded-xl"
              />
            )}

            {/* CONTENT */}
            <div className="p-5">
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
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                View Clinic
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

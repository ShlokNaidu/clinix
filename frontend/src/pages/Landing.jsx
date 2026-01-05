import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-md text-center">
        
        <h1 className="text-4xl font-bold mb-2 text-blue-600">
          Clinix
        </h1>

        <p className="text-gray-600 mb-8">
          Book clinic appointments easily
        </p>

        <button
          onClick={() => navigate("/clinics")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg mb-4 hover:bg-blue-700 transition"
        >
          Search Appointment
        </button>

        <button
          onClick={() => navigate("/login")}
          className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition"
        >
          Doctor Login
        </button>

      </div>
    </div>
  );
}

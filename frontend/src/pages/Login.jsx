import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password
      });

      login(res.data.token, res.data.role);

      if (res.data.role === "doctor") {
        localStorage.setItem("doctorToken", res.data.token);
        navigate("/doctor/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-8">
        {/* HEADER */}
        <h2 className="text-2xl font-bold text-center mb-2">
          Doctor Login
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Access your clinic dashboard
        </p>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="doctor@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-600 mt-4">
          New doctor?{" "}
          <span
            onClick={() => navigate("/doctor/signup")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Create an account
          </span>
        </p>

        <button
          onClick={() => navigate("/")}
          className="block mx-auto mt-4 text-sm text-gray-500 hover:underline"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

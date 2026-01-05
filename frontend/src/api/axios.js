import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

// 🔐 Attach token automatically
api.interceptors.request.use((config) => {
  const doctorToken = localStorage.getItem("doctorToken");
  const patientToken = localStorage.getItem("patientToken");

  // Prefer doctor token if available
  const token = doctorToken || patientToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

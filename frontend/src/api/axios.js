import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api"
});

// 👇 this will be injected from App
let setLoadingGlobal = null;

// 🔗 bind function
export const bindGlobalLoader = (setLoading) => {
  setLoadingGlobal = setLoading;
};

// REQUEST → SHOW LOADER
api.interceptors.request.use(
  (config) => {
    if (setLoadingGlobal) setLoadingGlobal(true);

    const doctorToken = localStorage.getItem("doctorToken");
    const patientToken = localStorage.getItem("patientToken");
    const token = doctorToken || patientToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    if (setLoadingGlobal) setLoadingGlobal(false);
    return Promise.reject(error);
  }
);

// RESPONSE → HIDE LOADER
api.interceptors.response.use(
  (response) => {
    if (setLoadingGlobal) setLoadingGlobal(false);
    return response;
  },
  (error) => {
    if (setLoadingGlobal) setLoadingGlobal(false);
    return Promise.reject(error);
  }
);

export default api;

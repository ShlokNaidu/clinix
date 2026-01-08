import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "leaflet/dist/leaflet.css";

import { Toaster } from "react-hot-toast";        // ✅ ADD
import { LoadingProvider } from "./context/LoadingContext";
import GlobalLoader from "./components/GlobalLoader";
import { bindGlobalLoader } from "./api/axios";
import { useLoading } from "./context/LoadingContext";

/* 🔌 Helper component to bind loader */
function LoaderBinder() {
  const { setLoading } = useLoading();

  React.useEffect(() => {
    bindGlobalLoader(setLoading);
  }, [setLoading]);

  return null;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 🔔 GLOBAL TOAST UI */}
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 3500,
        style: {
          background: "#111827", // dark gray
          color: "#fff",
          fontSize: "14px",
        },
        success: {
          iconTheme: {
            primary: "#10b981", // green
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444", // red
            secondary: "#fff",
          },
        },
      }}
    />

    <LoadingProvider>
      <LoaderBinder />
      <GlobalLoader />
      <App />
    </LoadingProvider>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "leaflet/dist/leaflet.css";  // leaflet for map - import
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
    <LoadingProvider>
      <LoaderBinder />
      <GlobalLoader />
      <App />
    </LoadingProvider>
  </React.StrictMode>
);

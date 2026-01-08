import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";

/* 🔧 Fix Leaflet marker icons */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function ClinicMap({ clinics }) {
  const navigate = useNavigate();

  /* Default center (India) */
  const center = [22.7196, 75.8577]; // Indore fallback

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-md">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='© OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {clinics.map((clinic) => {
          if (!clinic.location?.lat || !clinic.location?.lng) return null;

          return (
            <Marker
              key={clinic._id}
              position={[
                clinic.location.lat,
                clinic.location.lng
              ]}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="font-semibold">{clinic.name}</p>
                  <p className="text-sm text-gray-600">
                    {clinic.specialization}
                  </p>

                  <button
                    onClick={() => navigate(`/clinics/${clinic._id}`)}
                    className="mt-2 text-sm text-blue-600 underline"
                  >
                    View Clinic
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

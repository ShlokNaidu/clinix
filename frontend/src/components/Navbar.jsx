import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div
      style={{
        padding: "12px 20px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      {/* Left */}
      <div style={{ display: "flex", gap: "15px" }}>
        <Link to="/">Home</Link>
        <Link to="/clinics">Clinics</Link>
      </div>

      {/* Right */}
      <div style={{ display: "flex", gap: "15px" }}>
        {!user && <Link to="/login">Doctor Login</Link>}

        {user?.role === "doctor" && (
          <>
            <Link to="/doctor/dashboard">Dashboard</Link>
            <Link to="/doctor/add-clinic">Add Clinic</Link>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

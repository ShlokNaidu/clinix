import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import DoctorDashboard from "./pages/DoctorDashboard";
import Navbar from "./components/Navbar";
import AddClinic from "./pages/AddClinic";
import DoctorSignup from "./pages/DoctorSignup";
import Clinics from "./pages/Clinics";
import ClinicDetail from "./pages/ClinicDetail";
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/book" element={<BookAppointment />} /> */}
          <Route path="/doctor/signup" element={<DoctorSignup />} />
          <Route path="/clinics" element={<Clinics />} />
          <Route path="/clinics/:id" element={<ClinicDetail />} />

          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute role="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route path="/doctor/add-clinic" element={<AddClinic />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

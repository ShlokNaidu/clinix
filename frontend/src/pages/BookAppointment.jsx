import { useEffect, useState } from "react";
import api from "../api/axios";

export default function BookAppointment() {
  const [clinics, setClinics] = useState([]);
  const [clinicId, setClinicId] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch clinics (public)
  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const res = await api.get("/clinics");
        setClinics(res.data);
      } catch (err) {
        alert("Failed to load clinics");
      }
    };
    fetchClinics();
  }, []);

  const handleBook = async () => {
    if (!name || !email || !clinicId || !slotTime || !symptoms) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ ALWAYS auto-login / auto-register patient
      const authRes = await api.post("/auth/patient-login", {
        name,
        email
      });

      const patientToken = authRes.data.token;

      if (!patientToken) {
        throw new Error("Patient token not received");
      }

      // 2️⃣ Persist token (optional but useful)
      localStorage.setItem("patientToken", patientToken);

      // 3️⃣ Book appointment with fresh token
      await api.post(
        "/appointments",
        {
          clinic: clinicId,
          slotTime,
          symptoms
        },
        {
          headers: {
            Authorization: `Bearer ${patientToken}`
          }
        }
      );

      alert("Appointment booked successfully");

      // 4️⃣ Reset form (UX polish)
      setClinicId("");
      setSlotTime("");
      setSymptoms("");
      setName("");
      setEmail("");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Book Appointment</h2>

      <label>Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Email</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>Choose Clinic</label>
      <select value={clinicId} onChange={(e) => setClinicId(e.target.value)}>
        <option value="">Select</option>
        {clinics.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name} – {c.specialization}
          </option>
        ))}
      </select>

      <br /><br />

      <label>Slot Time</label>
      <input
        type="datetime-local"
        value={slotTime}
        onChange={(e) => setSlotTime(e.target.value)}
      />

      <br /><br />

      <label>Symptoms</label>
      <textarea
        placeholder="Describe your problem"
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
      />

      <br /><br />

      <button onClick={handleBook} disabled={loading}>
        {loading ? "Booking..." : "Book Appointment"}
      </button>
    </div>
  );
}

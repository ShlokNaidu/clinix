import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function ClinicDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pageLoading, setPageLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [clinic, setClinic] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [pdf, setPdf] = useState(null);

  const [bookedSlots, setBookedSlots] = useState([]);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiData, setAiData] = useState(null);

  /* ---------------- FETCH CLINIC ---------------- */
  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const res = await api.get(`/clinics/${id}`);
        setClinic(res.data);
      } catch {
        toast.error("Failed to load clinic");
      } finally {
        setPageLoading(false);
      }
    };

    fetchClinic();
  }, [id]);

  /* ---------------- FETCH BOOKED SLOTS ---------------- */
  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        const res = await api.get(`/appointments/clinic/${id}`);
        setBookedSlots(
          res.data.map(a =>
            new Date(a.slotTime).toISOString().slice(0, 16)
          )
        );
      } catch {
        console.error("Failed to fetch booked slots");
      }
    };

    fetchBookedSlots();
  }, [id]);

  /* ---------------- AI INTAKE ---------------- */
  const runAI = async () => {
    if (!symptoms || symptoms.length < 10) {
      toast.error("Please describe symptoms clearly");
      return;
    }

    try {
      setAiLoading(true);
      const res = await api.post("/ai/intake", { text: symptoms });
      setAiData(res.data.data);
    } catch {
      toast.error("AI failed to analyze symptoms");
      setAiData(null);
    } finally {
      setAiLoading(false);
    }
  };

  /* ---------------- BOOK APPOINTMENT ---------------- */
  const handleBook = async () => {
    if (!name || !email || !slotTime || !symptoms) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!aiData) {
      toast.error("Please analyze symptoms with AI first");
      return;
    }

    try {
      setBookingLoading(true);

      const data = new FormData();
      data.append("clinic", id);
      data.append("slotTime", new Date(slotTime).toISOString());
      data.append("symptoms", symptoms);
      data.append("name", name);
      data.append("email", email);
      data.append(
        "aiMeta",
        JSON.stringify({
          symptoms: aiData.symptoms,
          urgency: aiData.urgency,
          preferredDateTime: aiData.preferredDateTime,
          source: "groq"
        })
      );

      if (pdf) data.append("pdf", pdf);

      await api.post("/appointments", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Appointment booked successfully");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  /* ---------------- PAGE LOADING ---------------- */
  if (pageLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-gray-600">Loading clinic details...</p>
      </div>
    );
  }

  if (!clinic) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      {/* CLINIC INFO */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2">{clinic.name}</h2>

        {clinic.photos?.length > 0 && (
          <div className="flex gap-4 overflow-x-auto mb-4">
            {clinic.photos.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Clinic"
                className="w-40 h-40 object-cover rounded-xl"
              />
            ))}

          </div>
        )}

        <p className="text-gray-700">
          <b>Doctor:</b> {clinic.doctor?.name}
        </p>
        <p className="text-gray-700">
          <b>Specialization:</b> {clinic.specialization}
        </p>
        <p className="text-gray-700">
          <b>Working Hours:</b> {clinic.workingHours?.start} –{" "}
          {clinic.workingHours?.end}
        </p>
      </div>

      {/* BOOK APPOINTMENT */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">
          Book Appointment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Your Name"
            value={name}
            disabled={bookingLoading}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded-lg disabled:bg-gray-100"
          />

          <input
            placeholder="Email"
            value={email}
            disabled={bookingLoading}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded-lg disabled:bg-gray-100"
          />

          <input
            type="datetime-local"
            value={slotTime}
            disabled={bookingLoading}
            onChange={(e) => {
              if (bookedSlots.includes(e.target.value)) {
                toast.error("This slot is already booked");
                return;
              }
              setSlotTime(e.target.value);
            }}
            className="border p-2 rounded-lg disabled:bg-gray-100"
          />
        </div>

        <textarea
          placeholder="Describe your symptoms"
          value={symptoms}
          disabled={bookingLoading}
          onChange={(e) => setSymptoms(e.target.value)}
          className="border p-2 rounded-lg w-full mt-4 disabled:bg-gray-100"
          rows={4}
        />

        <button
          disabled={bookingLoading || aiLoading}
          onClick={handleBook}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {bookingLoading ? "Booking..." : "Book Appointment"}
        </button>


        {aiData && (
          <div className="mt-4 bg-purple-50 border border-purple-200 p-4 rounded-lg">
            <p><b>AI Symptoms:</b> {aiData.symptoms}</p>
            <p><b>Urgency:</b> {aiData.urgency}</p>
            {aiData.preferredDateTime && (
              <p><b>Suggested Time:</b> {aiData.preferredDateTime}</p>
            )}
          </div>
        )}

        <input
          type="file"
          accept="application/pdf"
          disabled={bookingLoading}
          onChange={(e) => setPdf(e.target.files[0])}
          className="mt-4"
        />

        <button
          onClick={handleBook}
          disabled={bookingLoading}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {bookingLoading ? "Booking..." : "Book Appointment"}
        </button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const getGoogleMapsLink = (address) => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
};

export default function ClinicDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clinic, setClinic] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [slotTime, setSlotTime] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const [aiSummary, setAiSummary] = useState("");
  const [urgency, setUrgency] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [pdf, setPdf] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  /* ================= FETCH CLINIC ================= */
  useEffect(() => {
    const loadClinic = async () => {
      try {
        const res = await api.get(`/clinics/${id}`);
        setClinic(res.data);
      } catch {
        toast.error("Failed to load clinic details");
      } finally {
        setPageLoading(false);
      }
    };
    loadClinic();
  }, [id]);

  /* ================= FETCH BOOKED SLOTS ================= */
  useEffect(() => {
    api
      .get(`/appointments/clinic/${id}`)
      .then((res) => {
        setBookedSlots(
          res.data.map((a) =>
            new Date(a.slotTime).toISOString().slice(0, 16)
          )
        );
      })
      .catch(() => {});
  }, [id]);

  /* ================= AI ANALYZE ================= */
  const runAI = async () => {
    if (symptoms.trim().length < 5) {
      toast.error("Please describe your symptoms clearly");
      return;
    }

    try {
      setAiLoading(true);
      toast.loading("Analyzing symptoms…", { id: "ai" });

      const res = await api.post("/ai/intake", { text: symptoms });

      setAiSummary(res.data.data.aiSummary || res.data.data.symptoms);
      setUrgency(res.data.data.urgency || "medium");

      toast.success("Symptoms analyzed. Please review below.", {
        id: "ai",
      });
    } catch {
      setAiSummary(symptoms);
      setUrgency("medium");

      toast.error(
        "We couldn't fully analyze your symptoms. Please review manually.",
        { id: "ai" }
      );
    } finally {
      setAiLoading(false);
    }
  };

  /* ================= BOOK APPOINTMENT ================= */
  const handleBook = async () => {
    if (!name || !email || !slotTime || !aiSummary) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setBookingLoading(true);
      toast.loading("Booking your appointment…", { id: "booking" });

      const data = new FormData();
      data.append("clinic", id);
      data.append("slotTime", new Date(slotTime).toISOString());
      data.append("name", name);
      data.append("email", email);
      data.append("symptoms", symptoms);
      data.append(
        "aiMeta",
        JSON.stringify({
          aiSummary,
          urgency,
        })
      );

      if (pdf) data.append("pdf", pdf);

      await api.post("/appointments", data);

      toast.success("Appointment booked successfully", {
        id: "booking",
      });

      // ✅ OPTIONAL: auto-open maps after booking
      setTimeout(() => {
        window.open(
          getGoogleMapsLink(clinic.address),
          "_blank"
        );
      }, 800);

      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Unable to book appointment. Please try again.",
        { id: "booking" }
      );
    } finally {
      setBookingLoading(false);
    }
  };

  /* ================= UI ================= */
  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading clinic…
      </div>
    );
  }

  if (!clinic) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      {/* CLINIC INFO */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-bold">{clinic.name}</h2>
        <p className="text-gray-600">
          <b>Doctor:</b> {clinic.doctor?.name}
        </p>
        <p className="text-gray-600">
          <b>Specialization:</b> {clinic.specialization}
        </p>
        <p className="text-gray-600">
          <b>Working Hours:</b>{" "}
          {clinic.workingHours?.start} – {clinic.workingHours?.end}
        </p>

        {/* 📍 MAP BUTTON */}
        {clinic.address && (
          <a
            href={getGoogleMapsLink(clinic.address)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            📍 Open Clinic Location
          </a>
        )}
      </div>

      {/* BOOKING */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Book Appointment</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="datetime-local"
            value={slotTime}
            onChange={(e) => {
              if (bookedSlots.includes(e.target.value)) {
                toast.error(
                  "This time slot is already booked. Please choose another time."
                );
                return;
              }
              setSlotTime(e.target.value);
            }}
            className="border p-2 rounded"
          />
        </div>

        <textarea
          className="border p-2 rounded w-full mt-4"
          rows={4}
          placeholder="Describe your symptoms (Hindi / Hinglish / English)"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />

        <button
          onClick={runAI}
          disabled={aiLoading}
          className="mt-3 w-full bg-purple-600 text-white py-2 rounded"
        >
          {aiLoading ? "Analyzing…" : "Analyze Symptoms with AI"}
        </button>

        {aiSummary && (
          <div className="mt-4 bg-purple-50 p-4 rounded border">
            <p className="font-semibold mb-1">
              AI Summary (you can edit):
            </p>
            <textarea
              className="border p-2 rounded w-full"
              value={aiSummary}
              onChange={(e) => setAiSummary(e.target.value)}
            />
            <p className="text-sm mt-2">
              Urgency: <b>{urgency}</b>
            </p>
          </div>
        )}

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdf(e.target.files[0])}
          className="mt-4"
        />

        <button
          onClick={handleBook}
          disabled={bookingLoading}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded"
        >
          {bookingLoading ? "Booking…" : "Book Appointment"}
        </button>
      </div>
    </div>
  );
}

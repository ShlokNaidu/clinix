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

  const [rawSymptoms, setRawSymptoms] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [urgency, setUrgency] = useState("low");

  const [pdf, setPdf] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiDone, setAiDone] = useState(false);

  /* ================= FETCH CLINIC ================= */
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

  /* ================= FETCH BOOKED SLOTS ================= */
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
        console.warn("Failed to fetch booked slots");
      }
    };
    fetchBookedSlots();
  }, [id]);

  /* ================= AI ANALYZE ================= */
  const runAI = async () => {
    if (!rawSymptoms || rawSymptoms.length < 5) {
      toast.error("Please describe symptoms clearly");
      return;
    }

    try {
      setAiLoading(true);

      const res = await api.post("/ai/intake", {
        text: rawSymptoms
      });

      const data = res.data.data;

      setAiSummary(data.symptoms);
      setUrgency(data.urgency);
      setAiDone(true);

      toast.success("Symptoms analyzed");
    } catch {
      // frontend fallback (extra safety)
      setAiSummary(rawSymptoms);
      setUrgency("medium");
      setAiDone(true);

      toast("AI unavailable, using manual summary", { icon: "⚠️" });
    } finally {
      setAiLoading(false);
    }
  };

  /* ================= BOOK APPOINTMENT ================= */
  const handleBook = async () => {
    if (!name || !email || !slotTime || !rawSymptoms) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!aiDone) {
      toast.error("Please analyze symptoms first");
      return;
    }

    try {
      setBookingLoading(true);

      const data = new FormData();
      data.append("clinic", id);
      data.append("slotTime", new Date(slotTime).toISOString());
      data.append("name", name);
      data.append("email", email);
      data.append("symptoms", rawSymptoms);
      data.append(
        "aiMeta",
        JSON.stringify({
          summary: aiSummary,
          urgency,
          source: "ai+fallback"
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

  /* ================= LOADING ================= */
  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!clinic) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-600">
        ← Back
      </button>

      {/* CLINIC INFO */}
      <div className="bg-white rounded-xl p-6 mb-6">
        <h2 className="text-2xl font-bold">{clinic.name}</h2>
        <p><b>Doctor:</b> {clinic.doctor?.name}</p>
        <p><b>Specialization:</b> {clinic.specialization}</p>
        <p><b>Working Hours:</b> {clinic.workingHours?.start} – {clinic.workingHours?.end}</p>
      </div>

      {/* BOOK */}
      <div className="bg-white rounded-xl p-6">
        <input placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} className="border p-2 w-full mb-3" />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 w-full mb-3" />
        <input type="datetime-local" value={slotTime} onChange={e => setSlotTime(e.target.value)} className="border p-2 w-full mb-3" />

        <textarea
          placeholder="Describe symptoms (Hindi / Hinglish / English)"
          value={rawSymptoms}
          onChange={e => setRawSymptoms(e.target.value)}
          className="border p-2 w-full mb-3"
          rows={4}
        />

        <button onClick={runAI} disabled={aiLoading} className="bg-purple-600 text-white py-2 w-full rounded mb-4">
          {aiLoading ? "Analyzing..." : "Analyze Symptoms"}
        </button>

        {aiDone && (
          <div className="bg-purple-50 p-3 rounded mb-4">
            <p className="text-sm font-semibold mb-1">AI Summary (Editable)</p>
            <textarea
              value={aiSummary}
              onChange={e => setAiSummary(e.target.value)}
              className="border p-2 w-full"
              rows={3}
            />
            <p className="text-sm mt-2"><b>Urgency:</b> {urgency}</p>
          </div>
        )}

        <input type="file" accept="application/pdf" onChange={e => setPdf(e.target.files[0])} className="mb-4" />

        <button onClick={handleBook} disabled={bookingLoading} className="bg-blue-600 text-white py-3 w-full rounded">
          {bookingLoading ? "Booking..." : "Book Appointment"}
        </button>
      </div>
    </div>
  );
}

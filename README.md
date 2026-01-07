# 🏥 Clinix

Clinix is a smart, web-based clinic operations platform that helps small and medium clinics move away from WhatsApp-based chaos and manual workflows — into a simple, organized, and digital system.

It focuses on real clinic needs: appointment management, patient coordination, and record handling — without unnecessary complexity or heavy hospital software.

Clinix is designed to be fast for patients, useful for doctors, and practical for real-world adoption.

---

## 🚀 Problem Statement

Most local clinics today:
-Manage appointments using calls and WhatsApp messages
-Have no structured scheduling or slot visibility
-Depend on paper files or scattered PDFs for patient records
-Spend significant time on manual coordination
-Have no insight into daily operations

This results in:
-Missed or double bookings
-Lost or inaccessible medical records
-Long waiting times
-High dependence on reception staff
-Poor patient experience

Clinics need a lightweight digital infrastructure — not heavy hospital systems.

---

## 💡 Solution

Clinix provides:
- A centralized platform for clinics to list themselves
- A simple, no-login appointment booking flow for patients
- Secure medical record (PDF) uploads per appointment
- Doctor-only dashboards with access control
- Clean separation between patient and doctor workflows
-Reduces manual coordination for clinics
-Improved patient experience without friction

The system uses automation and AI responsibly — not to diagnose or treat — but to structure information and save time.

---

## 🧠 Key Features

### 👨‍⚕️ Doctor Side
- Doctor account signup & login
- Create and manage clinics
- Add clinic details:
  - Clinic name
  - Specialization
  - Address & location
  - Working hours
  - Clinic images
- View all appointments for **their clinics only** sorted by time
- Access patient details and uploaded medical records
- Download patient medical PDFs securely
-View AI-generated summaries of uploaded PDFs (assistive only)
-Basic analytics on appointments and clinic activity

### 🧑‍🦱 Patient Side
- Browse all listed clinics
- View clinic details (hours, address, specialization, photos)
- Book appointments **without creating an account**
- Upload previous medical records (PDF) during booking
-Describe health issues in natural language (Hindi/English)

### 🤖 AI Assistance 
- Converts natural language patient input into structured booking data
- Summarizes uploaded medical documents for faster doctor review
- Used only for workflow assistance — not medical advice

### 🔐 Security & Access Control
- Role-based authentication (doctor-only routes protected)
- Medical PDFs accessible **only to the doctor of that clinic**
- No public access to sensitive files

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
-Tailwind CSS (UI styling)

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- PdfParser
- Multer (file uploads)
- JWT (authentication)

### AI & CLOUD
- Gemini and Groq
- Google Maps API
- Firebase & Render

---

### LINK TO OUR PROJECT
https://clinix-frontend.web.app/

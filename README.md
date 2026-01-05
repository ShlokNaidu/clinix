# 🏥 Clinix

Clinix is a web-based clinic discovery and appointment management platform designed to simplify how local clinics handle appointments and medical records, while keeping the patient experience fast and frictionless.

The project was built with a **real-world clinic workflow** in mind — especially small and medium clinics that currently rely on WhatsApp calls and manual record handling.

---

## 🚀 Problem Statement

Many local clinics:
- Manage appointments manually via calls or WhatsApp
- Have no structured appointment scheduling
- Ask patients to carry physical medical records
- Lack visibility into daily patient flow

This leads to inefficiency, lost records, and poor patient experience.

---

## 💡 Solution

Clinix provides:
- A centralized platform for clinics to list themselves
- A simple, no-login appointment booking flow for patients
- Secure medical record (PDF) uploads per appointment
- Doctor-only dashboards with access control
- Clean separation between patient and doctor workflows

---

## 🧠 Key Features

### 👨‍⚕️ Doctor Side
- Doctor account signup & login
- Create and manage clinics
- Add clinic details:
  - Clinic name
  - Specialization
  - Address
  - Working hours
  - Clinic photo
- View all appointments for **their clinics only**
- Download patient medical PDFs securely

### 🧑‍🦱 Patient Side
- Browse all listed clinics
- View clinic details (hours, address, specialization, photos)
- Book appointments **without creating an account**
- Upload previous medical records (PDF) during booking

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

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- Multer (file uploads)
- JWT (authentication)

### Storage
- Local filesystem for uploads:

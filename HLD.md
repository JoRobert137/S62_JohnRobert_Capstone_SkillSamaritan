# SkillSamaritan - High Level Design

# Architecture

Client
      │
 REST API
      │
Backend Server
      │
Business Layer
      │
Database

---

# Components

Frontend

- React
- TypeScript
- TailwindCSS

Responsibilities

- Authentication
- Dashboard
- Search
- Booking
- Profile

---

Backend

Spring Boot

Responsibilities

- Authentication
- Business Logic
- Validation
- Scheduling
- Notifications

---

Database

MySQL

Stores

- Users
- Skills
- Sessions
- Reviews
- Bookings

---

Authentication

JWT Authentication

Flow

Login
↓

Generate JWT

↓

Client stores token

↓

Authenticated API requests

---

Major Modules

Authentication Module

↓

Profile Module

↓

Mentor Module

↓

Learner Module

↓

Booking Module

↓

Review Module

↓

Notification Module

↓

Admin Module

---

External Services

- Email Service
- Cloud Storage (Profile Images)
- Google Calendar (Future)
- Video Meeting Integration (Future)

---

Deployment

Frontend

↓

Vercel / Netlify

Backend

↓

Render / Railway / AWS

Database

↓

MySQL

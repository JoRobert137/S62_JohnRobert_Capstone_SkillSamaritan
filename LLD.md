# SkillSamaritan - Low Level Design

# Entities

User

- id
- name
- email
- password
- role
- profileImage
- bio

---

Mentor

- id
- userId
- experience
- skills
- availability
- hourlyRate
- rating

---

Learner

- id
- userId

---

Skill

- id
- name
- category

---

Booking

- id
- learnerId
- mentorId
- date
- time
- status

Status

- Pending
- Accepted
- Rejected
- Completed
- Cancelled

---

Review

- id
- bookingId
- rating
- review

---

# REST APIs

Authentication

POST /register

POST /login

POST /logout

---

Profile

GET /profile

PUT /profile

---

Mentor

GET /mentors

GET /mentors/{id}

POST /mentor

PUT /mentor

DELETE /mentor

---

Booking

POST /bookings

GET /bookings

PUT /bookings/{id}

DELETE /bookings/{id}

---

Review

POST /reviews

GET /reviews/{mentorId}

---

Admin

GET /users

DELETE /users/{id}

GET /reports

---

Validation

Email

- Required
- Unique

Password

- Minimum 8 characters

Booking

- Cannot overlap existing session

Review

- Only after completed session

---

Error Responses

400

Bad Request

401

Unauthorized

403

Forbidden

404

Not Found

500

Internal Server Error

---

Folder Structure

backend

src

controller

service

repository

entity

dto

config

security

exception

util

frontend

src

components

pages

hooks

services

store

types

utils

routes

assets

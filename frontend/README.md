# Calendly Clone

A full-stack functional scheduling and booking web application that closely replicates Calendly's core features and user interface. It allows users to create event types, set their weekly availability, and provides a public link for invitees to book available time slots without double-booking.

## 🚀 Tech Stack

**Frontend:**
* React.js (Bootstrapped with Vite)
* Tailwind CSS v4 (for styling and UI design)
* React Router DOM (for SPA navigation)
* Axios (for API requests)
* Date-fns (for calendar and time/date manipulation)
* Lucide React (for UI icons)

**Backend:**
* Node.js & Express.js (REST API framework)
* PostgreSQL (Relational Database)
* `pg` (PostgreSQL client for Node.js)
* `cors` & `dotenv` (Environment and cross-origin resource sharing management)

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed on your system:
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [PostgreSQL](https://www.postgresql.org/download/) (running locally on port `5432`)

---

## 🛠️ Project Setup & Installation

### 1. Database Setup
You need to create the database and seed it with the default user data.

1. Open **SQL Shell (psql)** or **pgAdmin**.
2. Connect to your local PostgreSQL server.
3. Run the following SQL commands:

```
sql
CREATE DATABASE calendly_clone;
\c calendly_clone;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    timezone VARCHAR(50) DEFAULT 'UTC'
);

CREATE TABLE event_types (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(100) NOT NULL,
    duration INTEGER NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE availabilities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    day_of_week INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    UNIQUE(user_id, day_of_week)
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    event_type_id INTEGER REFERENCES event_types(id),
    invitee_name VARCHAR(100) NOT NULL,
    invitee_email VARCHAR(100) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'active'
);

-- Seed Default Admin Data
INSERT INTO users (name, email) VALUES ('Admin User', 'admin@example.com');
INSERT INTO event_types (user_id, title, duration, slug) VALUES (1, '15 Minute Meeting', 15, '15min');
INSERT INTO availabilities (user_id, day_of_week, start_time, end_time) VALUES 
(1, 1, '09:00', '17:00'), (1, 2, '09:00', '17:00'), (1, 3, '09:00', '17:00'), 
(1, 4, '09:00', '17:00'), (1, 5, '09:00', '17:00');

```
2. Backend Setup
cd backend
npm install
node server.js

3. Frontend Setup
cd frontend
npm install
npm run dev

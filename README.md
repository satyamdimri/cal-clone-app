# Cal.clone

A Calendly-style scheduling app with a dark `cal.com`-inspired UI, a React + Vite frontend, an Express backend, and Neon PostgreSQL for persistence.

## Tech Stack

- Frontend: React 19, Vite 8, React Router 7, Tailwind CSS 4, Axios
- Backend: Node.js, Express 5, `pg`, `dotenv`, `cors`
- Database: Neon PostgreSQL
- Utilities: `date-fns`, `lucide-react`, `nodemon`

## Project Structure

- `frontend/`: React client
- `backend/`: Express API and database connection
- `backend/schema.sql`: database schema for Neon/PostgreSQL
- `backend/seed.sql`: sample data for quick setup
- `vercel.json`: local/service routing configuration

## Prerequisites

- Node.js 18+ recommended
- A Neon PostgreSQL database
- `npm`

## Environment Setup

Create `backend/.env` with:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require&channel_binding=require"
```

Use the full connection string from the Neon dashboard's `Connect` dialog.

## Database Setup

Run these files in the Neon SQL editor in this order:

1. `backend/schema.sql`
2. `backend/seed.sql`

What they do:

- `schema.sql` creates `users`, `event_types`, `availabilities`, and `bookings`
- `seed.sql` inserts a default admin user, sample event types, default availability, and one demo booking

## Install Dependencies

Run this once from the repo root:

```bash
npm install --prefix backend
npm install --prefix frontend
```

## Run Locally

Start the backend:

```bash
npm --prefix backend run dev
```

Start the frontend in a second terminal:

```bash
npm --prefix frontend run dev
```

Open:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

Note: the Vite dev server proxies `/api` requests to `http://localhost:5000`.

## Available Scripts

Backend:

```bash
npm --prefix backend run dev
npm --prefix backend start
```

Frontend:

```bash
npm --prefix frontend run dev
npm --prefix frontend run build
npm --prefix frontend run lint
npm --prefix frontend run preview
```

## Features

- Create, edit, and delete event types
- Set weekly availability
- View bookings by status
- Public booking page by event slug
- Booking slot generation based on duration, availability, and existing bookings

## Assumptions

- The app currently operates around a single default user: `admin@example.com`
- Authentication is not implemented yet
- Availability is stored as one time range per day
- Booking slots are generated in 15-minute increments
- Only active bookings block time slots
- Timezone selection is currently UI-level only; it is not persisted in the database
- Event type slug uniqueness is enforced per user
- The backend expects Neon/PostgreSQL-compatible SQL behavior

## Notes

- If the UI shows no data, make sure `backend/seed.sql` was executed successfully in Neon
- If port `5000` is already in use, stop the other process before starting the backend
- If the frontend cannot reach the backend, confirm the backend is running and `frontend/vite.config.js` proxy is present

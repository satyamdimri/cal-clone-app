-- Dummy data for local UI testing (event types + availability + optional bookings).
-- Run this after `backend/schema.sql` in the Neon SQL editor.

-- 1) Ensure the default admin user exists (matches backend DEFAULT_USER_EMAIL)
WITH u AS (
  INSERT INTO users (name, email)
  VALUES ('Admin User', 'admin@example.com')
  ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
  RETURNING id
),
events AS (
  SELECT
    u.id AS user_id,
    v.title,
    v.duration,
    v.slug
  FROM u
  CROSS JOIN (
    VALUES
      ('Intro Call', 30, 'intro-call'),
      ('Consultation', 45, 'consultation')
  ) AS v(title, duration, slug)
)
INSERT INTO event_types (user_id, title, duration, slug)
SELECT user_id, title, duration, slug
FROM events
ON CONFLICT (user_id, slug) DO UPDATE
SET
  title = EXCLUDED.title,
  duration = EXCLUDED.duration;

-- 2) Seed default availability (Mon-Fri 09:00 - 17:00)
WITH u AS (
  SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1
)
INSERT INTO availabilities (user_id, day_of_week, start_time, end_time)
SELECT
  u.id,
  v.day_of_week,
  v.start_time,
  v.end_time
FROM u
CROSS JOIN (
  VALUES
    (1, '09:00'::time, '17:00'::time),
    (2, '09:00'::time, '17:00'::time),
    (3, '09:00'::time, '17:00'::time),
    (4, '09:00'::time, '17:00'::time),
    (5, '09:00'::time, '17:00'::time)
) AS v(day_of_week, start_time, end_time)
ON CONFLICT (user_id, day_of_week) DO UPDATE
SET
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time;

-- 3) Optional: seed one upcoming booking (for Intro Call)
-- This is only for demo; if date mismatches your timezone, you may see it in Past/Canceled instead.
WITH intro_event AS (
  SELECT e.id, e.duration
  FROM event_types e
  JOIN users u ON u.id = e.user_id
  WHERE u.email = 'admin@example.com'
    AND e.slug = 'intro-call'
  LIMIT 1
)
INSERT INTO bookings (event_type_id, invitee_name, invitee_email, start_time, end_time, status)
SELECT
  intro_event.id,
  'Demo User',
  'demo-user@example.com',
  (date_trunc('day', now()) + interval '1 day' + interval '14 hours'),
  (date_trunc('day', now()) + interval '1 day' + interval '14 hours') + (intro_event.duration || ' minutes')::interval,
  'active'
FROM intro_event
ON CONFLICT DO NOTHING;


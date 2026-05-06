CREATE TABLE IF NOT EXISTS rsvps (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  attending BOOLEAN NOT NULL,
  guest_count INTEGER,
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

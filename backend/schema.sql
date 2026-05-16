CREATE TABLE IF NOT EXISTS rsvps (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  attending BOOLEAN NOT NULL,
  guest_count INTEGER,
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS rsvps_name_normalized_unique
  ON rsvps (LOWER(TRIM(name)));

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

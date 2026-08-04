-- Restore RSVPs extracted from notification emails after Heroku loss.
-- Run against Railway Postgres (Console or: psql "$DATABASE_URL" -f scripts/seed-rsvps-from-emails.sql)
-- Excluded clear test rows: Ahaoma Destiny Okeke (guest_count 5000000).
-- Ngozi Echem had guest_count 1206 in email (likely a typo/test); restored as 0 — fix in admin if needed.

BEGIN;

DELETE FROM rsvps;

INSERT INTO rsvps (name, attending, guest_count, comment) VALUES
  ('Prince Ihedi Okeke', true, 0, NULL),
  ('Sareh Ebrahimi', true, 0, 'Gleder meg skikkelig! ❤️'),
  ('Lat samba gueye', true, 1, NULL),
  ('Catherine', true, 1, 'Myself and daughter'),
  ('Nze John Anugweje', true, 6, '<3'),
  (
    'Juliet Okparaebo',
    true,
    2,
    'Please send this request to: Chigoziri Okparaebo as well if not sent yet'
  ),
  ('Ojukwu', true, 5, NULL),
  (
    'Prince Adesanya',
    true,
    2,
    'We shall grace the occasion by God''s grace.'
  ),
  (
    'Emmanuel Odu',
    true,
    3,
    'I would like to know if there is a dress code please'
  ),
  ('Udeme Udosen', true, 2, NULL),
  ('Uche and family', true, 7, NULL),
  (
    'Patricia caulker',
    true,
    3,
    'I will conform if the 2 are comming. I will come foresure by GG'
  ),
  ('Uwanuakwa Vivian', true, 2, 'Me and my daughter'),
  (
    'The Emeodi''s',
    true,
    4,
    'Thank you for the invitation. My family and I look forward to celebrating with you all.'
  ),
  ('Kingsley Egbeocha & family', true, 4, NULL),
  ('Tomi & Mayowa', true, 2, 'Thanks for inviting us!'),
  ('Angelica Okparaebo', true, 1, NULL),
  (
    'Chiamaka',
    true,
    2,
    'Gjestene jeg tar med er mannen, Ole og datteren min Eliana :)'
  ),
  (
    'Sampson Okeke',
    true,
    5,
    'Sampson Okeke, Beauty okeke, Favour Okeke, Angel Okeke, Goodness Okeke'
  ),
  ('Muni Kwarasey', true, 1, NULL),
  ('Eunice Komeja', true, 4, NULL),
  ('Faustina Akyaah', false, NULL, 'I''m Happy to see that day'),
  ('Olanma Ikekwe', true, 1, NULL),
  ('Chisom', true, 3, NULL),
  ('Racheal Wanjiku Gitau', true, 2, NULL),
  ('Carolyn Semboja', true, 1, 'Yippi! Gleder meg❤️'),
  (
    'Ngozi Echem',
    true,
    0,
    'I''m coming . Thanks for invitation Ngozi 2026'
  ),
  ('Omotayo Noah williams', true, 2, NULL),
  ('Chidozie Okeke', true, 3, NULL),
  ('Jane W Njuguna', true, 1, NULL),
  ('Emenike Eribe', true, 2, NULL),
  ('Tumaini Semboja', true, 1, 'Meg Tumaini'),
  ('Frank Bamenye', true, 0, NULL),
  ('eric monga', true, 1, NULL),
  ('Kamyar Abbasi', true, 0, NULL);

COMMIT;

-- Quick check:
-- SELECT COUNT(*) AS rsvps, COALESCE(SUM(CASE WHEN attending THEN COALESCE(guest_count,0)+1 ELSE 0 END),0) AS total_attending FROM rsvps;

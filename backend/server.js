require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const { pool, ensureSchema } = require("./db");
const { sendRsvpNotification, sendRemovalNotification } = require("./email");

const app = express();
/* Default 5050: macOS often uses 5000 for AirPlay Receiver, causing EADDRINUSE. */
const PORT = Number(process.env.PORT) || 5050;

app.use(cors());
app.use(bodyParser.json());

const ADMIN_TOKEN_TTL = process.env.ADMIN_TOKEN_TTL || "7d";
const ADMIN_JWT_SECRET = String(process.env.ADMIN_JWT_SECRET || "").trim();

function ensureAdminSecret(res) {
  if (ADMIN_JWT_SECRET) return true;
  res.status(500).json({ error: "Admin auth is not configured" });
  return false;
}

function getConfiguredAdminPassword() {
  const adminPwRaw = process.env.ADMIN_PASSWORD;
  return typeof adminPwRaw === "string"
    ? adminPwRaw.trim()
    : String(adminPwRaw ?? "").trim();
}

function parseBearerToken(headerValue) {
  const [scheme, token] = String(headerValue || "").split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return token;
}

function requireAdmin(req, res, next) {
  if (!ensureAdminSecret(res)) return;
  const token = parseBearerToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ error: "Admin token is required" });
  }

  try {
    req.admin = jwt.verify(token, ADMIN_JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired admin token" });
  }
}

app.get("/health", (req, res) => {
  res.type("text").send("OK");
});

app.get("/", (req, res) => {
  res.type("text").send(
    "RSVP API is running. Use GET /health to verify the dyno; the invitation site talks to /login and /rsvp."
  );
});

app.post("/login", (req, res) => {
  const raw = req.body?.password;
  if (raw == null || String(raw).trim() === "") {
    return res.status(400).json({ error: "Password is required" });
  }

  const submitted = String(raw).trim();

  /* Trim .env value so CRLF/quotes mishaps don't break compares. */
  const appPwRaw = process.env.APP_PASSWORD;
  const configured =
    typeof appPwRaw === "string" ? appPwRaw.trim() : String(appPwRaw ?? "").trim();

  if (!configured) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  if (submitted === configured) {
    return res.json({ success: true });
  }

  return res.status(401).json({ error: "Invalid password" });
});

app.post("/admin/login", (req, res) => {
  if (!ensureAdminSecret(res)) return;

  const configuredPassword = getConfiguredAdminPassword();
  if (!configuredPassword) {
    return res.status(500).json({ error: "Admin password is not configured" });
  }

  const password = String(req.body?.password || "").trim();
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  if (password !== configuredPassword) {
    return res.status(401).json({ error: "Invalid admin password" });
  }

  const token = jwt.sign({ role: "admin" }, ADMIN_JWT_SECRET, {
    expiresIn: ADMIN_TOKEN_TTL,
  });
  return res.json({ success: true, token });
});

app.post("/rsvp", async (req, res) => {
  const { name, attending, guest_count, comment } = req.body || {};

  if (name == null || String(name).trim() === "") {
    return res.status(400).json({ error: "Name is required" });
  }

  if (typeof attending !== "boolean") {
    return res.status(400).json({ error: "Attending is required" });
  }

  if (attending === true) {
    if (
      guest_count == null ||
      typeof guest_count !== "number" ||
      !Number.isInteger(guest_count) ||
      guest_count < 0
    ) {
      return res
        .status(400)
        .json({ error: "Guest count is required when attending" });
    }
  }

  let guestCountValue = null;
  if (attending === true) {
    guestCountValue = guest_count;
  }

  try {
    await pool.query(
      `INSERT INTO rsvps (name, attending, guest_count, comment)
       VALUES ($1, $2, $3, $4)`,
      [String(name).trim(), attending, guestCountValue, comment ?? null]
    );

    let totalAttending = null;
    if (attending === true) {
      const totalsResult = await pool.query(
        `SELECT COALESCE(SUM(COALESCE(guest_count, 0) + 1), 0) AS total_attending
         FROM rsvps
         WHERE attending = true`
      );
      totalAttending = Number(totalsResult.rows[0]?.total_attending ?? 0);
    }

    const emailPayload = {
      name: String(name).trim(),
      attending,
      guest_count: guestCountValue,
      comment: comment ?? null,
      total_attending: totalAttending,
    };
    sendRsvpNotification(emailPayload).catch((emailErr) => {
      console.error("RSVP saved but notification email failed:", emailErr);
    });

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    const body = { error: "Could not save RSVP" };
    /* Help local debugging; hide details in production. */
    if (process.env.NODE_ENV !== "production") {
      const msg = err && (err.message || String(err));
      const code = err && err.code;
      if (msg) body.detail = code ? `${code}: ${msg}` : msg;
    }
    return res.status(500).json(body);
  }
});

app.get("/admin/rsvps", requireAdmin, async (req, res) => {
  try {
    const rsvpsResult = await pool.query(
      `SELECT id, name, attending, guest_count, comment, created_at
       FROM rsvps
       ORDER BY created_at DESC`
    );
    const totalsResult = await pool.query(
      `SELECT COALESCE(SUM(COALESCE(guest_count, 0) + 1), 0)::int AS total_attending
       FROM rsvps
       WHERE attending = true`
    );
    return res.json({
      rsvps: rsvpsResult.rows,
      total_attending: totalsResult.rows[0].total_attending,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not load RSVPs" });
  }
});

app.delete("/admin/rsvps/:id", requireAdmin, async (req, res) => {
  const rsvpId = Number(req.params.id);
  if (!Number.isInteger(rsvpId) || rsvpId <= 0) {
    return res.status(400).json({ error: "Invalid RSVP id" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const selected = await client.query(
      `SELECT id, name, attending, guest_count
       FROM rsvps
       WHERE id = $1
       FOR UPDATE`,
      [rsvpId]
    );
    if (selected.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "RSVP not found" });
    }

    const removed = selected.rows[0];
    await client.query("DELETE FROM rsvps WHERE id = $1", [rsvpId]);

    const totals = await client.query(
      `SELECT COALESCE(SUM(COALESCE(guest_count, 0) + 1), 0)::int AS total_attending
       FROM rsvps
       WHERE attending = true`
    );
    await client.query("COMMIT");

    const removedGuests = removed.attending ? Number(removed.guest_count || 0) : 0;
    const removedPartySize = removed.attending ? removedGuests + 1 : 0;
    const currentTotal = totals.rows[0].total_attending;

    sendRemovalNotification({
      name: removed.name,
      removedGuestCount: removedGuests,
      removedPartySize,
      currentAttendingTotal: currentTotal,
    }).catch((emailErr) => {
      console.error("RSVP removed but notification email failed:", emailErr);
    });

    return res.json({
      success: true,
      removed: {
        id: removed.id,
        name: removed.name,
        removed_guest_count: removedGuests,
        removed_party_size: removedPartySize,
      },
      total_attending: currentTotal,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({ error: "Could not remove RSVP" });
  } finally {
    client.release();
  }
});

async function start() {
  const dbUrl = process.env.DATABASE_URL?.trim();
  if (!dbUrl) {
    console.error(
      "FATAL: DATABASE_URL is not set. On Heroku: add the Postgres add-on (Resources → Find add-ons → Heroku Postgres) or set DATABASE_URL in Config Vars, then redeploy."
    );
    process.exit(1);
  }

  try {
    await ensureSchema();
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server listening on port ${PORT}`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(
          `Port ${PORT} is already in use. Set PORT in backend/.env (e.g. PORT=3001) or stop the other process. On macOS, AirPlay Receiver often uses port 5000, so this app defaults to 5050.`
        );
      } else {
        console.error(err);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error("Failed to initialize database schema:", err);
    process.exit(1);
  }
}

start();

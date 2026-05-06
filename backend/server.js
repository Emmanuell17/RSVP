require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { pool, ensureSchema } = require("./db");
const { sendRsvpNotification } = require("./email");

const app = express();
/* Default 5050: macOS often uses 5000 for AirPlay Receiver, causing EADDRINUSE. */
const PORT = Number(process.env.PORT) || 5050;

app.use(cors());
app.use(bodyParser.json());

app.get("/health", (req, res) => {
  res.type("text").send("OK");
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

async function start() {
  try {
    await ensureSchema();
    const server = app.listen(PORT, () => {
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

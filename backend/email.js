const nodemailer = require("nodemailer");

function buildSummary({ name, attending, guest_count, comment, total_attending }) {
  const lines = [
    "New RSVP received",
    "",
    `Name: ${name}`,
    `Attending: ${attending ? "Yes" : "No"}`,
  ];
  if (attending && guest_count != null) {
    const partySize = Number(guest_count) + 1;
    lines.push(`Guest count (excl. self): ${guest_count}`);
    lines.push(`Party size (incl. self): ${partySize}`);
  }
  if (attending && total_attending != null) {
    lines.push(`Total attending so far (incl. this RSVP): ${total_attending}`);
  }
  if (comment) {
    lines.push(`Comment: ${comment}`);
  }
  return lines.join("\n");
}

/**
 * Sends a one-off summary to NOTIFY_EMAIL when SMTP is configured.
 * Safe to call without awaiting for fire-and-forget; errors are thrown for logging.
 */
async function sendRsvpNotification(payload) {
  const to = process.env.NOTIFY_EMAIL?.trim();
  if (!to) {
    return;
  }

  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure =
    String(process.env.SMTP_SECURE || "").toLowerCase() === "true" ||
    port === 465;

  if (!host || !user || pass == null || String(pass) === "") {
    console.warn(
      "NOTIFY_EMAIL is set but SMTP_HOST / SMTP_USER / SMTP_PASS are incomplete; skipping email."
    );
    return;
  }

  const from =
    process.env.SMTP_FROM?.trim() || user || `noreply@${host}`;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass: String(pass) },
  });

  const text = buildSummary(payload);
  const subject =
    process.env.NOTIFY_SUBJECT?.trim() || "New RSVP";

  await transporter.sendMail({
    from,
    to,
    subject,
    text,
  });
}

module.exports = { sendRsvpNotification, buildSummary };

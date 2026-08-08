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

/** Read SMTP settings; Gmail app passwords may be pasted with spaces. */
function getSmtpConfig() {
  const to = process.env.NOTIFY_EMAIL?.trim();
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const rawPass = process.env.SMTP_PASS;
  const pass =
    rawPass == null ? "" : String(rawPass).trim().replace(/\s+/g, "");
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure =
    String(process.env.SMTP_SECURE || "").toLowerCase() === "true" ||
    port === 465;
  const from = process.env.SMTP_FROM?.trim() || user || `noreply@${host}`;
  return { to, host, user, pass, port, secure, from };
}

function createTransporter({ host, port, secure, user, pass }) {
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

/**
 * Sends a one-off summary to NOTIFY_EMAIL when SMTP is configured.
 * Safe to call without awaiting for fire-and-forget; errors are thrown for logging.
 */
async function sendRsvpNotification(payload) {
  const { to, host, user, pass, port, secure, from } = getSmtpConfig();
  if (!to) {
    console.warn("NOTIFY_EMAIL is not set; skipping RSVP notification email.");
    return;
  }

  if (!host || !user || !pass) {
    console.warn(
      "NOTIFY_EMAIL is set but SMTP_HOST / SMTP_USER / SMTP_PASS are incomplete; skipping email."
    );
    return;
  }

  const transporter = createTransporter({ host, port, secure, user, pass });
  const text = buildSummary(payload);
  const subject = process.env.NOTIFY_SUBJECT?.trim() || "New RSVP";

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
  });
  console.log(
    `RSVP notification email sent to ${to} (messageId=${info.messageId || "n/a"})`
  );
}

async function sendRemovalNotification(payload) {
  const { to, host, user, pass, port, secure, from } = getSmtpConfig();
  if (!to) return;

  if (!host || !user || !pass) {
    console.warn(
      "NOTIFY_EMAIL is set but SMTP_HOST / SMTP_USER / SMTP_PASS are incomplete; skipping email."
    );
    return;
  }

  const transporter = createTransporter({ host, port, secure, user, pass });
  const subject =
    process.env.NOTIFY_REMOVAL_SUBJECT?.trim() || "RSVP removed by admin";
  const text = [
    "An RSVP was removed by admin",
    "",
    `Name: ${payload.name}`,
    `Removed additional guests: ${payload.removedGuestCount}`,
    `Removed party size (incl. attendee): ${payload.removedPartySize}`,
    `Current total attending: ${payload.currentAttendingTotal}`,
  ].join("\n");

  const info = await transporter.sendMail({ from, to, subject, text });
  console.log(
    `RSVP removal email sent to ${to} (messageId=${info.messageId || "n/a"})`
  );
}

module.exports = { sendRsvpNotification, sendRemovalNotification, buildSummary };

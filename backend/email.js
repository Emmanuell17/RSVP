const nodemailer = require("nodemailer");
const { Resend } = require("resend");

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

function getNotifyEmail() {
  return process.env.NOTIFY_EMAIL?.trim() || "";
}

function getResendApiKey() {
  return process.env.RESEND_API_KEY?.trim() || "";
}

function getResendFrom() {
  return (
    process.env.RESEND_FROM?.trim() ||
    process.env.SMTP_FROM?.trim() ||
    "RSVP Alerts <onboarding@resend.dev>"
  );
}

/** SMTP fallback (works locally; blocked on Railway Hobby). */
function getSmtpConfig() {
  const to = getNotifyEmail();
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

async function sendViaResend({ to, subject, text }) {
  const apiKey = getResendApiKey();
  const from = getResendFrom();
  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject,
    text,
  });
  if (error) {
    const message =
      typeof error === "object" && error && error.message
        ? error.message
        : String(error);
    throw new Error(`Resend API error: ${message}`);
  }
  console.log(
    `RSVP notification email sent via Resend to ${to} (id=${data?.id || "n/a"})`
  );
}

async function sendViaSmtp({ to, subject, text }) {
  const { host, user, pass, port, secure, from } = getSmtpConfig();
  if (!host || !user || !pass) {
    console.warn(
      "NOTIFY_EMAIL is set but neither RESEND_API_KEY nor SMTP settings are complete; skipping email."
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
  const info = await transporter.sendMail({ from, to, subject, text });
  console.log(
    `RSVP notification email sent via SMTP to ${to} (messageId=${info.messageId || "n/a"})`
  );
}

/**
 * Prefer Resend (HTTPS — works on Railway Hobby). Fall back to SMTP locally / Pro.
 */
async function sendMail({ subject, text }) {
  const to = getNotifyEmail();
  if (!to) {
    console.warn("NOTIFY_EMAIL is not set; skipping notification email.");
    return;
  }

  if (getResendApiKey()) {
    await sendViaResend({ to, subject, text });
    return;
  }

  await sendViaSmtp({ to, subject, text });
}

/**
 * Sends a one-off summary to NOTIFY_EMAIL when email is configured.
 * Safe to call without awaiting for fire-and-forget; errors are thrown for logging.
 */
async function sendRsvpNotification(payload) {
  const subject = process.env.NOTIFY_SUBJECT?.trim() || "New RSVP";
  await sendMail({ subject, text: buildSummary(payload) });
}

async function sendRemovalNotification(payload) {
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
  await sendMail({ subject, text });
}

module.exports = { sendRsvpNotification, sendRemovalNotification, buildSummary };

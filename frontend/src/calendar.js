function foldIcsLine(line) {
  const chunks = [];
  let rest = line;
  while (rest.length > 75) {
    chunks.push(rest.slice(0, 75));
    rest = ` ${rest.slice(75)}`;
  }
  chunks.push(rest);
  return chunks.join("\r\n");
}

function escapeIcsText(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function toIcsDateTime(isoLocal) {
  const d = new Date(isoLocal);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
    `T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  );
}

export function buildIcsEvent({
  title,
  description,
  start,
  end,
  location,
  uid,
}) {
  const now = toIcsDateTime(new Date().toISOString());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RSVP Website//Celebration//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid || `${Date.now()}@rsvp-site`}`,
    `DTSTAMP:${now}`,
    `DTSTART:${toIcsDateTime(start)}`,
    `DTEND:${toIcsDateTime(end)}`,
    foldIcsLine(`SUMMARY:${escapeIcsText(title)}`),
    foldIcsLine(`DESCRIPTION:${escapeIcsText(description)}`),
    foldIcsLine(`LOCATION:${escapeIcsText(location)}`),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `${lines.join("\r\n")}\r\n`;
}

export function downloadIcsFile({ filename, content }) {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadCelebrationEvent(event) {
  const content = buildIcsEvent({
    title: event.calendarTitle,
    description: event.calendarDescription,
    start: event.dateTime,
    end: event.endDateTime,
    location: `${event.venue}, ${event.address}`,
    uid: `${event.id}-2026-09-12@rsvp-site`,
  });
  downloadIcsFile({
    filename: `${event.id}-ngozi-confirmation.ics`,
    content,
  });
}

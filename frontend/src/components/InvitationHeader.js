import { IconCalendar, IconMapPin } from "./EventIcons";
import CountdownTimer from "./CountdownTimer";
import "./InvitationHeader.css";

const EVENTS = [
  {
    id: "ceremony",
    label: "Ceremony",
    dateTime: "2026-09-12T11:00",
    timeLabel: "12th September 2026 · 11:00 AM",
    venue: "Åssiden kirke",
    address: "Åkerveien 2, 3024 Drammen",
    mapsUrl:
      "https://www.google.com/maps?q=%C3%85ssiden+kirke,+%C3%85kerveien+2,+3024+Drammen,+Norway",
  },
  {
    id: "reception",
    label: "Reception",
    dateTime: "2026-09-12T17:00",
    timeLabel: "12th September 2026 · 5:00 PM",
    venue: "2104EventsByJose",
    address: "Tvetenveien 158, 0670 Oslo",
    mapsUrl:
      "https://www.google.com/maps?q=Tvetenveien+158,+0670+Oslo,+Norge",
  },
];

export default function InvitationHeader() {
  return (
    <header className="invitation-header">
      {/* Ornament */}
      <div className="invitation-ornament" aria-hidden="true">
        <span className="invitation-ornament-line" />
        <span className="invitation-ornament-diamond">✦ ✦ ✦</span>
        <span className="invitation-ornament-line" />
      </div>

      {/* Label */}
      <p className="invitation-label">You are cordially invited</p>

      {/* Title split: italic intro + bold name */}
      <h1 className="invitation-title font-display">
        With great joy, we celebrate
      </h1>
      <p className="invitation-name-block font-display">
        Ngozi Roselyn<br />Amarachi Okeke-Nwakamma
      </p>

      {/* Gold rule */}
      <div className="invitation-rule" aria-hidden="true" />

      {/* Event cards */}
      <div className="invitation-details">
        {EVENTS.map((event) => (
          <section
            key={event.id}
            className="invitation-event"
            aria-labelledby={`invitation-${event.id}-heading`}
          >
            <h2
              id={`invitation-${event.id}-heading`}
              className="invitation-event-label"
            >
              {event.label}
            </h2>
            <p className="invitation-detail-row invitation-datetime">
              <IconCalendar className="invitation-detail-icon" />
              <time dateTime={event.dateTime}>{event.timeLabel}</time>
            </p>
            <p className="invitation-detail-row invitation-location">
              <IconMapPin className="invitation-detail-icon" />
              <a
                className="invitation-location-link"
                href={event.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {event.venue} — {event.address}
              </a>
            </p>
          </section>
        ))}
      </div>

      {/* Countdown */}
      <CountdownTimer />

      {/* Footer */}
      <div className="invitation-footer">
        <p className="invitation-notice-strong">Strictly by Invitation</p>
        <p className="invitation-deadline">
          RSVP by <time dateTime="2026-07-31">31st July 2026</time>
        </p>
      </div>
    </header>
  );
}

import { IconCalendar, IconMapPin } from "./EventIcons";
import "./InvitationHeader.css";

const EVENTS = [
  {
    id: "ceremony",
    label: "Ceremony",
    dateTime: "2026-09-12T11:00",
    timeLabel: "12th of September 2026, 11:00",
    venue: "Åssiden kirke",
    address: "Åkerveien 2, 3024 Drammen",
    mapsUrl:
      "https://www.google.com/maps?q=%C3%85ssiden+kirke,+%C3%85kerveien+2,+3024+Drammen,+Norway",
  },
  {
    id: "reception",
    label: "Reception",
    dateTime: "2026-09-12T17:00",
    timeLabel: "12th of September 2026, 5pm",
    venue: "2104EventsByJose",
    address: "Ebbells gate 4, 0183 Oslo",
    mapsUrl:
      "https://www.google.com/maps?q=Ebbells+gate+4,+0183+Oslo,+Norway&ftid=0x46416e616fd12ef7:0xcf454cf0252103f&entry=gps",
  },
];

export default function InvitationHeader() {
  return (
    <header className="invitation-header">
      <span className="invitation-accent-line" aria-hidden="true" />
      <h1 className="invitation-title font-display">
        With great joy, we invite you to celebrate the confirmation of Ngozi Roselyn Amarachi Okeke-Nwakamma
      </h1>
      <div className="invitation-details">
        {EVENTS.map((event, index) => (
          <section
            key={event.id}
            className="invitation-event"
            aria-labelledby={`invitation-${event.id}-heading`}
          >
            {index > 0 ? (
              <hr className="invitation-event-divider" aria-hidden="true" />
            ) : null}
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
                {event.venue} - {event.address}
              </a>
            </p>
          </section>
        ))}
      </div>
      <p className="invitation-notice-strong">Strictly by Invitation</p>
      <p className="invitation-deadline">
        RSVP deadline: <time dateTime="2026-07-12">July 12, 2026</time>
      </p>
    </header>
  );
}

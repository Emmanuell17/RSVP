import { IconCalendar, IconMapPin } from "./EventIcons";
import "./InvitationHeader.css";

const MAPS_URL =
  "https://www.google.com/maps?q=Ebbells+gate+4,+0183+Oslo,+Norway&ftid=0x46416e616fd12ef7:0xcf454cf0252103f&entry=gps";

export default function InvitationHeader() {
  return (
    <header className="invitation-header">
      <span className="invitation-accent-line" aria-hidden="true" />
      <h1 className="invitation-title font-display">
        With great joy, we invite you to celebrate with us.
      </h1>
      <div className="invitation-details">
        <p className="invitation-detail-row invitation-datetime">
          <IconCalendar className="invitation-detail-icon" />
          <time dateTime="2026-09-12T17:00">
            12th of September 2026, 5pm
          </time>
        </p>
        <p className="invitation-detail-row invitation-location">
          <IconMapPin className="invitation-detail-icon" />
          <a
            className="invitation-location-link"
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ebbells gate 4, 0183 Oslo
          </a>
        </p>
      </div>
      <p className="invitation-notice-strong">Strictly by Invitation</p>
      <p className="invitation-deadline">
        RSVP deadline: <time dateTime="2026-07-12">July 12, 2026</time>
      </p>
    </header>
  );
}

import { CELEBRATION_EVENTS } from "../eventDetails";
import { downloadCelebrationEvent } from "../calendar";
import "./AddToCalendar.css";

export default function AddToCalendar() {
  return (
    <section className="add-to-calendar" aria-labelledby="add-to-calendar-heading">
      <h2 id="add-to-calendar-heading" className="add-to-calendar__heading">
        Add to your calendar
      </h2>
      <p className="add-to-calendar__intro">
        Save the ceremony and reception so you don&apos;t miss a moment.
      </p>
      <div className="add-to-calendar__actions">
        {CELEBRATION_EVENTS.map((event) => (
          <button
            key={event.id}
            type="button"
            className="add-to-calendar__btn"
            onClick={() => downloadCelebrationEvent(event)}
          >
            <span className="add-to-calendar__btn-label">{event.label}</span>
            <span className="add-to-calendar__btn-meta">
              {event.timeOfDay} · {event.timeLabel.split(" · ")[1]}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

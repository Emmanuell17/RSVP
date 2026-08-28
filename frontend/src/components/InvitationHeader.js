import { useEffect, useRef } from "react";
import { IconCalendar, IconMapPin } from "./EventIcons";
import CountdownTimer from "./CountdownTimer";
import { CELEBRATION_EVENTS } from "../eventDetails";
import "./InvitationHeader.css";

export default function InvitationHeader() {
  const eventRefs = useRef([]);

  useEffect(() => {
    const nodes = eventRefs.current.filter(Boolean);
    if (!nodes.length) return undefined;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      nodes.forEach((node) => node.classList.add("invitation-event--visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("invitation-event--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="invitation-header">
      <div className="invitation-ornament" aria-hidden="true">
        <span className="invitation-ornament-line" />
        <span className="invitation-ornament-diamond">✦ ✦ ✦</span>
        <span className="invitation-ornament-line" />
      </div>

      <p className="invitation-label">You are cordially invited</p>

      <h1 className="invitation-title font-display">
        With great joy, we celebrate
      </h1>
      <p className="invitation-name-block font-display">
        Ngozi Roselyn<br />Amarachi Okeke-Nwakamma
      </p>

      <div className="invitation-rule" aria-hidden="true" />

      <div className="invitation-details">
        {CELEBRATION_EVENTS.map((event, index) => (
          <section
            key={event.id}
            ref={(el) => {
              eventRefs.current[index] = el;
            }}
            className="invitation-event"
            aria-labelledby={`invitation-${event.id}-heading`}
          >
            <p className="invitation-event-time-of-day">{event.timeOfDay}</p>
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
              <span className="invitation-location-text">
                <strong>{event.venue}</strong>
                <span>{event.address}</span>
              </span>
            </p>
            <a
              className="invitation-directions-btn"
              href={event.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get directions
            </a>
          </section>
        ))}
      </div>

      <CountdownTimer />

      <div className="invitation-footer">
        <p className="invitation-notice-strong">Strictly by Invitation</p>
        <p className="invitation-deadline">
          RSVP by <time dateTime="2026-09-10">10th September 2026</time>
        </p>
      </div>
    </header>
  );
}

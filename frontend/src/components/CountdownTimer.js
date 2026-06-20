import { useState, useEffect } from "react";
import "./CountdownTimer.css";

const TARGET = new Date("2026-09-12T11:00:00");

function getTimeLeft() {
  const diff = TARGET - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer() {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "Days",    value: time.days },
    { label: "Hours",   value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <div className="countdown" aria-label="Countdown to ceremony">
      <p className="countdown-eyebrow">Counting down to the celebration</p>
      <div className="countdown-grid">
        {units.map(({ label, value }, i) => (
          <div key={label} className="countdown-unit">
            <span className="countdown-num" aria-label={`${value} ${label}`}>
              {String(value).padStart(2, "0")}
            </span>
            <span className="countdown-label" aria-hidden="true">{label}</span>
            {i < units.length - 1 && (
              <span className="countdown-sep" aria-hidden="true">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import "./CountdownTimer.css";

const TARGET = new Date("2026-09-12T11:00:00");

function getTimeLeft() {
  const diff = TARGET - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer() {
  const [time, setTime] = useState(getTimeLeft);
  const [tickKeys, setTickKeys] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const prevRef = useRef(time);

  useEffect(() => {
    const id = setInterval(() => {
      const next = getTimeLeft();
      const prev = prevRef.current;

      setTickKeys((keys) => {
        const nextKeys = { ...keys };
        if (next.days !== prev.days) nextKeys.days += 1;
        if (next.hours !== prev.hours) nextKeys.hours += 1;
        if (next.minutes !== prev.minutes) nextKeys.minutes += 1;
        if (next.seconds !== prev.seconds) nextKeys.seconds += 1;
        return nextKeys;
      });

      prevRef.current = next;
      setTime(next);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const units = [
    { key: "days", label: "Days", value: time.days },
    { key: "hours", label: "Hours", value: time.hours },
    { key: "minutes", label: "Minutes", value: time.minutes },
    { key: "seconds", label: "Seconds", value: time.seconds },
  ];

  return (
    <div className="countdown" aria-label="Countdown to ceremony">
      <p className="countdown-eyebrow">Counting down to the celebration</p>
      <div className="countdown-grid">
        {units.map(({ key, label, value }, i) => (
          <div key={key} className="countdown-unit">
            <span
              key={tickKeys[key]}
              className="countdown-num countdown-num--tick"
              aria-label={`${value} ${label}`}
            >
              {String(value).padStart(2, "0")}
            </span>
            <span className="countdown-label" aria-hidden="true">
              {label}
            </span>
            {i < units.length - 1 && (
              <span className="countdown-sep" aria-hidden="true">
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from "react";
import "./CelebrationSlideshow.css";

const SLIDE_COUNT = 8;

const slides = Array.from({ length: SLIDE_COUNT }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    src: `/images/slideshow/slide-${n}.png`,
    alt: `Celebration photo ${i + 1} of ${SLIDE_COUNT}`,
  };
});

export default function CelebrationSlideshow() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const regionRef = useRef(null);

  const go = useCallback((delta) => {
    setIndex((i) => (i + delta + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  useEffect(() => {
    if (paused) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDE_COUNT);
    }, 6000);
    return () => window.clearInterval(id);
  }, [paused]);

  useEffect(() => {
    const el = regionRef.current;
    if (!el) return undefined;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [go]);

  const current = slides[index];

  return (
    <section
      ref={regionRef}
      className="celebration-slideshow"
      aria-roledescription="carousel"
      aria-describedby="slideshow-hint"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <h2 className="celebration-slideshow__heading">Celebration moments</h2>
      <p className="celebration-slideshow__hint" id="slideshow-hint">
        Use the arrows or dots to browse. Slides advance automatically when you
        are not hovering here.
      </p>

      <div className="celebration-slideshow__viewport">
        <img
          key={current.src}
          className="celebration-slideshow__img"
          src={current.src}
          alt={current.alt}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      </div>

      <div className="celebration-slideshow__controls">
        <button
          type="button"
          className="celebration-slideshow__btn"
          onClick={() => go(-1)}
          aria-label="Previous photo"
        >
          ‹
        </button>
        <span className="celebration-slideshow__counter" aria-live="polite">
          {index + 1} / {SLIDE_COUNT}
        </span>
        <button
          type="button"
          className="celebration-slideshow__btn"
          onClick={() => go(1)}
          aria-label="Next photo"
        >
          ›
        </button>
      </div>

      <div
        className="celebration-slideshow__dots"
        role="tablist"
        aria-label="Choose slide"
      >
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show photo ${i + 1}`}
            className={
              i === index
                ? "celebration-slideshow__dot celebration-slideshow__dot--active"
                : "celebration-slideshow__dot"
            }
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}

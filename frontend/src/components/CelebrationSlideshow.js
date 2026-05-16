import { useCallback, useEffect, useRef, useState } from "react";
import "./CelebrationSlideshow.css";

const SLIDE_COUNT = 8;
const AUTO_MS = 5200;

const slides = Array.from({ length: SLIDE_COUNT }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    src: `/images/slideshow/slide-${n}.png`,
    alt: "Photo from the celebration",
  };
});

export default function CelebrationSlideshow() {
  const [index, setIndex] = useState(0);
  const regionRef = useRef(null);

  const go = useCallback((delta) => {
    setIndex((i) => (i + delta + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDE_COUNT);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [index]);

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

  return (
    <section
      ref={regionRef}
      className="celebration-slideshow"
      aria-roledescription="carousel"
      aria-label="Celebration photos"
      tabIndex={0}
    >
      <div className="celebration-slideshow__viewport">
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            className={
              i === index
                ? "celebration-slideshow__slide celebration-slideshow__slide--active"
                : "celebration-slideshow__slide"
            }
            src={slide.src}
            alt={i === index ? slide.alt : ""}
            aria-hidden={i !== index}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
          />
        ))}
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
            aria-label="Select this photo"
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

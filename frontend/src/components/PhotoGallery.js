import { useCallback, useEffect, useRef, useState } from "react";
import { LOCAL_GALLERY_PHOTOS } from "../gallery";
import "./CelebrationSlideshow.css";
import "./PhotoGallery.css";

const AUTO_MS = 5200;
const slides = LOCAL_GALLERY_PHOTOS;

export default function PhotoGallery() {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const regionRef = useRef(null);

  const go = useCallback((delta) => {
    setIndex((i) => (i + delta + count) % count);
  }, [count]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [count, index]);

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
      className="celebration-slideshow photo-gallery"
      aria-roledescription="carousel"
      aria-labelledby="gallery-heading"
      tabIndex={0}
    >
      <h2 id="gallery-heading" className="photo-gallery__heading">
        Celebration photos
      </h2>

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
        <button
          type="button"
          className="photo-gallery__nav photo-gallery__nav--prev"
          aria-label="Previous photo"
          onClick={() => go(-1)}
        >
          ‹
        </button>
        <button
          type="button"
          className="photo-gallery__nav photo-gallery__nav--next"
          aria-label="Next photo"
          onClick={() => go(1)}
        >
          ›
        </button>
      </div>

      <div
        className="celebration-slideshow__dots"
        role="tablist"
        aria-label="Choose photo"
      >
        {slides.map((_, i) => (
          <button
            key={slides[i].src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Photo ${i + 1}`}
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

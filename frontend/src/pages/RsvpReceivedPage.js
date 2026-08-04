import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import AddToCalendar from "../components/AddToCalendar";
import CelebrationSlideshow from "../components/CelebrationSlideshow";
import GuestLogoutButton from "../components/GuestLogoutButton";
import { IconCheckCircle } from "../components/EventIcons";
import "./RsvpReceivedPage.css";

export default function RsvpReceivedPage() {
  const location = useLocation();
  const guestName = location.state?.guestName;
  const mainRef = useRef(null);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    let ticking = false;
    const apply = () => {
      const y = window.scrollY || 0;
      root.style.setProperty("--parallax-bg", `${y * 0.32}px`);
      root.style.setProperty("--parallax-orbs", `${y * 0.14}px`);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    apply();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main ref={mainRef} className="rsvp-received-page">
      <div className="rsvp-received-page__parallax texture-grain" aria-hidden="true">
        <div className="rsvp-received-page__parallax-bg" />
        <div className="rsvp-received-page__parallax-orbs" />
        <div className="rsvp-received-page__parallax-veil" />
      </div>
      <div className="rsvp-received-page__content">
        <div className="rsvp-received-stack">
          <GuestLogoutButton />
          <section
            className="rsvp-received-card"
            aria-labelledby="rsvp-received-title"
          >
            <div className="rsvp-received-icon-wrap">
              <IconCheckCircle className="rsvp-received-icon" />
            </div>
            <h1 id="rsvp-received-title" className="rsvp-received-title">
              RSVP received
            </h1>
            <p className="rsvp-received-text">
              {guestName ? (
                <>
                  Thank you, <strong>{guestName}</strong>. We&apos;ve received
                  your RSVP and look forward to celebrating with you.
                </>
              ) : (
                <>
                  Thank you for responding. Your RSVP has been submitted
                  successfully.
                </>
              )}
            </p>
          </section>
          <AddToCalendar />
          <CelebrationSlideshow />
          <blockquote className="rsvp-received-verse">
            <p className="rsvp-received-verse__text font-display">
              For I know the plans I have for you, declares the Lord, plans to
              prosper you and not to harm you, plans to give you hope and a
              future.
            </p>
            <cite className="rsvp-received-verse__ref">Jeremiah 29:11</cite>
          </blockquote>
        </div>
      </div>
    </main>
  );
}

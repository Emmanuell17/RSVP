import { useEffect, useRef } from "react";
import GuestLogoutButton from "../components/GuestLogoutButton";
import InvitationHeader from "../components/InvitationHeader";
import ContactInfo from "../components/ContactInfo";
import RSVPForm from "../components/RSVPForm";
import "./MainPage.css";

function isRsvpDeadlinePassed() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  if (year > 2026) return true;
  if (year < 2026) return false;
  /* getMonth(): 0 = Jan … 7 = August */
  if (month > 7) return true;
  if (month < 7) return false;
  return day > 15;
}

export default function MainPage() {
  const closed = isRsvpDeadlinePassed();
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
    <main ref={mainRef} className="main-page">
      <div className="main-page__parallax texture-grain" aria-hidden="true">
        <div className="main-page__parallax-bg" />
        <div className="main-page__parallax-orbs" />
        <div className="main-page__parallax-veil" />
      </div>
      <div className="main-page__content">
        <div className="main-inner page-enter-stagger">
          <GuestLogoutButton />
          <InvitationHeader />
          <ContactInfo />
          {closed && (
            <p className="rsvp-closed-message" role="status">
              RSVP is now closed
            </p>
          )}
          <RSVPForm disabled={closed} />
        </div>
      </div>
    </main>
  );
}

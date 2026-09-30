import { useEffect, useRef } from "react";
import GuestLogoutButton from "../components/GuestLogoutButton";
import AppreciationMessage from "../components/AppreciationMessage";
import PhotoGallery from "../components/PhotoGallery";
import "./MainPage.css";

export default function MainPage() {
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
        <div className="main-page__parallax-rays" />
        <div className="main-page__parallax-orbs">
          <span className="main-page__ember main-page__ember--a" />
          <span className="main-page__ember main-page__ember--b" />
          <span className="main-page__ember main-page__ember--c" />
          <span className="main-page__ember main-page__ember--d" />
        </div>
        <div className="main-page__parallax-veil" />
      </div>
      <div className="main-page__content">
        <div className="main-inner page-enter-stagger">
          <GuestLogoutButton />
          <AppreciationMessage />
          <PhotoGallery />
        </div>
      </div>
    </main>
  );
}

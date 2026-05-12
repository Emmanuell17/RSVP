import CelebrationSlideshow from "../components/CelebrationSlideshow";
import "./RsvpReceivedPage.css";

export default function RsvpReceivedPage() {
  return (
    <main className="rsvp-received-page">
      <div className="rsvp-received-stack">
        <section
          className="rsvp-received-card"
          aria-labelledby="rsvp-received-title"
        >
          <h1 id="rsvp-received-title" className="rsvp-received-title">
            RSVP received
          </h1>
          <p className="rsvp-received-text">
            Thank you for responding. Your RSVP has been submitted successfully.
          </p>
        </section>
        <CelebrationSlideshow />
      </div>
    </main>
  );
}

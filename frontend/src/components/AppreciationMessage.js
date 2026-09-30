import "./AppreciationMessage.css";

export default function AppreciationMessage() {
  return (
    <section className="appreciation" aria-labelledby="appreciation-heading">
      <div className="appreciation-ornament" aria-hidden="true">
        <span className="appreciation-ornament-line" />
        <span className="appreciation-ornament-diamond">✦ ✦ ✦</span>
        <span className="appreciation-ornament-line" />
      </div>
      <p className="appreciation-kicker">A day of thanksgiving</p>
      <p className="appreciation-banner">With grateful hearts</p>
      <h1 id="appreciation-heading" className="appreciation-heading font-display">
        Thank you
      </h1>
      <p className="appreciation-lead font-display">
        RSVPs are now complete, and the celebration has been held. We keep every
        name in our records and more importantly, in our hearts.
      </p>

      <div className="appreciation-notes">
        <article className="appreciation-note">
          <h3 className="appreciation-note-title">To everyone who RSVP&apos;d</h3>
          <p className="appreciation-note-text">
            Thank you for taking the time to answer the invitation. Your reply
            helped us prepare with care, and your thoughtfulness meant more than
            we can say.
          </p>
        </article>
        <article className="appreciation-note">
          <h3 className="appreciation-note-title">To everyone who came</h3>
          <p className="appreciation-note-text">
            Thank you for filling the day with love, prayer, and joy. Your
            presence made Ngozi&apos;s confirmation a memory we will treasure
            always.
          </p>
        </article>
      </div>

      <blockquote className="appreciation-verse">
        <p className="appreciation-verse__text font-display">
          How can we thank God enough for you in return for all the joy we have
          in the presence of our God because of you?
        </p>
        <cite className="appreciation-verse__ref">1 Thessalonians 3:9</cite>
      </blockquote>
    </section>
  );
}

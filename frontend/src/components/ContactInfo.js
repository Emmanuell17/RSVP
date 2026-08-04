import { IconMail, IconPhone } from "./EventIcons";
import "./ContactInfo.css";

export default function ContactInfo() {
  return (
    <section className="contact-info" aria-labelledby="contact-heading">
      <h2 id="contact-heading" className="contact-heading">
        Contact Information
      </h2>
      <p className="contact-intro">
        Questions about travel, the day, or your RSVP? We&apos;re happy to help.
      </p>
      <div className="contact-cards">
        <a className="contact-card" href="mailto:adaokeke1971@gmail.com">
          <span className="contact-card-icon" aria-hidden="true">
            <IconMail />
          </span>
          <span className="contact-card-body">
            <span className="contact-card-type">Email</span>
            <span className="contact-card-value">adaokeke1971@gmail.com</span>
          </span>
        </a>
        <a className="contact-card" href="tel:+4793246045">
          <span className="contact-card-icon" aria-hidden="true">
            <IconPhone />
          </span>
          <span className="contact-card-body">
            <span className="contact-card-type">Phone</span>
            <span className="contact-card-value">+47 932 46 045</span>
          </span>
        </a>
      </div>
    </section>
  );
}

import "./ContactInfo.css";

export default function ContactInfo() {
  return (
    <section className="contact-info" aria-labelledby="contact-heading">
      <h2 id="contact-heading" className="contact-heading">
        Contact Information
      </h2>
      <p>
        Email:{" "}
        <a href="mailto:events@example.com">adaokeke1971@gmail.com</a>
      </p>
      <p>
        Phone: <a href="tel:+15551234567">+1 (555) 123-4567</a>
      </p>
    </section>
  );
}

import "./ContactInfo.css";

export default function ContactInfo() {
  return (
    <section className="contact-info" aria-labelledby="contact-heading">
      <h2 id="contact-heading" className="contact-heading">
        Contact Information
      </h2>
      <p>
        Email:{" "}
        <a href="mailto:adaokeke1971@gmail.com">adaokeke1971@gmail.com</a>
      </p>
      <p>
        Phone: <a href="tel:+4793246045">+4793246045</a>
      </p>
    </section>
  );
}

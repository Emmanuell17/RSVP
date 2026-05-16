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
    </section>
  );
}

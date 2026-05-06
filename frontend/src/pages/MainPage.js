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
  if (month > 6) return true;
  if (month < 6) return false;
  return day > 12;
}

export default function MainPage() {
  const closed = isRsvpDeadlinePassed();

  return (
    <main className="main-page">
      <div className="main-inner">
        <InvitationHeader />
        <ContactInfo />
        {closed && (
          <p className="rsvp-closed-message" role="status">
            RSVP is now closed
          </p>
        )}
        <RSVPForm disabled={closed} />
      </div>
    </main>
  );
}

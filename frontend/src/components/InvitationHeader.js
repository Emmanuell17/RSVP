import "./InvitationHeader.css";

export default function InvitationHeader() {
  return (
    <header className="invitation-header">
      <h1 className="invitation-title">
        With great joy, we invite you to celebrate with us.
      </h1>
      <p className="invitation-notice-strong">Strictly by Invitation</p>
      <p className="invitation-deadline">
        RSVP deadline: <time dateTime="2026-07-12">July 12, 2026</time>
      </p>
    </header>
  );
}

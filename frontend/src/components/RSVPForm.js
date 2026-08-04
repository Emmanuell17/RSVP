import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../api";
import "./RSVPForm.css";

export default function RSVPForm({ disabled }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [attending, setAttending] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [comment, setComment] = useState("");
  const [clientError, setClientError] = useState("");
  const [serverError, setServerError] = useState("");
  const [pending, setPending] = useState(false);

  const attendingYes = attending === "yes";

  function validate() {
    if (!String(name).trim()) {
      return "Please enter your name.";
    }
    if (attending !== "yes" && attending !== "no") {
      return "Please choose whether you are attending.";
    }
    if (attendingYes) {
      const n = Number(guestCount);
      if (guestCount === "" || !Number.isInteger(n) || n < 0) {
        return "Please enter how many guests from your household will attend.";
      }
    }
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");

    const err = validate();
    if (err) {
      setClientError(err);
      return;
    }
    setClientError("");

    const payload = {
      name: String(name).trim(),
      attending: attendingYes,
      comment: comment.trim() ? comment.trim() : null,
    };
    if (attendingYes) {
      payload.guest_count = Number(guestCount);
    }

    setPending(true);
    try {
      const res = await fetch(apiUrl("/rsvp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setName("");
        setAttending("");
        setGuestCount("");
        setComment("");
        navigate("/rsvp-received", {
          state: { guestName: String(name).trim() },
        });
        return;
      }

      if (res.status === 409 && data.error) {
        setServerError(data.error);
        return;
      }

      const msg = [data.error, data.detail].filter(Boolean).join(" — ");
      setServerError(msg || "Could not submit your RSVP.");
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  function onFieldChange() {
    if (serverError) setServerError("");
    if (clientError) setClientError("");
  }

  const formDisabled = Boolean(disabled) || pending;

  return (
    <section className="rsvp-section" aria-labelledby="rsvp-heading">
      <p className="rsvp-invite-banner">You are cordially invited</p>
      <h2 id="rsvp-heading" className="rsvp-heading">
        RSVP
      </h2>
      <p className="rsvp-subheading">
        Kindly let us know if you'll be joining the celebration.
      </p>
      <form className="rsvp-form" onSubmit={handleSubmit}>
        <div className="rsvp-field">
          <label className="rsvp-label" htmlFor="rsvp-name">
            Name<span className="rsvp-required">*</span>
          </label>
          <input
            id="rsvp-name"
            className="rsvp-input"
            type="text"
            autoComplete="name"
            value={name}
            disabled={formDisabled}
            onChange={(e) => {
              setName(e.target.value);
              onFieldChange();
            }}
          />
        </div>

        <div className="rsvp-field">
          <span className="rsvp-label" id="rsvp-attending-label">
            Attending<span className="rsvp-required">*</span>
          </span>
          <div
            className="rsvp-radio-row"
            role="group"
            aria-labelledby="rsvp-attending-label"
          >
            <label className="rsvp-radio">
              <input
                className="rsvp-radio__input"
                type="radio"
                name="attending"
                value="yes"
                checked={attending === "yes"}
                disabled={formDisabled}
                onChange={() => {
                  setAttending("yes");
                  onFieldChange();
                }}
              />
              <span className="rsvp-radio__control" aria-hidden="true" />
              <span className="rsvp-radio__text">Yes</span>
            </label>
            <label className="rsvp-radio">
              <input
                className="rsvp-radio__input"
                type="radio"
                name="attending"
                value="no"
                checked={attending === "no"}
                disabled={formDisabled}
                onChange={() => {
                  setAttending("no");
                  setGuestCount("");
                  onFieldChange();
                }}
              />
              <span className="rsvp-radio__control" aria-hidden="true" />
              <span className="rsvp-radio__text">No</span>
            </label>
          </div>
        </div>

        {attendingYes && (
          <div className="rsvp-field rsvp-field--guests">
            <label className="rsvp-label rsvp-label--guests" htmlFor="rsvp-guests">
              Guest count<span className="rsvp-required">*</span>
            </label>
            <input
              id="rsvp-guests"
              className="rsvp-input"
              type="number"
              min={0}
              step={1}
              inputMode="numeric"
              value={guestCount}
              disabled={formDisabled}
              onChange={(e) => {
                setGuestCount(e.target.value);
                onFieldChange();
              }}
            />
            <p className="rsvp-hint rsvp-hint--guests">
              How many guests would you like to bring (from your household)?
            </p>
          </div>
        )}

        <div className="rsvp-field">
          <label className="rsvp-label" htmlFor="rsvp-comment">
            Comment{" "}
            <span className="rsvp-optional">(optional)</span>
          </label>
          <textarea
            id="rsvp-comment"
            className="rsvp-textarea"
            rows={4}
            value={comment}
            disabled={formDisabled}
            onChange={(e) => {
              setComment(e.target.value);
              onFieldChange();
            }}
          />
        </div>

        {clientError && (
          <p className="rsvp-error" role="alert">
            {clientError}
          </p>
        )}
        {serverError && (
          <p className="rsvp-error" role="alert">
            {serverError}
          </p>
        )}
        <button className="rsvp-submit" type="submit" disabled={formDisabled}>
          {pending ? "Sending…" : disabled ? "RSVP closed" : "Send my RSVP"}
        </button>
      </form>
    </section>
  );
}

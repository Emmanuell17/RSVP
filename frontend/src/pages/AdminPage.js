import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../api";
import {
  ADMIN_TOKEN_KEY,
  getAdminToken,
  isGuestAuthenticated,
  touchActivity,
} from "../authSession";
import "./AdminPage.css";

function isGuestSignedIn() {
  return isGuestAuthenticated();
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(getAdminToken());
  const [rsvps, setRsvps] = useState([]);
  const [totalAttending, setTotalAttending] = useState(0);
  const [pendingAuth, setPendingAuth] = useState(false);
  const [pendingLoad, setPendingLoad] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editAttending, setEditAttending] = useState("yes");
  const [editGuestCount, setEditGuestCount] = useState("0");
  const [savingId, setSavingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isSignedIn = Boolean(token);

  function goToInvitationOrLogin() {
    navigate(isGuestSignedIn() ? "/" : "/login");
  }

  async function loadRsvps(activeToken = token) {
    if (!activeToken) return;
    setPendingLoad(true);
    setErrorMessage("");
    try {
      const res = await fetch(apiUrl("/admin/rsvps"), {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem(ADMIN_TOKEN_KEY);
          setToken("");
        }
        throw new Error(data.error || "Could not load RSVPs.");
      }

      setRsvps(Array.isArray(data.rsvps) ? data.rsvps : []);
      setTotalAttending(Number(data.total_attending || 0));
    } catch (err) {
      setErrorMessage(err.message || "Could not load RSVPs.");
    } finally {
      setPendingLoad(false);
    }
  }

  useEffect(() => {
    if (isSignedIn) {
      loadRsvps();
    }
  }, [isSignedIn]);

  async function handleAuth(e) {
    e.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

    if (!password.trim()) {
      setErrorMessage("Admin password is required.");
      return;
    }

    setPendingAuth(true);
    try {
      const res = await fetch(apiUrl("/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.token) {
        throw new Error(data.error || "Could not complete admin login.");
      }

      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      setToken(data.token);
      touchActivity();
      setPassword("");
      setStatusMessage("Admin login successful.");
      await loadRsvps(data.token);
    } catch (err) {
      setErrorMessage(err.message || "Could not complete admin login.");
    } finally {
      setPendingAuth(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken("");
    setRsvps([]);
    setTotalAttending(0);
    setStatusMessage("Logged out.");
    setErrorMessage("");
  }

  function startEdit(row) {
    setEditingId(row.id);
    setEditAttending(row.attending ? "yes" : "no");
    setEditGuestCount(String(Number(row.guest_count || 0)));
    setErrorMessage("");
    setStatusMessage("");
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveRsvp(rsvpId) {
    if (editAttending === "yes") {
      const n = Number(editGuestCount);
      if (editGuestCount === "" || !Number.isInteger(n) || n < 0) {
        setErrorMessage("Enter a valid guest count (0 or more).");
        return;
      }
    }

    setSavingId(rsvpId);
    setErrorMessage("");
    setStatusMessage("");
    try {
      const payload = {
        attending: editAttending === "yes",
      };
      if (editAttending === "yes") {
        payload.guest_count = Number(editGuestCount);
      }

      const res = await fetch(apiUrl(`/admin/rsvps/${rsvpId}`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Could not update RSVP.");
      }

      setRsvps((current) =>
        current.map((row) => (row.id === rsvpId ? data.rsvp : row))
      );
      setTotalAttending(Number(data.total_attending || 0));
      setEditingId(null);
      setStatusMessage(
        `${data.rsvp?.name || "RSVP"} updated. Total attending: ${Number(
          data.total_attending || 0
        )}.`
      );
    } catch (err) {
      setErrorMessage(err.message || "Could not update RSVP.");
    } finally {
      setSavingId(null);
    }
  }

  async function removeRsvp(rsvpId) {
    setDeletingId(rsvpId);
    setErrorMessage("");
    setStatusMessage("");
    try {
      const res = await fetch(apiUrl(`/admin/rsvps/${rsvpId}`), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Could not remove RSVP.");
      }

      setRsvps((current) => current.filter((row) => row.id !== rsvpId));
      if (editingId === rsvpId) setEditingId(null);
      setTotalAttending(Number(data.total_attending || 0));
      setStatusMessage(
        `${data.removed?.name || "Guest"} removed. Current total attending: ${Number(
          data.total_attending || 0
        )}.`
      );
    } catch (err) {
      setErrorMessage(err.message || "Could not remove RSVP.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-panel">
        <div className="admin-header">
          <h1 className="admin-heading">Admin panel</h1>
          <button
            type="button"
            className="admin-back-button"
            onClick={goToInvitationOrLogin}
          >
            Back to event
          </button>
        </div>

        {!isSignedIn ? (
          <>
            <form className="admin-auth-form" onSubmit={handleAuth}>
              <label htmlFor="admin-password">Admin password</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={pendingAuth}
              />

              <button type="submit" disabled={pendingAuth}>
                {pendingAuth ? "Please wait..." : "Login"}
              </button>
            </form>
          </>
        ) : (
          <section className="admin-data">
            <div className="admin-toolbar">
              <strong>Total attending: {totalAttending}</strong>
              <div className="admin-toolbar-actions">
                <button type="button" onClick={() => loadRsvps()} disabled={pendingLoad}>
                  Refresh
                </button>
                <button type="button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>

            {pendingLoad ? (
              <p>Loading RSVPs...</p>
            ) : rsvps.length === 0 ? (
              <p>No RSVP records found.</p>
            ) : (
              <ul className="admin-rsvp-list">
                {rsvps.map((row) => {
                  const isEditing = editingId === row.id;
                  const partySize = row.attending
                    ? Number(row.guest_count || 0) + 1
                    : 0;
                  return (
                    <li key={row.id} className="admin-rsvp-item">
                      <div className="admin-rsvp-body">
                        <p className="admin-rsvp-name">{row.name}</p>
                        {!isEditing ? (
                          <>
                            <p>Attending: {row.attending ? "Yes" : "No"}</p>
                            <p>
                              Household guests (excl. self):{" "}
                              {Number(row.guest_count || 0)}
                            </p>
                            {row.attending ? (
                              <p>Party size (incl. self): {partySize}</p>
                            ) : null}
                          </>
                        ) : (
                          <div className="admin-rsvp-edit">
                            <label className="admin-edit-label">
                              Attending
                              <select
                                value={editAttending}
                                onChange={(e) => {
                                  setEditAttending(e.target.value);
                                  if (e.target.value === "no") {
                                    setEditGuestCount("0");
                                  }
                                }}
                                disabled={savingId === row.id}
                              >
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                              </select>
                            </label>
                            {editAttending === "yes" ? (
                              <label className="admin-edit-label">
                                Household guests (excl. self)
                                <input
                                  type="number"
                                  min={0}
                                  step={1}
                                  value={editGuestCount}
                                  onChange={(e) =>
                                    setEditGuestCount(e.target.value)
                                  }
                                  disabled={savingId === row.id}
                                />
                              </label>
                            ) : null}
                          </div>
                        )}
                      </div>
                      <div className="admin-rsvp-actions">
                        {!isEditing ? (
                          <>
                            <button
                              type="button"
                              className="admin-btn-secondary"
                              onClick={() => startEdit(row)}
                              disabled={
                                deletingId === row.id || savingId != null
                              }
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="admin-btn-danger"
                              onClick={() => removeRsvp(row.id)}
                              disabled={
                                deletingId === row.id || savingId != null
                              }
                            >
                              {deletingId === row.id
                                ? "Removing..."
                                : "Remove"}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => saveRsvp(row.id)}
                              disabled={savingId === row.id}
                            >
                              {savingId === row.id ? "Saving..." : "Save"}
                            </button>
                            <button
                              type="button"
                              className="admin-btn-secondary"
                              onClick={cancelEdit}
                              disabled={savingId === row.id}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}

        {errorMessage ? (
          <p className="admin-error" role="alert">
            {errorMessage}
          </p>
        ) : null}
        {statusMessage ? (
          <p className="admin-status" role="status">
            {statusMessage}
          </p>
        ) : null}
      </section>
    </main>
  );
}

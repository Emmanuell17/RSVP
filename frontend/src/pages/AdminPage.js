import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../api";
import "./AdminPage.css";

const ADMIN_TOKEN_KEY = "adminToken";
const GUEST_AUTH_KEY = "isAuthenticated";

function getStoredAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || "";
}

function isGuestSignedIn() {
  return localStorage.getItem(GUEST_AUTH_KEY) === "true";
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(getStoredAdminToken());
  const [rsvps, setRsvps] = useState([]);
  const [totalAttending, setTotalAttending] = useState(0);
  const [pendingAuth, setPendingAuth] = useState(false);
  const [pendingLoad, setPendingLoad] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
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
                {rsvps.map((row) => (
                  <li key={row.id} className="admin-rsvp-item">
                    <div>
                      <p className="admin-rsvp-name">{row.name}</p>
                      <p>Attending: {row.attending ? "Yes" : "No"}</p>
                      <p>Additional guests: {Number(row.guest_count || 0)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRsvp(row.id)}
                      disabled={deletingId === row.id}
                    >
                      {deletingId === row.id ? "Removing..." : "Remove"}
                    </button>
                  </li>
                ))}
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

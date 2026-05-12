import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../api";
import "./LoginForm.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    setPending(true);
    try {
      const url = apiUrl("/login");
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      const ct = (res.headers.get("content-type") || "").toLowerCase();
      const rawBody = await res.text();
      let data = null;
      if (rawBody) {
        try {
          data = JSON.parse(rawBody);
        } catch {
          data = null;
        }
      }

      if (
        (!res.ok && res.status === 0) ||
        (res.ok && ct.includes("text/html")) ||
        (res.ok && data == null && /<!doctype html/i.test(rawBody))
      ) {
        setError(
          process.env.NODE_ENV === "production"
            ? "Cannot reach the API. In Vercel, set REACT_APP_API_URL to your Fly (or other) API base URL (https://…, no quotes, no trailing slash), save for Production, then redeploy the site."
            : "Cannot reach the API. Start the backend (npm run dev in backend/) so it listens on the same port as the frontend proxy."
        );
        return;
      }

      if (data && res.ok && data.success) {
        localStorage.setItem("isAuthenticated", "true");
        navigate("/");
        return;
      }

      if (data && typeof data.error === "string") {
        setError(data.error);
        return;
      }

      const preview = rawBody.replace(/\s+/g, " ").trim().slice(0, 120);
      setError(
        data == null
          ? process.env.NODE_ENV === "production"
            ? `API returned non-JSON (HTTP ${res.status}). Check REACT_APP_API_URL (${url.split("/login")[0] || "not set"}) and redeploy. Preview: ${preview || "(empty)"}`
            : `Bad response from server (HTTP ${res.status}). Is the backend running? ${preview || ""}`
          : "Invalid password."
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label className="login-label" htmlFor="invitation-password">
        Password
      </label>
      <input
        id="invitation-password"
        className="login-input"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={pending}
      />
      {error && (
        <p className="login-error" role="alert">
          {error}
        </p>
      )}
      <button className="login-submit" type="submit" disabled={pending}>
        {pending ? "Checking…" : "Continue"}
      </button>
    </form>
  );
}

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
      const res = await fetch(apiUrl("/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password.trim() }),
      });

      const ct = res.headers.get("content-type") || "";
      const data =
        ct.includes("application/json")
          ? await res.json().catch(() => null)
          : null;

      if (
        (!res.ok && res.status === 0) ||
        (res.ok && ct.includes("text/html"))
      ) {
        setError(
          process.env.NODE_ENV === "production"
            ? "Cannot reach the API. In Vercel, set environment variable REACT_APP_API_URL to your deployed backend URL (no trailing slash), then redeploy."
            : "Cannot reach the API. Start the backend (npm run dev in backend/) so it listens on the same port as the frontend proxy."
        );
        return;
      }

      if (data && res.ok && data.success) {
        localStorage.setItem("isAuthenticated", "true");
        navigate("/");
        return;
      }

      setError(
        (data && data.error) ||
          (!data
            ? process.env.NODE_ENV === "production"
              ? "Bad response from server. Check REACT_APP_API_URL points to your API and redeploy."
              : "Bad response from server. Is the backend running?"
            : "Invalid password.")
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

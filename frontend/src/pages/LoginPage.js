import { useLocation } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import "./LoginPage.css";

export default function LoginPage() {
  const location = useLocation();
  const timedOut = location.state?.reason === "timeout";

  return (
    <main className="login-page" aria-labelledby="login-lead">
      <div className="login-panel">
        <div className="login-ornament" aria-hidden="true">
          <span className="login-ornament-line" />
          <span className="login-ornament-mark">✦ ✦ ✦</span>
          <span className="login-ornament-line" />
        </div>
        {timedOut ? (
          <p className="login-timeout" role="status">
            Your session ended after 10 minutes of inactivity. Please sign in
            again.
          </p>
        ) : null}
        <p className="login-intro login-intro--lead" id="login-lead">
          Enter the password you were given to view details and RSVP.
        </p>
        <LoginForm />
        <p className="login-intro">
          Admin? Open <a href="/admin">/admin</a>
        </p>
      </div>
    </main>
  );
}

import LoginForm from "../components/LoginForm";
import "./LoginPage.css";

export default function LoginPage() {
  return (
    <main className="login-page" aria-labelledby="login-lead">
      <div className="login-panel">
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

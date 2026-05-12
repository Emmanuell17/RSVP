import LoginForm from "../components/LoginForm";
import "./LoginPage.css";

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-panel">
        <h1 className="login-heading">Invitation</h1>
        <p className="login-intro">Enter the password to continue.</p>
        <LoginForm />
        <p className="login-intro">
          Admin? Open <a href="/admin">/admin</a>
        </p>
      </div>
    </main>
  );
}

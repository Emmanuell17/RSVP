import { useNavigate } from "react-router-dom";
import { logoutGuest } from "../authSession";
import "./GuestLogoutButton.css";

export default function GuestLogoutButton() {
  const navigate = useNavigate();

  function handleLogout() {
    logoutGuest();
    navigate("/login", { replace: true });
  }

  return (
    <div className="guest-logout-bar">
      <button
        type="button"
        className="guest-logout-button"
        onClick={handleLogout}
      >
        Log out
      </button>
    </div>
  );
}

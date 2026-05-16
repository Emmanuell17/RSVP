import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  checkAndExpireSession,
  hasActiveSession,
  touchActivity,
} from "../authSession";

const ACTIVITY_EVENTS = [
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
  "click",
];

/**
 * Ends guest and admin sessions after inactivity; sends user to /login.
 */
export default function InactivityGuard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!hasActiveSession()) return undefined;

    const redirectIfExpired = () => {
      if (checkAndExpireSession()) {
        navigate("/login", { replace: true, state: { reason: "timeout" } });
        return true;
      }
      return false;
    };

    if (redirectIfExpired()) return undefined;

    const onActivity = () => {
      if (hasActiveSession()) touchActivity();
    };

    for (const name of ACTIVITY_EVENTS) {
      window.addEventListener(name, onActivity, { passive: true });
    }

    const intervalId = window.setInterval(redirectIfExpired, 30_000);

    const onVisibility = () => {
      if (document.visibilityState === "visible") redirectIfExpired();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      for (const name of ACTIVITY_EVENTS) {
        window.removeEventListener(name, onActivity);
      }
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [navigate, location.pathname]);

  return null;
}

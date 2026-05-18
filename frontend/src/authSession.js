export const GUEST_AUTH_KEY = "isAuthenticated";
export const ADMIN_TOKEN_KEY = "adminToken";
const LAST_ACTIVITY_KEY = "lastActivityAt";

/** 10 minutes of no pointer/keyboard/scroll activity */
export const INACTIVITY_MS = 10 * 60 * 1000;

export function isGuestAuthenticated() {
  return localStorage.getItem(GUEST_AUTH_KEY) === "true";
}

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || "";
}

export function hasActiveSession() {
  return isGuestAuthenticated() || Boolean(getAdminToken());
}

export function touchActivity() {
  sessionStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
}

export function clearSession() {
  localStorage.removeItem(GUEST_AUTH_KEY);
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(LAST_ACTIVITY_KEY);
}

/** End guest invitation access; returns user to the password screen. */
export function logoutGuest() {
  localStorage.removeItem(GUEST_AUTH_KEY);
  sessionStorage.removeItem(LAST_ACTIVITY_KEY);
}

export function isInactive() {
  const raw = sessionStorage.getItem(LAST_ACTIVITY_KEY);
  if (!raw) return false;
  const last = Number(raw);
  if (!Number.isFinite(last)) return false;
  return Date.now() - last > INACTIVITY_MS;
}

/** @returns {boolean} true if session was expired and cleared */
export function checkAndExpireSession() {
  if (!hasActiveSession()) return false;

  if (!sessionStorage.getItem(LAST_ACTIVITY_KEY)) {
    touchActivity();
    return false;
  }

  if (isInactive()) {
    clearSession();
    return true;
  }

  return false;
}

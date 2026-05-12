/**
 * Base URL for the Express API.
 * Leave unset locally: Create React App proxies `/login`, `/rsvp`, etc. to the backend.
 * On Vercel: set `REACT_APP_API_URL` to your deployed API origin (no trailing slash), then redeploy.
 */
export function apiUrl(path) {
  const raw = (process.env.REACT_APP_API_URL || "").trim();
  const base = raw.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}

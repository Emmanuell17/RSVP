import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import InactivityGuard from "./components/InactivityGuard";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import RsvpReceivedPage from "./pages/RsvpReceivedPage";
import AdminPage from "./pages/AdminPage";
import {
  checkAndExpireSession,
  isGuestAuthenticated,
} from "./authSession";
import "./App.css";

function PrivateRoute({ children }) {
  if (checkAndExpireSession() || !isGuestAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <InactivityGuard />
      <div className="app-shell">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/rsvp-received"
            element={
              <PrivateRoute>
                <RsvpReceivedPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

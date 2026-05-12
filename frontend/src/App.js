import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import RsvpReceivedPage from "./pages/RsvpReceivedPage";
import AdminPage from "./pages/AdminPage";
import "./App.css";

function isAuthenticated() {
  return localStorage.getItem("isAuthenticated") === "true";
}

function PrivateRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
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

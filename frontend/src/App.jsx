import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import { useEffect } from "react";

function getPageTitle(pathname) {
  if (pathname === "/") {
    return "ApplicationTracker | Track Every Opportunity";
  }

  if (pathname === "/login") {
    return "Login | ApplicationTracker";
  }

  if (pathname === "/register") {
    return "Create Account | ApplicationTracker";
  }

  if (pathname === "/profile") {
    return "Manage Account | ApplicationTracker";
  }

  return "ApplicationTracker";
}

function RouteTitle() {
  const location = useLocation();

  useEffect(() => {
    document.title = getPageTitle(location.pathname);
  }, [location.pathname]);

  return null;
}

function App() {
  return (
      <BrowserRouter>
        <RouteTitle />
        <Navbar />
        <main className="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={
                <PublicOnlyRoute>
                <LoginPage />
                </PublicOnlyRoute>
            }
            />
            <Route path="/register" element={
                <PublicOnlyRoute >
                <RegisterPage />
                </PublicOnlyRoute>
            }
            />
            <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
            }
            />
          </Routes>
        </main>
      </BrowserRouter>
  );
}

export default App;

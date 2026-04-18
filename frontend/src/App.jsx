import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
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
          </Routes>
        </main>
      </BrowserRouter>
  );
}

export default App;

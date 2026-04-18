import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ApplicationsListPage from "./pages/ApplicationsListPage";
import ApplicationFormPage from "./pages/ApplicationFormPage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";
import MarketPage from "./pages/MarketPage";
import SalaryPage from "./pages/SalaryPage";
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

  if (pathname === "/dashboard") {
    return "Dashboard | ApplicationTracker";
  }

  if (pathname === "/applications") {
    return "Applications | ApplicationTracker";
  }

  if (pathname === "/applications/new") {
    return "New Application | ApplicationTracker";
  }

  if (pathname === "/market") {
    return "Market | ApplicationTracker";
  }

  if (pathname === "/salary") {
    return "Salary | ApplicationTracker";
  }

  if (pathname.startsWith("/applications/")) {
    return "Application Details | ApplicationTracker";
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
            <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
            }
            />
            <Route path="/applications" element={
                <ProtectedRoute>
                  <ApplicationsListPage />
                </ProtectedRoute>
            }
            />
            <Route path="/applications/new" element={
                <ProtectedRoute>
                  <ApplicationFormPage />
                </ProtectedRoute>
            }
            />
            <Route path="/applications/:id" element={
                <ProtectedRoute>
                  <ApplicationDetailPage />
                </ProtectedRoute>
            }
            />
            <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
            }
            />
            <Route path="/market" element={
                <ProtectedRoute>
                  <MarketPage />
                </ProtectedRoute>
            }
            />
            <Route path="/salary" element={
                <ProtectedRoute>
                  <SalaryPage />
                </ProtectedRoute>
            }
            />
          </Routes>
        </main>
      </BrowserRouter>
  );
}

export default App;

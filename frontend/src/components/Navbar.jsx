import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { apiFetch, clearToken, getToken, isUnauthorizedError } from "../api/Client.js";

function Navbar() {
    const navigate = useNavigate();
    const menuRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const token = getToken();

    const initials = useMemo(() => {
        if (!currentUser) {
            return "AT";
        }

        return `${currentUser.firstName?.[0] || ""}${currentUser.lastName?.[0] || ""}`.toUpperCase();
    }, [currentUser]);

    useEffect(() => {
        if (!token) {
            setCurrentUser(null);
            setMenuOpen(false);
            return;
        }

        let ignore = false;

        async function loadCurrentUser() {
            try {
                const data = await apiFetch("/api/me");
                if (!ignore) {
                    setCurrentUser(data);
                }
            } catch (error) {
                if (ignore) {
                    return;
                }

                if (isUnauthorizedError(error)) {
                    clearToken();
                }

                setCurrentUser(null);
            }
        }

        loadCurrentUser();

        return () => {
            ignore = true;
        };
    }, [token]);

    useEffect(() => {
        function handleDocumentClick(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleDocumentClick);
        return () => {
            document.removeEventListener("mousedown", handleDocumentClick);
        };
    }, []);

    function handleLogout() {
        clearToken();
        setCurrentUser(null);
        setMenuOpen(false);
        navigate("/login", { replace: true });
    }

    return (
        <nav className="nav">
            <div className="nav-inner">
                <Link to="/" className="nav-brand">
                    <span className="nav-brand-mark">ApplicationTracker</span>
                    <span className="nav-brand-copy">Track every opportunity with clarity.</span>
                </Link>

                <div className="nav-links">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`}
                    >
                        Home
                    </NavLink>

                    {!token ? (
                        <NavLink
                            to="/login"
                            className={({ isActive }) => `nav-link nav-link--cta${isActive ? " nav-link--active" : ""}`}
                        >
                            Login
                        </NavLink>
                    ) : (
                        <div className="nav-account" ref={menuRef}>
                            <button
                                type="button"
                                className={`nav-account-trigger${menuOpen ? " nav-account-trigger--open" : ""}`}
                                onClick={() => setMenuOpen((open) => !open)}
                            >
                                <span className="nav-avatar" aria-hidden="true">{initials}</span>
                            </button>

                            {menuOpen && (
                                <div className="nav-menu">
                                    <button type="button" className="nav-menu-item" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

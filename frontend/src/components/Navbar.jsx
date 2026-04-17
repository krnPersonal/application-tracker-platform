import { Link, NavLink } from "react-router-dom";

function Navbar() {
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
                    <NavLink
                        to="/login"
                        className={({ isActive }) => `nav-link nav-link--cta${isActive ? " nav-link--active" : ""}`}
                    >
                        Login
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;

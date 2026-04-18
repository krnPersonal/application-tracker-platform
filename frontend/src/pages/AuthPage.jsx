import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch, setToken } from "../api/Client.js";

const COPY_BY_MODE = {
    login: {
        eyebrow: "Focused search",
        title: "Track Every Application.",
        accent: "Win More Offers.",
        body: "Organize your job hunt, upload resumes, and generate reports in seconds.",
        statValue: "4x",
        statLabel: "Faster follow-up rhythm",
        insightTitle: "Built for momentum",
        insightBody: "Keep resumes, notes, and interview progress aligned so every next step feels ready.",
        quickStats: [
            {value: "1 hub", label: "resume, notes, and status"},
            {value: "Zero noise", label: "only the next actions that matter"},
        ],
        cardTitle: "Welcome back",
        cardSubtitle: "Sign in to manage your applications",
        submitLabel: "Login",
        switchLabel: "New here?",
        switchAction: "Create an account",
        nextRoute: "/register",
        visualClassName: "",
    },
    register: {
        eyebrow: "Career command center",
        title: "Build Momentum With",
        accent: "Every New Opportunity.",
        body: "Create your account to track progress, upload resumes, and stay ready for the next move.",
        statValue: "24/7",
        statLabel: "Clear view of every application",
        insightTitle: "Designed for consistency",
        insightBody: "Move from first application to final offer with one place for every update, document, and detail.",
        quickStats: [
            {value: "Fast setup", label: "be ready in under a minute"},
            {value: "Clear pipeline", label: "track every stage from day one"},
        ],
        cardTitle: "Create account",
        cardSubtitle: "Start tracking your applications",
        submitLabel: "Register",
        switchLabel: "Already have an account?",
        switchAction: "Sign in",
        nextRoute: "/login",
        visualClassName: " alt",
    },
};

function AuthPage({mode}) {
    const location = useLocation();
    const navigate = useNavigate();
    const copy = COPY_BY_MODE[mode];
    const redirectTo = location.state?.from?.pathname || "/dashboard";
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);

    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    });

    const [registerForm, setRegisterForm] = useState({
        email: "",
        firstName: "",
        middleName: "",
        lastName: "",
        password: "",
    });

    const transitionClassName = useMemo(() => {
        const transition = location.state?.authTransition;
        if (transition === "to-register") return " auth-layout--animate-left";
        if (transition === "to-login") return " auth-layout--animate-right";
        return "";
    }, [location.state]);

    const loginEmailHint =
        loginForm.email.length === 0
            ? "Use the email address linked to your account."
            : /\S+@\S+\.\S+/.test(loginForm.email)
                ? "Email format looks good."
                : "Enter a valid email address.";

    const loginPasswordHint =
        loginForm.password.length === 0
            ? "Enter the password you used when creating your account."
            : loginForm.password.length >= 8
                ? "Password length looks good."
                : "Password must be at least 8 characters.";

    const registerEmailHint =
        registerForm.email.length === 0
            ? "We'll use this email to sign you in."
            : /\S+@\S+\.\S+/.test(registerForm.email)
                ? "Email format looks good."
                : "Enter a valid email address.";

    const registerPasswordHint =
        registerForm.password.length === 0
            ? "Use at least 8 characters."
            : registerForm.password.length >= 8
                ? "Strong enough to continue."
                : "Password must be at least 8 characters.";

    async function handleLoginSubmit(event) {
        event.preventDefault();
        setSaving(true);
        setError("");

        try {
            const response = await apiFetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(loginForm),
            });

            setToken(response.token);
            navigate(redirectTo, {replace: true});
        } catch (err) {
            setError(err.message || "Failed to sign in");
        } finally {
            setSaving(false);
        }
    }

    async function handleRegisterSubmit(event) {
        event.preventDefault();
        setSaving(true);
        setError("");

        try {
            const payload = {
                ...registerForm,
                middleName: registerForm.middleName.trim() || null,
            };

            const response = await apiFetch("/api/auth/register", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            setToken(response.token);
            navigate(redirectTo, {replace: true});
        } catch (err) {
            setError(err.message || "Failed to create account");
        } finally {
            setSaving(false);
        }
    }

    function handleSwitch() {
        navigate(copy.nextRoute, {
            state: {
                from: location.state?.from,
                authTransition: mode === "login" ? "to-register" : "to-login",
            },
        });
    }

    return (
        <div className={`auth-layout auth-layout--${mode}${transitionClassName}`}>
            <section className={`auth-visual auth-visual--${mode}${copy.visualClassName}`}>
                <div className="auth-visual-glow" />
                <div className="auth-visual-sheen" />
                <div className="auth-visual-inner">
                    <p className="auth-kicker auth-reveal auth-reveal-1">{copy.eyebrow}</p>
                    <h1 className="auth-title auth-reveal auth-reveal-2">
                        {copy.title}
                        <span>{copy.accent}</span>
                    </h1>
                    <p className="auth-copy auth-reveal auth-reveal-3">{copy.body}</p>

                    <div className="auth-quick-stats auth-reveal auth-reveal-4" aria-label="ApplicationTracker highlights">
                        {copy.quickStats.map((item) => (
                            <div className="auth-quick-stat" key={item.label}>
                                <p className="auth-quick-stat-value">{item.value}</p>
                                <p className="auth-quick-stat-label">{item.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="auth-visual-stack auth-reveal auth-reveal-5">
                        <div className="auth-insight-card">
                            <p className="auth-insight-value">{copy.statValue}</p>
                            <p className="auth-insight-label">{copy.statLabel}</p>
                        </div>

                        <div className="auth-floating-note">
                            <p className="auth-floating-title">{copy.insightTitle}</p>
                            <p className="auth-floating-body">{copy.insightBody}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={`auth-panel auth-panel--${mode}`}>
                <div className="auth-card auth-card-enter">
                    <div className={`auth-mode-toggle auth-mode-toggle--${mode}`} aria-label="Authentication mode switch">
                        <div className="auth-mode-indicator" aria-hidden="true" />
                        <button
                            type="button"
                            className={`auth-mode-pill${mode === "login" ? " is-active" : ""}`}
                            onClick={() => {
                                if (mode !== "login") {
                                    navigate("/login", {
                                        state: {
                                            from: location.state?.from,
                                            authTransition: "to-login",
                                        },
                                    });
                                }
                            }}
                        >
                            Sign in
                        </button>

                        <button
                            type="button"
                            className={`auth-mode-pill${mode === "register" ? " is-active" : ""}`}
                            onClick={() => {
                                if (mode !== "register") {
                                    navigate("/register", {
                                        state: {
                                            from: location.state?.from,
                                            authTransition: "to-register",
                                        },
                                    });
                                }
                            }}
                        >
                            Create account
                        </button>
                    </div>

                    <h2 className="auth-card-title">{copy.cardTitle}</h2>
                    <p className="auth-card-subtitle">{copy.cardSubtitle}</p>

                    {mode === "login" ? (
                        <form className="form" onSubmit={handleLoginSubmit}>
                            <div className="field">
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="input"
                                    value={loginForm.email}
                                    onChange={(event) =>
                                        setLoginForm((prev) => ({...prev, email: event.target.value}))
                                    }
                                    required
                                />
                                <p className="helper-text">{loginEmailHint}</p>
                            </div>

                            <div className="field">
                                <label className="label">Password</label>
                                <div className="input-with-action">
                                    <input
                                        type={showLoginPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="input"
                                        value={loginForm.password}
                                        onChange={(event) => {
                                            const value = event.target.value;
                                            setLoginForm((prev) => ({...prev, password: value}));
                                            if (!value) {
                                                setShowLoginPassword(false);
                                            }
                                        }}
                                        required
                                    />
                                    {loginForm.password && (
                                        <button
                                            type="button"
                                            className="input-action"
                                            onClick={() => setShowLoginPassword((prev) => !prev)}
                                        >
                                            {showLoginPassword ? "Hide" : "Show"}
                                        </button>
                                    )}
                                </div>
                                <p className="helper-text">{loginPasswordHint}</p>
                            </div>

                            {error && <p className="form-error">{error}</p>}

                            <button className="btn-primary btn-block" disabled={saving}>
                                {saving ? (
                                    <span className="button-content">
                                        <span className="button-spinner" aria-hidden="true" />
                                        Signing in...
                                    </span>
                                ) : (
                                    copy.submitLabel
                                )}
                            </button>

                            <p className="form-footer">
                                <span>{copy.switchLabel}</span>
                                <button className="auth-switch-link" type="button" onClick={handleSwitch}>
                                    {copy.switchAction}
                                </button>
                            </p>
                        </form>
                    ) : (
                        <form className="form" onSubmit={handleRegisterSubmit}>
                            <div className="field">
                                <label className="label">First Name</label>
                                <input
                                    type="text"
                                    placeholder="Jane"
                                    className="input"
                                    value={registerForm.firstName}
                                    onChange={(event) =>
                                        setRegisterForm((prev) => ({...prev, firstName: event.target.value}))
                                    }
                                    required
                                />
                                <p className="helper-text">Use your preferred first name.</p>
                            </div>

                            <div className="field">
                                <label className="label">Middle Name (optional)</label>
                                <input
                                    type="text"
                                    placeholder="A."
                                    className="input"
                                    value={registerForm.middleName}
                                    onChange={(event) =>
                                        setRegisterForm((prev) => ({...prev, middleName: event.target.value}))
                                    }
                                />
                            </div>

                            <div className="field">
                                <label className="label">Last Name</label>
                                <input
                                    type="text"
                                    placeholder="Doe"
                                    className="input"
                                    value={registerForm.lastName}
                                    onChange={(event) =>
                                        setRegisterForm((prev) => ({...prev, lastName: event.target.value}))
                                    }
                                    required
                                />
                                <p className="helper-text">This helps personalize your profile.</p>
                            </div>

                            <div className="field">
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="input"
                                    value={registerForm.email}
                                    onChange={(event) =>
                                        setRegisterForm((prev) => ({...prev, email: event.target.value}))
                                    }
                                    required
                                />
                                <p className="helper-text">{registerEmailHint}</p>
                            </div>

                            <div className="field">
                                <label className="label">Password</label>
                                <div className="input-with-action">
                                    <input
                                        type={showRegisterPassword ? "text" : "password"}
                                        placeholder="At least 8 characters"
                                        className="input"
                                        value={registerForm.password}
                                        onChange={(event) => {
                                            const value = event.target.value;
                                            setRegisterForm((prev) => ({...prev, password: value}));
                                            if (!value) {
                                                setShowRegisterPassword(false);
                                            }
                                        }}
                                        required
                                    />
                                    {registerForm.password && (
                                        <button
                                            type="button"
                                            className="input-action"
                                            onClick={() => setShowRegisterPassword((prev) => !prev)}
                                        >
                                            {showRegisterPassword ? "Hide" : "Show"}
                                        </button>
                                    )}
                                </div>
                                <p className="helper-text">{registerPasswordHint}</p>
                            </div>

                            {error && <p className="form-error">{error}</p>}

                            <button className="btn-primary btn-block" disabled={saving}>
                                {saving ? (
                                    <span className="button-content">
                                        <span className="button-spinner" aria-hidden="true" />
                                        Creating account...
                                    </span>
                                ) : (
                                    copy.submitLabel
                                )}
                            </button>

                            <p className="form-footer">
                                <span>{copy.switchLabel}</span>
                                <button className="auth-switch-link" type="button" onClick={handleSwitch}>
                                    {copy.switchAction}
                                </button>
                            </p>
                        </form>
                    )}
                </div>
            </section>
        </div>
    );
}

export default AuthPage;

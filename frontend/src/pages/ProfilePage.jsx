import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/Client.js";

function ProfilePage() {
    const [me, setMe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [profileForm, setProfileForm] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        phone: "",
        title: "",
    });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const memberSince = useMemo(() => {
        if (!me?.createdAt) {
            return "—";
        }

        return new Date(me.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }, [me]);

    useEffect(() => {
        let ignore = false;

        async function loadProfile() {
            try {
                setLoading(true);
                const data = await apiFetch("/api/me");
                if (!ignore) {
                    setMe(data);
                    setProfileForm({
                        firstName: data.firstName || "",
                        middleName: data.middleName || "",
                        lastName: data.lastName || "",
                        phone: data.phone || "",
                        title: data.title || "",
                    });
                }
            } catch (err) {
                if (!ignore) {
                    setError(err.message || "Failed to load account");
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadProfile();

        return () => {
            ignore = true;
        };
    }, []);

    async function handleProfileSave(event) {
        event.preventDefault();
        setSavingProfile(true);
        setError("");
        setMessage("");

        try {
            const updated = await apiFetch("/api/me", {
                method: "PUT",
                body: JSON.stringify(profileForm),
            });

            setMe(updated);
            setProfileForm({
                firstName: updated.firstName || "",
                middleName: updated.middleName || "",
                lastName: updated.lastName || "",
                phone: updated.phone || "",
                title: updated.title || "",
            });
            window.dispatchEvent(new Event("account-updated"));
            setMessage("Account details updated.");
        } catch (err) {
            setError(err.message || "Failed to update account");
        } finally {
            setSavingProfile(false);
        }
    }

    async function handlePasswordSave(event) {
        event.preventDefault();
        setSavingPassword(true);
        setError("");
        setMessage("");

        try {
            if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                throw new Error("New password and confirmation do not match");
            }

            await apiFetch("/api/me/password", {
                method: "PUT",
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                }),
            });

            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setMessage("Password updated.");
        } catch (err) {
            setError(err.message || "Failed to update password");
        } finally {
            setSavingPassword(false);
        }
    }

    return (
        <div className="page profile-page">
            <header className="page-header">
                <div>
                    <p className="page-kicker">Manage account</p>
                    <h1 className="page-title">Keep your account ready for the next opportunity.</h1>
                    <p className="page-subtitle">
                        Update your identity details now. Profile photo, email changes, and deeper account settings can follow in later slices.
                    </p>
                </div>
            </header>

            {loading ? (
                <section className="card">
                    <p className="page-subtitle">Loading account details...</p>
                </section>
            ) : (
                <>
                    <section className="card">
                        <h2 className="section-title">Account summary</h2>
                        <div className="summary-grid">
                            <div>
                                <p className="meta-label">Email</p>
                                <p className="meta-value">{me?.email || "—"}</p>
                            </div>
                            <div>
                                <p className="meta-label">Full name</p>
                                <p className="meta-value">{me?.fullName || "—"}</p>
                            </div>
                            <div>
                                <p className="meta-label">Role</p>
                                <p className="meta-value">{me?.role || "User"}</p>
                            </div>
                            <div>
                                <p className="meta-label">Member since</p>
                                <p className="meta-value">{memberSince}</p>
                            </div>
                        </div>
                    </section>

                    <section className="card profile-section">
                        <div className="section-heading">
                            <div>
                                <h2 className="section-title">Profile details</h2>
                                <p className="page-subtitle">This is what the app will use across your account and future profile surfaces.</p>
                            </div>
                        </div>

                        <form className="form" onSubmit={handleProfileSave}>
                            <div className="form-grid">
                                <div className="field">
                                    <label className="label">First name</label>
                                    <input
                                        className="input"
                                        value={profileForm.firstName}
                                        onChange={(event) =>
                                            setProfileForm((prev) => ({ ...prev, firstName: event.target.value }))
                                        }
                                        required
                                    />
                                </div>

                                <div className="field">
                                    <label className="label">Middle name</label>
                                    <input
                                        className="input"
                                        value={profileForm.middleName}
                                        onChange={(event) =>
                                            setProfileForm((prev) => ({ ...prev, middleName: event.target.value }))
                                        }
                                    />
                                </div>

                                <div className="field">
                                    <label className="label">Last name</label>
                                    <input
                                        className="input"
                                        value={profileForm.lastName}
                                        onChange={(event) =>
                                            setProfileForm((prev) => ({ ...prev, lastName: event.target.value }))
                                        }
                                        required
                                    />
                                </div>

                                <div className="field">
                                    <label className="label">Professional title</label>
                                    <input
                                        className="input"
                                        placeholder="Software Engineer"
                                        value={profileForm.title}
                                        onChange={(event) =>
                                            setProfileForm((prev) => ({ ...prev, title: event.target.value }))
                                        }
                                    />
                                </div>

                                <div className="field span-2">
                                    <label className="label">Phone</label>
                                    <input
                                        className="input"
                                        placeholder="+1 (555) 000-0000"
                                        value={profileForm.phone}
                                        onChange={(event) =>
                                            setProfileForm((prev) => ({ ...prev, phone: event.target.value }))
                                        }
                                    />
                                </div>
                            </div>

                            {error && <p className="form-error">{error}</p>}
                            {message && <p className="form-success">{message}</p>}

                            <div className="form-actions">
                                <button className="btn-primary" disabled={savingProfile}>
                                    {savingProfile ? "Saving..." : "Save account details"}
                                </button>
                            </div>
                        </form>
                    </section>

                    <section className="card profile-section">
                        <div className="section-heading">
                            <div>
                                <h2 className="section-title">Change password</h2>
                                <p className="page-subtitle">Keep this separate from profile edits so validation and error handling stay clear.</p>
                            </div>
                        </div>

                        <form className="form" onSubmit={handlePasswordSave}>
                            <div className="field">
                                <label className="label">Current password</label>
                                <input
                                    type="password"
                                    className="input"
                                    value={passwordForm.currentPassword}
                                    onChange={(event) =>
                                        setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))
                                    }
                                    required
                                />
                            </div>

                            <div className="field">
                                <label className="label">New password</label>
                                <input
                                    type="password"
                                    className="input"
                                    value={passwordForm.newPassword}
                                    onChange={(event) =>
                                        setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))
                                    }
                                    required
                                />
                                <p className="helper-text">Use at least 8 characters and avoid reusing your current password.</p>
                            </div>

                            <div className="field">
                                <label className="label">Confirm new password</label>
                                <input
                                    type="password"
                                    className="input"
                                    value={passwordForm.confirmPassword}
                                    onChange={(event) =>
                                        setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                                    }
                                    required
                                />
                            </div>

                            {error && <p className="form-error">{error}</p>}
                            {message && <p className="form-success">{message}</p>}

                            <div className="form-actions">
                                <button className="btn-primary" disabled={savingPassword}>
                                    {savingPassword ? "Updating..." : "Update password"}
                                </button>
                            </div>
                        </form>
                    </section>
                </>
            )}
        </div>
    );
}

export default ProfilePage;

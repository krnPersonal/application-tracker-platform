import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/Client.js";

function ApplicationFormPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        companyName: "",
        location: "",
        position: "",
        appliedDate: "",
        workType: "Onsite",
        status: "APPLIED",
        coverLetter: "",
        yearsExperience: "",
        availableFrom: "",
        salaryExpectation: "",
        notes: "",
        portfolioUrl: "",
        linkedinUrl: "",
    });
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    function updateField(name, value) {
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setSaving(true);

        try {
            if (!form.fullName.trim()) {
                throw new Error("Full name is required");
            }
            if (!form.email.trim()) {
                throw new Error("Email is required");
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
                throw new Error("Enter a valid email address");
            }
            if (!form.position.trim()) {
                throw new Error("Position is required");
            }
            if (!form.companyName.trim()) {
                throw new Error("Company name is required");
            }
            if (form.yearsExperience === "" || Number.isNaN(Number(form.yearsExperience))) {
                throw new Error("Years of experience is required");
            }

            const payload = {
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                phone: form.phone.trim() || null,
                companyName: form.companyName.trim(),
                location: form.location.trim() || null,
                position: form.position.trim(),
                appliedDate: form.appliedDate || null,
                workType: form.workType || null,
                status: form.status || "APPLIED",
                coverLetter: form.coverLetter.trim() || null,
                yearsExperience: form.yearsExperience === "" ? 0 : Number(form.yearsExperience),
                availableFrom: form.availableFrom || null,
                salaryExpectation: form.salaryExpectation === "" ? null : Number(form.salaryExpectation),
                notes: form.notes.trim() || null,
                portfolioUrl: form.portfolioUrl.trim() || null,
                linkedinUrl: form.linkedinUrl.trim() || null,
            };

            await apiFetch("/api/applications", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            navigate("/applications");
        } catch (err) {
            setError(err.message || "Failed to create application");
        } finally {
            setSaving(false);
        }
    }

    return (
        <form className="page" onSubmit={handleSubmit}>
            <header className="page-header">
                <div>
                    <p className="page-kicker">New application</p>
                    <h1 className="page-title">Capture a new opportunity while the details are still fresh.</h1>
                    <p className="page-subtitle">
                        Add the core application details now. Resume upload and richer follow-up history can come in later slices.
                    </p>
                </div>
            </header>

            {error && <p className="form-error">{error}</p>}

            <section className="card form-section">
                <h2 className="section-title">Applicant info</h2>
                <div className="form-grid">
                    <div className="field">
                        <label className="label">Full name</label>
                        <input
                            type="text"
                            placeholder="Jane Doe"
                            className="input"
                            value={form.fullName}
                            onChange={(event) => updateField("fullName", event.target.value)}
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="label">Email</label>
                        <input
                            type="email"
                            placeholder="jane@example.com"
                            className="input"
                            value={form.email}
                            onChange={(event) => updateField("email", event.target.value)}
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="label">Phone</label>
                        <input
                            type="tel"
                            placeholder="+1 555 123 4567"
                            className="input"
                            value={form.phone}
                            onChange={(event) => updateField("phone", event.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label className="label">Portfolio URL</label>
                        <input
                            type="url"
                            placeholder="https://portfolio.com"
                            className="input"
                            value={form.portfolioUrl}
                            onChange={(event) => updateField("portfolioUrl", event.target.value)}
                        />
                    </div>

                    <div className="field span-2">
                        <label className="label">LinkedIn</label>
                        <input
                            type="url"
                            placeholder="https://linkedin.com/in/username"
                            className="input"
                            value={form.linkedinUrl}
                            onChange={(event) => updateField("linkedinUrl", event.target.value)}
                        />
                    </div>
                </div>
            </section>

            <section className="card form-section">
                <h2 className="section-title">Job details</h2>
                <div className="form-grid">
                    <div className="field">
                        <label className="label">Company name</label>
                        <input
                            type="text"
                            placeholder="Acme Inc."
                            className="input"
                            value={form.companyName}
                            onChange={(event) => updateField("companyName", event.target.value)}
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="label">Location</label>
                        <input
                            type="text"
                            placeholder="Chicago, IL"
                            className="input"
                            value={form.location}
                            onChange={(event) => updateField("location", event.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label className="label">Position</label>
                        <input
                            type="text"
                            placeholder="Frontend Engineer"
                            className="input"
                            value={form.position}
                            onChange={(event) => updateField("position", event.target.value)}
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="label">Applied date</label>
                        <input
                            type="date"
                            className="input"
                            value={form.appliedDate}
                            onChange={(event) => updateField("appliedDate", event.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label className="label">Available from</label>
                        <input
                            type="date"
                            className="input"
                            value={form.availableFrom}
                            onChange={(event) => updateField("availableFrom", event.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label className="label">Work type</label>
                        <select
                            className="input"
                            value={form.workType}
                            onChange={(event) => updateField("workType", event.target.value)}
                        >
                            <option value="Onsite">Onsite</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>

                    <div className="field span-2">
                        <label className="label">Status</label>
                        <div className="option-group">
                            {["APPLIED", "INTERVIEW", "OFFER", "REJECTED"].map((status) => (
                                <label key={status} className="option">
                                    <input
                                        type="radio"
                                        name="status"
                                        value={status}
                                        checked={form.status === status}
                                        onChange={(event) => updateField("status", event.target.value)}
                                    />
                                    {status}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Years of experience</label>
                        <input
                            type="number"
                            min="0"
                            className="input"
                            value={form.yearsExperience}
                            onChange={(event) => updateField("yearsExperience", event.target.value)}
                            required
                        />
                    </div>

                    <div className="field">
                        <label className="label">Salary expectation</label>
                        <input
                            type="number"
                            min="0"
                            className="input"
                            placeholder="90000"
                            value={form.salaryExpectation}
                            onChange={(event) => updateField("salaryExpectation", event.target.value)}
                        />
                    </div>
                </div>
            </section>

            <section className="card form-section">
                <h2 className="section-title">Notes and context</h2>
                <div className="form-grid">
                    <div className="field span-2">
                        <label className="label">Cover letter notes</label>
                        <textarea
                            className="input textarea"
                            rows="5"
                            placeholder="Key points you tailored for this application"
                            value={form.coverLetter}
                            onChange={(event) => updateField("coverLetter", event.target.value)}
                        />
                    </div>

                    <div className="field span-2">
                        <label className="label">Notes</label>
                        <textarea
                            className="input textarea"
                            rows="5"
                            placeholder="Interviewer names, follow-up plans, company notes..."
                            value={form.notes}
                            onChange={(event) => updateField("notes", event.target.value)}
                        />
                    </div>
                </div>
            </section>

            <div className="form-actions">
                <button className="btn-primary" disabled={saving}>
                    {saving ? "Saving..." : "Create application"}
                </button>
                <button
                    className="btn-outline"
                    type="button"
                    onClick={() => navigate("/applications")}
                    disabled={saving}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default ApplicationFormPage;

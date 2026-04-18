import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/Client.js";

const STATUS_OPTIONS = [
    "APPLIED",
    "INTERVIEW_SCHEDULED",
    "INTERVIEWED",
    "OFFER_RECEIVED",
    "REJECTED",
    "WITHDRAWN",
];

const SOURCE_OPTIONS = ["LINKEDIN", "INDEED", "COMPANY_WEBSITE", "REFERRAL", "OTHER"];
const JOB_TYPE_OPTIONS = ["FULL_TIME", "CONTRACT", "PART_TIME", "INTERN"];
const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH"];

function formatEnumLabel(value) {
    return value
        .split("_")
        .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
        .join(" ");
}

function ApplicationFormPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        jobTitle: "",
        companyName: "",
        jobLocation: "",
        status: "APPLIED",
        priority: "MEDIUM",
        jobUrl: "",
        source: "LINKEDIN",
        appliedDate: "",
        salaryMin: "",
        salaryMax: "",
        jobType: "FULL_TIME",
        notes: "",
        nextAction: "",
        nextActionDate: "",
        recruiterName: "",
        recruiterPhone: "",
        recruiterEmail: "",
        resumeFileName: "",
        coverLetter: "",
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
            if (!form.jobTitle.trim()) {
                throw new Error("Job title is required");
            }
            if (!form.companyName.trim()) {
                throw new Error("Company name is required");
            }
            if (form.recruiterEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.recruiterEmail.trim())) {
                throw new Error("Enter a valid recruiter email address");
            }

            const payload = {
                jobTitle: form.jobTitle.trim(),
                companyName: form.companyName.trim(),
                jobLocation: form.jobLocation.trim() || null,
                status: form.status || "APPLIED",
                priority: form.priority || "MEDIUM",
                jobUrl: form.jobUrl.trim() || null,
                source: form.source || null,
                appliedDate: form.appliedDate || null,
                salaryMin: form.salaryMin === "" ? null : Number(form.salaryMin),
                salaryMax: form.salaryMax === "" ? null : Number(form.salaryMax),
                jobType: form.jobType || null,
                notes: form.notes.trim() || null,
                nextAction: form.nextAction.trim() || null,
                nextActionDate: form.nextActionDate || null,
                recruiterName: form.recruiterName.trim() || null,
                recruiterPhone: form.recruiterPhone.trim() || null,
                recruiterEmail: form.recruiterEmail.trim() || null,
                resumeFileName: form.resumeFileName.trim() || null,
                coverLetter: form.coverLetter.trim() || null,
            };

            if (
                payload.salaryMin !== null &&
                payload.salaryMax !== null &&
                payload.salaryMin > payload.salaryMax
            ) {
                throw new Error("Salary minimum cannot be greater than salary maximum");
            }

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
                    <h1 className="page-title">Capture the job, the source, and the recruiter details in one place.</h1>
                    <p className="page-subtitle">
                        This form is now centered on the opportunity itself so you can track where you applied and what you need for follow-up.
                    </p>
                </div>
            </header>

            {error && <p className="form-error">{error}</p>}

            <section className="card form-section">
                <h2 className="section-title">Role and company</h2>
                <div className="form-grid">
                    <div className="field">
                        <label className="label">Job title</label>
                        <input
                            type="text"
                            placeholder="Frontend Engineer"
                            className="input"
                            value={form.jobTitle}
                            onChange={(event) => updateField("jobTitle", event.target.value)}
                            required
                        />
                    </div>

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
                        <label className="label">Job location</label>
                        <input
                            type="text"
                            placeholder="Chicago, IL or Remote"
                            className="input"
                            value={form.jobLocation}
                            onChange={(event) => updateField("jobLocation", event.target.value)}
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
                        <label className="label">Application status</label>
                        <select
                            className="input"
                            value={form.status}
                            onChange={(event) => updateField("status", event.target.value)}
                        >
                            {STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>
                                    {formatEnumLabel(status)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label className="label">Priority</label>
                        <select
                            className="input"
                            value={form.priority}
                            onChange={(event) => updateField("priority", event.target.value)}
                        >
                            {PRIORITY_OPTIONS.map((priority) => (
                                <option key={priority} value={priority}>
                                    {formatEnumLabel(priority)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label className="label">Job type</label>
                        <select
                            className="input"
                            value={form.jobType}
                            onChange={(event) => updateField("jobType", event.target.value)}
                        >
                            {JOB_TYPE_OPTIONS.map((jobType) => (
                                <option key={jobType} value={jobType}>
                                    {formatEnumLabel(jobType)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            <section className="card form-section">
                <h2 className="section-title">Source and compensation</h2>
                <div className="form-grid">
                    <div className="field span-2">
                        <label className="label">Job URL</label>
                        <input
                            type="url"
                            placeholder="https://company.com/careers/role"
                            className="input"
                            value={form.jobUrl}
                            onChange={(event) => updateField("jobUrl", event.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label className="label">Source</label>
                        <select
                            className="input"
                            value={form.source}
                            onChange={(event) => updateField("source", event.target.value)}
                        >
                            {SOURCE_OPTIONS.map((source) => (
                                <option key={source} value={source}>
                                    {formatEnumLabel(source)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label className="label">Salary minimum</label>
                        <input
                            type="number"
                            min="0"
                            className="input"
                            placeholder="90000"
                            value={form.salaryMin}
                            onChange={(event) => updateField("salaryMin", event.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label className="label">Salary maximum</label>
                        <input
                            type="number"
                            min="0"
                            className="input"
                            placeholder="120000"
                            value={form.salaryMax}
                            onChange={(event) => updateField("salaryMax", event.target.value)}
                        />
                    </div>
                </div>
            </section>

            <section className="card form-section">
                <h2 className="section-title">Follow-up planning</h2>
                <div className="form-grid">
                    <div className="field span-2">
                        <label className="label">Next action</label>
                        <input
                            type="text"
                            placeholder="Send follow-up email to recruiter"
                            className="input"
                            value={form.nextAction}
                            onChange={(event) => updateField("nextAction", event.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label className="label">Next action date</label>
                        <input
                            type="date"
                            className="input"
                            value={form.nextActionDate}
                            onChange={(event) => updateField("nextActionDate", event.target.value)}
                        />
                    </div>
                </div>
            </section>

            <section className="card form-section">
                <h2 className="section-title">Recruiter contact</h2>
                <div className="form-grid">
                    <div className="field">
                        <label className="label">Recruiter name</label>
                        <input
                            type="text"
                            placeholder="Taylor Brooks"
                            className="input"
                            value={form.recruiterName}
                            onChange={(event) => updateField("recruiterName", event.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label className="label">Recruiter phone</label>
                        <input
                            type="tel"
                            placeholder="+1 555 123 4567"
                            className="input"
                            value={form.recruiterPhone}
                            onChange={(event) => updateField("recruiterPhone", event.target.value)}
                        />
                    </div>

                    <div className="field span-2">
                        <label className="label">Recruiter email</label>
                        <input
                            type="email"
                            placeholder="taylor@company.com"
                            className="input"
                            value={form.recruiterEmail}
                            onChange={(event) => updateField("recruiterEmail", event.target.value)}
                        />
                    </div>
                </div>
            </section>

            <section className="card form-section">
                <h2 className="section-title">Materials and notes</h2>
                <div className="form-grid">
                    <div className="field span-2">
                        <label className="label">Resume used</label>
                        <input
                            type="text"
                            placeholder="frontend-resume-v3.pdf"
                            className="input"
                            value={form.resumeFileName}
                            onChange={(event) => updateField("resumeFileName", event.target.value)}
                        />
                    </div>

                    <div className="field span-2">
                        <label className="label">Cover letter</label>
                        <textarea
                            className="input textarea"
                            rows="5"
                            placeholder="Paste or summarize the cover letter you used for this role."
                            value={form.coverLetter}
                            onChange={(event) => updateField("coverLetter", event.target.value)}
                        />
                    </div>

                    <div className="field span-2">
                        <label className="label">Notes</label>
                        <textarea
                            className="input textarea"
                            rows="5"
                            placeholder="Interview timeline, recruiter notes, compensation context, or anything to revisit later."
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

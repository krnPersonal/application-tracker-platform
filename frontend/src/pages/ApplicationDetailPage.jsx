import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../api/Client.js";

function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatDateTime(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

function formatEnumLabel(value) {
    if (!value) return "—";
    return String(value)
        .split("_")
        .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
        .join(" ");
}

function formatSalaryRange(application) {
    const { salaryMin, salaryMax } = application;
    if (salaryMin == null && salaryMax == null) return "—";
    if (salaryMin != null && salaryMax != null) return `$${salaryMin.toLocaleString()} - $${salaryMax.toLocaleString()}`;
    if (salaryMin != null) return `From $${salaryMin.toLocaleString()}`;
    return `Up to $${salaryMax.toLocaleString()}`;
}

function ApplicationDetailPage() {
    const { id } = useParams();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        async function loadApplication() {
            try {
                setLoading(true);
                setError("");
                const data = await apiFetch(`/api/applications/${id}`);

                if (!ignore) {
                    setApplication(data);
                }
            } catch (err) {
                if (!ignore) {
                    setError(err.message || "Failed to load application");
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadApplication();

        return () => {
            ignore = true;
        };
    }, [id]);

    const summaryRows = useMemo(() => {
        if (!application) return [];

        return [
            { label: "Status", value: formatEnumLabel(application.status), badge: ["status-badge", String(application.status || "applied").toLowerCase()] },
            { label: "Priority", value: formatEnumLabel(application.priority), badge: ["priority-badge", String(application.priority || "medium").toLowerCase()] },
            { label: "Source", value: formatEnumLabel(application.source) },
            { label: "Job type", value: formatEnumLabel(application.jobType) },
            { label: "Applied", value: formatDate(application.appliedDate || application.createdAt) },
            { label: "Salary range", value: formatSalaryRange(application) },
            { label: "Location", value: application.jobLocation || "—" },
            { label: "Resume used", value: application.resumeFileName || "—" },
        ];
    }, [application]);

    if (loading) {
        return (
            <div className="page">
                <section className="card">
                    <p className="page-subtitle">Loading application details...</p>
                </section>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page">
                <section className="card">
                    <p className="form-error">{error}</p>
                    <div className="form-actions">
                        <Link className="btn-outline" to="/applications">
                            Back to Applications
                        </Link>
                    </div>
                </section>
            </div>
        );
    }

    if (!application) {
        return null;
    }

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <p className="page-kicker">Application detail</p>
                    <h1 className="page-title">{application.jobTitle}</h1>
                    <p className="page-subtitle">
                        {application.companyName || "Unknown company"} • {application.jobLocation || "Location TBD"}
                    </p>
                </div>

                <div className="form-actions">
                    <Link className="btn-outline" to="/applications">
                        Back to Applications
                    </Link>
                </div>
            </header>

            <section className="card">
                <div className="section-heading">
                    <div>
                        <h2 className="section-title">Opportunity snapshot</h2>
                        <p className="page-subtitle">Everything important about this role in one view.</p>
                    </div>
                </div>

                <div className="detail-grid">
                    {summaryRows.map((item) => (
                        <div key={item.label}>
                            <p className="meta-label">{item.label}</p>
                            {item.badge ? (
                                <span className={`${item.badge[0]} ${item.badge[1]}`}>{item.value}</span>
                            ) : (
                                <p className="meta-value">{item.value}</p>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <section className="detail-columns">
                <article className="card detail-card">
                    <div className="section-heading">
                        <div>
                            <h2 className="section-title">Follow-up</h2>
                            <p className="page-subtitle">What needs to happen next for this application.</p>
                        </div>
                    </div>

                    <div className="detail-stack">
                        <div>
                            <p className="meta-label">Next action</p>
                            <p className="meta-value">{application.nextAction || "—"}</p>
                        </div>
                        <div>
                            <p className="meta-label">Next action date</p>
                            <p className="meta-value">{formatDate(application.nextActionDate)}</p>
                        </div>
                        <div>
                            <p className="meta-label">Job URL</p>
                            {application.jobUrl ? (
                                <a className="detail-link" href={application.jobUrl} target="_blank" rel="noreferrer">
                                    Open job posting
                                </a>
                            ) : (
                                <p className="meta-value">—</p>
                            )}
                        </div>
                    </div>
                </article>

                <article className="card detail-card">
                    <div className="section-heading">
                        <div>
                            <h2 className="section-title">Recruiter contact</h2>
                            <p className="page-subtitle">The primary person or channel tied to this role.</p>
                        </div>
                    </div>

                    <div className="detail-stack">
                        <div>
                            <p className="meta-label">Name</p>
                            <p className="meta-value">{application.recruiterName || "—"}</p>
                        </div>
                        <div>
                            <p className="meta-label">Email</p>
                            <p className="meta-value">{application.recruiterEmail || "—"}</p>
                        </div>
                        <div>
                            <p className="meta-label">Phone</p>
                            <p className="meta-value">{application.recruiterPhone || "—"}</p>
                        </div>
                    </div>
                </article>
            </section>

            <section className="detail-columns">
                <article className="card detail-card">
                    <div className="section-heading">
                        <div>
                            <h2 className="section-title">Notes</h2>
                            <p className="page-subtitle">Context, follow-up reminders, and interview prep.</p>
                        </div>
                    </div>
                    <p className="detail-body">{application.notes || "No notes added yet."}</p>
                </article>

                <article className="card detail-card">
                    <div className="section-heading">
                        <div>
                            <h2 className="section-title">Cover letter</h2>
                            <p className="page-subtitle">The version or summary attached to this application.</p>
                        </div>
                    </div>
                    <p className="detail-body">{application.coverLetter || "No cover letter captured yet."}</p>
                </article>
            </section>

            <section className="card">
                <div className="section-heading">
                    <div>
                        <h2 className="section-title">Record history</h2>
                        <p className="page-subtitle">Timestamps for the application record itself.</p>
                    </div>
                </div>

                <div className="summary-grid detail-history-grid">
                    <div>
                        <p className="meta-label">Created</p>
                        <p className="meta-value">{formatDateTime(application.createdAt)}</p>
                    </div>
                    <div>
                        <p className="meta-label">Updated</p>
                        <p className="meta-value">{formatDateTime(application.updatedAt)}</p>
                    </div>
                    <div>
                        <p className="meta-label">Resume uploaded</p>
                        <p className="meta-value">{formatDateTime(application.resumeUploadedAt)}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ApplicationDetailPage;

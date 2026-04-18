import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/Client.js";

const PIPELINE_STATUS_ORDER = [
    "APPLIED",
    "INTERVIEW_SCHEDULED",
    "INTERVIEWED",
    "OFFER_RECEIVED",
    "REJECTED",
    "WITHDRAWN",
];

function getLastActivityTimestamp(application) {
    const created = new Date(application.createdAt || 0).getTime();
    const resume = new Date(application.resumeUploadedAt || 0).getTime();
    return Math.max(created, resume);
}

function getDaysSince(value) {
    const timestamp = new Date(value || 0).getTime();
    if (!timestamp) return null;
    const diff = Date.now() - timestamp;
    if (diff < 0) return 0;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

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

function formatEnumLabel(value) {
    return String(value || "APPLIED")
        .split("_")
        .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
        .join(" ");
}

function isFollowUpCandidate(status) {
    return status !== "REJECTED" && status !== "WITHDRAWN" && status !== "OFFER_RECEIVED";
}

function getPriorityRank(priority) {
    if (priority === "HIGH") return 0;
    if (priority === "MEDIUM") return 1;
    return 2;
}

function DashboardPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        async function loadApplications() {
            try {
                setLoading(true);
                setError("");
                const data = await apiFetch("/api/applications");

                if (!ignore) {
                    setApplications(data || []);
                }
            } catch (err) {
                if (!ignore) {
                    setError(err.message || "Failed to load applications");
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadApplications();

        return () => {
            ignore = true;
        };
    }, []);

    const metrics = useMemo(() => {
        const counts = {
            APPLIED: 0,
            INTERVIEW_SCHEDULED: 0,
            INTERVIEWED: 0,
            OFFER_RECEIVED: 0,
            REJECTED: 0,
            WITHDRAWN: 0,
        };

        let activeCount = 0;
        let staleCount = 0;

        for (const application of applications) {
            const status = String(application.status || "").toUpperCase();
            const daysSinceActivity = getDaysSince(getLastActivityTimestamp(application));

            if (counts[status] !== undefined) {
                counts[status] += 1;
            }

            if (isFollowUpCandidate(status)) {
                activeCount += 1;
            }

            if (
                ((application.nextActionDate && new Date(application.nextActionDate).getTime() <= Date.now()) ||
                    (daysSinceActivity !== null && daysSinceActivity >= 14)) &&
                isFollowUpCandidate(status)
            ) {
                staleCount += 1;
            }
        }

        const total = applications.length;
        const interviewCount = counts.INTERVIEW_SCHEDULED + counts.INTERVIEWED;
        const interviewRate = total > 0 ? Math.round((interviewCount / total) * 100) : 0;
        const offerRate = total > 0 ? Math.round((counts.OFFER_RECEIVED / total) * 100) : 0;

        return {
            total,
            activeCount,
            staleCount,
            counts,
            interviewCount,
            interviewRate,
            offerRate,
        };
    }, [applications]);

    const dashboardCards = useMemo(
        () => [
            {
                label: "Total applications",
                value: metrics.total,
                detail: `${metrics.activeCount} still active in the pipeline`,
                tone: "default",
            },
            {
                label: "Interview rate",
                value: `${metrics.interviewRate}%`,
                detail: `${metrics.interviewCount} reached an interview stage`,
                tone: "warm",
            },
            {
                label: "Offer rate",
                value: `${metrics.offerRate}%`,
                detail: `${metrics.counts.OFFER_RECEIVED} offer${metrics.counts.OFFER_RECEIVED === 1 ? "" : "s"} received`,
                tone: "success",
            },
            {
                label: "Needs follow-up",
                value: metrics.staleCount,
                detail: "No activity in the last 14 days",
                tone: "cool",
            },
        ],
        [metrics]
    );

    const stageBreakdown = useMemo(() => {
        return PIPELINE_STATUS_ORDER.map((status) => {
            const count = metrics.counts[status] || 0;
            const share = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
            return { status, count, share };
        });
    }, [metrics]);

    const recentApplications = useMemo(() => {
        return [...applications]
            .sort((a, b) => getLastActivityTimestamp(b) - getLastActivityTimestamp(a))
            .slice(0, 6);
    }, [applications]);

    const staleApplications = useMemo(() => {
        return [...applications]
            .filter((application) => {
                const status = String(application.status || "").toUpperCase();
                const daysSinceActivity = getDaysSince(getLastActivityTimestamp(application));

                return (
                    ((application.nextActionDate && new Date(application.nextActionDate).getTime() <= Date.now()) ||
                        (daysSinceActivity !== null && daysSinceActivity >= 14)) &&
                    isFollowUpCandidate(status)
                );
            })
            .sort((a, b) => {
                const aDue = new Date(a.nextActionDate || "9999-12-31").getTime();
                const bDue = new Date(b.nextActionDate || "9999-12-31").getTime();
                if (aDue !== bDue) return aDue - bDue;
                return getPriorityRank(String(a.priority || "MEDIUM").toUpperCase()) -
                    getPriorityRank(String(b.priority || "MEDIUM").toUpperCase());
            })
            .slice(0, 4);
    }, [applications]);

    if (loading) {
        return (
            <div className="page">
                <section className="card">
                    <p className="page-subtitle">Loading dashboard...</p>
                </section>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page">
                <section className="card">
                    <p className="form-error">{error}</p>
                </section>
            </div>
        );
    }

    return (
        <div className="page">
            <header className="page-header">
                <div>
                    <p className="page-kicker">Dashboard</p>
                    <h1 className="page-title">Keep your pipeline moving with cleaner status signals.</h1>
                    <p className="page-subtitle">
                        Review conversion, identify stale opportunities, and keep recruiter follow-up visible.
                    </p>
                </div>

                <div className="form-actions">
                    <Link className="btn-outline" to="/applications">
                        View Applications
                    </Link>
                </div>
            </header>

            <section className="dashboard-metrics-grid">
                {dashboardCards.map((card) => (
                    <article key={card.label} className={`dashboard-metric-card ${card.tone}`}>
                        <p className="dashboard-metric-label">{card.label}</p>
                        <p className="dashboard-metric-value">{card.value}</p>
                        <p className="dashboard-metric-detail">{card.detail}</p>
                    </article>
                ))}
            </section>

            <section className="dashboard-insight-grid">
                <article className="card dashboard-stage-card">
                    <div className="section-heading">
                        <div>
                            <h2 className="section-title">Pipeline breakdown</h2>
                            <p className="page-subtitle">See where your applications are clustering right now.</p>
                        </div>
                    </div>

                    <div className="dashboard-stage-list">
                        {stageBreakdown.map((item) => (
                            <div key={item.status} className="dashboard-stage-row">
                                <div className="dashboard-stage-meta">
                                    <span className={`status-badge ${item.status.toLowerCase()}`}>{formatEnumLabel(item.status)}</span>
                                    <span className="dashboard-stage-count">{item.count}</span>
                                </div>

                                <div className="dashboard-stage-bar">
                                    <span
                                        className={`dashboard-stage-fill ${item.status.toLowerCase()}`}
                                        style={{ width: `${Math.max(item.share, item.count > 0 ? 8 : 0)}%` }}
                                    />
                                </div>

                                <span className="dashboard-stage-share">{item.share}%</span>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="card dashboard-followup-card">
                    <div className="section-heading">
                        <div>
                            <h2 className="section-title">Follow-up queue</h2>
                            <p className="page-subtitle">Applications that have gone quiet and may need action.</p>
                        </div>
                    </div>

                    {staleApplications.length === 0 ? (
                        <p className="page-subtitle">No stale applications right now.</p>
                    ) : (
                        <div className="dashboard-followup-list">
                            {staleApplications.map((application) => {
                                const daysSinceActivity = getDaysSince(getLastActivityTimestamp(application));

                                return (
                                    <article key={application.id} className="dashboard-followup-item">
                                        <div>
                                            <p className="dashboard-followup-title">{application.jobTitle}</p>
                                            <p className="dashboard-followup-meta">
                                                {application.companyName || "Unknown company"} • {application.nextAction || formatEnumLabel(application.status || "APPLIED")}
                                            </p>
                                        </div>
                                        <div className="dashboard-followup-stack">
                                            <span className={`priority-badge ${String(application.priority || "MEDIUM").toLowerCase()}`}>
                                                {formatEnumLabel(application.priority || "MEDIUM")}
                                            </span>
                                            <p className="dashboard-followup-age">
                                                {application.nextActionDate
                                                    ? `Due ${formatDate(application.nextActionDate)}`
                                                    : `${daysSinceActivity} day${daysSinceActivity === 1 ? "" : "s"} idle`}
                                            </p>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </article>
            </section>

            <section className="card">
                <div className="section-heading">
                    <div>
                        <h2 className="section-title">Recent activity</h2>
                        <p className="page-subtitle">Most recently updated application records.</p>
                    </div>
                </div>

                {recentApplications.length === 0 ? (
                    <p className="page-subtitle">No applications yet. Add your first one in the next slice.</p>
                ) : (
                    <div className="dashboard-recent-list">
                        {recentApplications.map((application) => (
                            <article key={application.id} className="dashboard-recent-item">
                                <div>
                                    <p className="dashboard-recent-title">{application.jobTitle}</p>
                                    <p className="dashboard-recent-meta">
                                        {application.companyName || "Unknown company"} • {formatDate(application.appliedDate || application.createdAt)}
                                    </p>
                                </div>
                                <div className="dashboard-recent-tags">
                                    <span className={`priority-badge ${String(application.priority || "MEDIUM").toLowerCase()}`}>
                                        {formatEnumLabel(application.priority || "MEDIUM")}
                                    </span>
                                    <span className={`status-badge ${String(application.status || "APPLIED").toLowerCase()}`}>
                                        {formatEnumLabel(application.status || "APPLIED")}
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default DashboardPage;

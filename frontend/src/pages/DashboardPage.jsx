import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/Client.js";

const PIPELINE_STATUS_ORDER = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"];

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
            INTERVIEW: 0,
            OFFER: 0,
            REJECTED: 0,
        };

        let activeCount = 0;
        let staleCount = 0;

        for (const application of applications) {
            const status = String(application.status || "").toUpperCase();
            const daysSinceActivity = getDaysSince(getLastActivityTimestamp(application));

            if (counts[status] !== undefined) {
                counts[status] += 1;
            }

            if (status !== "REJECTED" && status !== "OFFER") {
                activeCount += 1;
            }

            if (
                daysSinceActivity !== null &&
                daysSinceActivity >= 14 &&
                status !== "REJECTED" &&
                status !== "OFFER"
            ) {
                staleCount += 1;
            }
        }

        const total = applications.length;
        const responseRate = total > 0 ? Math.round((counts.INTERVIEW / total) * 100) : 0;
        const offerRate = total > 0 ? Math.round((counts.OFFER / total) * 100) : 0;

        return {
            total,
            activeCount,
            staleCount,
            counts,
            responseRate,
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
                value: `${metrics.responseRate}%`,
                detail: `${metrics.counts.INTERVIEW} reached interview stage`,
                tone: "warm",
            },
            {
                label: "Offer rate",
                value: `${metrics.offerRate}%`,
                detail: `${metrics.counts.OFFER} offer${metrics.counts.OFFER === 1 ? "" : "s"} received`,
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
                    daysSinceActivity !== null &&
                    daysSinceActivity >= 14 &&
                    status !== "REJECTED" &&
                    status !== "OFFER"
                );
            })
            .sort((a, b) => getLastActivityTimestamp(a) - getLastActivityTimestamp(b))
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
                    <h1 className="page-title">Keep your pipeline moving with clearer signals.</h1>
                    <p className="page-subtitle">
                        Review conversion, identify stale applications, and keep the next follow-up visible.
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
                                    <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
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
                                            <p className="dashboard-followup-title">{application.position}</p>
                                            <p className="dashboard-followup-meta">
                                                {application.fullName} • {application.status || "APPLIED"}
                                            </p>
                                        </div>
                                        <p className="dashboard-followup-age">
                                            {daysSinceActivity} day{daysSinceActivity === 1 ? "" : "s"} idle
                                        </p>
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
                                    <p className="dashboard-recent-title">{application.position}</p>
                                    <p className="dashboard-recent-meta">
                                        {application.fullName} • {formatDate(application.appliedDate || application.createdAt)}
                                    </p>
                                </div>
                                <span className={`status-badge ${String(application.status || "APPLIED").toLowerCase()}`}>
                                    {application.status || "APPLIED"}
                                </span>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default DashboardPage;

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/Client.js";

const STATUS_OPTIONS = [
    "ALL",
    "APPLIED",
    "INTERVIEW_SCHEDULED",
    "INTERVIEWED",
    "OFFER_RECEIVED",
    "REJECTED",
    "WITHDRAWN",
];
const JOB_TYPE_OPTIONS = ["ALL", "FULL_TIME", "CONTRACT", "PART_TIME", "INTERN"];
const PRIORITY_OPTIONS = ["ALL", "HIGH", "MEDIUM", "LOW"];
const SORT_OPTIONS = [
    { value: "activity-desc", label: "Latest activity" },
    { value: "created-desc", label: "Newest created" },
    { value: "created-asc", label: "Oldest created" },
    { value: "next-action-asc", label: "Next action due" },
    { value: "company-asc", label: "Company A-Z" },
    { value: "job-title-asc", label: "Job title A-Z" },
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

function ApplicationsListPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [jobTypeFilter, setJobTypeFilter] = useState("ALL");
    const [priorityFilter, setPriorityFilter] = useState("ALL");
    const [sortBy, setSortBy] = useState("activity-desc");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

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

    const overviewStats = useMemo(() => {
        const counts = {
            total: applications.length,
            interviews: 0,
            offers: 0,
            followUps: 0,
        };

        for (const application of applications) {
            const status = String(application.status || "").toUpperCase();
            const daysSinceActivity = getDaysSince(getLastActivityTimestamp(application));

            if (status === "INTERVIEW_SCHEDULED" || status === "INTERVIEWED") counts.interviews += 1;
            if (status === "OFFER_RECEIVED") counts.offers += 1;
            if (
                daysSinceActivity !== null &&
                daysSinceActivity >= 14 &&
                status !== "REJECTED" &&
                status !== "WITHDRAWN" &&
                status !== "OFFER_RECEIVED"
            ) {
                counts.followUps += 1;
            }
        }

        return [
            { label: "Total pipeline", value: counts.total, tone: "default" },
            { label: "Interview stages", value: counts.interviews, tone: "warm" },
            { label: "Offers", value: counts.offers, tone: "success" },
            { label: "Needs follow-up", value: counts.followUps, tone: "cool" },
        ];
    }, [applications]);

    const filtered = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return applications.filter((application) => {
            const status = String(application.status || "").toUpperCase();
            const jobType = String(application.jobType || "").toUpperCase();
            const priority = String(application.priority || "").toUpperCase();
            const matchesStatus = statusFilter === "ALL" || status === statusFilter;
            const matchesJobType = jobTypeFilter === "ALL" || jobType === jobTypeFilter;
            const matchesPriority = priorityFilter === "ALL" || priority === priorityFilter;
            const matchesQuery =
                !normalizedQuery ||
                String(application.companyName || "").toLowerCase().includes(normalizedQuery) ||
                String(application.jobTitle || "").toLowerCase().includes(normalizedQuery) ||
                String(application.jobLocation || "").toLowerCase().includes(normalizedQuery) ||
                String(application.recruiterName || "").toLowerCase().includes(normalizedQuery) ||
                String(application.recruiterEmail || "").toLowerCase().includes(normalizedQuery) ||
                String(application.jobUrl || "").toLowerCase().includes(normalizedQuery);

            return matchesStatus && matchesJobType && matchesPriority && matchesQuery;
        });
    }, [applications, query, statusFilter, jobTypeFilter, priorityFilter]);

    const sorted = useMemo(() => {
        const items = [...filtered];

        items.sort((left, right) => {
            switch (sortBy) {
                case "created-desc":
                    return new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime();
                case "created-asc":
                    return new Date(left.createdAt || 0).getTime() - new Date(right.createdAt || 0).getTime();
                case "company-asc":
                    return String(left.companyName || "").localeCompare(String(right.companyName || ""));
                case "job-title-asc":
                    return String(left.jobTitle || "").localeCompare(String(right.jobTitle || ""));
                case "next-action-asc": {
                    const leftDate = new Date(left.nextActionDate || "9999-12-31").getTime();
                    const rightDate = new Date(right.nextActionDate || "9999-12-31").getTime();
                    return leftDate - rightDate;
                }
                case "activity-desc":
                default:
                    return getLastActivityTimestamp(right) - getLastActivityTimestamp(left);
            }
        });

        return items;
    }, [filtered, sortBy]);

    useEffect(() => {
        setPage(1);
    }, [query, statusFilter, jobTypeFilter, priorityFilter, sortBy, pageSize]);

    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const currentPage = Math.min(page, totalPages);

    const pageNumbers = useMemo(() => {
        const numbers = [];
        const maxButtons = 5;
        let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let end = Math.min(totalPages, start + maxButtons - 1);

        if (end - start < maxButtons - 1) {
            start = Math.max(1, end - maxButtons + 1);
        }

        for (let value = start; value <= end; value += 1) {
            numbers.push(value);
        }

        return numbers;
    }, [currentPage, totalPages]);

    const pageItems = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return sorted.slice(start, start + pageSize);
    }, [sorted, currentPage, pageSize]);

    const filtersApplied =
        query.trim() !== "" || statusFilter !== "ALL" || jobTypeFilter !== "ALL" || priorityFilter !== "ALL";

    function clearFilters() {
        setQuery("");
        setStatusFilter("ALL");
        setJobTypeFilter("ALL");
        setPriorityFilter("ALL");
        setSortBy("activity-desc");
    }

    function exportCsv() {
        const rows = sorted.map((application) => ({
            id: application.id ?? "",
            companyName: application.companyName ?? "",
            jobTitle: application.jobTitle ?? "",
            jobLocation: application.jobLocation ?? "",
            status: application.status ?? "",
            priority: application.priority ?? "",
            source: application.source ?? "",
            jobType: application.jobType ?? "",
            nextAction: application.nextAction ?? "",
            nextActionDate: formatDate(application.nextActionDate),
            recruiterName: application.recruiterName ?? "",
            recruiterEmail: application.recruiterEmail ?? "",
            appliedDate: formatDate(application.appliedDate),
            salaryRange: formatSalaryRange(application),
        }));

        const headers = [
            "id",
            "companyName",
            "jobTitle",
            "jobLocation",
            "status",
            "priority",
            "source",
            "jobType",
            "nextAction",
            "nextActionDate",
            "recruiterName",
            "recruiterEmail",
            "appliedDate",
            "salaryRange",
        ];

        const escape = (value) => {
            const normalized = String(value ?? "");
            if (normalized.includes("\"") || normalized.includes(",") || normalized.includes("\n")) {
                return `"${normalized.replace(/"/g, "\"\"")}"`;
            }
            return normalized;
        };

        const csv = [
            headers.join(","),
            ...rows.map((row) => headers.map((key) => escape(row[key])).join(",")),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "applications.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }

    if (loading) {
        return (
            <div className="page">
                <section className="card">
                    <p className="page-subtitle">Loading applications...</p>
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
                    <p className="page-kicker">Applications</p>
                    <h1 className="page-title">Track each opportunity by company, source, status, and recruiter contact.</h1>
                    <p className="page-subtitle">
                        Search, filter, sort, and export your pipeline from one place.
                    </p>
                </div>
                <div className="form-actions">
                    <button
                        className="btn-outline"
                        type="button"
                        onClick={exportCsv}
                        disabled={sorted.length === 0}
                    >
                        Export CSV
                    </button>
                    <Link className="btn-primary" to="/applications/new">
                        New Application
                    </Link>
                </div>
            </header>

            <section className="applications-overview-grid">
                {overviewStats.map((stat) => (
                    <article key={stat.label} className={`applications-overview-card ${stat.tone}`}>
                        <p className="applications-overview-label">{stat.label}</p>
                        <p className="applications-overview-value">{stat.value}</p>
                    </article>
                ))}
            </section>

            <section className="card applications-toolbar-card">
                <div className="applications-toolbar-top">
                    <div>
                        <h2 className="section-title">Pipeline controls</h2>
                        <p className="page-subtitle applications-toolbar-copy">
                            Filter the list, review activity, and export a cleaner snapshot.
                        </p>
                    </div>

                    <div className="applications-results-meta">
                        <span className="applications-results-count">
                            {sorted.length} result{sorted.length === 1 ? "" : "s"}
                        </span>
                        {filtersApplied && (
                            <button className="link-button" type="button" onClick={clearFilters}>
                                Clear filters
                            </button>
                        )}
                    </div>
                </div>

                <div className="applications-filter-grid">
                    <div className="field">
                        <label className="label">Search</label>
                        <input
                            type="search"
                            className="input"
                            placeholder="Search by company, job title, location, recruiter, or URL"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label className="label">Status</label>
                        <select
                            className="input"
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                        >
                            {STATUS_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option === "ALL" ? "All statuses" : formatEnumLabel(option)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label className="label">Job type</label>
                        <select
                            className="input"
                            value={jobTypeFilter}
                            onChange={(event) => setJobTypeFilter(event.target.value)}
                        >
                            {JOB_TYPE_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option === "ALL" ? "All job types" : formatEnumLabel(option)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label className="label">Priority</label>
                        <select
                            className="input"
                            value={priorityFilter}
                            onChange={(event) => setPriorityFilter(event.target.value)}
                        >
                            {PRIORITY_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option === "ALL" ? "All priorities" : formatEnumLabel(option)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label className="label">Sort by</label>
                        <select
                            className="input"
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value)}
                        >
                            {SORT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            <section className="card applications-list-card">
                <div className="applications-list-header">
                    <div>
                        <h2 className="section-title">Application records</h2>
                        <p className="page-subtitle">
                            {pageItems.length === 0
                                ? "No applications match the current filters."
                                : "Review each record and keep your next move visible."}
                        </p>
                    </div>

                    <div className="applications-page-size">
                        <label className="label">Rows</label>
                        <select
                            className="input input-compact"
                            value={pageSize}
                            onChange={(event) => setPageSize(Number(event.target.value))}
                        >
                            {[5, 10, 20].map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {pageItems.length === 0 ? (
                    <div className="applications-empty-state">
                        <p className="applications-empty-title">No applications to show.</p>
                        <p className="page-subtitle">
                            Adjust your filters or add a new job opportunity.
                        </p>
                    </div>
                ) : (
                    <div className="applications-record-list">
                        {pageItems.map((application) => {
                            const daysSinceActivity = getDaysSince(getLastActivityTimestamp(application));

                            return (
                                <article key={application.id} className="applications-record-card">
                                    <div className="applications-record-main">
                                        <div>
                                            <Link className="applications-record-link" to={`/applications/${application.id}`}>
                                                <p className="applications-record-title">{application.jobTitle}</p>
                                            </Link>
                                            <p className="applications-record-meta">
                                                {application.companyName || "Unknown company"} • {application.jobLocation || "Location TBD"}
                                            </p>
                                        </div>
                                        <span className={`status-badge ${String(application.status || "APPLIED").toLowerCase()}`}>
                                            {formatEnumLabel(application.status || "APPLIED")}
                                        </span>
                                    </div>

                                    <div className="applications-record-grid">
                                        <div>
                                            <p className="meta-label">Priority</p>
                                            <p className="meta-value">
                                                <span className={`priority-badge ${String(application.priority || "MEDIUM").toLowerCase()}`}>
                                                    {formatEnumLabel(application.priority || "MEDIUM")}
                                                </span>
                                            </p>
                                        </div>
                                        <div>
                                            <p className="meta-label">Source</p>
                                            <p className="meta-value">{formatEnumLabel(application.source)}</p>
                                        </div>
                                        <div>
                                            <p className="meta-label">Job type</p>
                                            <p className="meta-value">{formatEnumLabel(application.jobType)}</p>
                                        </div>
                                        <div>
                                            <p className="meta-label">Recruiter</p>
                                            <p className="meta-value">{application.recruiterName || "—"}</p>
                                        </div>
                                        <div>
                                            <p className="meta-label">Applied</p>
                                            <p className="meta-value">{formatDate(application.appliedDate || application.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="meta-label">Salary</p>
                                            <p className="meta-value">{formatSalaryRange(application)}</p>
                                        </div>
                                        <div>
                                            <p className="meta-label">Next action</p>
                                            <p className="meta-value">
                                                {application.nextAction
                                                    ? `${application.nextAction}${application.nextActionDate ? ` • ${formatDate(application.nextActionDate)}` : ""}`
                                                    : "—"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="meta-label">Last activity</p>
                                            <p className="meta-value">
                                                {daysSinceActivity === null
                                                    ? "—"
                                                    : `${daysSinceActivity} day${daysSinceActivity === 1 ? "" : "s"} ago`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="applications-record-actions">
                                        <Link className="btn-outline applications-inline-button" to={`/applications/${application.id}`}>
                                            View Details
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                {pageItems.length > 0 && (
                    <div className="pagination">
                        <button
                            type="button"
                            className="btn-outline pagination-button"
                            onClick={() => setPage((value) => Math.max(1, value - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>

                        <div className="pagination-pages">
                            {pageNumbers.map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    className={`pagination-page${value === currentPage ? " is-active" : ""}`}
                                    onClick={() => setPage(value)}
                                >
                                    {value}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            className="btn-outline pagination-button"
                            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}

export default ApplicationsListPage;

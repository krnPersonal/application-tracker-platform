import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/Client.js";

const STATUS_OPTIONS = ["ALL", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"];
const WORK_TYPE_OPTIONS = ["ALL", "Remote", "Hybrid", "Onsite"];
const SORT_OPTIONS = [
    { value: "activity-desc", label: "Latest activity" },
    { value: "created-desc", label: "Newest created" },
    { value: "created-asc", label: "Oldest created" },
    { value: "name-asc", label: "Name A-Z" },
    { value: "position-asc", label: "Role A-Z" },
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

function ApplicationsListPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [workTypeFilter, setWorkTypeFilter] = useState("ALL");
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

            if (status === "INTERVIEW") counts.interviews += 1;
            if (status === "OFFER") counts.offers += 1;
            if (daysSinceActivity !== null && daysSinceActivity >= 14 && status !== "REJECTED" && status !== "OFFER") {
                counts.followUps += 1;
            }
        }

        return [
            { label: "Total pipeline", value: counts.total, tone: "default" },
            { label: "Interview stage", value: counts.interviews, tone: "warm" },
            { label: "Offers", value: counts.offers, tone: "success" },
            { label: "Needs follow-up", value: counts.followUps, tone: "cool" },
        ];
    }, [applications]);

    const filtered = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return applications.filter((application) => {
            const status = String(application.status || "").toUpperCase();
            const workType = String(application.workType || "").toLowerCase();
            const matchesStatus = statusFilter === "ALL" || status === statusFilter;
            const matchesWorkType =
                workTypeFilter === "ALL" || workType === workTypeFilter.toLowerCase();
            const matchesQuery =
                !normalizedQuery ||
                String(application.fullName || "").toLowerCase().includes(normalizedQuery) ||
                String(application.position || "").toLowerCase().includes(normalizedQuery) ||
                String(application.email || "").toLowerCase().includes(normalizedQuery) ||
                String(application.phone || "").toLowerCase().includes(normalizedQuery);

            return matchesStatus && matchesWorkType && matchesQuery;
        });
    }, [applications, query, statusFilter, workTypeFilter]);

    const sorted = useMemo(() => {
        const items = [...filtered];

        items.sort((left, right) => {
            switch (sortBy) {
                case "created-desc":
                    return new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime();
                case "created-asc":
                    return new Date(left.createdAt || 0).getTime() - new Date(right.createdAt || 0).getTime();
                case "name-asc":
                    return String(left.fullName || "").localeCompare(String(right.fullName || ""));
                case "position-asc":
                    return String(left.position || "").localeCompare(String(right.position || ""));
                case "activity-desc":
                default:
                    return getLastActivityTimestamp(right) - getLastActivityTimestamp(left);
            }
        });

        return items;
    }, [filtered, sortBy]);

    useEffect(() => {
        setPage(1);
    }, [query, statusFilter, workTypeFilter, sortBy, pageSize]);

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
        query.trim() !== "" || statusFilter !== "ALL" || workTypeFilter !== "ALL";

    function clearFilters() {
        setQuery("");
        setStatusFilter("ALL");
        setWorkTypeFilter("ALL");
        setSortBy("activity-desc");
    }

    function exportCsv() {
        const rows = sorted.map((application) => ({
            id: application.id ?? "",
            fullName: application.fullName ?? "",
            email: application.email ?? "",
            phone: application.phone ?? "",
            position: application.position ?? "",
            workType: application.workType ?? "",
            status: application.status ?? "",
            appliedDate: formatDate(application.appliedDate),
            createdAt: formatDate(application.createdAt),
        }));

        const headers = [
            "id",
            "fullName",
            "email",
            "phone",
            "position",
            "workType",
            "status",
            "appliedDate",
            "createdAt",
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
                    <h1 className="page-title">Manage your pipeline with clearer follow-up visibility.</h1>
                    <p className="page-subtitle">
                        Search, filter, sort, and export your applications from one place.
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
                            placeholder="Search by name, role, email, or phone"
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
                                    {option === "ALL" ? "All statuses" : option}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label className="label">Work type</label>
                        <select
                            className="input"
                            value={workTypeFilter}
                            onChange={(event) => setWorkTypeFilter(event.target.value)}
                        >
                            {WORK_TYPE_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option === "ALL" ? "All work types" : option}
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
                            Adjust your filters or add new application flows in the next slice.
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
                                            <p className="applications-record-title">{application.position}</p>
                                            <p className="applications-record-meta">
                                                {application.fullName} • {application.email}
                                            </p>
                                        </div>
                                        <span className={`status-badge ${String(application.status || "APPLIED").toLowerCase()}`}>
                                            {application.status || "APPLIED"}
                                        </span>
                                    </div>

                                    <div className="applications-record-grid">
                                        <div>
                                            <p className="meta-label">Phone</p>
                                            <p className="meta-value">{application.phone || "—"}</p>
                                        </div>
                                        <div>
                                            <p className="meta-label">Work type</p>
                                            <p className="meta-value">{application.workType || "—"}</p>
                                        </div>
                                        <div>
                                            <p className="meta-label">Applied</p>
                                            <p className="meta-value">{formatDate(application.appliedDate || application.createdAt)}</p>
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

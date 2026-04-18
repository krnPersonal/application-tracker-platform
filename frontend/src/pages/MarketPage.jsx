import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api/Client.js";

const FALLBACK_JOBS = [
  {
    title: "Senior Backend Engineer",
    company_name: "Northstar Cloud",
    location: "Remote / United States",
    tags: ["Backend", "Distributed Systems", "Java"],
    url: "https://www.usajobs.gov/",
    created_at: "2026-04-12T09:00:00.000Z",
  },
  {
    title: "Frontend Engineer",
    company_name: "Atlas Product Studio",
    location: "New York, NY",
    tags: ["Frontend", "React", "TypeScript"],
    url: "https://www.usajobs.gov/",
    created_at: "2026-04-13T11:30:00.000Z",
  },
  {
    title: "Platform Engineer",
    company_name: "Helio Infrastructure",
    location: "Austin, TX",
    tags: ["Platform", "Cloud", "Kubernetes"],
    url: "https://www.usajobs.gov/",
    created_at: "2026-04-11T16:15:00.000Z",
  },
  {
    title: "Software Engineer",
    company_name: "SignalPath",
    location: "Seattle, WA",
    tags: ["Engineering", "APIs", "Product"],
    url: "https://www.usajobs.gov/",
    created_at: "2026-04-10T14:45:00.000Z",
  },
  {
    title: "Data Engineer",
    company_name: "Clearbeam",
    location: "Chicago, IL",
    tags: ["Data", "Python", "ETL"],
    url: "https://www.usajobs.gov/",
    created_at: "2026-04-09T08:20:00.000Z",
  },
  {
    title: "Product Engineer",
    company_name: "Meridian Health Tech",
    location: "Remote / United States",
    tags: ["Product", "Full Stack", "React"],
    url: "https://www.usajobs.gov/",
    created_at: "2026-04-08T10:10:00.000Z",
  },
];

const DEFAULT_SEARCH_TERMS = ["Software Engineer", "Backend Engineer", "Frontend Engineer"];
const US_STATE_CODES = new Set([
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  "DC",
]);

const US_STATE_NAMES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "District of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah",
  "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming",
];

function normalizeJobs(payload) {
  const rawJobs = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.jobs)
      ? payload.jobs
      : [];

  return rawJobs
    .map((job) => ({
      title: String(job?.title || "").trim(),
      company_name: String(job?.company_name || job?.companyName || job?.company || "Unknown company").trim(),
      location: String(job?.location || "Location not specified").trim(),
      tags: Array.isArray(job?.tags) ? job.tags.filter(Boolean).slice(0, 4) : [],
      url: job?.url || job?.job_url || job?.apply_url || "https://www.usajobs.gov/",
      created_at: job?.created_at || job?.createdAt || job?.published_at || job?.publication_date || null,
    }))
    .filter((job) => job.title);
}

function isTargetRole(job) {
  const searchable = `${job.title} ${(job.tags || []).join(" ")}`.toLowerCase();
  return DEFAULT_SEARCH_TERMS.some((term) => searchable.includes(term.toLowerCase().split(" ")[0])) ||
    /engineer|engineering|developer|frontend|backend|platform|software|data|full stack|product|it specialist|information technology|cyber|security|cloud|network|sysadmin|systems/.test(searchable);
}

function isUnitedStatesRole(job) {
  const location = String(job.location || "").trim();
  const normalized = location.toLowerCase();

  if (!location) return false;
  if (/multiple locations/i.test(location)) return true;
  if (/remote\s*\/\s*(united states|usa|us)/i.test(location)) return true;
  if (/\b(united states|usa|u\.s\.|us-only|us only)\b/i.test(location)) return true;

  const parts = location.split(",").map((part) => part.trim()).filter(Boolean);
  const trailingToken = parts[parts.length - 1]?.toUpperCase();
  if (trailingToken && US_STATE_CODES.has(trailingToken)) return true;

  if (/(afb|space center|district of columbia|virginia|maryland|new mexico|mississippi|ohio|alabama|illinois|washington|colorado)/i.test(location)) {
    return true;
  }

  if (/remote/i.test(normalized) && /(new york|california|texas|illinois|washington|florida|massachusetts|colorado)/i.test(normalized)) {
    return true;
  }

  return false;
}

function formatDateLabel(value) {
  if (!value) return "Date unavailable";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Date unavailable";
  return parsed.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function daysSince(value) {
  if (!value) return 999;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 999;
  return Math.floor((Date.now() - parsed.getTime()) / (1000 * 60 * 60 * 24));
}

function getLocationBucket(location) {
  const normalized = String(location || "").trim();
  if (!normalized) return "Unknown";
  if (/remote/i.test(normalized)) return "Remote";
  if (/multiple locations/i.test(normalized)) return "Multiple Locations";

  const parts = normalized.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length > 1) {
    return parts[parts.length - 1];
  }

  if (/\b[A-Z]{2}\b/.test(normalized)) {
    return normalized.match(/\b[A-Z]{2}\b/)?.[0] || normalized;
  }

  return normalized;
}

function getHotspotCopy(bucket) {
  if (bucket === "Remote") {
    return "Remote roles in the current feed";
  }
  if (bucket === "Multiple Locations") {
    return "Openings listed across multiple locations";
  }
  if (bucket === "Unknown") {
    return "Roles with incomplete location details";
  }
  return "Current roles in this state";
}

export default function MarketPage() {
  const [jobs, setJobs] = useState(FALLBACK_JOBS);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sourceUrl, setSourceUrl] = useState("https://developer.usajobs.gov/api-reference/get-api-search");
  const [query, setQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [tagFilter, setTagFilter] = useState("ALL");
  const [freshnessFilter, setFreshnessFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  useEffect(() => {
    let ignore = false;

    async function loadMarketFeed() {
      try {
        setLoading(true);
        const payload = await apiFetch("/api/market/us-jobs");
        const normalized = normalizeJobs({ jobs: payload?.jobs })
          .filter(isTargetRole)
          .filter(isUnitedStatesRole);

        if (!normalized.length) {
          throw new Error("USAJOBS feed returned no matching US engineering roles");
        }

        if (!ignore) {
          setJobs(normalized);
          setUsingFallback(Boolean(payload?.usingFallback));
          setErrorMessage(payload?.message || "");
          setSourceUrl(payload?.sourceUrl || "https://developer.usajobs.gov/api-reference/get-api-search");
        }
      } catch (error) {
        if (!ignore) {
          setJobs(FALLBACK_JOBS);
          setUsingFallback(true);
          setErrorMessage(error instanceof Error ? error.message : "USAJOBS feed unavailable");
          setSourceUrl("https://developer.usajobs.gov/api-reference/get-api-search");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadMarketFeed();
    return () => {
      ignore = true;
    };
  }, []);

  const totalOpenings = jobs.length;
  const remoteOpenings = jobs.filter((job) => /remote/i.test(job.location)).length;
  const freshOpenings = jobs.filter((job) => daysSince(job.created_at) <= 7).length;
  const uniqueCompanies = new Set(jobs.map((job) => job.company_name)).size;

  const locationMap = jobs.reduce((acc, job) => {
    const key = /remote/i.test(job.location) ? "Remote" : job.location.split(",")[0].trim();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const hotspotEntries = Object.entries(locationMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const tagMap = jobs.reduce((acc, job) => {
    for (const tag of job.tags || []) {
      acc[tag] = (acc[tag] || 0) + 1;
    }
    return acc;
  }, {});

  const topTags = Object.entries(tagMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const signalCards = [
    {
      label: "Tracked openings",
      value: totalOpenings,
      detail: "engineering-focused roles from the current sample",
    },
    {
      label: "Remote-friendly",
      value: remoteOpenings,
      detail: "roles mentioning remote or distributed work",
    },
    {
      label: "Fresh postings",
      value: freshOpenings,
      detail: "roles posted within the last 7 days",
    },
    {
      label: "Active companies",
      value: uniqueCompanies,
      detail: "distinct employers in the current feed",
    },
  ];

  const locationOptions = useMemo(() => {
    const dynamicOptions = Array.from(new Set(jobs.map((job) => getLocationBucket(job.location))))
      .filter((option) => option === "Remote" || option === "Multiple Locations" || option === "Unknown")
      .sort((a, b) => a.localeCompare(b));

    return ["ALL", ...US_STATE_NAMES, ...dynamicOptions];
  }, [jobs]);

  const tagOptions = useMemo(() => [
    "ALL",
    ...Array.from(new Set(jobs.flatMap((job) => job.tags || []))).sort((a, b) => a.localeCompare(b)),
  ], [jobs]);

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesQuery =
        !normalizedQuery ||
        job.title.toLowerCase().includes(normalizedQuery) ||
        job.company_name.toLowerCase().includes(normalizedQuery) ||
        job.location.toLowerCase().includes(normalizedQuery) ||
        (job.tags || []).some((tag) => tag.toLowerCase().includes(normalizedQuery));

      const matchesLocation =
        locationFilter === "ALL" || getLocationBucket(job.location) === locationFilter;

      const matchesTag =
        tagFilter === "ALL" || (job.tags || []).includes(tagFilter);

      const age = daysSince(job.created_at);
      const matchesFreshness =
        freshnessFilter === "ALL" ||
        (freshnessFilter === "3" && age <= 3) ||
        (freshnessFilter === "7" && age <= 7) ||
        (freshnessFilter === "14" && age <= 14);

      return matchesQuery && matchesLocation && matchesTag && matchesFreshness;
    });
  }, [jobs, query, locationFilter, tagFilter, freshnessFilter]);

  const sortedJobs = useMemo(() => {
    const items = [...filteredJobs];

    items.sort((left, right) => {
      if (sortBy === "company") {
        return left.company_name.localeCompare(right.company_name);
      }
      if (sortBy === "title") {
        return left.title.localeCompare(right.title);
      }
      return new Date(right.created_at || 0).getTime() - new Date(left.created_at || 0).getTime();
    });

    return items;
  }, [filteredJobs, sortBy]);

  const filtersApplied =
    query.trim() !== "" ||
    locationFilter !== "ALL" ||
    tagFilter !== "ALL" ||
    freshnessFilter !== "ALL" ||
    sortBy !== "newest";

  useEffect(() => {
    setPage(1);
  }, [query, locationFilter, tagFilter, freshnessFilter, sortBy, pageSize]);

  const totalPages = Math.max(1, Math.ceil(sortedJobs.length / pageSize));
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
    return sortedJobs.slice(start, start + pageSize);
  }, [sortedJobs, currentPage, pageSize]);

  function clearFilters() {
    setQuery("");
    setLocationFilter("ALL");
    setTagFilter("ALL");
    setFreshnessFilter("ALL");
    setSortBy("newest");
  }

  return (
    <div className="page market-page">
      <section className="page-header market-header">
        <div>
          <p className="page-kicker">External market intelligence</p>
          <h1 className="page-title">Market</h1>
          <p className="page-subtitle">
            Blend your personal application data with US-only hiring signals so the app feels like a real search command center.
          </p>
        </div>
        <div className="market-status-panel">
          <p className="market-status-label">{loading ? "Refreshing feed" : usingFallback ? "Snapshot mode" : "Live feed"}</p>
          <p className="market-status-value">{usingFallback ? "Using curated US engineering sample" : "USAJOBS federal market feed connected"}</p>
          <p className="market-status-copy">
            Source:{" "}
            <a href={sourceUrl} target="_blank" rel="noreferrer">
              USAJOBS Search API
            </a>
          </p>
        </div>
      </section>

      {usingFallback && (
        <section className="market-alert">
          <strong>Live USAJOBS feed unavailable.</strong> {errorMessage || "Showing a curated US engineering sample so the page remains useful in demos and screenshots."}
        </section>
      )}

      <section className="market-signal-grid">
        {signalCards.map((card) => (
          <article key={card.label} className="market-signal-card">
            <p className="market-signal-label">{card.label}</p>
            <p className="market-signal-value">{card.value}</p>
            <p className="market-signal-detail">{card.detail}</p>
          </article>
        ))}
      </section>

      <section className="market-content-grid">
        <article className="card market-panel">
          <div className="market-panel-header">
            <div>
              <p className="page-kicker">Hiring hotspots</p>
              <h2 className="section-title">Where the activity is concentrated</h2>
            </div>
          </div>
          <div className="market-hotspot-list">
            {hotspotEntries.map(([location, count]) => (
              <div key={location} className="market-hotspot-item">
                <div>
                  <p className="market-hotspot-name">{location}</p>
                  <p className="market-hotspot-copy">{getHotspotCopy(location)}</p>
                </div>
                <span className="market-hotspot-count">{count}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="card market-panel">
          <div className="market-panel-header">
            <div>
              <p className="page-kicker">Skill demand</p>
              <h2 className="section-title">Common tags across current roles</h2>
            </div>
          </div>
          <div className="market-tag-cloud">
            {topTags.map(([tag, count]) => (
              <span key={tag} className="market-tag-chip">
                {tag}
                <strong>{count}</strong>
              </span>
            ))}
          </div>
          <p className="market-footnote">
            Use these tags to guide resume keywords, targeted applications, and the roles you prioritize next.
          </p>
        </article>
      </section>

      <section className="card market-list-card">
        <div className="market-list-header">
          <div>
            <p className="page-kicker">Live openings</p>
            <h2 className="section-title">US engineering roles to benchmark against</h2>
          </div>
          <p className="market-footnote">
            Focused on US engineering-adjacent roles that complement your tracked pipeline.
          </p>
        </div>

        <div className="market-list-controls">
          <div className="applications-toolbar-top">
            <div>
              <h2 className="section-title">Search the current market</h2>
              <p className="page-subtitle applications-toolbar-copy">
                Search the live feed, narrow by state or skill signal, and sort the roles worth tracking.
              </p>
            </div>

            <div className="applications-results-meta">
              <span className="applications-results-count">
                {sortedJobs.length} role{sortedJobs.length === 1 ? "" : "s"}
              </span>
              {filtersApplied && (
                <button className="link-button" type="button" onClick={clearFilters}>
                  Clear filters
                </button>
              )}
            </div>
          </div>

          <div className="market-filter-grid">
            <div className="field market-filter-search">
              <label className="label" htmlFor="market-query">Search roles</label>
              <input
                id="market-query"
                className="input"
                placeholder="Title, company, location, or tag"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="market-location-filter">Location</label>
              <select
                id="market-location-filter"
                className="input"
                value={locationFilter}
                onChange={(event) => setLocationFilter(event.target.value)}
              >
                {locationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "ALL" ? "All states" : option}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="label" htmlFor="market-tag-filter">Tag</label>
              <select
                id="market-tag-filter"
                className="input"
                value={tagFilter}
                onChange={(event) => setTagFilter(event.target.value)}
              >
                {tagOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "ALL" ? "All tags" : option}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="label" htmlFor="market-freshness-filter">Freshness</label>
              <select
                id="market-freshness-filter"
                className="input"
                value={freshnessFilter}
                onChange={(event) => setFreshnessFilter(event.target.value)}
              >
                <option value="ALL">Any time</option>
                <option value="3">Last 3 days</option>
                <option value="7">Last 7 days</option>
                <option value="14">Last 14 days</option>
              </select>
            </div>

            <div className="field">
              <label className="label" htmlFor="market-sort">Sort by</label>
              <select
                id="market-sort"
                className="input"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="newest">Newest first</option>
                <option value="company">Company A-Z</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>

            <div className="field">
              <label className="label" htmlFor="market-page-size">Per page</label>
              <select
                id="market-page-size"
                className="input"
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
              >
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={18}>18</option>
                <option value={24}>24</option>
              </select>
            </div>
          </div>
        </div>

        <div className="market-opening-list">
          {pageItems.map((job) => (
            <article key={`${job.company_name}-${job.title}-${job.created_at || job.location}`} className="market-opening-item">
              <div className="market-opening-main">
                <p className="market-opening-title">{job.title}</p>
                <p className="market-opening-meta">
                  <span>{job.company_name}</span>
                  <span>{job.location}</span>
                  <span>Posted {formatDateLabel(job.created_at)}</span>
                </p>
                <div className="market-opening-tags">
                  {(job.tags || []).slice(0, 4).map((tag) => (
                    <span key={tag} className="market-mini-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <a className="btn-outline market-opening-link" href={job.url} target="_blank" rel="noreferrer">
                View role
              </a>
            </article>
          ))}
          {sortedJobs.length === 0 && (
            <div className="market-empty-state">
              <p className="section-title">No roles match the current filters.</p>
              <p className="page-subtitle">Try clearing one or more filters to widen the market view.</p>
            </div>
          )}
        </div>

        {sortedJobs.length > 0 && (
          <div className="pagination">
            <button
              className="btn-outline pagination-button"
              type="button"
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
              className="btn-outline pagination-button"
              type="button"
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </section>

      <section className="market-note-grid">
        <article className="card market-note-card">
          <p className="page-kicker">How to use this page</p>
          <h2 className="section-title">Turn market signals into better applications</h2>
          <div className="market-guidance-list">
            <div className="market-guidance-item">
              Prioritize roles that match repeated tags and locations instead of applying blindly.
            </div>
            <div className="market-guidance-item">
              Update your resume language when you see recurring skills across fresh postings.
            </div>
            <div className="market-guidance-item">
              Compare your own pipeline against external demand to spot missing role types or underused markets.
            </div>
          </div>
        </article>

        <article className="card market-note-card market-note-card-accent">
          <p className="page-kicker">Professional framing</p>
          <h2 className="section-title">Why this belongs in the product</h2>
          <p className="page-subtitle">
            A portfolio app feels more credible when every navigation item supports the core workflow. Market data adds context and planning value instead of feeling experimental.
          </p>
        </article>
      </section>
    </div>
  );
}

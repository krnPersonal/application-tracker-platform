import { Link } from "react-router-dom";

const MARKET_ROLES = [
  {
    title: "Senior Backend Engineer",
    company: "Northstar Cloud",
    location: "Remote / United States",
    freshness: "Posted 2 days ago",
    tags: ["Java", "Distributed Systems", "Platform"],
    source: "Company Website",
  },
  {
    title: "Frontend Engineer",
    company: "Atlas Product Studio",
    location: "New York, NY",
    freshness: "Posted 3 days ago",
    tags: ["React", "TypeScript", "Design Systems"],
    source: "LinkedIn",
  },
  {
    title: "Platform Engineer",
    company: "Helio Infrastructure",
    location: "Austin, TX",
    freshness: "Posted 5 days ago",
    tags: ["Cloud", "Kubernetes", "Reliability"],
    source: "Referral",
  },
  {
    title: "Data Engineer",
    company: "Clearbeam",
    location: "Chicago, IL",
    freshness: "Posted 1 day ago",
    tags: ["Python", "ETL", "Analytics"],
    source: "Indeed",
  },
  {
    title: "Product Engineer",
    company: "Meridian Health Tech",
    location: "Remote / United States",
    freshness: "Posted today",
    tags: ["Full Stack", "React", "APIs"],
    source: "Company Website",
  },
  {
    title: "Software Engineer",
    company: "SignalPath",
    location: "Seattle, WA",
    freshness: "Posted 4 days ago",
    tags: ["Backend", "Product", "Node.js"],
    source: "LinkedIn",
  },
];

const SIGNAL_CARDS = [
  {
    label: "Tracked openings",
    value: "48",
    detail: "Roles worth watching this week across remote and city-based teams.",
  },
  {
    label: "Remote-friendly",
    value: "21",
    detail: "Openings explicitly offering distributed or hybrid flexibility.",
  },
  {
    label: "Fresh postings",
    value: "13",
    detail: "New roles surfaced in the last 7 days and worth acting on quickly.",
  },
  {
    label: "Company mix",
    value: "18",
    detail: "Distinct employers represented across product, platform, and data.",
  },
];

const HOTSPOTS = [
  { label: "Remote", value: "21 openings", tone: "primary" },
  { label: "New York", value: "8 openings", tone: "warm" },
  { label: "Austin", value: "6 openings", tone: "success" },
  { label: "Seattle", value: "5 openings", tone: "cool" },
];

const THEMES = [
  { label: "Platform & Infra", value: "Most resilient demand", note: "Kubernetes, reliability, internal tooling" },
  { label: "Frontend UX", value: "Strong mid-market pull", note: "React, performance, design systems" },
  { label: "Data & AI", value: "Growing but more selective", note: "Pipelines, analytics, product data" },
];

function MarketPage() {
  return (
    <div className="page market-page">
      <header className="page-header market-header">
        <div>
          <p className="page-kicker">Market</p>
          <h1 className="page-title">Read the job market before you chase it.</h1>
          <p className="page-subtitle">
            Use external market signals to decide where to focus, which roles are moving quickly,
            and what patterns are actually showing up across engineering openings.
          </p>
        </div>

        <div className="market-status-panel">
          <p className="market-status-label">Signal mode</p>
          <p className="market-status-value">Curated engineering market snapshot</p>
          <p className="market-status-copy">
            A focused surface for trend watching now, with live feed integration available in a later slice.
          </p>
        </div>
      </header>

      <section className="market-signal-grid">
        {SIGNAL_CARDS.map((card) => (
          <article key={card.label} className="market-signal-card">
            <p className="market-signal-label">{card.label}</p>
            <p className="market-signal-value">{card.value}</p>
            <p className="market-signal-detail">{card.detail}</p>
          </article>
        ))}
      </section>

      <section className="market-content-grid">
        <article className="card market-panel">
          <div className="section-heading">
            <div>
              <h2 className="section-title">Hiring hotspots</h2>
              <p className="page-subtitle">Locations and work patterns showing the strongest current pull.</p>
            </div>
          </div>

          <div className="market-hotspot-list">
            {HOTSPOTS.map((item) => (
              <div key={item.label} className={`market-hotspot-item ${item.tone}`}>
                <div>
                  <p className="market-hotspot-label">{item.label}</p>
                  <p className="market-hotspot-value">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="card market-panel market-panel-dark">
          <div className="section-heading">
            <div>
              <h2 className="section-title">What is moving now</h2>
              <p className="page-subtitle">Themes worth leaning into before your next application batch.</p>
            </div>
          </div>

          <div className="market-theme-list">
            {THEMES.map((theme) => (
              <div key={theme.label} className="market-theme-item">
                <p className="market-theme-label">{theme.label}</p>
                <p className="market-theme-value">{theme.value}</p>
                <p className="market-theme-note">{theme.note}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="card market-role-panel">
        <div className="section-heading">
          <div>
            <h2 className="section-title">Roles worth tracking</h2>
            <p className="page-subtitle">A curated view of the kinds of engineering openings your pipeline can target next.</p>
          </div>

          <Link className="btn-outline" to="/applications/new">
            Add New Application
          </Link>
        </div>

        <div className="market-role-grid">
          {MARKET_ROLES.map((role) => (
            <article key={`${role.company}-${role.title}`} className="market-role-card">
              <div className="market-role-top">
                <div>
                  <p className="market-role-title">{role.title}</p>
                  <p className="market-role-company">{role.company}</p>
                </div>
                <span className="market-role-source">{role.source}</span>
              </div>

              <p className="market-role-meta">
                {role.location} • {role.freshness}
              </p>

              <div className="market-tag-list">
                {role.tags.map((tag) => (
                  <span key={tag} className="market-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default MarketPage;

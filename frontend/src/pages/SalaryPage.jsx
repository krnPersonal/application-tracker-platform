import { useState } from "react";

const BASELINE_SALARY = 133080;

const LOCATION_OPTIONS = [
  { value: "US", label: "United States average", multiplier: 1, marketLabel: "National baseline" },
  { value: "REMOTE", label: "Remote / national market", multiplier: 1.04, marketLabel: "Remote market" },
  { value: "AL", label: "Alabama", multiplier: 0.86, marketLabel: "Lower-cost market" },
  { value: "AK", label: "Alaska", multiplier: 1.02, marketLabel: "Specialized market" },
  { value: "AZ", label: "Arizona", multiplier: 0.99, marketLabel: "Growth market" },
  { value: "AR", label: "Arkansas", multiplier: 0.82, marketLabel: "Lower-cost market" },
  { value: "CA", label: "California", multiplier: 1.27, marketLabel: "Premium tech market" },
  { value: "CO", label: "Colorado", multiplier: 1.08, marketLabel: "Strong tech market" },
  { value: "CT", label: "Connecticut", multiplier: 1.08, marketLabel: "Higher-wage market" },
  { value: "DE", label: "Delaware", multiplier: 1.01, marketLabel: "Finance-adjacent market" },
  { value: "DC", label: "District of Columbia", multiplier: 1.2, marketLabel: "Federal tech market" },
  { value: "FL", label: "Florida", multiplier: 0.98, marketLabel: "Growth market" },
  { value: "GA", label: "Georgia", multiplier: 1.02, marketLabel: "Atlanta tech market" },
  { value: "HI", label: "Hawaii", multiplier: 0.96, marketLabel: "Specialized market" },
  { value: "ID", label: "Idaho", multiplier: 0.9, marketLabel: "Emerging market" },
  { value: "IL", label: "Illinois", multiplier: 1.04, marketLabel: "Chicago tech market" },
  { value: "IN", label: "Indiana", multiplier: 0.88, marketLabel: "Midwest market" },
  { value: "IA", label: "Iowa", multiplier: 0.88, marketLabel: "Midwest market" },
  { value: "KS", label: "Kansas", multiplier: 0.87, marketLabel: "Midwest market" },
  { value: "KY", label: "Kentucky", multiplier: 0.85, marketLabel: "Lower-cost market" },
  { value: "LA", label: "Louisiana", multiplier: 0.84, marketLabel: "Lower-cost market" },
  { value: "ME", label: "Maine", multiplier: 0.9, marketLabel: "Smaller tech market" },
  { value: "MD", label: "Maryland", multiplier: 1.13, marketLabel: "Federal tech market" },
  { value: "MA", label: "Massachusetts", multiplier: 1.18, marketLabel: "Premium tech market" },
  { value: "MI", label: "Michigan", multiplier: 0.96, marketLabel: "Industrial tech market" },
  { value: "MN", label: "Minnesota", multiplier: 1.02, marketLabel: "Stable tech market" },
  { value: "MS", label: "Mississippi", multiplier: 0.78, marketLabel: "Lower-cost market" },
  { value: "MO", label: "Missouri", multiplier: 0.92, marketLabel: "Midwest market" },
  { value: "MT", label: "Montana", multiplier: 0.86, marketLabel: "Smaller tech market" },
  { value: "NE", label: "Nebraska", multiplier: 0.88, marketLabel: "Midwest market" },
  { value: "NV", label: "Nevada", multiplier: 0.96, marketLabel: "Growth market" },
  { value: "NH", label: "New Hampshire", multiplier: 1.02, marketLabel: "Northeast market" },
  { value: "NJ", label: "New Jersey", multiplier: 1.15, marketLabel: "NY-adjacent market" },
  { value: "NM", label: "New Mexico", multiplier: 0.88, marketLabel: "Specialized market" },
  { value: "NY", label: "New York", multiplier: 1.2, marketLabel: "Premium tech market" },
  { value: "NC", label: "North Carolina", multiplier: 1.02, marketLabel: "Research Triangle market" },
  { value: "ND", label: "North Dakota", multiplier: 0.86, marketLabel: "Smaller tech market" },
  { value: "OH", label: "Ohio", multiplier: 0.93, marketLabel: "Midwest market" },
  { value: "OK", label: "Oklahoma", multiplier: 0.84, marketLabel: "Lower-cost market" },
  { value: "OR", label: "Oregon", multiplier: 1.08, marketLabel: "West Coast market" },
  { value: "PA", label: "Pennsylvania", multiplier: 0.99, marketLabel: "Northeast market" },
  { value: "RI", label: "Rhode Island", multiplier: 0.98, marketLabel: "Northeast market" },
  { value: "SC", label: "South Carolina", multiplier: 0.86, marketLabel: "Lower-cost market" },
  { value: "SD", label: "South Dakota", multiplier: 0.82, marketLabel: "Smaller tech market" },
  { value: "TN", label: "Tennessee", multiplier: 0.94, marketLabel: "Growth market" },
  { value: "TX", label: "Texas", multiplier: 1.07, marketLabel: "Major tech market" },
  { value: "UT", label: "Utah", multiplier: 1.01, marketLabel: "Growth tech market" },
  { value: "VT", label: "Vermont", multiplier: 0.9, marketLabel: "Smaller tech market" },
  { value: "VA", label: "Virginia", multiplier: 1.13, marketLabel: "Federal tech market" },
  { value: "WA", label: "Washington", multiplier: 1.24, marketLabel: "Premium tech market" },
  { value: "WV", label: "West Virginia", multiplier: 0.78, marketLabel: "Lower-cost market" },
  { value: "WI", label: "Wisconsin", multiplier: 0.92, marketLabel: "Midwest market" },
  { value: "WY", label: "Wyoming", multiplier: 0.84, marketLabel: "Smaller tech market" },
];

const EXPERIENCE_OPTIONS = [
  {
    value: "0-1",
    label: "0-1 years",
    multiplier: 0.82,
    marketLabel: "Entry-level",
  },
  {
    value: "2-4",
    label: "2-4 years",
    multiplier: 0.96,
    marketLabel: "Early career",
  },
  {
    value: "5-7",
    label: "5-7 years",
    multiplier: 1.08,
    marketLabel: "Mid-level",
  },
  {
    value: "8-10",
    label: "8-10 years",
    multiplier: 1.2,
    marketLabel: "Senior",
  },
  {
    value: "10+",
    label: "10+ years",
    multiplier: 1.34,
    marketLabel: "Staff / lead",
  },
];

const SKILL_GROUPS = [
  {
    title: "Languages",
    items: [
      { label: "Java", impact: 0.04 },
      { label: "Python", impact: 0.04 },
      { label: "JavaScript", impact: 0.02 },
      { label: "TypeScript", impact: 0.03 },
      { label: "Go", impact: 0.05 },
      { label: "C#", impact: 0.035 },
      { label: "Ruby", impact: 0.025 },
      { label: "Rust", impact: 0.055 },
      { label: "Scala", impact: 0.05 },
    ],
  },
  {
    title: "Databases",
    items: [
      { label: "PostgreSQL", impact: 0.02 },
      { label: "MySQL", impact: 0.015 },
      { label: "MongoDB", impact: 0.02 },
      { label: "Redis", impact: 0.02 },
      { label: "SQL Server", impact: 0.02 },
      { label: "Oracle", impact: 0.025 },
      { label: "DynamoDB", impact: 0.025 },
      { label: "Elasticsearch", impact: 0.03 },
    ],
  },
  {
    title: "Frameworks & Platform",
    items: [
      { label: "Spring Boot", impact: 0.04 },
      { label: "React", impact: 0.03 },
      { label: "Angular", impact: 0.025 },
      { label: "Vue", impact: 0.02 },
      { label: "Node.js", impact: 0.025 },
      { label: "Next.js", impact: 0.025 },
      { label: "GraphQL", impact: 0.025 },
      { label: "Microservices", impact: 0.04 },
    ],
  },
  {
    title: "Cloud & Delivery",
    items: [
      { label: "AWS", impact: 0.05 },
      { label: "Azure", impact: 0.04 },
      { label: "GCP", impact: 0.04 },
      { label: "Docker", impact: 0.03 },
      { label: "Kubernetes", impact: 0.05 },
      { label: "Terraform", impact: 0.04 },
      { label: "Kafka", impact: 0.035 },
      { label: "CI/CD", impact: 0.025 },
    ],
  },
  {
    title: "Security & Data",
    items: [
      { label: "Cybersecurity", impact: 0.04 },
      { label: "Machine Learning", impact: 0.05 },
      { label: "Data Engineering", impact: 0.04 },
      { label: "Observability", impact: 0.03 },
      { label: "System Design", impact: 0.035 },
      { label: "API Design", impact: 0.025 },
    ],
  },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function SalaryPage() {
  const [experienceBand, setExperienceBand] = useState("5-7");
  const [location, setLocation] = useState("US");
  const [selectedSkills, setSelectedSkills] = useState(["Java", "Spring Boot", "React", "PostgreSQL"]);

  const selectedExperience = EXPERIENCE_OPTIONS.find((option) => option.value === experienceBand) || EXPERIENCE_OPTIONS[2];
  const selectedLocation = LOCATION_OPTIONS.find((option) => option.value === location) || LOCATION_OPTIONS[0];
  const skillImpact = SKILL_GROUPS.flatMap((group) => group.items)
    .filter((item) => selectedSkills.includes(item.label))
    .reduce((total, item) => total + item.impact, 0);

  const adjustedSkillImpact = Math.min(skillImpact, 0.22);
  const locationAdjustedBaseline = Math.round(BASELINE_SALARY * selectedLocation.multiplier);
  const experienceAdjustedEstimate = Math.round(locationAdjustedBaseline * selectedExperience.multiplier);
  const estimate = Math.round(experienceAdjustedEstimate * (1 + adjustedSkillImpact));
  const lowerBound = Math.round(estimate * 0.9);
  const upperBound = Math.round(estimate * 1.12);

  function toggleSkill(label) {
    setSelectedSkills((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
  }

  return (
    <div className="page salary-page">
      <section className="page-header">
        <div>
          <p className="page-kicker">US salary benchmark</p>
          <h1 className="page-title">Salary</h1>
          <p className="page-subtitle">
            Estimate a current US developer salary range using location, experience, and stack signals.
            This is a guided benchmark, not a compensation guarantee.
          </p>
        </div>

        <div className="salary-source-panel">
          <p className="salary-source-label">Baseline</p>
          <p className="salary-source-value">{formatCurrency(BASELINE_SALARY)}</p>
          <p className="salary-source-copy">
            Based on the recent US software developer pay baseline from the Bureau of Labor Statistics,
            then adjusted by location, experience, and selected skills.
          </p>
          <a
            className="salary-source-link"
            href="https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm"
            target="_blank"
            rel="noreferrer"
          >
            View BLS reference
          </a>
        </div>
      </section>

      <section className="salary-layout">
        <article className="card salary-config-card">
          <div className="salary-config-header">
            <div>
              <p className="page-kicker">Estimator inputs</p>
              <h2 className="section-title">Shape the profile</h2>
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="location-market">Location / market</label>
            <select
              id="location-market"
              className="input"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            >
              {LOCATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="helper-text">
              Location adjusts the BLS national baseline before experience and skills are applied.
            </p>
          </div>

          <div className="field">
            <label className="label" htmlFor="experience-band">Years of experience</label>
            <select
              id="experience-band"
              className="input"
              value={experienceBand}
              onChange={(event) => setExperienceBand(event.target.value)}
            >
              {EXPERIENCE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="salary-skill-groups">
            {SKILL_GROUPS.map((group) => (
              <section key={group.title} className="salary-skill-group">
                <div className="salary-skill-group-header">
                  <p className="salary-skill-group-title">{group.title}</p>
                  <p className="salary-skill-group-copy">Choose every stack area that fits the target role.</p>
                </div>

                <div className="salary-chip-grid">
                  {group.items.map((item) => {
                    const isActive = selectedSkills.includes(item.label);
                    return (
                      <button
                        key={item.label}
                        type="button"
                        className={`salary-chip${isActive ? " is-active" : ""}`}
                        onClick={() => toggleSkill(item.label)}
                      >
                        <span>{item.label}</span>
                        <strong>+{Math.round(item.impact * 100)}%</strong>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </article>

        <aside className="salary-results-stack">
          <article className="salary-estimate-card">
            <p className="salary-estimate-label">Estimated US salary</p>
            <p className="salary-estimate-value">{formatCurrency(estimate)}</p>
            <p className="salary-estimate-range">
              Typical range: {formatCurrency(lowerBound)} to {formatCurrency(upperBound)}
            </p>
          </article>

          <article className="card salary-breakdown-card">
            <div className="salary-breakdown-grid">
              <div className="salary-breakdown-item">
                <p className="salary-breakdown-label">Location market</p>
                <p className="salary-breakdown-value">{selectedLocation.marketLabel}</p>
              </div>
              <div className="salary-breakdown-item">
                <p className="salary-breakdown-label">Location adjustment</p>
                <p className="salary-breakdown-value">
                  {selectedLocation.multiplier >= 1 ? "+" : "-"}
                  {Math.abs(Math.round((selectedLocation.multiplier - 1) * 100))}%
                </p>
              </div>
              <div className="salary-breakdown-item">
                <p className="salary-breakdown-label">Experience band</p>
                <p className="salary-breakdown-value">{selectedExperience.marketLabel}</p>
              </div>
              <div className="salary-breakdown-item">
                <p className="salary-breakdown-label">Selected skills</p>
                <p className="salary-breakdown-value">{selectedSkills.length}</p>
              </div>
              <div className="salary-breakdown-item">
                <p className="salary-breakdown-label">Skill uplift</p>
                <p className="salary-breakdown-value">+{Math.round(adjustedSkillImpact * 100)}%</p>
              </div>
              <div className="salary-breakdown-item">
                <p className="salary-breakdown-label">Benchmark model</p>
                <p className="salary-breakdown-value">US developer baseline</p>
              </div>
            </div>
          </article>

          <article className="card salary-breakdown-card">
            <p className="page-kicker">Calculation model</p>
            <h2 className="section-title">How this estimate changes</h2>
            <div className="salary-guidance-list">
              <div className="salary-guidance-item">
                Start with the BLS software developer median: {formatCurrency(BASELINE_SALARY)}.
              </div>
              <div className="salary-guidance-item">
                Apply location: {selectedLocation.label} moves the baseline to {formatCurrency(locationAdjustedBaseline)}.
              </div>
              <div className="salary-guidance-item">
                Apply experience: {selectedExperience.label} moves it to {formatCurrency(experienceAdjustedEstimate)}.
              </div>
              <div className="salary-guidance-item">
                Apply selected skills/tools: +{Math.round(adjustedSkillImpact * 100)}%, capped at 22% to avoid unrealistic stacking.
              </div>
            </div>
          </article>

          <article className="card salary-guidance-card">
            <p className="page-kicker">How to use it</p>
            <h2 className="section-title">Use this as a benchmark, not a promise</h2>
            <div className="salary-guidance-list">
              <div className="salary-guidance-item">
                Compare the estimate to the salary fields in your tracked applications.
              </div>
              <div className="salary-guidance-item">
                Adjust the selected stack to reflect the role you are targeting, not just your resume.
              </div>
              <div className="salary-guidance-item">
                Use the range to decide whether a posting is below-market, on-market, or stretch compensation.
              </div>
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}

export default SalaryPage;

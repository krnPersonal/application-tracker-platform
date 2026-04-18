import { useEffect, useState } from "react";

import { apiFetch } from "../api/Client";

const LOCATION_OPTIONS = [
  { value: "US", label: "National average" },
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "DC", label: "District of Columbia" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
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
  if (value == null || Number.isNaN(value)) {
    return "Loading";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function SalaryPage() {
  const [location, setLocation] = useState("US");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [experienceBand, setExperienceBand] = useState("5-7");
  const [selectedSkills, setSelectedSkills] = useState(["Java", "Spring Boot", "React", "PostgreSQL"]);
  const [benchmark, setBenchmark] = useState(null);
  const [isLoadingBenchmark, setIsLoadingBenchmark] = useState(true);
  const [benchmarkError, setBenchmarkError] = useState("");
  const [zipLocation, setZipLocation] = useState(null);
  const [isLookingUpZip, setIsLookingUpZip] = useState(false);
  const [zipError, setZipError] = useState("");

  const selectedExperience = EXPERIENCE_OPTIONS.find((option) => option.value === experienceBand) || EXPERIENCE_OPTIONS[2];
  const selectedLocation = LOCATION_OPTIONS.find((option) => option.value === location) || LOCATION_OPTIONS[0];
  const isNationalAverage = location === "US";
  const locationLabel = city.trim() ? `${city.trim()}, ${selectedLocation.label}` : selectedLocation.label;
  const baselineSalary = benchmark?.annualSalary ?? null;
  const metroAreaCode = zipLocation?.metroAreaCode || "";
  const metroAreaName = zipLocation?.metroAreaName || "";
  const skillImpact = SKILL_GROUPS.flatMap((group) => group.items)
    .filter((item) => selectedSkills.includes(item.label))
    .reduce((total, item) => total + item.impact, 0);

  const adjustedSkillImpact = Math.min(skillImpact, 0.22);
  const experienceAdjustedEstimate = baselineSalary == null
    ? null
    : Math.round(baselineSalary * selectedExperience.multiplier);
  const estimate = experienceAdjustedEstimate == null
    ? null
    : Math.round(experienceAdjustedEstimate * (1 + adjustedSkillImpact));
  const lowerBound = estimate == null ? null : Math.round(estimate * 0.9);
  const upperBound = estimate == null ? null : Math.round(estimate * 1.12);
  const sourceStatus = benchmark?.usingFallback
    ? "Fallback benchmark"
    : isLoadingBenchmark
      ? "Loading BLS data"
      : "Live BLS benchmark";

  useEffect(() => {
    const controller = new AbortController();
    setIsLoadingBenchmark(true);
    setBenchmarkError("");

    const params = new URLSearchParams({
      location,
      metroAreaCode,
      metroAreaName,
    });

    apiFetch(`/api/salary/software-developer-benchmark?${params.toString()}`, {
      signal: controller.signal,
    })
      .then((payload) => {
        setBenchmark(payload);
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setBenchmark(null);
        setBenchmarkError("Salary benchmark is unavailable. Showing the last known US baseline.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoadingBenchmark(false);
        }
      });

    return () => controller.abort();
  }, [location, metroAreaCode, metroAreaName]);

  useEffect(() => {
    const controller = new AbortController();

    if (isNationalAverage || zipCode.length === 0) {
      setZipLocation(null);
      setZipError("");
      setIsLookingUpZip(false);
      return () => controller.abort();
    }

    if (zipCode.length < 5) {
      setZipLocation(null);
      setZipError("Enter 5 digits to validate ZIP and auto-fill city.");
      setIsLookingUpZip(false);
      return () => controller.abort();
    }

    setIsLookingUpZip(true);
    setZipError("");

    apiFetch(`/api/salary/zip-location?zipCode=${encodeURIComponent(zipCode)}&stateCode=${encodeURIComponent(location)}`, {
      signal: controller.signal,
    })
      .then((payload) => {
        if (!payload?.valid) {
          setZipLocation(null);
          setZipError(payload?.message || "ZIP code could not be validated.");
          return;
        }

        setZipLocation(payload);
        setCity(payload.city || "");
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setZipLocation(null);
        setZipError("ZIP lookup is unavailable right now. Select a state manually.");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLookingUpZip(false);
        }
      });

    return () => controller.abort();
  }, [isNationalAverage, location, zipCode]);

  useEffect(() => {
    const controller = new AbortController();
    const normalizedCity = city.trim();

    if (isNationalAverage || zipCode.length === 5 || normalizedCity.length < 3) {
      return () => controller.abort();
    }

    const timeoutId = window.setTimeout(() => {
      apiFetch(`/api/salary/city-location?city=${encodeURIComponent(normalizedCity)}&stateCode=${encodeURIComponent(location)}`, {
        signal: controller.signal,
      })
        .then((payload) => {
          if (!payload?.valid) {
            setZipLocation(null);
            return;
          }
          setZipLocation(payload);
        })
        .catch((error) => {
          if (error.name === "AbortError") return;
          setZipLocation(null);
        });
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [city, isNationalAverage, location, zipCode]);

  function toggleSkill(label) {
    setSelectedSkills((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
  }

  function handleStateChange(value) {
    setLocation(value);
    setCity("");
    setZipCode("");
    setZipLocation(null);
    setZipError("");
  }

  function handleZipCodeChange(value) {
    setZipCode(value.replace(/\D/g, "").slice(0, 5));
  }

  function handleCityChange(value) {
    if (isNationalAverage) return;
    setCity(value);
    setZipLocation(null);
  }

  return (
    <div className="page salary-page">
      <section className="page-header">
        <div>
          <p className="page-kicker">US salary benchmark</p>
          <h1 className="page-title">Salary</h1>
          <p className="page-subtitle">
            Estimate a current developer salary range using BLS wage data, city/metro context,
            experience, and stack signals. This is a guided benchmark, not a compensation guarantee.
          </p>
        </div>

        <div className="salary-source-panel">
          <p className="salary-source-label">{sourceStatus}</p>
          <p className="salary-source-value">{formatCurrency(baselineSalary)}</p>
          <p className="salary-source-copy">
            {benchmark
              ? `${benchmark.locationLabel} ${benchmark.geographyLevel?.toLowerCase() || "area"} ${benchmark.occupation} wage benchmark from ${benchmark.sourceName}${benchmark.year ? ` (${benchmark.year})` : ""}.${city.trim() ? ` City context: ${city.trim()}.` : ""}`
              : "Based on the last known software developer wage benchmark, then adjusted by experience and selected skills."}
          </p>
          {benchmark?.hourlyWage ? (
            <p className="salary-source-copy">
              API hourly wage: ${benchmark.hourlyWage.toFixed(2)} x 2,080 hours.
            </p>
          ) : null}
          {benchmark?.message || benchmarkError ? (
            <p className="salary-source-copy">{benchmark?.message || benchmarkError}</p>
          ) : null}
          <a
            className="salary-source-link"
            href={benchmark?.sourceUrl || "https://api.bls.gov/publicAPI/v2/timeseries/data/"}
            target="_blank"
            rel="noreferrer"
          >
            View BLS API
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
            <label className="label" htmlFor="salary-location">State</label>
            <select
              id="salary-location"
              className="input"
              value={location}
              onChange={(event) => handleStateChange(event.target.value)}
            >
              {LOCATION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="helper-text">
              Select a state to unlock ZIP and city-level metro salary lookup.
            </p>
          </div>

          <div className="field">
            <label className="label" htmlFor="salary-zip-code">ZIP code</label>
            <input
              id="salary-zip-code"
              className="input"
              inputMode="numeric"
              maxLength={5}
              placeholder="Example: 75201"
              value={zipCode}
              disabled={isNationalAverage}
              onChange={(event) => handleZipCodeChange(event.target.value)}
            />
            <p className="helper-text">
              {isNationalAverage
                ? "Select a state to unlock ZIP validation."
                : isLookingUpZip
                  ? "Validating ZIP and filling city/state..."
                  : zipLocation
                    ? `Detected ${zipLocation.city}, ${zipLocation.state}.${zipLocation.metroAreaName ? ` Metro benchmark: ${zipLocation.metroAreaName}.` : " State benchmark will be used."}`
                    : zipError || "Optional: enter ZIP to auto-fill city. ZIP must belong to the selected state."}
            </p>
          </div>

          <div className="field">
            <label className="label" htmlFor="salary-city">City</label>
            <input
              id="salary-city"
              className="input"
              placeholder="Optional city"
              value={city}
              disabled={isNationalAverage}
              onChange={(event) => handleCityChange(event.target.value)}
            />
            <p className="helper-text">
              {isNationalAverage
                ? "Select a state to unlock city context."
                : zipLocation?.metroAreaName
                  ? `City resolved to ${zipLocation.metroAreaName}; salary will use metro data when BLS has it.`
                  : "City can resolve to metro salary data when available; otherwise state data is used."}
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
            <p className="salary-estimate-label">Estimated salary in {locationLabel}</p>
            <p className="salary-estimate-value">{formatCurrency(estimate)}</p>
            <p className="salary-estimate-range">
              Typical range: {formatCurrency(lowerBound)} to {formatCurrency(upperBound)}
            </p>
          </article>

          <article className="card salary-breakdown-card">
            <div className="salary-breakdown-grid">
              <div className="salary-breakdown-item">
                <p className="salary-breakdown-label">Location baseline</p>
                <p className="salary-breakdown-value">{benchmark?.locationLabel || selectedLocation.label}</p>
              </div>
              <div className="salary-breakdown-item">
                <p className="salary-breakdown-label">Geography level</p>
                <p className="salary-breakdown-value">{benchmark?.geographyLevel || "National"}</p>
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
                <p className="salary-breakdown-value">
                  {benchmark?.usingFallback ? "Fallback + profile" : `${benchmark?.geographyLevel || "BLS"} API + profile`}
                </p>
              </div>
            </div>
          </article>

          <article className="card salary-breakdown-card">
            <p className="page-kicker">Calculation model</p>
            <h2 className="section-title">How this estimate changes</h2>
            <div className="salary-guidance-list">
              <div className="salary-guidance-item">
                Start with the BLS benchmark for {benchmark?.locationLabel || selectedLocation.label}: {formatCurrency(baselineSalary)}.
              </div>
              <div className="salary-guidance-item">
                Apply experience: {selectedExperience.label} moves it to {formatCurrency(experienceAdjustedEstimate)}.
              </div>
              <div className="salary-guidance-item">
                Apply selected skills/tools: +{Math.round(adjustedSkillImpact * 100)}%, capped at 22% to avoid unrealistic stacking.
              </div>
              <div className="salary-guidance-item">
                Skill percentages are transparent estimates; public free APIs do not provide reliable per-skill salary uplift.
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
                Use ZIP or city to resolve metro wage data when BLS and Census have a match.
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

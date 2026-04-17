import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

function HomePage() {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        async function loadLandingContent() {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${API_BASE}/api/public/landing`);
                if (!response.ok) {
                    throw new Error("Failed to load landing content");
                }

                const data = await response.json();
                if (!ignore) {
                    setContent(data);
                }
            } catch (err) {
                if (!ignore) {
                    setError(err.message || "Something went wrong");
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadLandingContent();

        return () => {
            ignore = true;
        };
    }, []);

    if (loading) {
        return (
            <div className="page landing-page">
                <section className="landing-shell">
                    <p className="landing-status">Loading landing page...</p>
                </section>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page landing-page">
                <section className="landing-shell">
                    <p className="landing-status landing-status-error">{error}</p>
                </section>
            </div>
        );
    }

    return (
        <div className="page landing-page">
            <section className="landing-hero">
                <div className="landing-copy">
                    <p className="landing-kicker">{content.eyebrow}</p>
                    <h1 className="landing-title">{content.title}</h1>
                    <p className="landing-subtitle">{content.subtitle}</p>

                    <div className="landing-actions">
                        <Link className="btn-primary" to="/login">
                            Explore the app
                        </Link>
                        <a
                            className="btn-outline"
                            href={`${API_BASE}/swagger-ui.html`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            View API docs
                        </a>
                    </div>

                    <div className="landing-demo-card">
                        <p className="landing-demo-label">Local demo account</p>
                        <p className="landing-demo-value">{content.demoAccount.email}</p>
                        <p className="landing-demo-value">{content.demoAccount.password}</p>
                    </div>
                </div>

                <div className="landing-visual">
                    <div className="landing-panel landing-panel-primary">
                        <p className="landing-panel-kicker">Overview</p>
                        <p className="landing-panel-value">Page 1 complete</p>
                        <p className="landing-panel-copy">
                            Public content is being served from Spring Boot and rendered by React.
                        </p>
                    </div>

                    <div className="landing-panel landing-panel-secondary">
                        <p className="landing-panel-kicker">Workflow</p>
                        <p className="landing-panel-list">
                            Landing Page → Login → Dashboard → Applications
                        </p>
                    </div>

                    <div className="landing-stack">
                        {content.stack.map((item) => (
                            <span key={item} className="landing-stack-chip">
                {item}
              </span>
                        ))}
                    </div>
                </div>
            </section>

            <section className="landing-feature-grid">
                {content.features.map((card) => (
                    <article key={card.title} className="landing-feature-card">
                        <h2 className="section-title">{card.title}</h2>
                        <p className="page-subtitle">{card.copy}</p>
                    </article>
                ))}
            </section>

            <section className="landing-showcase-grid">
                <article className="landing-showcase-card">
                    <div className="landing-showcase-header">
                        <div>
                            <p className="landing-kicker">Demo-ready views</p>
                            <h2 className="section-title">Built to present well in screenshots</h2>
                        </div>
                    </div>

                    <div className="landing-showcase-strip">
                        {content.showcase.map((item) => (
                            <div key={item.label} className="landing-showcase-item">
                                <p className="landing-showcase-label">{item.label}</p>
                                <p className="landing-showcase-value">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="landing-about-card">
                    <p className="landing-kicker">About this project</p>
                    <h2 className="section-title">A portfolio project with product and engineering depth.</h2>
                    <p className="page-subtitle">
                        The goal was not just to CRUD data. It was to build something that looks like a real
                        product, supports a believable workflow, and shows decisions across frontend UX and
                        backend architecture.
                    </p>
                    <div className="landing-about-list">
                        {content.about.map((item) => (
                            <div key={item} className="landing-about-item">
                                {item}
                            </div>
                        ))}
                    </div>
                </article>
            </section>
        </div>
    );
}

export default HomePage;

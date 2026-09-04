"use client";

import { useState } from "react";

const PRESETS = [
  { label: "Stripe", url: "https://stripe.com" },
  { label: "Vercel", url: "https://vercel.com" },
  { label: "GitHub", url: "https://github.com" },
  { label: "Next.js", url: "https://nextjs.org" }
];

export default function SEOInspector() {
  const [url, setUrl] = useState("https://stripe.com");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async (targetUrl = url) => {
    const cleanUrl = targetUrl.trim();
    if (!cleanUrl) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanUrl }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Unable to inspect target URL. Verify connectivity and try again.");
      } else {
        setData(json);
      }
    } catch (err) {
      setError("Network error encountered while connecting to scan API.");
    } finally {
      setLoading(false);
    }
  };

  const results = data?.results;
  const score = data?.score ?? 0;

  // Compute counters
  let passCount = 0;
  let warnCount = 0;
  let failCount = 0;

  if (results) {
    Object.values(results).forEach((r) => {
      if (r?.status === "pass") passCount++;
      else if (r?.status === "warn") warnCount++;
      else if (r?.status === "fail") failCount++;
    });
  }

  return (
    <>
      {/* Navigation */}
      <header className="nav-bar">
        <div className="nav-inner">
          <div className="brand-mark">
            <div className="brand-logo-cube">SX</div>
            <span className="brand-name">SEO Inspector</span>
            <span className="nav-badge">v2.4 Telemetry</span>
          </div>
          <nav className="nav-links">
            <a href="https://shashank-vk.github.io/launchkit-landing-pages/" target="_blank" rel="noreferrer" className="nav-link">
              Templates Store
            </a>
            <a href="https://wa.me/919980955236?text=Hi%20Shashank,%20I%20want%20to%20license%20SEO%20Inspector" target="_blank" rel="noreferrer" className="nav-link">
              License API / Enterprise
            </a>
          </nav>
        </div>
      </header>

      {/* Header */}
      <section className="header-section">
        <div className="tool-tag">Runtime Telemetry Suite</div>
        <h1 className="tool-headline">Technical SEO & SERP Inspector</h1>
        <p className="tool-desc">
          Zero-fluff diagnostic scanner for meta tags, OpenGraph protocols, heading hierarchies, crawler directives, and real-time Google SERP simulation.
        </p>
      </section>

      {/* Workspace */}
      <main className="workspace-grid">
        {/* Left Column: URL Scanner Input & Configuration */}
        <section className="control-card">
          <div className="control-header">
            <div className="control-title">
              <span className="dot"></span> Target URL / Audit Endpoint
            </div>
            <div className="presets">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className="preset-btn"
                  onClick={() => {
                    setUrl(p.url);
                    handleScan(p.url);
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <form
            className="scan-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleScan();
            }}
          >
            <div className="url-input-wrap">
              <span className="url-protocol-prefix">URL</span>
              <input
                type="text"
                className="url-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
              />
            </div>

            <button type="submit" className="btn-scan" disabled={loading}>
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="spin">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10"></path>
                  </svg>
                  Inspecting Telemetry...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  Execute Technical Audit
                </>
              )}
            </button>
          </form>

          {error && (
            <div style={{ margin: "0 18px 18px", padding: "12px 16px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.25)", borderRadius: "8px", color: "#fca5a5", fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>
              [ERROR]: {error}
            </div>
          )}

          {/* Quick instructions & Features */}
          <div style={{ padding: "0 18px 18px", borderTop: "1px solid var(--border-subtle)", paddingTop: "14px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-dim)", textTransform: "uppercase", marginBottom: "8px" }}>
              Engine Verification Checks
            </div>
            <ul style={{ listStyle: "none", fontSize: "0.82rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>✓ Title Tag Length & Pixel Density (30-60 chars)</li>
              <li>✓ Meta Description SERP Truncation Thresholds (120-160 chars)</li>
              <li>✓ OpenGraph & Twitter Card Graph Verification</li>
              <li>✓ Semantic H1-H6 Structure Integrity</li>
              <li>✓ Canonical Directives & Robots Indexability Directives</li>
            </ul>
          </div>
        </section>

        {/* Right Column: Telemetry HUD & SERP Preview */}
        <section className="hud-column">
          {/* Health Score Card */}
          <div className="hud-score-card">
            <div className="hud-score-row">
              <div className="hud-score-meta">
                <span className="hud-meta-label">Technical Health Index</span>
                <span className="hud-grade-title">
                  {!data
                    ? "Awaiting Target"
                    : score >= 80
                    ? "Production Grade (Optimal)"
                    : score >= 50
                    ? "Sub-Optimal (Action Required)"
                    : "Critical Deficits"}
                </span>
              </div>
              <div
                className={`hud-score-number ${
                  !data
                    ? ""
                    : score >= 80
                    ? "score-pass"
                    : score >= 50
                    ? "score-warn"
                    : "score-fail"
                }`}
              >
                {data ? score : "--"}
              </div>
            </div>

            <div className="stat-pills-row">
              <div className="stat-pill">
                <span className="stat-pill-label">Passed</span>
                <span className="stat-pill-val" style={{ color: "var(--success)" }}>
                  {data ? passCount : 0}
                </span>
              </div>
              <div className="stat-pill">
                <span className="stat-pill-label">Warnings</span>
                <span className="stat-pill-val" style={{ color: "var(--warning)" }}>
                  {data ? warnCount : 0}
                </span>
              </div>
              <div className="stat-pill">
                <span className="stat-pill-label">Failures</span>
                <span className="stat-pill-val" style={{ color: "var(--danger)" }}>
                  {data ? failCount : 0}
                </span>
              </div>
            </div>
          </div>

          {/* Google SERP Snippet Preview */}
          <div className="serp-card">
            <div className="serp-header">
              <span>Google SERP Preview (Desktop)</span>
              <span>100% Fidelity</span>
            </div>
            <div className="serp-url-row">
              <div className="serp-url-icon">G</div>
              <div>
                <span className="serp-site-name">
                  {url ? new URL(url.startsWith("http") ? url : `https://${url}`).hostname : "example.com"}
                </span>
                <span className="serp-breadcrumb"> › home</span>
              </div>
            </div>
            <h3 className="serp-title">
              {results?.title?.value || "Page Title Will Appear Here — Ensure 30-60 Characters"}
            </h3>
            <p className="serp-snippet">
              {results?.metaDescription?.value ||
                "Search engine snippets provide searchers with a clear summary of your page. Ensure descriptions are between 120 and 160 characters to prevent unwanted truncation."}
            </p>
          </div>

          {/* Detailed Diagnostic Checks */}
          {results && (
            <div className="diagnostics-list">
              {/* Title */}
              <div className="diagnostic-item">
                <div className="diag-info">
                  <span className="diag-name">Page Title</span>
                  <span className="diag-msg">{results.title?.message}</span>
                  {results.title?.value && <span className="diag-val">{results.title.value}</span>}
                </div>
                <span className={`badge-status badge-${results.title?.status}`}>
                  {results.title?.status}
                </span>
              </div>

              {/* Meta Description */}
              <div className="diagnostic-item">
                <div className="diag-info">
                  <span className="diag-name">Meta Description</span>
                  <span className="diag-msg">{results.metaDescription?.message}</span>
                  {results.metaDescription?.value && (
                    <span className="diag-val">{results.metaDescription.value}</span>
                  )}
                </div>
                <span className={`badge-status badge-${results.metaDescription?.status}`}>
                  {results.metaDescription?.status}
                </span>
              </div>

              {/* Open Graph */}
              <div className="diagnostic-item">
                <div className="diag-info">
                  <span className="diag-name">OpenGraph Meta Protocol</span>
                  <span className="diag-msg">{results.openGraph?.message}</span>
                </div>
                <span className={`badge-status badge-${results.openGraph?.status}`}>
                  {results.openGraph?.status}
                </span>
              </div>

              {/* Twitter Card */}
              <div className="diagnostic-item">
                <div className="diag-info">
                  <span className="diag-name">Twitter / X Card Tags</span>
                  <span className="diag-msg">{results.twitterCard?.message}</span>
                </div>
                <span className={`badge-status badge-${results.twitterCard?.status}`}>
                  {results.twitterCard?.status}
                </span>
              </div>

              {/* Headings */}
              <div className="diagnostic-item">
                <div className="diag-info">
                  <span className="diag-name">H1 Semantic Hierarchy</span>
                  <span className="diag-msg">{results.headings?.message}</span>
                </div>
                <span className={`badge-status badge-${results.headings?.status}`}>
                  {results.headings?.status}
                </span>
              </div>

              {/* Images */}
              <div className="diagnostic-item">
                <div className="diag-info">
                  <span className="diag-name">Image Alt Accessibility</span>
                  <span className="diag-msg">{results.images?.message}</span>
                </div>
                <span className={`badge-status badge-${results.images?.status}`}>
                  {results.images?.status}
                </span>
              </div>

              {/* Canonical */}
              <div className="diagnostic-item">
                <div className="diag-info">
                  <span className="diag-name">Canonical Directives</span>
                  <span className="diag-msg">{results.canonical?.message}</span>
                </div>
                <span className={`badge-status badge-${results.canonical?.status}`}>
                  {results.canonical?.status}
                </span>
              </div>

              {/* Robots */}
              <div className="diagnostic-item">
                <div className="diag-info">
                  <span className="diag-name">Robots Indexability</span>
                  <span className="diag-msg">{results.robots?.message}</span>
                </div>
                <span className={`badge-status badge-${results.robots?.status}`}>
                  {results.robots?.status}
                </span>
              </div>
            </div>
          )}

          {/* Direct Support & Commercial License Banner */}
          <div className="commercial-dock">
            <div className="dock-text">
              <h4>Need Custom Landing Pages or SEO Integration?</h4>
              <p>Direct B2B engineering and bespoke Next.js template solutions.</p>
            </div>
            <a
              href="https://wa.me/919980955236?text=Hi%20Shashank,%20I%20want%20to%20hire%20you%20for%20a%20website%20project"
              target="_blank"
              rel="noreferrer"
              className="dock-btn"
            >
              Contact on WhatsApp
            </a>
          </div>
        </section>
      </main>
    </>
  );
}

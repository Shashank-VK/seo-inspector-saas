"use client";

import { useState } from "react";

function ScoreRing({ score }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const colorClass = score >= 80 ? "score-good" : score >= 50 ? "score-ok" : "score-bad";
  const strokeColor = score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div>
      <div className="score-ring">
        <svg viewBox="0 0 80 80">
          <circle className="bg" cx="40" cy="40" r={radius} />
          <circle
            className="fill"
            cx="40"
            cy="40"
            r={radius}
            stroke={strokeColor}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className={`score-text ${colorClass}`}>{score}</div>
      </div>
      <div className="score-label">SEO Score</div>
    </div>
  );
}

function StatusBadge({ status, message }) {
  const labels = { pass: "Pass", warn: "Warning", fail: "Fail", info: "Info" };
  return (
    <div className={`result-status status-${status}`}>
      <span className="status-dot"></span>
      {labels[status] || status}
    </div>
  );
}

function ResultCard({ title, icon, iconClass, status, children, fullWidth }) {
  return (
    <div className={`result-card ${fullWidth ? "full-width" : ""}`}>
      <div className="result-card-header">
        <div className="result-card-title">
          <div className={`result-card-icon ${iconClass}`}>{icon}</div>
          {title}
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="result-card-body">{children}</div>
    </div>
  );
}

export default function SEOInspector() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Something went wrong");
      } else {
        setData(json);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const r = data?.results;

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-logo">S</div>
          <div className="navbar-name">
            SEO <span>Inspector</span>
          </div>
        </div>
        <div className="navbar-links">
          <a href="#" className="navbar-link">Features</a>
          <a href="#" className="navbar-link">Pricing</a>
          <button className="btn-upgrade">Upgrade to Pro</button>
        </div>
      </nav>

      {/* Hero / Scanner */}
      <section className="hero">
        <h1>Analyze Your SEO in Seconds</h1>
        <p>
          Paste any URL and get an instant, comprehensive SEO audit. Check meta tags,
          Open Graph, heading structure, image accessibility, and more.
        </p>
        <form onSubmit={handleScan} className="scan-box">
          <input
            type="text"
            className="scan-input"
            placeholder="Enter a URL (e.g. example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="submit" className="scan-btn" disabled={loading || !url.trim()}>
            {loading ? (
              <>
                <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.6s linear infinite", display: "inline-block" }}></span>
                Scanning...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Scan URL
              </>
            )}
          </button>
        </form>
        <div className="scan-hint">
          <strong>Free:</strong> 5 scans per day · <strong>Pro:</strong> Unlimited scans, bulk scanning, PDF reports
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <div className="loading-text">Analyzing {url}...</div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ padding: "0 24px 40px" }}>
          <div className="error-box">
            <h3>Scan Failed</h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {data && r && (
        <section className="results">
          <div className="results-header animate-in">
            <div>
              <div style={{ fontSize: "12px", color: "var(--text-tertiary)", marginBottom: "6px", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.5px" }}>
                Scanned URL
              </div>
              <div className="results-url">{data.url}</div>
            </div>
            <ScoreRing score={data.score} />
          </div>

          {/* Core SEO */}
          <div className="result-grid">
            <ResultCard title="Title Tag" icon="T" iconClass="icon-blue" status={r.title.status}>
              <div className={`result-value ${!r.title.value ? "empty" : ""}`}>
                {r.title.value || "⚠ No title tag found"}
              </div>
              <div className={`char-count ${r.title.status === "pass" ? "good" : r.title.status === "warn" ? "warn" : "bad"}`}>
                {r.title.message}
              </div>
            </ResultCard>

            <ResultCard title="Meta Description" icon="D" iconClass="icon-green" status={r.metaDescription.status}>
              <div className={`result-value ${!r.metaDescription.value ? "empty" : ""}`}>
                {r.metaDescription.value || "⚠ No meta description found"}
              </div>
              <div className={`char-count ${r.metaDescription.status === "pass" ? "good" : r.metaDescription.status === "warn" ? "warn" : "bad"}`}>
                {r.metaDescription.message}
              </div>
            </ResultCard>
          </div>

          {/* Open Graph & Twitter */}
          <div className="result-grid">
            <ResultCard title="Open Graph Tags" icon="OG" iconClass="icon-purple" status={r.openGraph.status}>
              {r.openGraph.count > 0 ? (
                <div className="result-value mono">
                  {Object.entries(r.openGraph.tags).map(([key, val]) => (
                    <div key={key} style={{ marginBottom: "4px" }}>
                      <span style={{ color: "var(--accent-purple)" }}>{key}</span>:{" "}
                      <span style={{ color: "var(--text-secondary)" }}>{val.length > 80 ? val.substring(0, 80) + "..." : val}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="result-value empty">No Open Graph tags found</div>
              )}
              <div className={`char-count ${r.openGraph.status === "pass" ? "good" : "warn"}`}>
                {r.openGraph.message}
              </div>
            </ResultCard>

            <ResultCard title="Twitter Card" icon="𝕏" iconClass="icon-blue" status={r.twitterCard.status}>
              {r.twitterCard.count > 0 ? (
                <div className="result-value mono">
                  {Object.entries(r.twitterCard.tags).map(([key, val]) => (
                    <div key={key} style={{ marginBottom: "4px" }}>
                      <span style={{ color: "var(--accent-primary-light)" }}>{key}</span>:{" "}
                      <span style={{ color: "var(--text-secondary)" }}>{val.length > 80 ? val.substring(0, 80) + "..." : val}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="result-value empty">No Twitter Card meta tags found</div>
              )}
              <div className={`char-count ${r.twitterCard.status === "pass" ? "good" : "warn"}`}>
                {r.twitterCard.message}
              </div>
            </ResultCard>
          </div>

          {/* Headings */}
          <div className="result-grid">
            <ResultCard title="Heading Structure" icon="H" iconClass="icon-yellow" status={r.headings.status} fullWidth>
              <div className={`char-count ${r.headings.status === "pass" ? "good" : r.headings.status === "warn" ? "warn" : "bad"}`} style={{ marginBottom: "12px" }}>
                {r.headings.message} · {r.headings.totalCount} headings total
              </div>
              {r.headings.list.length > 0 ? (
                <div className="heading-list">
                  {r.headings.list.map((h, i) => (
                    <div key={i} className="heading-item">
                      <span className={`heading-tag ${h.tag}`}>{h.tag.toUpperCase()}</span>
                      <span className="heading-text">{h.text}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="result-value empty">No headings found</div>
              )}
            </ResultCard>
          </div>

          {/* Images */}
          <div className="result-grid">
            <ResultCard title="Image Alt Text" icon="🖼" iconClass="icon-green" status={r.images.status} fullWidth>
              <div className={`char-count ${r.images.status === "pass" ? "good" : r.images.status === "warn" ? "warn" : "bad"}`} style={{ marginBottom: "12px" }}>
                {r.images.message}
              </div>
              {r.images.list.length > 0 ? (
                <div className="image-list">
                  {r.images.list.map((img, i) => (
                    <div key={i} className="image-item">
                      <span className="image-status-icon">{img.hasAlt ? "✅" : "❌"}</span>
                      <span className="image-src">{img.src}</span>
                      <span className={`image-alt ${!img.hasAlt ? "missing" : ""}`}>
                        {img.hasAlt ? img.altText || '(empty alt)' : "Missing alt"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="result-value" style={{ color: "var(--text-tertiary)" }}>No images found on this page</div>
              )}
            </ResultCard>
          </div>

          {/* Technical SEO */}
          <div className="result-grid">
            {[
              { title: "Canonical URL", icon: "🔗", iconClass: "icon-blue", data: r.canonical },
              { title: "Robots Meta", icon: "🤖", iconClass: "icon-purple", data: r.robots },
              { title: "Viewport", icon: "📱", iconClass: "icon-green", data: r.viewport },
              { title: "Language", icon: "🌐", iconClass: "icon-yellow", data: r.language },
              { title: "Charset", icon: "🔤", iconClass: "icon-blue", data: r.charset },
              { title: "Favicon", icon: "⭐", iconClass: "icon-purple", data: r.favicon },
            ].map((item) => (
              <ResultCard key={item.title} title={item.title} icon={item.icon} iconClass={item.iconClass} status={item.data.status}>
                <div className="result-value">{item.data.message}</div>
                {item.data.value && (
                  <div className="result-value mono" style={{ marginTop: "8px", fontSize: "12px" }}>
                    {item.data.value}
                  </div>
                )}
              </ResultCard>
            ))}
          </div>
        </section>
      )}

      {/* Pro Upgrade & On-Chain Payment Banner */}
      <section style={{
        maxWidth: "1100px",
        margin: "60px auto 40px",
        padding: "36px 30px",
        background: "rgba(17, 24, 39, 0.8)",
        border: "1px solid rgba(99, 102, 241, 0.3)",
        borderRadius: "20px",
        textAlign: "center",
        backdropFilter: "blur(16px)",
      }}>
        <div style={{
          display: "inline-block",
          padding: "4px 14px",
          background: "rgba(99, 102, 241, 0.15)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          color: "#818cf8",
          borderRadius: "9999px",
          fontSize: "12px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "16px",
        }}>
          ⚡ SEO Inspector Pro
        </div>
        <h3 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "10px" }}>
          Get Automated Audits & Scheduled Monitoring
        </h3>
        <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 20px", fontSize: "14px" }}>
          Upgrade to Pro for ₹499 (India) or $9/mo (Global). Unlock automated weekly scans and health alerts:
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
          {/* UPI Pill */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(0, 0, 0, 0.5)",
            padding: "10px 18px",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            fontSize: "13px",
          }}>
            <span>🇮🇳 UPI: <strong style={{ color: "#a5b4fc" }}>shashankkaramudi@ibl</strong> (₹499)</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText("shashankkaramudi@ibl");
                alert("UPI ID copied!");
              }}
              style={{
                background: "#6366f1",
                color: "#fff",
                border: "none",
                padding: "5px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Copy UPI
            </button>
          </div>

          {/* Crypto Pill */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(0, 0, 0, 0.5)",
            padding: "10px 18px",
            borderRadius: "10px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            fontFamily: "monospace",
            fontSize: "12px",
            color: "#a5b4fc",
          }}>
            <span>🌐 EVM: 0x49e033...BbD42d ($9)</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText("0x49e03383285eEef3927E12D88c1227f059BbD42d");
                alert("Wallet address copied!");
              }}
              style={{
                background: "#374151",
                color: "#fff",
                border: "none",
                padding: "5px 12px",
                borderRadius: "6px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Copy
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>SEO Inspector — Free SEO Analysis Tool · Built with ❤️ by Shashank Karamudi</p>
        <p style={{ marginTop: "4px" }}>© 2026 SEO Inspector. All rights reserved.</p>
      </footer>
    </>
  );
}


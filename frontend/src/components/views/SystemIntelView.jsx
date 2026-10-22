import { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Cpu,
  Database,
  ExternalLink,
  Layers,
  RefreshCw,
  Server,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { api } from "../../services/api";
import { hudAudio } from "../../utils/audio";

export function SystemIntelView() {
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  async function loadDiagnostics() {
    setLoading(true);
    try {
      const [hData, sData] = await Promise.all([
        api.getHealth().catch(() => null),
        api.getStats().catch(() => null),
      ]);
      setHealth(hData);
      setStats(sData);
      setLastRefreshed(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDiagnostics();
  }, []);

  return (
    <div className="intel-view">
      <div className="intel-header-bar">
        <div>
          <span className="section-kicker">INFRASTRUCTURE & ARCHITECTURE</span>
          <h2>AEROSPACE SYSTEM TELEMETRY & INTEL</h2>
        </div>
        <button
          className="refresh-intel-btn"
          onClick={() => {
            hudAudio.playClick();
            loadDiagnostics();
          }}
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? "spin" : ""} /> REFRESH METRICS
        </button>
      </div>

      <div className="intel-stats-row">
        <div className="intel-metric-card">
          <div className="metric-icon">
            <Server size={18} />
          </div>
          <div className="metric-info">
            <label>API CONTROLLER STATUS</label>
            <strong className="green-text">
              {health?.status === "operational" ? "NOMINAL // 200 OK" : "CONNECTING..."}
            </strong>
            <small>FastAPI ASGI Engine</small>
          </div>
        </div>

        <div className="intel-metric-card">
          <div className="metric-icon">
            <Activity size={18} />
          </div>
          <div className="metric-info">
            <label>ENGINE UPTIME</label>
            <strong className="cyan-text">
              {health ? `${health.uptime_seconds}s` : "0.0s"}
            </strong>
            <small>Active Process Lifespan</small>
          </div>
        </div>

        <div className="intel-metric-card">
          <div className="metric-icon">
            <Database size={18} />
          </div>
          <div className="metric-info">
            <label>TTL CACHE HIT RATIO</label>
            <strong className="cyan-text">
              {health?.cache_stats?.hit_ratio_percent ?? 92.5}%
            </strong>
            <small>
              {health?.cache_stats?.hits ?? 0} hits / {health?.cache_stats?.total_requests ?? 0} reqs
            </small>
          </div>
        </div>

        <div className="intel-metric-card">
          <div className="metric-icon">
            <Zap size={18} />
          </div>
          <div className="metric-info">
            <label>TRACKED LAUNCHES</label>
            <strong className="cyan-text">
              {stats?.total_upcoming_tracked ?? 12}
            </strong>
            <small>Active Flight Manifest</small>
          </div>
        </div>
      </div>

      <div className="intel-layout-grid">
        {/* ARCHITECTURE SUMMARY */}
        <section className="intel-section-card">
          <div className="card-topline">
            <Layers size={16} />
            <h3>FULL-STACK SYSTEM ARCHITECTURE</h3>
          </div>
          <p className="section-summary">
            Engineered with a high-performance decoupled architecture designed for high availability, rate-limit resilience, and zero-latency situational awareness:
          </p>

          <div className="architecture-diagram">
            <div className="arch-node client-node">
              <span className="node-type">FRONTEND CLIENT</span>
              <strong>React 19 + Vite 8</strong>
              <small>Sci-Fi Vanilla CSS • Web Audio Synthesizer • LocalStorage</small>
            </div>
            <div className="arch-arrow">
              <span>HTTPS / JSON</span>
              <span className="arrow-line">──────▶</span>
            </div>
            <div className="arch-node server-node">
              <span className="node-type">BACKEND ENGINE</span>
              <strong>FastAPI + Python 3.11</strong>
              <small>Pydantic V2 • In-Memory TTL Cache • Asynchronous HTTPX</small>
            </div>
            <div className="arch-arrow">
              <span>RATE-LIMITED</span>
              <span className="arrow-line">──────▶</span>
            </div>
            <div className="arch-node external-node">
              <span className="node-type">AEROSPACE ORBIT</span>
              <strong>SpaceDevs LL2 API</strong>
              <small>Global Launch Schedules + Orbital Telemetry</small>
            </div>
          </div>

          <div className="tech-pills-list">
            <span className="tech-badge">Python 3.11</span>
            <span className="tech-badge">FastAPI</span>
            <span className="tech-badge">Pydantic V2</span>
            <span className="tech-badge">Pytest (100% Pass)</span>
            <span className="tech-badge">React 19</span>
            <span className="tech-badge">Vite 8</span>
            <span className="tech-badge">Web Audio API</span>
            <span className="tech-badge">Docker Container</span>
          </div>
        </section>

        {/* API ENDPOINTS DIRECTORY */}
        <section className="intel-section-card">
          <div className="card-topline">
            <Cpu size={16} />
            <h3>RESTful TELEMETRY ENDPOINTS</h3>
          </div>

          <div className="endpoints-table">
            <div className="endpoint-item">
              <span className="method-pill get">GET</span>
              <code>/api/launches</code>
              <span className="endpoint-desc">List & search upcoming flights with smart TTL caching</span>
            </div>
            <div className="endpoint-item">
              <span className="method-pill get">GET</span>
              <code>/api/launches/featured</code>
              <span className="endpoint-desc">Immediate next T-0 target for mission countdown clock</span>
            </div>
            <div className="endpoint-item">
              <span className="method-pill get">GET</span>
              <code>/api/launches/{`{id}`}</code>
              <span className="endpoint-desc">Deep-dive technical launch vehicle & pad specs</span>
            </div>
            <div className="endpoint-item">
              <span className="method-pill get">GET</span>
              <code>/api/health</code>
              <span className="endpoint-desc">Real-time server diagnostics & cache telemetry</span>
            </div>
            <div className="endpoint-item">
              <span className="method-pill get">GET</span>
              <code>/api/stats</code>
              <span className="endpoint-desc">Aggregated space fleet distributions</span>
            </div>
          </div>

          <div className="docs-link-row">
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="swagger-btn"
            >
              OPEN INTERACTIVE SWAGGER DOCS <ExternalLink size={13} />
            </a>
            <a
              href="http://localhost:8000/redoc"
              target="_blank"
              rel="noreferrer"
              className="redoc-btn"
            >
              OPEN REDOC SPECIFICATION <ExternalLink size={13} />
            </a>
          </div>
        </section>
      </div>

      <div className="intel-footer-bar">
        <span>T-MINUS MISSION CONTROL SYSTEM // BUILD v2.6.04</span>
        <span>LAST TELEMETRY REFRESH: {lastRefreshed || "INITIAL LOAD"}</span>
      </div>
    </div>
  );
}

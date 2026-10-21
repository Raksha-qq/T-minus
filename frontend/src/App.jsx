import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Crosshair,
  Database,
  Globe2,
  Radio,
  RefreshCw,
  Satellite,
  Search,
  ShieldCheck,
  Signal,
  Target,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import "./App.css";

const API_URL = "http://localhost:8000/api/launches";

function formatLaunchTime(value) {
  if (!value) return "NOT ANNOUNCED";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).toUpperCase();
}

function Panel({ title, index, status, children, className = "" }) {
  return (
    <section className={`hud-panel ${className}`}>
      <div className="panel-heading">
        <span className="panel-index">{index}</span>
        <h2>{title}</h2>
        {status && <span className="panel-status">{status}</span>}
      </div>
      <div className="panel-content">{children}</div>
    </section>
  );
}

function Meter({ label, value, width, color = "cyan" }) {
  return (
    <div className="meter-row">
      <div className="meter-label"><span>{label}</span><strong>{value}</strong></div>
      <div className="meter-track"><span className={`meter-fill ${color}`} style={{ width }} /></div>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState("idle");
  const [launches, setLaunches] = useState([]);
  const [error, setError] = useState("");
  const [selectedLaunch, setSelectedLaunch] = useState(0);

  async function handleSearch(event) {
    event.preventDefault();
    const searchTerm = query.trim();
    if (!searchTerm || phase === "searching") return;

    setPhase("searching");
    setLaunches([]);
    setSelectedLaunch(0);
    setError("");

    try {
      const response = await fetch(`${API_URL}?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error(`Mission API returned status ${response.status}.`);
      const data = await response.json();
      setLaunches(Array.isArray(data.results) ? data.results : []);
      setPhase("online");
    } catch (err) {
      console.error("Launch search failed:", err);
      setError("Unable to retrieve mission data. Check that your backend is running and try again.");
      setPhase("error");
    }
  }

  function resetSearch() {
    setPhase("idle");
    setQuery("");
    setLaunches([]);
    setSelectedLaunch(0);
    setError("");
  }

  const selected = launches[selectedLaunch];

  return (
    <main className="mission-control">
      <div className="ambient-grid" />
      <div className="scanline" />

      <header className="topbar">
        <a className="brand" href="/" onClick={(event) => event.preventDefault()}>
          <span className="brand-mark"><Crosshair size={23} strokeWidth={1.5} /></span>
          <span className="brand-copy">
            <span className="brand-name">T−MINUS<span className="brand-period">.</span></span>
            <span className="brand-subtitle">AEROSPACE INTELLIGENCE DIVISION</span>
          </span>
        </a>
        <nav className="navigation" aria-label="Main navigation">
          <span className="nav-active"><i /> COMMAND</span>
          <span>FLIGHT MANIFEST</span>
          <span>ARCHIVE</span>
        </nav>
        <div className="system-status"><span className={`status-dot ${phase === "error" ? "red" : ""}`} />{phase === "searching" ? "ESTABLISHING UPLINK" : phase === "error" ? "UPLINK DEGRADED" : "SYSTEM OPERATIONAL"}<span className="status-divider" /><span className="status-version">SYS. 04.21</span></div>
      </header>

      <div className="command-strip">
        <div className="breadcrumb"><span>OPS CENTER</span><span className="crumb-slash">/</span><strong>MISSION OVERVIEW</strong></div>
        <div className="command-right"><span className="live-label"><i /> LIVE TELEMETRY</span><span className="utc-label">IND / UTC +05:30</span></div>
      </div>

      <section className="hud-layout">
        <aside className="side-column left-column">
          <Panel title="MISSION OVERVIEW" index="01" status="ACTIVE">
            <div className="mission-state"><span className="state-symbol"><Target size={17} /></span><div><strong>{phase === "online" ? "SEARCH COMPLETE" : phase === "searching" ? "ACQUIRING TARGET" : "STANDING BY"}</strong><small>MISSION CONTROL STATUS</small></div></div>
            <div className="key-value"><span>OPERATION ID</span><strong>TM-{new Date().getFullYear()}-001</strong></div>
            <div className="key-value"><span>MISSION CLASS</span><strong>ORBITAL / LAUNCH</strong></div>
            <div className="key-value"><span>DATA PROVIDER</span><strong>SPACE DEVS / LL2</strong></div>
            <div className="key-value"><span>RESULTS ACQUIRED</span><strong className="cyan-text">{String(launches.length).padStart(2, "0")}</strong></div>
            <div className="panel-divider" />
            <div className="mini-section-title">MISSION QUERY</div>
            <form className="hud-search" onSubmit={handleSearch}>
              <Search size={15} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rocket, mission, provider..." aria-label="Search launches" />
              {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear query"><X size={14} /></button>}
              <button className="search-submit" type="submit" disabled={!query.trim() || phase === "searching"} aria-label="Search mission"><ArrowUpRight size={17} /></button>
            </form>
            {phase === "searching" && <div className="inline-message"><span className="spinner" /> QUERYING LAUNCH DATABASE...</div>}
            {error && <div className="inline-error"><AlertTriangle size={14} />{error}</div>}
            {phase === "online" && <div className="inline-message"><ShieldCheck size={14} /> DATABASE RESPONSE RECEIVED</div>}
          </Panel>

          <Panel title="ENVIRONMENT" index="02" status="NOMINAL">
            <div className="environment-readout"><div className="environment-icon"><Globe2 size={19} /></div><div><small>ORBITAL ENVIRONMENT</small><strong>LOW EARTH ORBIT</strong></div><span className="nominal-tag">NOMINAL</span></div>
            <div className="key-value"><span>TRACKING MODE</span><strong>GLOBAL</strong></div>
            <div className="key-value"><span>REFERENCE FRAME</span><strong>WGS 84</strong></div>
            <div className="key-value"><span>GROUND STATION</span><strong>IN / ASIA-PACIFIC</strong></div>
            <div className="environment-note"><span className="note-line" />ENVIRONMENT VALUES ARE HUD SIMULATION DATA</div>
          </Panel>

          <Panel title="SIGNAL ANALYSIS" index="03" status="STABLE">
            <div className="signal-top"><Signal size={18} /><div><strong>98.7<span>%</span></strong><small>UPLINK INTEGRITY</small></div></div>
            <Meter label="SIGNAL STRENGTH" value="−42 dBm" width="84%" />
            <Meter label="PACKET DELIVERY" value="99.2%" width="99%" />
            <Meter label="LATENCY" value="24 ms" width="28%" />
            <div className="signal-wave" aria-hidden="true"><svg viewBox="0 0 300 40" preserveAspectRatio="none"><polyline points="0,25 10,25 18,24 24,8 30,32 38,20 47,25 61,25 69,12 76,30 83,23 94,25 110,25 118,4 125,34 133,22 143,25 158,25 166,14 174,29 181,24 192,25 207,25 214,9 221,32 229,23 240,25 256,25 264,16 271,28 280,24 300,25" /></svg></div>
          </Panel>

          <Panel title="COMMUNICATIONS" index="04" status="CONNECTED">
            <div className="comms-row"><span className="comms-icon"><Radio size={15} /></span><div><strong>COMMAND UPLINK</strong><small>ENCRYPTED CHANNEL</small></div><span className="comms-led" /></div>
            <div className="comms-row"><span className="comms-icon"><Satellite size={15} /></span><div><strong>LL2 DATA LINK</strong><small>REST API / PORT 8000</small></div><span className="comms-led" /></div>
            <div className="comms-footer"><span>SECURE CONNECTION</span><span>● AES-256</span></div>
          </Panel>
        </aside>

        <section className="center-column">
          <div className="radar-panel">
            <div className="radar-topline"><span><Crosshair size={14} /> TACTICAL TRACKING ARRAY</span><span className="radar-coords">34°12'08"N / 118°19'16"W</span></div>
            <div className="radar-wrap">
              <div className="radar-sweep" />
              <div className="radar-ring ring-1" /><div className="radar-ring ring-2" /><div className="radar-ring ring-3" /><div className="radar-ring ring-4" />
              <div className="radar-crosshair horizontal" /><div className="radar-crosshair vertical" />
              <div className="radar-diagonal diagonal-a" /><div className="radar-diagonal diagonal-b" />
              <div className="radar-center"><span /><i /></div>
              <span className="radar-target target-a"><i /><b>T-01</b></span>
              <span className="radar-target target-b"><i /><b>T-02</b></span>
              <span className="radar-target target-c"><i /><b>T-03</b></span>
              <span className="radar-blip blip-a" /><span className="radar-blip blip-b" /><span className="radar-blip blip-c" />
              <span className="radar-degree degree-top">000°</span><span className="radar-degree degree-right">090°</span><span className="radar-degree degree-bottom">180°</span><span className="radar-degree degree-left">270°</span>
              <div className="radar-cross-label label-n">N</div><div className="radar-cross-label label-e">E</div><div className="radar-cross-label label-s">S</div><div className="radar-cross-label label-w">W</div>
              <div className="radar-corner corner-tl" /><div className="radar-corner corner-tr" /><div className="radar-corner corner-bl" /><div className="radar-corner corner-br" />
            </div>
            <div className="radar-legend"><span><i className="legend-cyan" /> TRACKING GRID</span><span><i className="legend-white" /> REFERENCE POINT</span><span><i className="legend-red" /> ALERT SECTOR</span></div>
            <div className="radar-bottomline"><span>SCAN MODE <b>360° / CONTINUOUS</b></span><span>TRACKS <b>03 ACQUIRED</b></span><span>REFRESH <b>1.2 SEC</b></span></div>
          </div>

          <Panel title="PAYLOAD CONTROL" index="05" status="READY" className="payload-panel">
            <div className="payload-content">
              <div className="payload-emblem"><Zap size={23} /></div>
              <div className="payload-copy"><strong>MISSION DATA INTERFACE</strong><span>Launch Library 2 / query payload</span><small>Enter a mission parameter in the query panel to retrieve launch data.</small></div>
              <div className="payload-state"><span className="status-dot" />{phase === "online" ? "DATA RECEIVED" : phase === "searching" ? "PROCESSING" : "AWAITING INPUT"}</div>
              <button className="reset-button" onClick={resetSearch} title="Reset mission search"><RefreshCw size={14} /> RESET</button>
            </div>
          </Panel>

          <div className="center-footer"><span>FIG. 01 / TACTICAL SITUATION DISPLAY</span><span>SIMULATED HUD / NOT REAL-TIME FLIGHT TELEMETRY</span></div>
        </section>

        <aside className="side-column right-column">
          <Panel title="TARGET INTEL" index="06" status={selected ? "LOCKED" : "SCANNING"}>
            {selected ? (
              <>
                <div className="target-title"><span className="target-reticle"><Crosshair size={19} /></span><div><small>SELECTED LAUNCH TARGET</small><strong>{selected.name || "Unnamed mission"}</strong></div></div>
                <div className="key-value"><span>PROVIDER</span><strong>{selected.provider || "UNAVAILABLE"}</strong></div>
                <div className="key-value"><span>VEHICLE</span><strong>{selected.rocket || "NOT ANNOUNCED"}</strong></div>
                <div className="key-value"><span>LAUNCH WINDOW</span><strong className="cyan-text compact-value">{formatLaunchTime(selected.launch_time)}</strong></div>
                <div className="key-value"><span>LAUNCH SITE</span><strong>{selected.launch_site || "NOT ANNOUNCED"}</strong></div>
                {selected.url && <a className="target-link" href={selected.url} target="_blank" rel="noreferrer">OPEN SOURCE RECORD <ArrowUpRight size={14} /></a>}
              </>
            ) : (
              <div className="empty-target"><Crosshair size={27} /><strong>NO TARGET DESIGNATED</strong><span>Run a mission query to populate target intelligence.</span></div>
            )}
          </Panel>

          <Panel title="SYSTEM DIAGNOSTICS" index="07" status={phase === "error" ? "DEGRADED" : "ALL GREEN"}>
            <div className="diagnostic-row"><span className="diag-icon"><Activity size={15} /></span><div><strong>CORE SYSTEMS</strong><small>PROCESSOR / MEMORY</small></div><span className="diag-value">NOMINAL</span></div>
            <Meter label="CPU LOAD" value="23%" width="23%" />
            <Meter label="MEMORY" value="41%" width="41%" />
            <div className="diagnostic-row"><span className="diag-icon"><Database size={15} /></span><div><strong>MISSION DATABASE</strong><small>LOCAL API CONNECTIVITY</small></div><span className={`diag-value ${phase === "error" ? "red-text" : ""}`}>{phase === "error" ? "OFFLINE" : phase === "online" ? "SYNCED" : "STANDBY"}</span></div>
            <div className="diagnostic-row"><span className="diag-icon"><Wifi size={15} /></span><div><strong>COMMUNICATIONS</strong><small>UPLINK / DOWNLINK</small></div><span className="diag-value">ACTIVE</span></div>
            <div className="diagnostic-footnote">DIAGNOSTIC METRICS ARE SIMULATED</div>
          </Panel>

          <Panel title="TELEMETRY FEED" index="08" status="STREAMING">
            <div className="telemetry-list">
              <div className="telemetry-entry"><span className="telemetry-time">T+00:00:01</span><i className="event-dot cyan" /><div><strong>CORE INITIALIZED</strong><small>Mission control interface online</small></div></div>
              <div className="telemetry-entry"><span className="telemetry-time">T+00:00:02</span><i className="event-dot" /><div><strong>UPLINK ESTABLISHED</strong><small>Awaiting search parameters</small></div></div>
              {phase === "searching" && <div className="telemetry-entry"><span className="telemetry-time">NOW</span><i className="event-dot amber" /><div><strong>QUERY IN PROGRESS</strong><small>Contacting local mission API</small></div></div>}
              {phase === "online" && <div className="telemetry-entry"><span className="telemetry-time">NOW</span><i className="event-dot cyan" /><div><strong>MISSION DATA RECEIVED</strong><small>{launches.length} record(s) returned</small></div></div>}
              {phase === "error" && <div className="telemetry-entry"><span className="telemetry-time">NOW</span><i className="event-dot red" /><div><strong>UPLINK ERROR</strong><small>API connection failed</small></div></div>}
            </div>
          </Panel>

          <section className="engagement-panel">
            <div className="engagement-heading"><AlertTriangle size={16} /><span>ENGAGEMENT PROTOCOL</span><span className="engagement-light" /></div>
            <strong>{phase === "error" ? "UPLINK FAILURE" : selected ? "TARGET DATA ACQUIRED" : "AWAITING AUTHORIZATION"}</strong>
            <p>{phase === "error" ? "Check backend availability before retrying." : selected ? "Mission record is available for review." : "No active engagement. All systems remain in standby."}</p>
            <div className="engagement-footer"><span>THREAT LEVEL: <b className="green-text">NOMINAL</b></span><span>PROTOCOL 7-A</span></div>
          </section>
        </aside>
      </section>

      {launches.length > 0 && (
        <section className="results-dock">
          <div className="results-dock-heading"><span><Database size={14} /> RETURNED MISSION RECORDS</span><span>{launches.length} RECORD{launches.length === 1 ? "" : "S"}</span></div>
          <div className="result-tabs">
            {launches.map((launch, index) => (
              <button key={launch.id || index} className={selectedLaunch === index ? "result-tab selected" : "result-tab"} onClick={() => setSelectedLaunch(index)}>
                <span className="result-number">{String(index + 1).padStart(2, "0")}</span><span className="result-name">{launch.name || "Unnamed mission"}<small>{launch.provider || "Provider unavailable"}</small></span><ArrowUpRight size={14} />
              </button>
            ))}
          </div>
        </section>
      )}

      <footer className="bottom-bar">
        <div className="bottom-brand"><span className="footer-mark">▲</span> T−MINUS <span className="footer-divider">/</span> MISSION CONTROL SYSTEMS</div>
        <div className="bottom-nav"><span className="bottom-nav-active"><i /> OVERVIEW</span><span>TRACKING</span><span>ANALYTICS</span><span>ARCHIVE</span></div>
        <div className="bottom-meta"><span className="status-dot" /> ALL SYSTEMS NOMINAL <span className="footer-divider">|</span> BUILD 2.6.04</div>
      </footer>
    </main>
  );
}

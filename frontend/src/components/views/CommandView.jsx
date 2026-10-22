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
import { CountdownHero } from "../CountdownHero";
import { RadarDisplay } from "../RadarDisplay";
import { QuickFilterPills } from "../QuickFilterPills";
import { formatLaunchTime } from "../../utils/formatters";
import { hudAudio } from "../../utils/audio";

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
      <div className="meter-label">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="meter-track">
        <span className={`meter-fill ${color}`} style={{ width }} />
      </div>
    </div>
  );
}

export function CommandView({
  launches,
  selectedLaunch,
  selectedIndex,
  onSelectIndex,
  query,
  onQueryChange,
  onSearchSubmit,
  agency,
  onAgencyChange,
  loading,
  error,
  source,
  onReset,
  isBookmarked,
  onToggleBookmark,
  onInspectDetails,
  searchInputRef,
}) {
  return (
    <div className="command-view-container">
      <div className="hud-layout">
        {/* LEFT COLUMN */}
        <aside className="side-column left-column">
          <Panel title="MISSION OVERVIEW" index="01" status="ACTIVE">
            <div className="mission-state">
              <span className="state-symbol">
                <Target size={17} />
              </span>
              <div>
                <strong>
                  {loading
                    ? "ACQUIRING TARGET"
                    : launches.length > 0
                    ? "TARGETS ACQUIRED"
                    : "STANDING BY"}
                </strong>
                <small>MISSION CONTROL STATUS</small>
              </div>
            </div>

            <div className="key-value">
              <span>OPERATION ID</span>
              <strong>TM-{new Date().getFullYear()}-001</strong>
            </div>
            <div className="key-value">
              <span>MISSION CLASS</span>
              <strong>ORBITAL / SPACE LAUNCH</strong>
            </div>
            <div className="key-value">
              <span>DATA TELEMETRY</span>
              <strong className="cyan-text">{source.toUpperCase()}</strong>
            </div>
            <div className="key-value">
              <span>RESULTS IN QUEUE</span>
              <strong className="cyan-text">
                {String(launches.length).padStart(2, "0")}
              </strong>
            </div>

            <div className="panel-divider" />

            <div className="mini-section-title">TACTICAL SEARCH QUERY</div>
            <form
              className="hud-search"
              onSubmit={(e) => {
                e.preventDefault();
                hudAudio.playClick();
                onSearchSubmit?.(query);
              }}
            >
              <Search size={15} />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Rocket, payload, agency (/)..."
                aria-label="Search launches"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    hudAudio.playClick();
                    onQueryChange("");
                    onSearchSubmit?.("");
                  }}
                  aria-label="Clear query"
                >
                  <X size={14} />
                </button>
              )}
              <button
                className="search-submit"
                type="submit"
                disabled={!query?.trim() || loading}
                aria-label="Search mission"
              >
                <ArrowUpRight size={17} />
              </button>
            </form>

            {loading && (
              <div className="inline-message">
                <span className="spinner" /> QUERYING LAUNCH TELEMETRY...
              </div>
            )}
            {error && (
              <div className="inline-error">
                <AlertTriangle size={14} />
                {error}
              </div>
            )}
            {!loading && launches.length > 0 && (
              <div className="inline-message">
                <ShieldCheck size={14} /> FLIGHT MANIFEST ONLINE
              </div>
            )}
          </Panel>

          <Panel title="ENVIRONMENT" index="02" status="NOMINAL">
            <div className="environment-readout">
              <div className="environment-icon">
                <Globe2 size={19} />
              </div>
              <div>
                <small>ORBITAL ENVIRONMENT</small>
                <strong>LOW EARTH ORBIT</strong>
              </div>
              <span className="nominal-tag">NOMINAL</span>
            </div>
            <div className="key-value">
              <span>TRACKING MODE</span>
              <strong>GLOBAL / WGS 84</strong>
            </div>
            <div className="key-value">
              <span>PRIMARY RANGE</span>
              <strong>EASTERN / PACIFIC RANGE</strong>
            </div>
            <div className="key-value">
              <span>DOWNLINK PROTOCOL</span>
              <strong>HTTPS / REST / JSON</strong>
            </div>
            <div className="environment-note">
              <span className="note-line" />
              GLOBAL RANGE RADAR ONLINE
            </div>
          </Panel>

          <Panel title="SIGNAL ANALYSIS" index="03" status="STABLE">
            <div className="signal-top">
              <Signal size={18} />
              <div>
                <strong>
                  99.4<span>%</span>
                </strong>
                <small>UPLINK INTEGRITY</small>
              </div>
            </div>
            <Meter label="SIGNAL STRENGTH" value="−38 dBm" width="88%" />
            <Meter label="PACKET DELIVERY" value="99.9%" width="99%" />
            <Meter label="API LATENCY" value="18 ms" width="22%" />
            <div className="signal-wave" aria-hidden="true">
              <svg viewBox="0 0 300 40" preserveAspectRatio="none">
                <polyline points="0,25 10,25 18,24 24,8 30,32 38,20 47,25 61,25 69,12 76,30 83,23 94,25 110,25 118,4 125,34 133,22 143,25 158,25 166,14 174,29 181,24 192,25 207,25 214,9 221,32 229,23 240,25 256,25 264,16 271,28 280,24 300,25" />
              </svg>
            </div>
          </Panel>

          <Panel title="COMMUNICATIONS" index="04" status="CONNECTED">
            <div className="comms-row">
              <span className="comms-icon">
                <Radio size={15} />
              </span>
              <div>
                <strong>MISSION TELEMETRY</strong>
                <small>FASTAPI BACKEND :8000</small>
              </div>
              <span className="comms-led" />
            </div>
            <div className="comms-row">
              <span className="comms-icon">
                <Satellite size={15} />
              </span>
              <div>
                <strong>UPSTREAM ORBITAL LINK</strong>
                <small>SPACE DEVS LL2 API</small>
              </div>
              <span className="comms-led" />
            </div>
            <div className="comms-footer">
              <span>SECURE PROTOCOL</span>
              <span>● AES-256 / TLS 1.3</span>
            </div>
          </Panel>
        </aside>

        {/* CENTER COLUMN */}
        <section className="center-column">
          <CountdownHero
            launch={selectedLaunch}
            isBookmarked={selectedLaunch ? isBookmarked(selectedLaunch.id) : false}
            onToggleBookmark={onToggleBookmark}
            onInspectDetails={onInspectDetails}
          />

          <RadarDisplay
            selectedLaunch={selectedLaunch}
            onTargetSelect={(idx) => {
              if (launches[idx]) onSelectIndex(idx);
            }}
          />

          <Panel title="FLEET CONTROL & FILTERS" index="05" status="READY" className="payload-panel">
            <div className="payload-content">
              <div className="payload-emblem">
                <Zap size={23} />
              </div>
              <div className="payload-copy">
                <strong>QUICK AGENCY FILTER</strong>
                <small>Filter live manifest by agency fleet or program target:</small>
                <QuickFilterPills
                  selectedFilter={agency}
                  onSelectFilter={(newAg) => onAgencyChange(newAg)}
                />
              </div>
              <button
                className="reset-button"
                onClick={() => {
                  hudAudio.playClick();
                  onReset();
                }}
                title="Reset all filters"
              >
                <RefreshCw size={14} /> RESET
              </button>
            </div>
          </Panel>

          <div className="center-footer">
            <span>FIG. 01 / TACTICAL SITUATION DISPLAY</span>
            <span>REAL-TIME ORBITAL TRACKING TELEMETRY</span>
          </div>
        </section>

        {/* RIGHT COLUMN */}
        <aside className="side-column right-column">
          <Panel
            title="TARGET INTEL"
            index="06"
            status={selectedLaunch ? "LOCKED" : "SCANNING"}
          >
            {selectedLaunch ? (
              <>
                <div className="target-title">
                  <span className="target-reticle">
                    <Crosshair size={19} />
                  </span>
                  <div>
                    <small>LOCKED TARGET MISSION</small>
                    <strong>{selectedLaunch.name}</strong>
                  </div>
                </div>

                <div className="key-value">
                  <span>OPERATOR</span>
                  <strong className="cyan-text">
                    {selectedLaunch.provider || "UNAVAILABLE"}
                  </strong>
                </div>
                <div className="key-value">
                  <span>LAUNCH VEHICLE</span>
                  <strong>{selectedLaunch.rocket || "NOT ANNOUNCED"}</strong>
                </div>
                <div className="key-value">
                  <span>T-0 WINDOW</span>
                  <strong className="cyan-text compact-value">
                    {formatLaunchTime(selectedLaunch.launch_time)}
                  </strong>
                </div>
                <div className="key-value">
                  <span>LAUNCH SITE</span>
                  <strong>{selectedLaunch.launch_site || "NOT ANNOUNCED"}</strong>
                </div>
                <div className="key-value">
                  <span>COORDINATES</span>
                  <small className="mono-sub">
                    {selectedLaunch.latitude != null
                      ? `${selectedLaunch.latitude.toFixed(2)}°, ${selectedLaunch.longitude.toFixed(2)}°`
                      : "RANGE CLASSIFIED"}
                  </small>
                </div>

                <div className="target-btn-row">
                  <button
                    className="inspect-full-btn"
                    onClick={() => {
                      hudAudio.playClick();
                      onInspectDetails(selectedLaunch);
                    }}
                  >
                    INSPECT TELEMETRY <ArrowUpRight size={14} />
                  </button>
                  {selectedLaunch.url && (
                    <a
                      className="target-link"
                      href={selectedLaunch.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      SOURCE RECORD <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              </>
            ) : (
              <div className="empty-target">
                <Crosshair size={27} />
                <strong>SCANNING SECTOR</strong>
                <span>Select a mission from the manifest dock below to lock target.</span>
              </div>
            )}
          </Panel>

          <Panel title="SYSTEM DIAGNOSTICS" index="07" status="ALL GREEN">
            <div className="diagnostic-row">
              <span className="diag-icon">
                <Activity size={15} />
              </span>
              <div>
                <strong>FASTAPI TELEMETRY CORE</strong>
                <small>ASYNC HTTPX / PYDANTIC V2</small>
              </div>
              <span className="diag-value">ONLINE</span>
            </div>
            <Meter label="CACHE EFFICIENCY" value="94%" width="94%" color="green" />
            <Meter label="MEMORY FOOTPRINT" value="38 MB" width="35%" />
            <div className="diagnostic-row">
              <span className="diag-icon">
                <Database size={15} />
              </span>
              <div>
                <strong>CACHE STORE</strong>
                <small>IN-MEMORY TTL ENGINE</small>
              </div>
              <span className="diag-value">ACTIVE</span>
            </div>
            <div className="diagnostic-row">
              <span className="diag-icon">
                <Wifi size={15} />
              </span>
              <div>
                <strong>DOWNLINK DATA FEED</strong>
                <small>CLIENT POLLING / REFRESH</small>
              </div>
              <span className="diag-value">SYNCHRONIZED</span>
            </div>
          </Panel>

          <Panel title="TELEMETRY LOG FEED" index="08" status="STREAMING">
            <div className="telemetry-list">
              <div className="telemetry-entry">
                <span className="telemetry-time">SYS_INIT</span>
                <i className="event-dot cyan" />
                <div>
                  <strong>ORBITAL RADAR ARMED</strong>
                  <small>Tactical array calibrated</small>
                </div>
              </div>
              <div className="telemetry-entry">
                <span className="telemetry-time">NET_UPLINK</span>
                <i className="event-dot" />
                <div>
                  <strong>FASTAPI CONTROLLER ACTIVE</strong>
                  <small>Port 8000 listening</small>
                </div>
              </div>
              {loading && (
                <div className="telemetry-entry">
                  <span className="telemetry-time">NOW</span>
                  <i className="event-dot amber" />
                  <div>
                    <strong>ACQUIRING MANIFEST</strong>
                    <small>Querying aerospace database</small>
                  </div>
                </div>
              )}
              {launches.length > 0 && (
                <div className="telemetry-entry">
                  <span className="telemetry-time">NOW</span>
                  <i className="event-dot cyan" />
                  <div>
                    <strong>{launches.length} MISSIONS LOADED</strong>
                    <small>Source: {source.toUpperCase()}</small>
                  </div>
                </div>
              )}
              {error && (
                <div className="telemetry-entry">
                  <span className="telemetry-time">ALERT</span>
                  <i className="event-dot red" />
                  <div>
                    <strong>UPLINK ERROR</strong>
                    <small>{error}</small>
                  </div>
                </div>
              )}
            </div>
          </Panel>

          <section className="engagement-panel">
            <div className="engagement-heading">
              <AlertTriangle size={16} />
              <span>ENGAGEMENT PROTOCOL</span>
              <span className="engagement-light" />
            </div>
            <strong>
              {selectedLaunch ? "MISSION LOCK ACQUIRED" : "SYSTEM STANDBY"}
            </strong>
            <p>
              {selectedLaunch
                ? `Telemetry profile for ${selectedLaunch.name} is synchronized and ready for inspection.`
                : "Awaiting operator targeting command. Select a mission above to begin tracking."}
            </p>
            <div className="engagement-footer">
              <span>
                DEFCON: <b className="green-text">NORMAL</b>
              </span>
              <span>PROTOCOL 7-ALPHA</span>
            </div>
          </section>
        </aside>
      </div>

      {/* RESULTS DOCK */}
      {launches.length > 0 && (
        <section className="results-dock">
          <div className="results-dock-heading">
            <span>
              <Database size={14} /> FLIGHT TELEMETRY DOCK
            </span>
            <span>
              {launches.length} MISSION{launches.length === 1 ? "" : "S"} LOADED
            </span>
          </div>
          <div className="result-tabs">
            {launches.map((launch, index) => {
              const isSelected = selectedIndex === index;
              return (
                <button
                  key={launch.id || index}
                  className={`result-tab ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    hudAudio.playTargetLock();
                    onSelectIndex(index);
                  }}
                >
                  <span className="result-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="result-name">
                    {launch.name || "Unnamed Mission"}
                    <small>{launch.provider || "Provider Unknown"}</small>
                  </span>
                  <ArrowUpRight size={14} />
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

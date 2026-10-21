import { useState } from "react";
import { Search, X, Crosshair, Radio, Activity } from "lucide-react";
import "./App.css";

const API_URL = "http://localhost:8000/api/launches";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatLaunchTime(value) {
  if (!value) return "Not announced";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function App() {
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState("idle");
  const [launches, setLaunches] = useState([]);
  const [error, setError] = useState("");

  async function handleSearch(event) {
    event.preventDefault();
    const searchTerm = query.trim();
    if (!searchTerm || phase !== "idle") return;

    setPhase("searching");
    setLaunches([]);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}?q=${encodeURIComponent(searchTerm)}`
      );
      if (!response.ok) {
        throw new Error(`Mission API returned status ${response.status}.`);
      }
      const data = await response.json();
      setLaunches(Array.isArray(data.results) ? data.results : []);
    } catch (err) {
      console.error("Launch search failed:", err);
      setError(
        "Unable to retrieve mission data. Check that your backend is running and try again."
      );
    }

    await wait(900);
    setPhase("launching");
    await wait(1800);
    setPhase("dashboard");
  }

  function resetSearch() {
    setPhase("idle");
    setQuery("");
    setLaunches([]);
    setError("");
  }

  return (
    <main className={`mission-control phase-${phase}`}>
      <div className="star-field" />

      <header className="topbar">
        <a className="brand" href="/" onClick={(event) => event.preventDefault()}>
          <span className="brand-symbol">▲</span>
          <span>
            <span className="brand-name">T− MINUS</span>
            <span className="brand-subtitle">MISSION CONTROL</span>
          </span>
        </a>
        <nav className="navigation">
          <span className="nav-active">HOME</span>
          <span>MISSIONS</span>
          <span>ARCHIVE</span>
        </nav>
        <span className="system-status">
          <span className="status-dot" /> SYSTEM ONLINE
        </span>
      </header>

      {phase !== "dashboard" ? (
        <section className="launch-screen">
          <div className="eyebrow">
            <Radio size={14} />
            <span>LAUNCH INTELLIGENCE SYSTEM / 001</span>
          </div>
          <h1>
            THE SKY
            <br />
            IS <span>NOT THE LIMIT.</span>
          </h1>
          <p className="intro">
            Every launch has a story.
            <br />
            Find the missions taking us beyond Earth.
          </p>

          <form className="search-form" onSubmit={handleSearch}>
            <Search size={20} className="search-icon" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a launch, rocket or mission..."
              aria-label="Search launches"
              disabled={phase !== "idle"}
            />
            {query && phase === "idle" && (
              <button
                type="button"
                className="clear-button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
            <button
              className="search-button"
              type="submit"
              disabled={!query.trim() || phase !== "idle"}
            >
              INITIATE SEARCH <span>↗</span>
            </button>
          </form>

          <div className="rocket-stage">
            <div className="orbit orbit-outer" />
            <div className="orbit orbit-inner" />
            <span className="orbit-marker marker-one" />
            <span className="orbit-marker marker-two" />
            <span className="orbit-marker marker-three" />
            <div className="rocket-placeholder">
              <div className="rocket-nose" />
              <div className="rocket-body">
                <div className="rocket-window" />
                <div className="rocket-stripe" />
              </div>
              <div className="rocket-fin fin-left" />
              <div className="rocket-fin fin-right" />
              <div className="rocket-engine" />
              <div className="rocket-flame" />
            </div>
            <div className="stage-readout">
              <Crosshair size={15} />
              {phase === "idle" && "AWAITING MISSION PARAMETERS"}
              {phase === "searching" && "ACQUIRING MISSION TELEMETRY"}
              {phase === "launching" && "IGNITION / LIFTOFF"}
            </div>
            <div className="stage-caption">
              {phase === "idle" && "SEARCH TO BEGIN SEQUENCE"}
              {phase === "searching" && "ESTABLISHING UPLINK..."}
              {phase === "launching" && "ALL SYSTEMS GO"}
            </div>
          </div>

          <div className="bottom-readout">
            <span><Activity size={14} /> FLIGHT SYSTEMS READY</span>
            <span>{phase === "idle" ? "LL2 / UPLINK STANDBY" : "LL2 / RECEIVING DATA"}</span>
            <span>INDIA · UTC +05:30</span>
          </div>
        </section>
      ) : (
        <section className="dashboard-screen">
          <div className="dashboard-heading">
            <div>
              <div className="eyebrow"><Radio size={14} /> MISSION SEARCH COMPLETE</div>
              <h2>MISSION CONTROL<span>.</span></h2>
              <p>Search: {query}</p>
            </div>
            <button className="search-again" onClick={resetSearch}>↺ NEW SEARCH</button>
          </div>

          {error ? (
            <div className="dashboard-notice">
              <Activity size={18} />
              <div><strong>UPLINK ERROR</strong><p>{error}</p></div>
            </div>
          ) : launches.length === 0 ? (
            <div className="dashboard-notice">
              <Activity size={18} />
              <div>
                <strong>NO MATCHING UPCOMING LAUNCHES</strong>
                <p>No matching launches were returned for “{query}”. Try a broader term such as Falcon 9 or Starlink.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="dashboard-notice">
                <Activity size={18} />
                <div>
                  <strong>MISSION DATA RECEIVED</strong>
                  <p>Found {launches.length} matching upcoming launch{launches.length === 1 ? "" : "es"} from Launch Library 2.</p>
                </div>
              </div>

              <div className="mission-overview">
                <div className="overview-topline">
                  <span>MISSION DATABASE / LL2</span>
                  <span>{launches.length} RESULTS FOUND</span>
                </div>
                <div className="overview-stats">
                  <div className="overview-stat">
                    <span className="stat-icon">↗</span>
                    <div><small>SEARCH QUERY</small><strong>{query}</strong></div>
                  </div>
                  <div className="overview-stat">
                    <span className="stat-icon">◎</span>
                    <div><small>MISSIONS FOUND</small><strong>{String(launches.length).padStart(2, "0")}</strong></div>
                  </div>
                  <div className="overview-stat">
                    <span className="stat-icon">◷</span>
                    <div><small>DATA SOURCE</small><strong>SPACE DEVS / LL2</strong></div>
                  </div>
                </div>

                <div className="mission-list-heading">
                  <div>
                    <span className="section-index">01 — FLIGHT MANIFEST</span>
                    <h3>Upcoming missions<span>.</span></h3>
                  </div>
                  <span className="manifest-live"><i /> DATA RECEIVED</span>
                </div>

                <div className="mission-list">
                  {launches.map((launch, index) => (
                    <article className={`mission-card ${index === 0 ? "featured-mission" : ""}`} key={launch.id || index}>
                      <div className="mission-art">
                        <div className="mission-art-grid" />
                        <div className="mission-orbit mission-orbit-one" />
                        <div className="mission-orbit mission-orbit-two" />
                        <span className="mission-art-index">{String(index + 1).padStart(2, "0")}</span>
                        <div className="mini-rocket">
                          <span className="mini-rocket-nose" />
                          <span className="mini-rocket-body" />
                          <span className="mini-rocket-fin left-fin" />
                          <span className="mini-rocket-fin right-fin" />
                          <span className="mini-rocket-flame" />
                        </div>
                        <span className="mission-art-label">FLIGHT / LL2</span>
                      </div>

                      <div className="mission-card-content">
                        <div className="mission-card-topline">
                          <span className="mission-category">MISSION {String(index + 1).padStart(3, "0")}</span>
                          <span className="mission-status"><i /> {launch.status || "STATUS UNKNOWN"}</span>
                        </div>
                        <h4>{launch.name || "Unnamed mission"}</h4>
                        <p className="mission-provider">{launch.provider || "Launch provider unavailable"}</p>
                        <div className="mission-details">
                          <div><span>LAUNCH VEHICLE</span><strong>{launch.rocket || "Not announced"}</strong></div>
                          <div><span>LAUNCH WINDOW</span><strong>{formatLaunchTime(launch.launch_time)}</strong></div>
                          <div><span>LAUNCH SITE</span><strong>{launch.launch_site || "Site not announced"}</strong></div>
                          <div><span>LOCATION</span><strong>{launch.location || "Not available"}</strong></div>
                        </div>
                        {launch.mission && <p className="mission-description">{launch.mission}</p>}
                        <div className="mission-card-footer">
                          <span>MISSION DATA / {launch.id || "UNAVAILABLE"}</span>
                          {launch.url ? (
                            <a href={launch.url} target="_blank" rel="noreferrer">EXPLORE MISSION <span>↗</span></a>
                          ) : <span className="source-unavailable">SOURCE UNAVAILABLE</span>}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </>
          )}
          <p className="dashboard-footer">T− MINUS / MISSION INTELLIGENCE / LAUNCH LIBRARY 2</p>
        </section>
      )}
    </main>
  );
}

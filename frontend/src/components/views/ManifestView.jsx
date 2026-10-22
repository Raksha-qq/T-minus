import { useState } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  MapPin,
  Rocket,
  Calendar,
  X,
  Radio,
} from "lucide-react";
import { QuickFilterPills } from "../QuickFilterPills";
import { formatLaunchTime, getStatusTheme } from "../../utils/formatters";
import { hudAudio } from "../../utils/audio";

export function ManifestView({
  launches,
  loading,
  error,
  query,
  onQueryChange,
  onSearchSubmit,
  agency,
  onAgencyChange,
  isBookmarked,
  onToggleBookmark,
  onInspectDetails,
}) {
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'

  return (
    <div className="manifest-view">
      <div className="manifest-controls-panel">
        <div className="manifest-search-row">
          <form
            className="hud-search manifest-search-input"
            onSubmit={(e) => {
              e.preventDefault();
              hudAudio.playClick();
              onSearchSubmit?.(query);
            }}
          >
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search by mission, vehicle, pad, or payload..."
              aria-label="Filter flight manifest"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  hudAudio.playClick();
                  onQueryChange("");
                  onSearchSubmit?.("");
                }}
              >
                <X size={15} />
              </button>
            )}
            <button
              className="search-submit"
              type="submit"
              disabled={!query?.trim() || loading}
              aria-label="Search mission"
            >
              <Search size={14} />
            </button>
          </form>

          <div className="view-mode-toggle">
            <button
              className={`view-mode-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => {
                hudAudio.playClick();
                setViewMode("grid");
              }}
              title="Card Grid View"
            >
              <Grid size={15} />
            </button>
            <button
              className={`view-mode-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => {
                hudAudio.playClick();
                setViewMode("table");
              }}
              title="Tactical Table View"
            >
              <List size={15} />
            </button>
          </div>
        </div>

        <div className="manifest-filters-row">
          <span className="filter-label">
            <Filter size={13} /> FLEET FILTER:
          </span>
          <QuickFilterPills
            selectedFilter={agency}
            onSelectFilter={(newAg) => onAgencyChange(newAg)}
          />
        </div>
      </div>

      {loading && (
        <div className="manifest-loading-state">
          <span className="spinner" />
          <span>QUERYING GLOBAL SPACEPORT SCHEDULES...</span>
        </div>
      )}

      {error && (
        <div className="manifest-error-state">
          <strong>UPLINK ALERT</strong>
          <p>{error}</p>
        </div>
      )}

      {!loading && launches.length === 0 && (
        <div className="manifest-empty-state">
          <Radio size={32} />
          <h3>NO MISSIONS FOUND</h3>
          <p>
            No orbital launches match the criteria &quot;{query || agency}&quot;. Try adjusting your search query or fleet filter.
          </p>
        </div>
      )}

      {!loading && launches.length > 0 && viewMode === "grid" && (
        <div className="manifest-grid">
          {launches.map((launch) => {
            const statusTheme = getStatusTheme(launch.status);
            const bookmarked = isBookmarked(launch.id);

            return (
              <article key={launch.id} className="manifest-card">
                <div className="card-media">
                  {launch.image ? (
                    <img src={launch.image} alt={launch.name} loading="lazy" />
                  ) : (
                    <div className="card-media-placeholder">
                      <Rocket size={28} />
                    </div>
                  )}
                  <div className="card-media-overlay" />
                  <span className={`status-badge ${statusTheme.tag}`}>
                    {statusTheme.label}
                  </span>
                  <button
                    className={`card-bookmark-btn ${bookmarked ? "bookmarked" : ""}`}
                    onClick={() => onToggleBookmark(launch)}
                    title={bookmarked ? "Remove from watchlist" : "Pin to watchlist"}
                  >
                    {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  </button>
                </div>

                <div className="card-body">
                  <div className="card-provider-pill">{launch.provider || "OPERATOR TBD"}</div>
                  <h3 className="card-title" title={launch.name}>
                    {launch.name}
                  </h3>

                  <div className="card-metadata">
                    <div className="meta-item">
                      <Rocket size={13} />
                      <span>{launch.rocket || "Launch Vehicle TBD"}</span>
                    </div>
                    <div className="meta-item">
                      <Calendar size={13} />
                      <span className="cyan-text">
                        {formatLaunchTime(launch.launch_time)}
                      </span>
                    </div>
                    <div className="meta-item">
                      <MapPin size={13} />
                      <span>{launch.launch_site || launch.location || "Pad classified"}</span>
                    </div>
                  </div>

                  <p className="card-description">
                    {launch.mission || "Orbital trajectory parameters undergoing final validation."}
                  </p>
                </div>

                <div className="card-footer">
                  <button
                    className="card-inspect-btn"
                    onClick={() => {
                      hudAudio.playClick();
                      onInspectDetails(launch);
                    }}
                  >
                    INSPECT SPECS <ExternalLink size={13} />
                  </button>
                  {launch.probability != null && (
                    <span className="weather-chip" title="Weather Go Probability">
                      WX GO: <b>{launch.probability}%</b>
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!loading && launches.length > 0 && viewMode === "table" && (
        <div className="manifest-table-wrapper">
          <table className="manifest-table">
            <thead>
              <tr>
                <th>TARGET MISSION</th>
                <th>OPERATOR</th>
                <th>VEHICLE</th>
                <th>T-0 WINDOW (UTC)</th>
                <th>LAUNCH PAD / SITE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {launches.map((launch) => {
                const statusTheme = getStatusTheme(launch.status);
                const bookmarked = isBookmarked(launch.id);

                return (
                  <tr key={launch.id}>
                    <td className="table-mission-name">
                      <strong>{launch.name}</strong>
                      <small>{launch.mission_type || "Orbital Flight"}</small>
                    </td>
                    <td>
                      <span className="table-provider">{launch.provider || "Unknown"}</span>
                    </td>
                    <td>{launch.rocket || "TBD"}</td>
                    <td className="cyan-text">{formatLaunchTime(launch.launch_time)}</td>
                    <td className="table-location">
                      <span>{launch.launch_site || launch.location || "Classified"}</span>
                    </td>
                    <td>
                      <span className={`status-badge-inline ${statusTheme.tag}`}>
                        {statusTheme.label}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="table-action-btn"
                          onClick={() => {
                            hudAudio.playClick();
                            onInspectDetails(launch);
                          }}
                          title="Inspect Telemetry"
                        >
                          <ExternalLink size={14} />
                        </button>
                        <button
                          className={`table-action-btn ${bookmarked ? "bookmarked" : ""}`}
                          onClick={() => onToggleBookmark(launch)}
                          title={bookmarked ? "Remove bookmark" : "Bookmark launch"}
                        >
                          {bookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

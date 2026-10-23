import { Bookmark, Trash2, Download, ExternalLink, Rocket, MapPin, Calendar } from "lucide-react";
import { formatLaunchTime, getStatusTheme } from "../../utils/formatters";
import { hudAudio } from "../../utils/audio";

export function WatchlistView({
  watchlist,
  onRemoveBookmark,
  onInspectDetails,
  onSwitchToManifest,
}) {
  function handleExport() {
    hudAudio.playClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(watchlist, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `t-minus-watchlist-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  return (
    <div className="watchlist-view">
      <div className="watchlist-header-bar">
        <div className="watchlist-title-wrap">
          <span className="section-kicker">MISSION PERSISTENCE LAYER</span>
          <h2>PINNED WATCHLIST ({watchlist.length})</h2>
        </div>

        {watchlist.length > 0 && (
          <div className="watchlist-actions">
            <button
              className="export-btn"
              onClick={handleExport}
              title="Export watchlist as JSON briefing"
            >
              <Download size={14} /> EXPORT MANIFEST
            </button>
          </div>
        )}
      </div>

      {watchlist.length === 0 ? (
        <div className="watchlist-empty">
          <Bookmark size={36} />
          <h3>NO MISSIONS PINNED</h3>
          <p>
            Pin upcoming rocket launches from the Command HUD or Flight Manifest to monitor their countdowns here.
          </p>
          <button
            className="browse-manifest-btn"
            onClick={() => {
              hudAudio.playClick();
              onSwitchToManifest();
            }}
          >
            BROWSE FLIGHT MANIFEST
          </button>
        </div>
      ) : (
        <div className="watchlist-grid">
          {watchlist.map((launch) => {
            const statusTheme = getStatusTheme(launch.status);

            return (
              <div key={launch.id} className="watchlist-card">
                <div className="watchlist-card-top">
                  <span className={`status-badge-inline ${statusTheme.tag}`}>
                    {statusTheme.label}
                  </span>
                  <button
                    className="remove-pin-btn"
                    onClick={() => onRemoveBookmark(launch.id)}
                    title="Remove from Watchlist"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <h3 className="watchlist-mission-title">{launch.name}</h3>

                <div className="watchlist-meta">
                  <div className="meta-item">
                    <Rocket size={13} />
                    <span>{launch.rocket || "Rocket TBD"}</span>
                  </div>
                  <div className="meta-item">
                    <Calendar size={13} />
                    <span className="cyan-text">
                      {formatLaunchTime(launch.launch_time)}
                    </span>
                  </div>
                  <div className="meta-item">
                    <MapPin size={13} />
                    <span>{launch.launch_site || launch.location || "Classified Pad"}</span>
                  </div>
                </div>

                <div className="watchlist-card-footer">
                  <span className="provider-label">{launch.provider || "OPERATOR"}</span>
                  <button
                    className="watchlist-inspect-btn"
                    onClick={() => {
                      hudAudio.playClick();
                      onInspectDetails(launch);
                    }}
                  >
                    SPECS <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

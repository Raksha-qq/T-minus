import { useEffect } from "react";
import {
  X,
  ExternalLink,
  MapPin,
  Rocket,
  ShieldCheck,
  CloudSun,
  Radio,
  Bookmark,
  BookmarkCheck,
  Crosshair,
} from "lucide-react";
import { formatLaunchTime, formatCoordinates, getStatusTheme } from "../utils/formatters";
import { hudAudio } from "../utils/audio";

export function LaunchDetailModal({
  launch,
  onClose,
  isBookmarked,
  onToggleBookmark,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!launch) return null;

  const statusTheme = getStatusTheme(launch.status);
  const coords = formatCoordinates(launch.latitude, launch.longitude);
  const weatherProb = launch.probability != null ? `${launch.probability}%` : "EVALUATING";

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-index">TELEMETRY FILE // {launch.id}</span>
            <h2>{launch.name}</h2>
          </div>

          <div className="modal-actions">
            <button
              className={`modal-bookmark-btn ${isBookmarked ? "bookmarked" : ""}`}
              onClick={() => onToggleBookmark(launch)}
              title={isBookmarked ? "Remove from watchlist" : "Pin to watchlist"}
            >
              {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              <span>{isBookmarked ? "PINNED" : "WATCHLIST"}</span>
            </button>

            <button
              className="modal-close-btn"
              onClick={() => {
                hudAudio.playClick();
                onClose();
              }}
              aria-label="Close telemetry modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          {launch.image && (
            <div className="modal-hero-image">
              <img src={launch.image} alt={launch.name} loading="lazy" />
              <div className="image-overlay-vignette" />
              <div className="image-badge">
                <span className={`status-badge ${statusTheme.tag}`}>
                  {statusTheme.label}
                </span>
              </div>
            </div>
          )}

          <div className="modal-grid">
            <div className="spec-card">
              <div className="spec-icon">
                <Rocket size={16} />
              </div>
              <div className="spec-details">
                <label>LAUNCH VEHICLE</label>
                <strong>{launch.rocket || "Unannounced Vehicle"}</strong>
                <small>FAMILY: {launch.rocket_family || "Orbital Class"}</small>
              </div>
            </div>

            <div className="spec-card">
              <div className="spec-icon">
                <ShieldCheck size={16} />
              </div>
              <div className="spec-details">
                <label>LAUNCH OPERATOR</label>
                <strong>{launch.provider || "Classified Agency"}</strong>
                <small>NATIONALITY: {launch.provider_country || "INTERNATIONAL"}</small>
              </div>
            </div>

            <div className="spec-card">
              <div className="spec-icon">
                <MapPin size={16} />
              </div>
              <div className="spec-details">
                <label>LAUNCH COMPLEX & SITE</label>
                <strong>{launch.launch_site || "Classified Pad"}</strong>
                <small>{launch.location || "Earth Orbital Spaceport"}</small>
              </div>
            </div>

            <div className="spec-card">
              <div className="spec-icon">
                <Crosshair size={16} />
              </div>
              <div className="spec-details">
                <label>SATELLITE COORDINATES</label>
                <strong className="cyan-text">{coords}</strong>
                <small>REFERENCE FRAME: WGS 84</small>
              </div>
            </div>

            <div className="spec-card">
              <div className="spec-icon">
                <CloudSun size={16} />
              </div>
              <div className="spec-details">
                <label>WEATHER GO PROBABILITY</label>
                <strong className="cyan-text">{weatherProb}</strong>
                <small>{launch.weather_concerns || "Zero operational weather violations"}</small>
              </div>
            </div>

            <div className="spec-card">
              <div className="spec-icon">
                <Radio size={16} />
              </div>
              <div className="spec-details">
                <label>SCHEDULED T-0 WINDOW</label>
                <strong>{formatLaunchTime(launch.launch_time)}</strong>
                <small>STATUS: {launch.status}</small>
              </div>
            </div>
          </div>

          <div className="modal-mission-summary">
            <h3>MISSION OBJECTIVES & TELEMETRY MANIFEST</h3>
            <p>
              {launch.mission ||
                "Primary orbital deployment parameters and payload payload specifications are undergoing pre-flight clearance."}
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <div className="modal-status-pill">
            <span className="status-dot" />
            <span>ENCRYPTED TELEMETRY LINK CONFIRMED</span>
          </div>

          {launch.url && (
            <a
              href={launch.url}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-modal-link"
              onClick={() => hudAudio.playClick()}
            >
              SPACE DEVS SOURCE RECORD <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

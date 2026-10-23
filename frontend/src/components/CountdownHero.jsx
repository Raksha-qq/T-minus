import { useEffect, useState } from "react";
import { Activity, Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { formatLaunchTime, getCountdown } from "../utils/formatters";
import { hudAudio } from "../utils/audio";

export function CountdownHero({
  launch,
  isBookmarked,
  onToggleBookmark,
  onInspectDetails,
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const countdown = getCountdown(launch?.launch_time, now);
  const launchName = launch?.name || "AWAITING MISSION DESIGNATION";
  const provider = launch?.provider || "AEROSPACE PROVIDER";
  const rocket = launch?.rocket || "LAUNCH VEHICLE";

  return (
    <section className={`countdown-panel countdown-${countdown.state}`} aria-live="polite">
      <div className="countdown-label">
        <span className="countdown-icon">
          <Activity size={16} />
        </span>
        <div>
          <span className="countdown-kicker">MISSION COUNTDOWN STATUS</span>
          <strong>{countdown.label}</strong>
        </div>
        <div className="countdown-controls">
          {launch && (
            <button
              className={`hero-action-btn ${isBookmarked ? "bookmarked" : ""}`}
              onClick={() => onToggleBookmark(launch)}
              title={isBookmarked ? "Remove from Watchlist" : "Pin to Watchlist"}
            >
              {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
              <span>{isBookmarked ? "PINNED" : "PIN MISSION"}</span>
            </button>
          )}
          <span className="countdown-live">
            <i /> LIVE
          </span>
        </div>
      </div>

      {countdown.parts ? (
        <div
          className="countdown-clock"
          aria-label={`${countdown.parts.days} days, ${countdown.parts.hours} hours, ${countdown.parts.minutes} minutes, ${countdown.parts.seconds} seconds`}
        >
          {[
            ["DAYS", countdown.parts.days],
            ["HRS", countdown.parts.hours],
            ["MIN", countdown.parts.minutes],
            ["SEC", countdown.parts.seconds],
          ].map(([label, value]) => (
            <div className="countdown-unit" key={label}>
              <strong>{String(value).padStart(2, "0")}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="countdown-fallback">
          {countdown.state === "elapsed"
            ? "T+ SCHEDULED LAUNCH WINDOW HAS PASSED"
            : "INITIALIZING TELEMETRY LINK / AWAITING MISSION DATA"}
        </div>
      )}

      <div className="countdown-mission">
        <div className="countdown-mission-info">
          <span className="countdown-mission-name" title={launchName}>
            {launchName}
          </span>
          <span className="countdown-mission-meta">
            <span className="provider-tag">{provider}</span>
            <span className="rocket-tag">{rocket}</span>
            <span className="time-tag">
              {launch?.launch_time ? formatLaunchTime(launch.launch_time) : "TBD"}
            </span>
          </span>
        </div>

        {launch && (
          <button
            className="inspect-specs-btn"
            onClick={() => {
              hudAudio.playClick();
              onInspectDetails(launch);
            }}
          >
            SPECS <ExternalLink size={12} />
          </button>
        )}
      </div>
    </section>
  );
}

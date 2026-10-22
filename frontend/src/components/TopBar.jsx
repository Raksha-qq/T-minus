import { Crosshair, Volume2, VolumeX, Keyboard } from "lucide-react";
import { hudAudio } from "../utils/audio";

export function TopBar({
  activeTab,
  onTabChange,
  source = "live",
  isMuted,
  onToggleMute,
  onOpenShortcuts,
  watchlistCount = 0,
}) {
  const tabs = [
    { id: "command", label: "COMMAND" },
    { id: "manifest", label: "FLIGHT MANIFEST" },
    { id: "watchlist", label: `WATCHLIST (${watchlistCount})` },
    { id: "intel", label: "SYSTEM INTEL" },
  ];

  return (
    <header className="topbar">
      <div className="brand" role="banner">
        <span className="brand-mark">
          <Crosshair size={23} strokeWidth={1.5} />
        </span>
        <span className="brand-copy">
          <span className="brand-name">
            T−MINUS<span className="brand-period">.</span>
          </span>
          <span className="brand-subtitle">AEROSPACE INTELLIGENCE DIVISION</span>
        </span>
      </div>

      <nav className="navigation" aria-label="Main navigation">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`nav-tab-btn ${isActive ? "nav-active" : ""}`}
              onClick={() => {
                hudAudio.playClick();
                onTabChange(tab.id);
              }}
            >
              {isActive && <i />}
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="topbar-actions">
        <button
          className={`hud-icon-btn ${!isMuted ? "active-audio" : ""}`}
          onClick={onToggleMute}
          title={isMuted ? "Enable HUD Sound FX (M)" : "Mute Sound (M)"}
          aria-label="Toggle Sound"
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>

        <button
          className="hud-icon-btn"
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts (?)"
          aria-label="Keyboard Shortcuts"
        >
          <Keyboard size={15} />
        </button>

        <div className="system-status">
          <span className={`status-dot ${source === "fallback" ? "amber" : ""}`} />
          <span>
            {source === "live"
              ? "UPLINK NOMINAL"
              : source === "cached"
              ? "CACHE SYNCED"
              : "STANDBY TELEMETRY"}
          </span>
          <span className="status-divider" />
          <span className="status-version">SYS. 05.10</span>
        </div>
      </div>
    </header>
  );
}

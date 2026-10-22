import { useEffect, useState } from "react";

export function CommandStrip({ activeTab = "command" }) {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const utcString = time.toUTCString().slice(17, 25) + " UTC";
  const localString = time.toLocaleTimeString([], { hour12: false });

  const tabLabels = {
    command: "TACTICAL SITUATION DISPLAY",
    manifest: "ORBITAL FLIGHT MANIFEST",
    watchlist: "PINNED MISSIONS / WATCHLIST",
    intel: "SYSTEM ARCHITECTURE & TELEMETRY",
  };

  return (
    <div className="command-strip">
      <div className="breadcrumb">
        <span>OPS CENTER</span>
        <span className="crumb-slash">/</span>
        <strong>{tabLabels[activeTab] || "OVERVIEW"}</strong>
      </div>
      <div className="command-right">
        <span className="live-label">
          <i /> LIVE TELEMETRY
        </span>
        <span className="utc-label">
          ZULU: <b className="cyan-text">{utcString}</b> | LOCAL: {localString}
        </span>
      </div>
    </div>
  );
}

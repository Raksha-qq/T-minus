import { useState, useEffect, useRef } from "react";
import { TopBar } from "./components/TopBar";
import { CommandStrip } from "./components/CommandStrip";
import { CommandView } from "./components/views/CommandView";
import { ManifestView } from "./components/views/ManifestView";
import { WatchlistView } from "./components/views/WatchlistView";
import { SystemIntelView } from "./components/views/SystemIntelView";
import { LaunchDetailModal } from "./components/LaunchDetailModal";
import { KeyboardShortcutsModal } from "./components/KeyboardShortcutsModal";
import { useLaunches } from "./hooks/useLaunches";
import { useWatchlist } from "./hooks/useWatchlist";
import { hudAudio } from "./utils/audio";
import "./App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("command");
  const [inspectingLaunch, setInspectingLaunch] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isMuted, setIsMuted] = useState(() => hudAudio.isMuted());
  const searchInputRef = useRef(null);

  const {
    query,
    setQuery,
    agency,
    setAgency,
    executeSearch,
    launches,
    source,
    loading,
    error,
    selectedIndex,
    setSelectedIndex,
    selectedLaunch,
    refetch,
  } = useLaunches();

  const { watchlist, isBookmarked, toggleBookmark, removeBookmark, count: watchlistCount } =
    useWatchlist();

  function toggleMute() {
    const nextMuted = hudAudio.toggleMute();
    setIsMuted(nextMuted);
  }

  function handleReset() {
    setQuery("");
    setAgency("");
    refetch();
  }

  // Keyboard navigation shortcuts
  useEffect(() => {
    function handleKeyDown(e) {
      // Don't trigger hotkeys if typing in an input
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        if (e.key === "Escape") {
          e.target.blur();
        }
        return;
      }

      if (e.key === "1") {
        hudAudio.playClick();
        setActiveTab("command");
      } else if (e.key === "2") {
        hudAudio.playClick();
        setActiveTab("manifest");
      } else if (e.key === "3") {
        hudAudio.playClick();
        setActiveTab("watchlist");
      } else if (e.key === "4") {
        hudAudio.playClick();
        setActiveTab("intel");
      } else if (e.key === "/") {
        e.preventDefault();
        hudAudio.playClick();
        setActiveTab("command");
        setTimeout(() => searchInputRef.current?.focus(), 50);
      } else if (e.key === "m" || e.key === "M") {
        toggleMute();
      } else if (e.key === "?") {
        hudAudio.playClick();
        setShowShortcuts((prev) => !prev);
      } else if (e.key === "Escape") {
        setInspectingLaunch(null);
        setShowShortcuts(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className="mission-control">
      <div className="ambient-grid" />
      <div className="scanline" />

      {/* TOP NAVIGATION BAR */}
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        source={source}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onOpenShortcuts={() => setShowShortcuts(true)}
        watchlistCount={watchlistCount}
      />

      {/* BREADCRUMB & REAL-TIME CLOCKS */}
      <CommandStrip activeTab={activeTab} />

      {/* ACTIVE VIEW ROUTER */}
      {activeTab === "command" && (
        <CommandView
          launches={launches}
          selectedLaunch={selectedLaunch}
          selectedIndex={selectedIndex}
          onSelectIndex={setSelectedIndex}
          query={query}
          onQueryChange={setQuery}
          onSearchSubmit={executeSearch}
          agency={agency}
          onAgencyChange={setAgency}
          loading={loading}
          error={error}
          source={source}
          onReset={handleReset}
          isBookmarked={isBookmarked}
          onToggleBookmark={toggleBookmark}
          onInspectDetails={setInspectingLaunch}
          searchInputRef={searchInputRef}
        />
      )}

      {activeTab === "manifest" && (
        <ManifestView
          launches={launches}
          loading={loading}
          error={error}
          query={query}
          onQueryChange={setQuery}
          onSearchSubmit={executeSearch}
          agency={agency}
          onAgencyChange={setAgency}
          isBookmarked={isBookmarked}
          onToggleBookmark={toggleBookmark}
          onInspectDetails={setInspectingLaunch}
        />
      )}

      {activeTab === "watchlist" && (
        <WatchlistView
          watchlist={watchlist}
          onRemoveBookmark={removeBookmark}
          onInspectDetails={setInspectingLaunch}
          onSwitchToManifest={() => setActiveTab("manifest")}
        />
      )}

      {activeTab === "intel" && <SystemIntelView />}

      {/* PERSISTENT BOTTOM STATUS BAR */}
      <footer className="bottom-bar">
        <div className="bottom-brand">
          <span className="footer-mark">▲</span> T−MINUS <span className="footer-divider">/</span> MISSION CONTROL SYSTEMS
        </div>
        <div className="bottom-nav">
          <button
            className={`bottom-nav-link ${activeTab === "command" ? "bottom-nav-active" : ""}`}
            onClick={() => setActiveTab("command")}
          >
            {activeTab === "command" && <i />} COMMAND HUD
          </button>
          <button
            className={`bottom-nav-link ${activeTab === "manifest" ? "bottom-nav-active" : ""}`}
            onClick={() => setActiveTab("manifest")}
          >
            {activeTab === "manifest" && <i />} FLIGHT MANIFEST
          </button>
          <button
            className={`bottom-nav-link ${activeTab === "watchlist" ? "bottom-nav-active" : ""}`}
            onClick={() => setActiveTab("watchlist")}
          >
            {activeTab === "watchlist" && <i />} WATCHLIST ({watchlistCount})
          </button>
          <button
            className={`bottom-nav-link ${activeTab === "intel" ? "bottom-nav-active" : ""}`}
            onClick={() => setActiveTab("intel")}
          >
            {activeTab === "intel" && <i />} ARCHITECTURE & INTEL
          </button>
        </div>
        <div className="bottom-meta">
          <span className="status-dot" /> ALL SYSTEMS NOMINAL <span className="footer-divider">|</span> BUILD 2.6.04
        </div>
      </footer>

      {/* MODALS */}
      {inspectingLaunch && (
        <LaunchDetailModal
          launch={inspectingLaunch}
          onClose={() => setInspectingLaunch(null)}
          isBookmarked={isBookmarked(inspectingLaunch.id)}
          onToggleBookmark={toggleBookmark}
        />
      )}

      {showShortcuts && (
        <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />
      )}
    </main>
  );
}

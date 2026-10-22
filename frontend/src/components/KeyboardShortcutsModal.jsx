import { X } from "lucide-react";
import { hudAudio } from "../utils/audio";

export function KeyboardShortcutsModal({ onClose }) {
  const shortcuts = [
    { key: "1", description: "Switch to COMMAND tactical view" },
    { key: "2", description: "Switch to FLIGHT MANIFEST view" },
    { key: "3", description: "Switch to WATCHLIST pinned missions" },
    { key: "4", description: "Switch to SYSTEM INTEL & architecture" },
    { key: "/", description: "Focus search bar" },
    { key: "M", description: "Toggle HUD Audio Synthesizer mute/unmute" },
    { key: "?", description: "Open / close this shortcuts guide" },
    { key: "Esc", description: "Close any active modal overlay" },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-index">SYSTEM QUICK-COMMANDS</span>
            <h2>HUD KEYBOARD SHORTCUTS</h2>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => {
              hudAudio.playClick();
              onClose();
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="shortcuts-list">
          {shortcuts.map((s) => (
            <div className="shortcut-row" key={s.key}>
              <kbd className="hud-key">{s.key}</kbd>
              <span className="shortcut-desc">{s.description}</span>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <span className="footer-meta">TACTICAL HOTKEYS ENABLED ACROSS ALL VIEWS</span>
        </div>
      </div>
    </div>
  );
}

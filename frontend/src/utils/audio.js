/**
 * Synthesizer for aerospace HUD audio cues using native Web Audio API.
 * Zero external audio assets required; synthesized in real-time.
 */

class HudAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = true; // default muted for respectful UX, toggled by user
  }

  _init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (!this.muted) {
      this._init();
      this.playBeep(880, 0.08, "sine");
    }
    return this.muted;
  }

  setMuted(state) {
    this.muted = state;
    if (!this.muted) this._init();
  }

  playBeep(frequency = 440, duration = 0.05, type = "sine", gainLevel = 0.06) {
    if (this.muted) return;
    try {
      this._init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainLevel, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio playback gracefully suppressed if context blocked
    }
  }

  playTargetLock() {
    if (this.muted) return;
    this.playBeep(620, 0.04, "square", 0.04);
    setTimeout(() => this.playBeep(940, 0.06, "square", 0.05), 50);
  }

  playClick() {
    if (this.muted) return;
    this.playBeep(1200, 0.02, "sine", 0.03);
  }

  playRadarPing() {
    if (this.muted) return;
    this.playBeep(780, 0.09, "sine", 0.02);
  }

  playLaunchAlert() {
    if (this.muted) return;
    this.playBeep(520, 0.1, "sawtooth", 0.05);
    setTimeout(() => this.playBeep(1040, 0.12, "sine", 0.06), 120);
  }
}

export const hudAudio = new HudAudioEngine();

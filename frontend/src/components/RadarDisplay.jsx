import { Crosshair } from "lucide-react";
import { hudAudio } from "../utils/audio";
import { formatCoordinates } from "../utils/formatters";

export function RadarDisplay({ selectedLaunch, onTargetSelect }) {
  const lat = selectedLaunch?.latitude ?? 28.5619;
  const lon = selectedLaunch?.longitude ?? -80.5772;
  const coords = formatCoordinates(lat, lon);

  return (
    <div className="radar-panel">
      <div className="radar-topline">
        <span>
          <Crosshair size={14} /> TACTICAL TRACKING ARRAY
        </span>
        <span className="radar-coords">{coords}</span>
      </div>

      <div className="radar-wrap">
        <div className="radar-sweep" />
        <div className="radar-ring ring-1" />
        <div className="radar-ring ring-2" />
        <div className="radar-ring ring-3" />
        <div className="radar-ring ring-4" />
        <div className="radar-crosshair horizontal" />
        <div className="radar-crosshair vertical" />
        <div className="radar-diagonal diagonal-a" />
        <div className="radar-diagonal diagonal-b" />

        <div className="radar-center">
          <span />
          <i />
        </div>

        <button
          type="button"
          className="radar-target target-a"
          onClick={() => {
            hudAudio.playRadarPing();
            onTargetSelect?.(0);
          }}
          title="Target Alpha - Primary Trajectory"
        >
          <i />
          <b>T-01</b>
        </button>

        <button
          type="button"
          className="radar-target target-b"
          onClick={() => {
            hudAudio.playRadarPing();
            onTargetSelect?.(1);
          }}
          title="Target Bravo - Secondary Orbit"
        >
          <i />
          <b>T-02</b>
        </button>

        <button
          type="button"
          className="radar-target target-c"
          onClick={() => {
            hudAudio.playRadarPing();
            onTargetSelect?.(2);
          }}
          title="Target Charlie - Ground Station Intercept"
        >
          <i />
          <b>T-03</b>
        </button>

        <span className="radar-blip blip-a" />
        <span className="radar-blip blip-b" />
        <span className="radar-blip blip-c" />

        <span className="radar-degree degree-top">000°</span>
        <span className="radar-degree degree-right">090°</span>
        <span className="radar-degree degree-bottom">180°</span>
        <span className="radar-degree degree-left">270°</span>

        <div className="radar-cross-label label-n">N</div>
        <div className="radar-cross-label label-e">E</div>
        <div className="radar-cross-label label-s">S</div>
        <div className="radar-cross-label label-w">W</div>

        <div className="radar-corner corner-tl" />
        <div className="radar-corner corner-tr" />
        <div className="radar-corner corner-bl" />
        <div className="radar-corner corner-br" />
      </div>

      <div className="radar-legend">
        <span>
          <i className="legend-cyan" /> TRACKING GRID
        </span>
        <span>
          <i className="legend-white" /> TARGET PAD
        </span>
        <span>
          <i className="legend-red" /> RANGE SECTOR
        </span>
      </div>

      <div className="radar-bottomline">
        <span>
          SCAN MODE <b>360° / CONTINUOUS</b>
        </span>
        <span>
          TARGET SITE <b>{selectedLaunch?.launch_site || "GLOBAL ARRAY"}</b>
        </span>
        <span>
          STATUS <b>LOCKED</b>
        </span>
      </div>
    </div>
  );
}

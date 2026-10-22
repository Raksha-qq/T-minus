import { hudAudio } from "../utils/audio";

const FILTERS = [
  { id: "", label: "ALL FLEETS" },
  { id: "SpaceX", label: "SPACEX" },
  { id: "NASA", label: "NASA" },
  { id: "ISRO", label: "ISRO" },
  { id: "Rocket Lab", label: "ROCKET LAB" },
  { id: "Starship", label: "STARSHIP" },
  { id: "Artemis", label: "ARTEMIS" },
];

export function QuickFilterPills({ selectedFilter, onSelectFilter }) {
  return (
    <div className="filter-pills-row" role="group" aria-label="Mission Agency Filters">
      {FILTERS.map((f) => {
        const isSelected = selectedFilter === f.id;
        return (
          <button
            key={f.id}
            type="button"
            className={`filter-pill ${isSelected ? "selected" : ""}`}
            onClick={() => {
              hudAudio.playClick();
              onSelectFilter(f.id);
            }}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

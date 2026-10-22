/**
 * Formatting utilities for aerospace telemetry, countdowns, and coordinates.
 */

export function formatLaunchTime(value) {
  if (!value) return "NOT ANNOUNCED";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).toUpperCase() + " UTC";
}

export function formatLocalDate(value) {
  if (!value) return "NOT ANNOUNCED";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).toUpperCase();
}

export function getCountdown(value, now) {
  if (!value) return { state: "unknown", label: "NOT ANNOUNCED", parts: null };

  const target = new Date(value).getTime();
  if (!Number.isFinite(target)) return { state: "unknown", label: "TIME UNAVAILABLE", parts: null };

  const difference = target - now;
  if (difference <= 0) return { state: "elapsed", label: "T+ TIME ELAPSED", parts: null };

  const totalSeconds = Math.floor(difference / 1000);
  return {
    state: "counting",
    label: "T− COUNTDOWN",
    totalSeconds,
    parts: {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    },
  };
}

export function formatCoordinates(lat, lon) {
  if (lat == null || lon == null) return "COORDINATES CLASSIFIED";
  const latDir = lat >= 0 ? "N" : "S";
  const lonDir = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}°${latDir} / ${Math.abs(lon).toFixed(4)}°${lonDir}`;
}

export function getStatusTheme(status) {
  const s = (status || "").toLowerCase();
  if (s.includes("go")) return { tag: "status-go", label: "GO FOR LAUNCH" };
  if (s.includes("hold") || s.includes("delay")) return { tag: "status-hold", label: "HOLD / DELAYED" };
  if (s.includes("success")) return { tag: "status-success", label: "SUCCESS" };
  return { tag: "status-tbd", label: "TBD / SCHEDULED" };
}

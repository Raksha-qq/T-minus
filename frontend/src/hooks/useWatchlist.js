import { useState, useEffect, useCallback } from "react";
import { hudAudio } from "../utils/audio";

const STORAGE_KEY = "t_minus_mission_watchlist";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch (e) {
      console.warn("Could not save watchlist to localStorage", e);
    }
  }, [watchlist]);

  const isBookmarked = useCallback(
    (id) => watchlist.some((item) => String(item.id) === String(id)),
    [watchlist]
  );

  const toggleBookmark = useCallback((launch) => {
    if (!launch || !launch.id) return;
    hudAudio.playTargetLock();
    setWatchlist((prev) => {
      const exists = prev.some((item) => String(item.id) === String(launch.id));
      if (exists) {
        return prev.filter((item) => String(item.id) !== String(launch.id));
      } else {
        return [launch, ...prev];
      }
    });
  }, []);

  const removeBookmark = useCallback((id) => {
    hudAudio.playClick();
    setWatchlist((prev) => prev.filter((item) => String(item.id) !== String(id)));
  }, []);

  return {
    watchlist,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
    count: watchlist.length,
  };
}

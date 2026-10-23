import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../services/api";
import { getFallbackLaunches } from "../services/fallbackData";

export function useLaunches({ initialQuery = "", initialAgency = "" } = {}) {
  const [query, setQuery] = useState(initialQuery);
  const [agency, setAgency] = useState(initialAgency);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Initialize with fallback launches so the UI is NEVER blank or empty
  const [launches, setLaunches] = useState(() =>
    getFallbackLaunches({ query: initialQuery, agency: initialAgency })
  );
  const [source, setSource] = useState("standby");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeRequestRef = useRef(0);
  const retryTimeoutRef = useRef(null);
  const retryCountRef = useRef(0);
  const launchesRef = useRef(launches);
  const fetchLaunchesRef = useRef(null);

  useEffect(() => {
    launchesRef.current = launches;
  }, [launches]);

  // Debounce user typing by 400ms to prevent rapid-fire requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);

    return () => clearTimeout(handler);
  }, [query]);

  const fetchLaunches = useCallback(async (q, ag, isRetry = false) => {
    if (!isRetry) {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      retryCountRef.current = 0;
    }

    const requestId = ++activeRequestRef.current;
    queueMicrotask(() => {
      if (requestId === activeRequestRef.current) {
        setLoading(true);
      }
    });

    try {
      const data = await api.getLaunches({ query: q, agency: ag, limit: 20 });
      // Only commit if this is the newest request
      if (requestId === activeRequestRef.current) {
        const results = Array.isArray(data.results) ? data.results : [];
        if (results.length > 0) {
          setLaunches(results);
          setSource(data.source || "live");
        } else if (q || ag) {
          // If query produced no live results, try matching fallback dataset
          const fallbackMatches = getFallbackLaunches({ query: q, agency: ag });
          setLaunches(fallbackMatches);
          setSource(fallbackMatches.length > 0 ? "fallback" : "live");
        } else {
          setLaunches([]);
          setSource("live");
        }
        setError(null);
        setSelectedIndex(0);
        retryCountRef.current = 0;
      }
    } catch (err) {
      if (requestId === activeRequestRef.current) {
        console.warn("Telemetry uplink delayed / server cold-starting:", err.message);

        // Make sure we have fallback data displayed
        if (!launchesRef.current || launchesRef.current.length === 0) {
          const fallback = getFallbackLaunches({ query: q, agency: ag });
          setLaunches(fallback);
          setSource("standby");
        }

        const nextRetry = Math.min(3 + retryCountRef.current * 2, 10);
        setError(
          `Telemetry Uplink Delayed (Render backend waking up). Retrying in ${nextRetry}s...`
        );

        // Auto-retry loop
        if (retryCountRef.current < 10) {
          retryTimeoutRef.current = setTimeout(() => {
            if (requestId === activeRequestRef.current) {
              retryCountRef.current += 1;
              fetchLaunchesRef.current?.(q, ag, true);
            }
          }, nextRetry * 1000);
        }
      }
    } finally {
      if (requestId === activeRequestRef.current) {
        setLoading(false);
      }
    }
  }, []); // Stable callback without dependency loop

  useEffect(() => {
    fetchLaunchesRef.current = fetchLaunches;
  }, [fetchLaunches]);

  // Trigger search on debounced query or agency change
  useEffect(() => {
    let active = true;

    async function runFetch() {
      await Promise.resolve();
      if (active) {
        fetchLaunches(debouncedQuery, agency);
      }
    }

    runFetch();

    return () => {
      active = false;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [debouncedQuery, agency, fetchLaunches]);

  // Immediate search trigger (e.g., when pressing Enter or clicking submit)
  const executeSearch = useCallback(
    (searchTerm) => {
      setQuery(searchTerm);
      setDebouncedQuery(searchTerm);
      fetchLaunches(searchTerm, agency);
    },
    [agency, fetchLaunches]
  );

  const safeIndex = selectedIndex < launches.length ? selectedIndex : 0;

  return {
    query,
    setQuery,
    agency,
    setAgency: (newAgency) => {
      setAgency(newAgency);
    },
    executeSearch,
    launches,
    source,
    loading,
    error,
    selectedIndex: safeIndex,
    setSelectedIndex,
    selectedLaunch: launches[safeIndex] || null,
    refetch: () => fetchLaunches(debouncedQuery, agency),
  };
}


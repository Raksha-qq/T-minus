import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../services/api";

export function useLaunches({ initialQuery = "", initialAgency = "" } = {}) {
  const [query, setQuery] = useState(initialQuery);
  const [agency, setAgency] = useState(initialAgency);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [launches, setLaunches] = useState([]);
  const [source, setSource] = useState("live");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeRequestRef = useRef(0);

  // Debounce user typing by 400ms to prevent rapid-fire requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);

    return () => clearTimeout(handler);
  }, [query]);

  const fetchLaunches = useCallback(async (q, ag) => {
    const requestId = ++activeRequestRef.current;
    setLoading(true);

    try {
      const data = await api.getLaunches({ query: q, agency: ag, limit: 20 });
      // Only commit if this is the newest request
      if (requestId === activeRequestRef.current) {
        setLaunches(Array.isArray(data.results) ? data.results : []);
        setSource(data.source || "live");
        setError(null);
        setSelectedIndex(0);
      }
    } catch (err) {
      if (requestId === activeRequestRef.current) {
        console.error("Failed to load aerospace manifest:", err);
        // Only show error if we have no existing launches
        setError((prev) => (launches.length > 0 ? prev : "Telemetry Uplink Delayed. Retrying..."));
      }
    } finally {
      if (requestId === activeRequestRef.current) {
        setLoading(false);
      }
    }
  }, [launches.length]);

  // Trigger search on debounced query or agency change
  useEffect(() => {
    fetchLaunches(debouncedQuery, agency);
  }, [debouncedQuery, agency, fetchLaunches]);

  // Immediate search trigger (e.g., when pressing Enter or clicking submit)
  const executeSearch = useCallback((searchTerm) => {
    setDebouncedQuery(searchTerm);
    fetchLaunches(searchTerm, agency);
  }, [agency, fetchLaunches]);

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
    selectedIndex,
    setSelectedIndex,
    selectedLaunch: launches[selectedIndex] || null,
    refetch: () => fetchLaunches(debouncedQuery, agency),
  };
}

import time
from typing import Any, Dict, Optional, Tuple


class TTLMemoryCache:
    """Thread-safe in-memory cache with Time-To-Live (TTL) expiration and metrics tracking."""

    def __init__(self, default_ttl: int = 300):
        self._store: Dict[str, Tuple[float, Any]] = {}
        self._default_ttl = default_ttl
        self._hits = 0
        self._misses = 0

    def get(self, key: str) -> Optional[Any]:
        """Retrieve an item from cache if not expired."""
        now = time.time()
        entry = self._store.get(key)
        if entry is None:
            self._misses += 1
            return None

        expiry, data = entry
        if now > expiry:
            del self._store[key]
            self._misses += 1
            return None

        self._hits += 1
        return data

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        """Store an item with expiration time."""
        effective_ttl = ttl if ttl is not None else self._default_ttl
        expiry = time.time() + effective_ttl
        self._store[key] = (expiry, value)

    def invalidate(self, key: str) -> bool:
        """Remove a key from cache."""
        if key in self._store:
            del self._store[key]
            return True
        return False

    def clear(self) -> None:
        """Clear all entries."""
        self._store.clear()

    def get_stats(self) -> Dict[str, Any]:
        """Return cache performance statistics."""
        total = self._hits + self._misses
        hit_ratio = round((self._hits / total * 100), 2) if total > 0 else 0.0
        now = time.time()
        active_keys = sum(1 for exp, _ in self._store.values() if exp > now)

        return {
            "hits": self._hits,
            "misses": self._misses,
            "total_requests": total,
            "hit_ratio_percent": hit_ratio,
            "active_cached_keys": active_keys,
            "default_ttl_seconds": self._default_ttl,
        }


# Singleton cache instance for space telemetry
telemetry_cache = TTLMemoryCache(default_ttl=300)

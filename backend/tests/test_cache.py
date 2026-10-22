import time
from app.core.cache import TTLMemoryCache


def test_cache_set_and_get():
    """Test standard cache set and retrieval."""
    cache = TTLMemoryCache(default_ttl=10)
    cache.set("mission_1", {"name": "Artemis II"})
    assert cache.get("mission_1") == {"name": "Artemis II"}


def test_cache_expiry():
    """Test that items expire after TTL."""
    cache = TTLMemoryCache(default_ttl=1)
    cache.set("temporary_key", "temporary_val", ttl=1)
    time.sleep(1.1)
    assert cache.get("temporary_key") is None


def test_cache_metrics():
    """Test hit and miss metric calculations."""
    cache = TTLMemoryCache(default_ttl=60)
    cache.set("item_a", 123)

    # 1 hit
    _ = cache.get("item_a")
    # 2 misses
    _ = cache.get("item_b")
    _ = cache.get("item_c")

    stats = cache.get_stats()
    assert stats["hits"] == 1
    assert stats["misses"] == 2
    assert stats["total_requests"] == 3
    assert stats["hit_ratio_percent"] == 33.33

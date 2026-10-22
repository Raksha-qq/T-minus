import logging
from typing import Any, Dict, List, Optional
import httpx

from app.config import get_settings
from app.core.cache import telemetry_cache
from app.core.exceptions import LaunchNotFoundException
from app.schemas.launch import LaunchItem
from app.services.mock_data import get_curated_launches

logger = logging.getLogger("t_minus.space_service")


class SpaceTelemetryService:
    """Aerospace telemetry retrieval service with intelligent caching & resilient fallback."""

    def __init__(self):
        self.settings = get_settings()
        self.base_url = self.settings.LL2_BASE_URL.rstrip("/")

    def _normalize_raw_launch(self, item: Dict[str, Any]) -> Dict[str, Any]:
        """Convert SpaceDevs LL2 raw payload into standard LaunchItem schema."""
        rocket = item.get("rocket") or {}
        configuration = rocket.get("configuration") or {}
        mission = item.get("mission") or {}
        pad = item.get("pad") or {}
        location = pad.get("location") or {}
        provider = item.get("launch_service_provider") or {}
        status = item.get("status") or {}
        orbit = (mission.get("orbit") or {}).get("name") if isinstance(mission.get("orbit"), dict) else None

        # Coordinates parsing safely
        lat = pad.get("latitude")
        lon = pad.get("longitude")
        try:
            lat = float(lat) if lat is not None else None
            lon = float(lon) if lon is not None else None
        except (ValueError, TypeError):
            lat, lon = None, None

        # Handle image field which can be a URL or an object
        raw_img = item.get("image")
        image_url = raw_img.get("image_url") if isinstance(raw_img, dict) else (raw_img if isinstance(raw_img, str) else None)

        return {
            "id": str(item.get("id")),
            "name": item.get("name", "Unknown Mission"),
            "launch_time": item.get("net"),
            "window_start": item.get("window_start"),
            "window_end": item.get("window_end"),
            "status": status.get("name", "To Be Confirmed"),
            "status_code": status.get("abbrev", "TBD"),
            "rocket": configuration.get("full_name") or rocket.get("name"),
            "rocket_family": configuration.get("family"),
            "provider": provider.get("name", "Unknown Provider"),
            "provider_country": provider.get("country_code"),
            "mission": mission.get("description") or mission.get("name"),
            "mission_type": mission.get("type"),
            "orbit": orbit,
            "launch_site": pad.get("name"),
            "location": location.get("name"),
            "latitude": lat,
            "longitude": lon,
            "image": image_url,
            "url": item.get("url"),
            "webcast_live": bool(item.get("webcast_live", False)),
            "probability": item.get("probability"),
            "weather_concerns": item.get("weather_concerns"),
        }

    def _filter_fallback_data(
        self,
        query: Optional[str] = None,
        agency: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Filter the curated fallback dataset when upstream API is unreachable."""
        items = get_curated_launches()
        if query:
            q_lower = query.lower().strip()
            items = [
                m for m in items
                if q_lower in m["name"].lower()
                or q_lower in (m.get("rocket") or "").lower()
                or q_lower in (m.get("provider") or "").lower()
                or q_lower in (m.get("mission") or "").lower()
                or q_lower in (m.get("location") or "").lower()
            ]
        elif agency:
            a_lower = agency.lower().strip()
            items = [
                m for m in items
                if a_lower in (m.get("provider") or "").lower()
            ]
        return items

    async def get_launches(
        self,
        query: Optional[str] = None,
        agency: Optional[str] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> Dict[str, Any]:
        """Fetch launches with caching and fallback support."""
        clean_q = query.strip() if query else None
        clean_ag = agency.strip() if agency else None

        cache_key = f"launches:q={clean_q or ''}:ag={clean_ag or ''}:lim={limit}:off={offset}"
        cached = telemetry_cache.get(cache_key)
        if cached is not None:
            return {**cached, "source": "cached"}

        params: Dict[str, Any] = {
            "limit": min(limit, 50),
            "offset": offset,
            "mode": "normal",
        }
        # Prioritize explicit search keyword, or use agency filter
        if clean_q:
            params["search"] = clean_q
        elif clean_ag:
            params["search"] = clean_ag

        endpoint = f"{self.base_url}/launches/upcoming/"

        try:
            headers = {"User-Agent": "T-Minus-Mission-Control/1.0"}
            async with httpx.AsyncClient(timeout=self.settings.REQUEST_TIMEOUT_SECONDS) as client:
                resp = await client.get(endpoint, params=params, headers=headers)

                if resp.status_code == 200:
                    data = resp.json()
                    raw_results = data.get("results", [])
                    launches = [self._normalize_raw_launch(r) for r in raw_results]

                    # If agency filter was also provided alongside query, try refining
                    if clean_ag and clean_q:
                        ag_lower = clean_ag.lower()
                        filtered = [
                            l for l in launches
                            if ag_lower in (l.get("provider") or "").lower()
                        ]
                        if filtered:
                            launches = filtered

                    payload = {
                        "query": clean_q,
                        "agency": clean_ag,
                        "count": len(launches),
                        "results": launches,
                    }
                    telemetry_cache.set(cache_key, payload, ttl=self.settings.CACHE_TTL_SECONDS)
                    return {**payload, "source": "live"}

                else:
                    logger.warning("Upstream API returned %s. Switching to fallback data.", resp.status_code)

        except Exception as exc:
            logger.warning("Upstream LL2 error (%s). Using resilient telemetry store.", exc)

        # Resilient Fallback
        fallback_items = self._filter_fallback_data(query=query, agency=agency)
        payload = {
            "query": query,
            "agency": agency,
            "count": len(fallback_items),
            "results": fallback_items,
            "source": "fallback",
        }
        telemetry_cache.set(cache_key, payload, ttl=60)
        return payload

    async def get_launch_by_id(self, launch_id: str) -> LaunchItem:
        """Retrieve full technical telemetry for a specific mission launch ID."""
        cache_key = f"launch_detail:{launch_id}"
        cached = telemetry_cache.get(cache_key)
        if cached:
            return LaunchItem(**cached)

        # Check curated fallback missions first for instant hits
        for item in get_curated_launches():
            if item["id"] == launch_id:
                telemetry_cache.set(cache_key, item, ttl=600)
                return LaunchItem(**item)

        # Otherwise query upstream LL2
        endpoint = f"{self.base_url}/launches/{launch_id}/"
        try:
            headers = {"User-Agent": "T-Minus-Mission-Control/1.0"}
            async with httpx.AsyncClient(timeout=self.settings.REQUEST_TIMEOUT_SECONDS) as client:
                resp = await client.get(endpoint, headers=headers)
                if resp.status_code == 200:
                    normalized = self._normalize_raw_launch(resp.json())
                    telemetry_cache.set(cache_key, normalized, ttl=self.settings.CACHE_TTL_SECONDS)
                    return LaunchItem(**normalized)
        except Exception as exc:
            logger.warning("Error fetching launch %s from upstream: %s", launch_id, exc)

        raise LaunchNotFoundException(launch_id)

    async def get_featured_launch(self) -> Optional[LaunchItem]:
        """Return the next immediate upcoming mission."""
        data = await self.get_launches(limit=5)
        results = data.get("results", [])
        if not results:
            return None
        return LaunchItem(**results[0])


# Global service instance
space_service = SpaceTelemetryService()

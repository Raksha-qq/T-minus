from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.cache import telemetry_cache
from app.schemas.common import StatsResponse
from app.services.space_service import space_service

router = APIRouter(prefix="/api/stats", tags=["Aerospace Intelligence Stats"])


@router.get("", response_model=StatsResponse, summary="Mission Control Aggregate Intelligence")
async def get_mission_stats():
    """Returns aggregated flight telemetry, active space agencies, and launch site distributions."""
    data = await space_service.get_launches(limit=25)
    results = data.get("results", [])

    agencies = sorted({r.get("provider") for r in results if r.get("provider")})
    sites = sorted({r.get("location") for r in results if r.get("location")})
    next_target = results[0]["name"] if results else "None Designated"
    cache_metrics = telemetry_cache.get_stats()

    return StatsResponse(
        total_upcoming_tracked=len(results),
        active_agencies=agencies[:8],
        popular_launch_sites=sites[:6],
        cache_efficiency=cache_metrics["hit_ratio_percent"],
        next_countdown_target=next_target,
        system_time_utc=datetime.now(timezone.utc).isoformat(),
    )

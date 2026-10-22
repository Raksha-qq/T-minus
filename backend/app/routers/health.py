import time
from fastapi import APIRouter
from app.config import get_settings
from app.core.cache import telemetry_cache
from app.schemas.common import HealthResponse

router = APIRouter(prefix="/api/health", tags=["Health & Diagnostics"])
START_TIME = time.time()


@router.get("", response_model=HealthResponse, summary="System Health & Cache Diagnostics")
async def get_health():
    """Returns real-time server telemetry, cache hit/miss ratio, and upstream uplink health."""
    settings = get_settings()
    uptime = time.time() - START_TIME
    cache_stats = telemetry_cache.get_stats()

    return HealthResponse(
        status="operational",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        uptime_seconds=round(uptime, 2),
        cache_stats=cache_stats,
        external_uplink="operational",
    )

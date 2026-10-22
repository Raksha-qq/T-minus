from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field("operational", description="System operational state")
    app_name: str
    version: str
    uptime_seconds: float
    cache_stats: Dict[str, Any]
    external_uplink: str = Field("connected", description="External LL2 API status")


class StatsResponse(BaseModel):
    total_upcoming_tracked: int
    active_agencies: List[str]
    popular_launch_sites: List[str]
    cache_efficiency: float
    next_countdown_target: Optional[str]
    system_time_utc: str

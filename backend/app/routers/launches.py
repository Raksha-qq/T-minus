from typing import Optional
from fastapi import APIRouter, Query
from app.schemas.launch import LaunchItem, LaunchListResponse
from app.services.space_service import space_service

router = APIRouter(prefix="/api/launches", tags=["Launches & Telemetry"])


@router.get("", response_model=LaunchListResponse, summary="Query Upcoming Space Launches")
async def list_launches(
    q: Optional[str] = Query(None, description="Search keyword (rocket, mission, or location)"),
    agency: Optional[str] = Query(None, description="Filter by agency (SpaceX, NASA, ISRO, Rocket Lab)"),
    limit: int = Query(12, ge=1, le=50, description="Max missions to return"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
):
    """Retrieve upcoming orbital launches with smart caching, multi-criteria filtering, and fallback resilience."""
    data = await space_service.get_launches(
        query=q,
        agency=agency,
        limit=limit,
        offset=offset,
    )
    return LaunchListResponse(
        query=data.get("query"),
        agency=data.get("agency"),
        count=data.get("count", 0),
        source=data.get("source", "live"),
        results=[LaunchItem(**r) for r in data.get("results", [])],
    )


@router.get("/featured", response_model=Optional[LaunchItem], summary="Immediate Next Launch Target")
async def get_featured():
    """Retrieve the nearest future mission for HUD countdown target lock."""
    return await space_service.get_featured_launch()


@router.get("/{launch_id}", response_model=LaunchItem, summary="Launch Telemetry by ID")
async def get_launch_detail(launch_id: str):
    """Retrieve full technical specifications, pad coordinates, and mission data for a launch."""
    return await space_service.get_launch_by_id(launch_id)

from typing import List, Optional
from pydantic import BaseModel, Field


class AgencyInfo(BaseModel):
    name: str = Field(..., description="Name of launch service provider")
    country_code: Optional[str] = Field(None, description="Country code of provider (e.g., USA, IND, CHN)")
    agency_type: Optional[str] = Field(None, description="Government or Commercial")


class LaunchPad(BaseModel):
    name: Optional[str] = Field(None, description="Pad identifier or name")
    location: Optional[str] = Field(None, description="Launch facility / space center name")
    country_code: Optional[str] = Field(None, description="Country location of the pad")
    latitude: Optional[float] = Field(None, description="Pad latitude coordinates")
    longitude: Optional[float] = Field(None, description="Pad longitude coordinates")
    map_url: Optional[str] = Field(None, description="Link to orbital/satellite map")


class RocketConfig(BaseModel):
    name: Optional[str] = Field(None, description="Rocket full name (e.g., Falcon 9 Block 5)")
    family: Optional[str] = Field(None, description="Rocket family (e.g., Falcon, Starship, PSLV)")
    variant: Optional[str] = Field(None, description="Vehicle variant")


class MissionInfo(BaseModel):
    name: Optional[str] = Field(None, description="Mission designation")
    description: Optional[str] = Field(None, description="Mission operational objectives")
    mission_type: Optional[str] = Field(None, description="Mission category (e.g., Communications, Exploration)")
    orbit: Optional[str] = Field(None, description="Target orbit name (e.g., Low Earth Orbit, Geostationary)")


class LaunchItem(BaseModel):
    """Clean, strongly-typed model representing a space launch event."""

    id: str = Field(..., description="Unique mission launch identifier")
    name: str = Field(..., description="Mission and vehicle title")
    launch_time: Optional[str] = Field(None, description="Scheduled T-0 time (UTC ISO)")
    window_start: Optional[str] = Field(None, description="Launch window opening")
    window_end: Optional[str] = Field(None, description="Launch window closing")
    status: str = Field("TBD", description="Launch readiness status")
    status_code: Optional[str] = Field("TBD", description="Status abbreviation (Go, TBD, Hold)")
    rocket: Optional[str] = Field(None, description="Launch vehicle full name")
    rocket_family: Optional[str] = Field(None, description="Rocket family")
    provider: Optional[str] = Field(None, description="Launch service agency or company")
    provider_country: Optional[str] = Field(None, description="Country code of provider")
    mission: Optional[str] = Field(None, description="Mission description summary")
    mission_type: Optional[str] = Field(None, description="Mission classification")
    orbit: Optional[str] = Field(None, description="Target orbital destination")
    launch_site: Optional[str] = Field(None, description="Pad name")
    location: Optional[str] = Field(None, description="Geographic spaceport location")
    latitude: Optional[float] = Field(None, description="Pad latitude")
    longitude: Optional[float] = Field(None, description="Pad longitude")
    image: Optional[str] = Field(None, description="Mission or vehicle image URL")
    url: Optional[str] = Field(None, description="LL2 source record URL")
    webcast_live: bool = Field(False, description="Whether live stream webcast is active")
    probability: Optional[int] = Field(None, description="Weather GO probability percentage (0-100)")
    weather_concerns: Optional[str] = Field(None, description="Weather concerns or constraints")


class LaunchListResponse(BaseModel):
    query: Optional[str] = Field(None, description="Search term filter applied")
    agency: Optional[str] = Field(None, description="Agency filter applied")
    count: int = Field(..., description="Number of launches returned")
    source: str = Field("live", description="'live', 'cached', or 'fallback'")
    results: List[LaunchItem] = Field(default_factory=list, description="Array of launches")

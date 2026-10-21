
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI(title="T-Minus Mission Control")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

LL2_URL = "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/"


@app.get("/")
def root():
    return {
        "message": "T-Minus Mission Control API is online"
    }


@app.get("/api/health")
def health():
    return {"status": "operational"}


@app.get("/api/launches")
async def search_launches(
    q: str = Query(min_length=1, max_length=100)
):
    params = {
        "search": q,
        "limit": 10,
        "mode": "normal",
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.get(
                LL2_URL,
                params=params,
            )
            response.raise_for_status()
            data = response.json()

    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=502,
            detail="Unable to retrieve launch data right now.",
        ) from exc

    launches = []

    for item in data.get("results", []):
        rocket = item.get("rocket") or {}
        configuration = rocket.get("configuration") or {}
        mission = item.get("mission") or {}
        pad = item.get("pad") or {}
        location = pad.get("location") or {}
        provider = item.get("launch_service_provider") or {}
        status = item.get("status") or {}

        launches.append({
            "id": item.get("id"),
            "name": item.get("name"),
            "launch_time": item.get("net"),
            "status": status.get("name"),
            "rocket": configuration.get("full_name"),
            "provider": provider.get("name"),
            "mission": mission.get("description")
                or mission.get("name"),
            "launch_site": pad.get("name"),
            "location": location.get("name"),
            "image": item.get("image"),
            "url": item.get("url"),
        })

    return {
        "query": q,
        "count": len(launches),
        "results": launches,
    }

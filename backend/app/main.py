from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.core.exceptions import AerospaceAPIException, aerospace_exception_handler
from app.routers import health, launches, stats
from app.services.space_service import space_service

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("t_minus.api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context for startup prefetching and graceful shutdown."""
    logger.info("Initializing T-Minus Mission Control API...")
    # Pre-warm telemetry cache with upcoming launches on startup
    try:
        await space_service.get_launches(limit=12)
        logger.info("Telemetry cache pre-warmed successfully.")
    except Exception as exc:
        logger.warning("Cache pre-warming notice: %s", exc)

    yield

    logger.info("T-Minus Mission Control API shutting down...")


def create_app() -> FastAPI:
    """Factory function for FastAPI application."""
    settings = get_settings()

    tags_metadata = [
        {
            "name": "Launches & Telemetry",
            "description": "Orbital flight schedules, vehicle configurations, and launch pad telemetry.",
        },
        {
            "name": "Health & Diagnostics",
            "description": "Service health checks, latency, and in-memory cache diagnostics.",
        },
        {
            "name": "Aerospace Intelligence Stats",
            "description": "Aggregated mission metrics, active launch providers, and launch site distributions.",
        },
    ]

    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description=(
            "**T-Minus Mission Control API** — Production-grade aerospace intelligence service "
            "providing live flight countdowns, vehicle telemetry, orbital tracking, and "
            "resilient caching for space exploration enthusiasts and mission controllers."
        ),
        openapi_tags=tags_metadata,
        lifespan=lifespan,
    )

    
    # CORS configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "https://t-minus-one.vercel.app",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


    # Domain Exception Handlers
    app.add_exception_handler(AerospaceAPIException, aerospace_exception_handler)

    # Register Routers
    app.include_router(health.router)
    app.include_router(launches.router)
    app.include_router(stats.router)

    @app.get("/", tags=["Root"])
    def root():
        return {
            "system": "T-Minus Mission Control API",
            "status": "online",
            "version": settings.APP_VERSION,
            "docs": "/docs",
            "redoc": "/redoc",
            "endpoints": {
                "launches": "/api/launches",
                "featured": "/api/launches/featured",
                "health": "/api/health",
                "stats": "/api/stats",
            },
        }

    return app


app = create_app()

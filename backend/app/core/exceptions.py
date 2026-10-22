from typing import Any, Dict, Optional
from fastapi import Request
from fastapi.responses import JSONResponse


class AerospaceAPIException(Exception):
    """Base exception for aerospace intelligence domain errors."""

    def __init__(
        self,
        message: str,
        status_code: int = 500,
        details: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details or {}


class LaunchNotFoundException(AerospaceAPIException):
    """Raised when a requested launch cannot be located."""

    def __init__(self, launch_id: str):
        super().__init__(
            message=f"Mission launch with ID '{launch_id}' was not found in flight database.",
            status_code=404,
            details={"launch_id": launch_id},
        )


class UplinkUnavailableException(AerospaceAPIException):
    """Raised when external Launch Library 2 uplink is degraded or rate-limited."""

    def __init__(self, detail: str = "Space telemetry data link is temporarily unavailable."):
        super().__init__(
            message=detail,
            status_code=503,
            details={"service": "Launch Library 2"},
        )


async def aerospace_exception_handler(request: Request, exc: AerospaceAPIException) -> JSONResponse:
    """Standardized JSON response for custom domain exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "code": exc.__class__.__name__,
            "message": exc.message,
            "details": exc.details,
            "path": request.url.path,
        },
    )

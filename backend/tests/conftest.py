import pytest
from starlette.testclient import TestClient
from app.main import app
from app.core.cache import telemetry_cache


@pytest.fixture(autouse=True)
def clean_cache():
    """Ensure a fresh cache state before each test."""
    telemetry_cache.clear()
    yield
    telemetry_cache.clear()


@pytest.fixture
def client():
    """Synchronous test client fixture."""
    with TestClient(app) as test_client:
        yield test_client

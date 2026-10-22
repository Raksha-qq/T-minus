import sys
from pathlib import Path

# Ensure backend root is on sys.path across all platforms
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

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

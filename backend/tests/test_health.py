def test_root_endpoint(client):
    """Test root status check."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "endpoints" in data


def test_health_endpoint(client):
    """Test health diagnostics and cache metrics."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    assert "uptime_seconds" in data
    assert "cache_stats" in data
    assert data["cache_stats"]["total_requests"] >= 0

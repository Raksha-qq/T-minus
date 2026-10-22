def test_list_launches_default(client):
    """Test retrieving upcoming launches without query parameters."""
    response = client.get("/api/launches?limit=5")
    assert response.status_code == 200
    data = response.json()
    assert "count" in data
    assert "results" in data
    assert len(data["results"]) > 0

    first = data["results"][0]
    assert "id" in first
    assert "name" in first
    assert "status" in first


def test_list_launches_filter_by_query(client):
    """Test searching launches with keyword."""
    response = client.get("/api/launches?q=Starship")
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "Starship"
    assert any("Starship" in item["name"] or "Starship" in (item.get("rocket") or "") for item in data["results"])


def test_list_launches_filter_by_agency(client):
    """Test filtering launches by agency."""
    response = client.get("/api/launches?agency=SpaceX")
    assert response.status_code == 200
    data = response.json()
    assert data["agency"] == "SpaceX"
    for item in data["results"]:
        assert "SpaceX" in (item.get("provider") or "")


def test_get_featured_launch(client):
    """Test retrieving the next immediate launch."""
    response = client.get("/api/launches/featured")
    assert response.status_code == 200
    data = response.json()
    assert data is not None
    assert "name" in data
    assert "launch_time" in data


def test_get_launch_by_id_found(client):
    """Test retrieving a specific launch by ID."""
    response = client.get("/api/launches/tm-starship-ift-7")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "tm-starship-ift-7"
    assert "Starship" in data["name"]


def test_get_launch_by_id_not_found(client):
    """Test requesting a non-existent launch ID returns 404."""
    response = client.get("/api/launches/tm-non-existent-999999")
    assert response.status_code == 404
    data = response.json()
    assert data["error"] is True
    assert "LaunchNotFoundException" in data["code"]

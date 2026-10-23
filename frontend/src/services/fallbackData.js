/**
 * High-fidelity aerospace telemetry fallback manifest.
 * Used when satellite uplink / Render backend is cold-starting or initializing.
 */

function getFutureDate(days = 0, hours = 0, minutes = 0) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(d.getHours() + hours);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
}

export function generateFallbackLaunches() {
  return [
    {
      id: "tm-starship-ift-7",
      name: "Starship | Integrated Flight Test 7",
      launch_time: getFutureDate(2, 4, 35),
      window_start: getFutureDate(2, 4, 0),
      window_end: getFutureDate(2, 6, 0),
      status: "Go for Launch",
      status_code: "Go",
      rocket: "Starship Block 2",
      rocket_family: "Starship",
      provider: "SpaceX",
      provider_country: "USA",
      mission: "Next-generation heavy-lift orbital test flight, booster catch tower demonstration and upper-stage propellant transfer.",
      mission_type: "Test Flight",
      orbit: "Trans-atmospheric / Orbital",
      launch_site: "Orbital Launch Mount A, Starbase",
      location: "Boca Chica, Texas, USA",
      latitude: 25.9972,
      longitude: -97.1561,
      image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80",
      url: "https://www.spacex.com/launches",
      webcast_live: true,
      probability: 85,
      weather_concerns: "Cumulus Cloud Rule, Surface Winds < 25 kt",
    },
    {
      id: "tm-falcon9-starlink-12-8",
      name: "Falcon 9 | Starlink Group 12-8",
      launch_time: getFutureDate(1, 2, 15),
      window_start: getFutureDate(1, 1, 0),
      window_end: getFutureDate(1, 5, 0),
      status: "Go for Launch",
      status_code: "Go",
      rocket: "Falcon 9 Block 5",
      rocket_family: "Falcon",
      provider: "SpaceX",
      provider_country: "USA",
      mission: "Deployment of 23 second-generation Starlink broadband internet satellites with direct-to-cell capabilities into Low Earth Orbit.",
      mission_type: "Communications",
      orbit: "Low Earth Orbit (530 km)",
      launch_site: "Space Launch Complex 40",
      location: "Cape Canaveral SFS, Florida, USA",
      latitude: 28.5619,
      longitude: -80.5772,
      image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=1200&q=80",
      url: "https://www.spacex.com/launches",
      webcast_live: true,
      probability: 80,
      weather_concerns: "Moderate anvil cloud potential",
    },
    {
      id: "tm-falcon9-crew-10",
      name: "Falcon 9 | Crew-10 ISS Mission",
      launch_time: getFutureDate(5, 16, 45),
      window_start: getFutureDate(5, 16, 0),
      window_end: getFutureDate(5, 17, 30),
      status: "Go for Launch",
      status_code: "Go",
      rocket: "Falcon 9 Block 5",
      rocket_family: "Falcon",
      provider: "SpaceX",
      provider_country: "USA",
      mission: "NASA Commercial Crew Program expedition transporting international astronaut crew to the International Space Station for a six-month scientific residency.",
      mission_type: "Human Exploration",
      orbit: "Low Earth Orbit (ISS Rendezvous)",
      launch_site: "Launch Complex 39A",
      location: "Kennedy Space Center, Florida, USA",
      latitude: 28.6083,
      longitude: -80.6043,
      image: "https://images.unsplash.com/photo-1517976487502-5f65b1d9bf59?auto=format&fit=crop&w=1200&q=80",
      url: "https://www.spacex.com/launches",
      webcast_live: true,
      probability: 90,
      weather_concerns: "Flight through precipitation rule nominal",
    },
    {
      id: "tm-artemis-ii-sls",
      name: "Space Launch System (SLS) | Artemis II Crewed Lunar Flyby",
      launch_time: getFutureDate(14, 11, 10),
      window_start: getFutureDate(14, 10, 0),
      window_end: getFutureDate(14, 12, 0),
      status: "Go for Launch",
      status_code: "Go",
      rocket: "SLS Block 1 Crew",
      rocket_family: "Space Launch System",
      provider: "NASA",
      provider_country: "USA",
      mission: "First crewed flight of NASA's Orion spacecraft carrying four astronauts on a 10-day lunar flyby trajectory test before Artemis III.",
      mission_type: "Human Exploration",
      orbit: "Lunar Free-Return Trajectory",
      launch_site: "Launch Complex 39B",
      location: "Kennedy Space Center, Florida, USA",
      latitude: 28.6272,
      longitude: -80.6208,
      image: "https://images.unsplash.com/photo-1517976487502-5f65b1d9bf59?auto=format&fit=crop&w=1200&q=80",
      url: "https://www.nasa.gov/specials/artemis-ii",
      webcast_live: false,
      probability: 90,
      weather_concerns: "Isolated offshore showers",
    },
    {
      id: "tm-isro-gaganyaan-1",
      name: "LVM3 | Gaganyaan-1 Uncrewed Orbital Demonstration",
      launch_time: getFutureDate(6, 8, 20),
      window_start: getFutureDate(6, 7, 0),
      window_end: getFutureDate(6, 9, 0),
      status: "Go for Launch",
      status_code: "Go",
      rocket: "LVM3 (GSLV Mk III)",
      rocket_family: "LVM3",
      provider: "ISRO",
      provider_country: "IND",
      mission: "India's human spaceflight program orbital module flight qualification carrying humanoid robot Vyommitra to evaluate life support & reentry.",
      mission_type: "Human Spaceflight Test",
      orbit: "Low Earth Orbit (400 km circular)",
      launch_site: "Second Launch Pad (SLP)",
      location: "Satish Dhawan Space Centre, Sriharikota, India",
      latitude: 13.7199,
      longitude: 80.2304,
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      url: "https://www.isro.gov.in/Gaganyaan.html",
      webcast_live: false,
      probability: 95,
      weather_concerns: "Clear skies, low humidity",
    },
    {
      id: "tm-rocketlab-electron-ride",
      name: "Electron | 'The Sky Is Not The Limit'",
      launch_time: getFutureDate(4, 18, 45),
      window_start: getFutureDate(4, 17, 0),
      window_end: getFutureDate(4, 21, 0),
      status: "To Be Confirmed",
      status_code: "TBD",
      rocket: "Electron",
      rocket_family: "Electron",
      provider: "Rocket Lab",
      provider_country: "NZL",
      mission: "Dedicated commercial rideshare inserting five Earth-observation cubesats into a 500 km sun-synchronous orbit using Curie kick stage.",
      mission_type: "Earth Science / Commercial",
      orbit: "Sun-Synchronous Orbit",
      launch_site: "Launch Complex 1A",
      location: "Māhia Peninsula, New Zealand",
      latitude: -39.2604,
      longitude: 177.8653,
      image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80",
      url: "https://www.rocketlabusa.com/missions",
      webcast_live: false,
      probability: 75,
      weather_concerns: "Coastal wind gusts near limit",
    },
    {
      id: "tm-ariane6-commercial",
      name: "Ariane 62 | European Earth Observation Constellation",
      launch_time: getFutureDate(9, 14, 0),
      window_start: getFutureDate(9, 13, 0),
      window_end: getFutureDate(9, 16, 0),
      status: "Go for Launch",
      status_code: "Go",
      rocket: "Ariane 62",
      rocket_family: "Ariane",
      provider: "Arianespace",
      provider_country: "FRA",
      mission: "Commercial operational flight of Europe's new Ariane 6 launch vehicle carrying multi-spectral meteorological monitoring payloads.",
      mission_type: "Earth Observation",
      orbit: "Polar Orbit (800 km)",
      launch_site: "ELA-4 (Ensemble de Lancement Ariane 4)",
      location: "Guiana Space Centre, Kourou, French Guiana",
      latitude: 5.239,
      longitude: -52.768,
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      url: "https://www.arianespace.com",
      webcast_live: false,
      probability: 88,
      weather_concerns: "Equatorial thunderstorm clearance expected",
    },
    {
      id: "tm-falconheavy-goes",
      name: "Falcon Heavy | NOAA GOES-U Advanced Weather Satellite",
      launch_time: getFutureDate(11, 21, 20),
      window_start: getFutureDate(11, 21, 0),
      window_end: getFutureDate(11, 23, 0),
      status: "Go for Launch",
      status_code: "Go",
      rocket: "Falcon Heavy",
      rocket_family: "Falcon",
      provider: "SpaceX",
      provider_country: "USA",
      mission: "Deployment of NOAA's final geostationary weather satellite with advanced lightning mapper and solar coronagraph to monitor severe storms.",
      mission_type: "Meteorology / Earth Science",
      orbit: "Geostationary Transfer Orbit",
      launch_site: "Launch Complex 39A",
      location: "Kennedy Space Center, Florida, USA",
      latitude: 28.6083,
      longitude: -80.6043,
      image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=1200&q=80",
      url: "https://www.spacex.com/launches",
      webcast_live: false,
      probability: 90,
      weather_concerns: "Nominal flight environment",
    },
  ];
}

export function getFallbackLaunches({ query = "", agency = "" } = {}) {
  const items = generateFallbackLaunches();
  const qLower = (query || "").toLowerCase().trim();
  const agLower = (agency || "").toLowerCase().trim();

  return items.filter((item) => {
    let matchesQuery = true;
    let matchesAgency = true;

    if (qLower) {
      matchesQuery =
        item.name.toLowerCase().includes(qLower) ||
        (item.rocket || "").toLowerCase().includes(qLower) ||
        (item.provider || "").toLowerCase().includes(qLower) ||
        (item.mission || "").toLowerCase().includes(qLower) ||
        (item.location || "").toLowerCase().includes(qLower) ||
        (item.launch_site || "").toLowerCase().includes(qLower);
    }

    if (agLower) {
      matchesAgency = (item.provider || "").toLowerCase().includes(agLower);
    }

    return matchesQuery && matchesAgency;
  });
}

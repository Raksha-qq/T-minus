/**
 * Centralized Aerospace API Client.
 * Communicates with the FastAPI Mission Control backend.
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, params = {}) {
  const url = new URL(path, BASE_URL);
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      url.searchParams.append(key, val);
    }
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API responded with HTTP ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export const api = {
  async getLaunches({ query = "", agency = "", limit = 16, offset = 0 } = {}) {
    return request("/api/launches", { q: query, agency, limit, offset });
  },

  async getFeaturedLaunch() {
    return request("/api/launches/featured");
  },

  async getLaunchDetail(id) {
    return request(`/api/launches/${encodeURIComponent(id)}`);
  },

  async getHealth() {
    return request("/api/health");
  },

  async getStats() {
    return request("/api/stats");
  },
};

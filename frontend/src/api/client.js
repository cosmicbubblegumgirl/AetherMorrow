const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787';

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length) query.set(key, value.join(','));
      return;
    }

    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value);
    }
  });

  const text = query.toString();
  return text ? `?${text}` : '';
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.detail || data?.error || 'Request failed');
  }

  return response.json();
}

export function fetchMeta() {
  return request('/api/activities');
}

export function fetchForecast({ destination, startDate, tone, selectedActivities } = {}) {
  return request(
    `/api/forecast${buildQuery({
      destination,
      startDate,
      tone,
      selectedActivities
    })}`
  );
}

export function fetchFishingSpots({ destination, precip, windSpeed, high } = {}) {
  return request(
    `/api/fishing-spots${buildQuery({
      destination,
      precip,
      windSpeed,
      high
    })}`
  );
}

export function fetchPlans() {
  return request('/api/plans');
}

export function savePlan(plan) {
  return request('/api/plans', {
    method: 'POST',
    body: JSON.stringify(plan)
  });
}

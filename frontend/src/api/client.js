async function request(path, options = {}) {
  const response = await fetch(path, {
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

export function fetchForecast(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length) search.set(key, value.join(','));
      return;
    }
    if (value !== undefined && value !== null && value !== '') search.set(key, value);
  });
  return request(`/api/forecast?${search.toString()}`);
}

export function fetchFishingSpots(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  });
  return request(`/api/fishing-spots?${search.toString()}`);
}

export function fetchPlans() {
  return request('/api/plans');
}

export function savePlan(payload) {
  return request('/api/plans', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

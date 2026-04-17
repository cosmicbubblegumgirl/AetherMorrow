const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787';

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

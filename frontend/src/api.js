/**
 * API client for Visa Slot Alerts backend
 * Uses Fetch API for HTTP calls
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const request = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.error || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
};

export const getAlerts = (filters = {}) => {
  const clean = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v != null && v !== '')
  );
  const params = new URLSearchParams(clean).toString();
  const query = params ? `?${params}` : '';
  return request(`/alerts${query}`);
};

export const createAlert = (alert) => {
  return request('/alerts', {
    method: 'POST',
    body: JSON.stringify(alert),
  });
};

export const updateAlertStatus = (id, status) => {
  return request(`/alerts/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
};

export const deleteAlert = (id) => {
  return request(`/alerts/${id}`, {
    method: 'DELETE',
  });
};

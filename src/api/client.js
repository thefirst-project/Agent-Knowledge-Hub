export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const AUTH_TOKEN_KEY = 'agent-knowledge-hub-token';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error(`Unable to reach the API at ${BASE_URL}. Check that the server is running.`, {
      cause: error,
    });
  }

  if (!response.ok) {
    if (response.status === 401 && token) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.dispatchEvent(new Event('auth:expired'));
      if (window.location.hash.startsWith('#/admin')
        && window.location.hash.split('?')[0] !== '#/admin/login') {
        window.location.hash = '#/admin/login';
      }
    }
    let message = response.statusText;
    try {
      const body = await response.json();
      if (body && typeof body.error === 'string') message = body.error;
    } catch {
      // Keep the HTTP status text when the response is not JSON.
    }
    throw new Error(`API request failed (${response.status}): ${message}`);
  }

  return response.json();
}

export function authenticatedFetch(path, options = {}) {
  if (!localStorage.getItem(AUTH_TOKEN_KEY)) {
    return Promise.reject(new Error('Sign in to perform this action.'));
  }
  return apiFetch(path, options);
}

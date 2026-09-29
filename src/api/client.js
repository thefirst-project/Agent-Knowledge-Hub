export const BASE_URL = 'http://localhost:3001';

export async function apiFetch(path, options) {
  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, options);
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error(`Unable to reach the API at ${BASE_URL}. Check that the server is running.`, {
      cause: error,
    });
  }

  if (!response.ok) {
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

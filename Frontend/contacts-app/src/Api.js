export async function apiRequest(endpoint, method = 'GET', body = null) {
  const API_URL = 'http://localhost:5108/'; // API base URL
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(API_URL + endpoint, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

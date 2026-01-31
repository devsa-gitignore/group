// src/lib/api.js

export const API_URL = 'http://localhost:5000/api';

/**
 * Helper function to make API requests
 * @param {string} endpoint - e.g., '/auth/login'
 * @param {string} method - 'GET', 'POST', 'PUT', etc.
 * @param {object} body - Data to send (optional)
 */
export const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    // CRITICAL: This tells the browser to send the HTTP-Only Cookie 
    // (which contains your JWT) to the backend.
    credentials: 'include', 
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    // Re-throw to handle it in the component (e.g., show an alert)
    throw error;
  }
};
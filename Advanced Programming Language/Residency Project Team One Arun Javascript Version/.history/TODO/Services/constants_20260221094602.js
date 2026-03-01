/**
 * API Configuration Constants
 * Centralized configuration for all API endpoints
 */

// Base API URL for JSON Server
export const API_BASE_URL = "http://localhost:3000";

// API Endpoints
export const API_ENDPOINTS = {
  TODOS: `${API_BASE_URL}/todos`,
  USERS: `${API_BASE_URL}/users`,
  CATEGORIES: `${API_BASE_URL}/categories`,
};

// Export individual endpoints for convenience
export const TODOS_ENDPOINT = API_ENDPOINTS.TODOS;
export const USERS_ENDPOINT = API_ENDPOINTS.USERS;
export const CATEGORIES_ENDPOINT = API_ENDPOINTS.CATEGORIES;

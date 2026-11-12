// ------------------------------------------------------------
// interceptors.js
// Shared Axios interceptors attached to every versioned client.
// Handles JWT Bearer token injection and transparent token refresh.
// ------------------------------------------------------------

import axios from 'axios';

// Storage key constants – must stay in sync with AuthContext.jsx
const ACCESS_TOKEN_KEY  = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Base URL for the plain refresh call (must NOT go through apiV1 to avoid loops)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// ── Request interceptors ──────────────────────────────────────

/**
 * attachAuthToken
 * Reads the JWT access token from localStorage and attaches it
 * as an Authorization: Bearer <token> header on every outgoing request.
 */
export function attachAuthToken(config) {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

/**
 * handleRequestError
 * Passthrough – simply propagates request-setup errors.
 */
export function handleRequestError(error) {
  return Promise.reject(error);
}

// ── Response interceptors ─────────────────────────────────────

/**
 * handleResponseSuccess
 * Passthrough – simply returns successful responses as-is.
 */
export function handleResponseSuccess(response) {
  return response;
}

/**
 * handleResponseError
 * Handles HTTP error responses.
 *
 * Key behaviour for 401 Unauthorized:
 *   1. Mark the request with _retry so we don't loop infinitely.
 *   2. Try to refresh the access token using the stored refresh token.
 *   3. On success, save the new token(s) and replay the original request.
 *   4. On failure, clear auth data and redirect the user to /auth.
 */
export async function handleResponseError(error) {
  const originalRequest = error.config;

  if (error.response) {
    const { status } = error.response;

    // ── 401 Unauthorized: attempt silent token refresh ────────
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // prevent infinite retry loops

      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

      if (!refreshToken) {
        // No refresh token available – user must log in again
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      try {
        // Use a plain axios instance (NOT apiV1) to avoid triggering
        // this same interceptor and causing an infinite loop.
        const plainAxios = axios.create();
        const { data } = await plainAxios.post(
          `${API_BASE_URL}/api/v1/auth/refresh/`,
          { refresh: refreshToken }
        );

        // Persist the new access token (and new refresh token if rotated)
        localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
        if (data.refresh) {
          localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
        }

        // Retry the original request with the fresh access token
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed – clear everything and send to login
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      }
    }

    // ── Other known status codes ──────────────────────────────
    if (status === 403) {
      console.error('[api] Forbidden – you do not have permission for this action.');
    } else if (status === 404) {
      console.error('[api] Not found – the requested resource does not exist.');
    } else if (status === 500) {
      console.error('[api] Server error – please try again later.');
    } else if (status !== 401) {
      // 401 is already handled above; log everything else
      console.error('[api] Request failed', error.response.data ?? error.message);
    }
  } else if (error.request) {
    console.error('[api] Network error – please check your connection.');
  }

  return Promise.reject(error);
}

// ── Private helper ────────────────────────────────────────────

/**
 * clearAuthAndRedirect
 * Removes stored tokens from localStorage and redirects to the login page.
 * Uses window.location so this module stays framework-agnostic.
 */
function clearAuthAndRedirect() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.location.href = '/auth';
}

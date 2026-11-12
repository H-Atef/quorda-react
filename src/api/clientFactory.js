// ------------------------------------------------------------
// Creates a configured Axios instance for a specific API version.
// Example: createVersionedClient('v1')
//          createVersionedClient('v2')
// ------------------------------------------------------------

import axios from 'axios';
import {
  attachAuthToken,
  handleRequestError,
  handleResponseSuccess,
  handleResponseError,
} from './interceptors';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;

if (!API_BASE_URL) {
  console.warn(
    '[api] VITE_API_BASE_URL is not set. Requests will use a relative /api path.'
  );
}

export function createVersionedClient(version) {
  if (!version) {
    throw new Error('[api] createVersionedClient requires a version string');
  }

  const client = axios.create({
    baseURL: `${API_BASE_URL}/api/${version}`,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  client.interceptors.request.use(attachAuthToken, handleRequestError);

  client.interceptors.response.use(
    handleResponseSuccess,
    handleResponseError
  );

  return client;
}
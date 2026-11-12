// ------------------------------------------------------------
// Shared Axios interceptors.
// Used by every versioned Axios client created in clientFactory.
// ------------------------------------------------------------

export function attachAuthToken(config) {
  const token = localStorage.getItem('authToken');

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

export function handleRequestError(error) {
  return Promise.reject(error);
}

export function handleResponseSuccess(response) {
  return response;
}

export function handleResponseError(error) {
  if (error.response) {
    const status = error.response.status;

    switch (status) {
      case 401:
        console.error('Unauthorized - please login again');
        localStorage.removeItem('authToken');
        // Optional: redirect to login page
        // window.location.href = '/login';
        break;

      case 403:
        console.error('Forbidden - access denied');
        break;

      case 404:
        console.error('Resource not found');
        break;

      case 500:
        console.error('Server error - please try again later');
        break;

      default:
        console.error(
          'Request failed',
          error.response.data ?? error.message
        );
    }
  } else if (error.request) {
    console.error('Network error - please check your connection');
  }

  return Promise.reject(error);
}
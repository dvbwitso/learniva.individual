// API base URL - consider moving this to an environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'; // Default to localhost if not set

/**
 * Logs in a user.
 * @param username The user\\'s username.
 * @param password The user\\'s password.
 * @returns The server response, typically containing an auth token.
 */
export async function loginUser(username: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Login failed');
  }
  return response.json();
}

/**
 * Registers a new user.
 * @param username The desired username.
 * @param email The user\\'s email address.
 * @param password The user\\'s chosen password.
 * @returns The server response, typically containing user details.
 */
export async function registerUser(username: string, email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/registration/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Registration failed');
  }
  return response.json();
}

/**
 * Requests a password reset email for the user.
 * @param email The user\\'s email address.
 * @returns The server response.
 */
export async function requestPasswordReset(email: string) {
  const response = await fetch(`${API_BASE_URL}/api/password/reset/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Password reset request failed');
  }
  return response.json();
}

/**
 * Confirms a password reset with the provided UID and token.
 * @param uidb64 The UID from the password reset email link.
 * @param token The token from the password reset email link.
 * @param newPassword The user\\'s new password.
 * @returns The server response.
 */
export async function confirmPasswordReset(uidb64: string, token: string, newPassword: string) {
  const response = await fetch(`${API_BASE_URL}/api/password/reset/confirm/${uidb64}/${token}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ new_password: newPassword }), // Assuming the API expects new_password
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Password reset confirmation failed');
  }
  return response.json();
}

/**
 * Fetches the authenticated user\\'s data.
 * @param authToken The user\\'s authentication token.
 * @returns The server response, containing user details.
 */
export async function getUserData(authToken: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/user/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch user data');
  }
  return response.json();
}

/**
 * Logs out the currently authenticated user.
 * @param authToken The user\'s authentication token.
 * @returns The server response.
 */
export async function logoutUser(authToken: string) {
  const response = await fetch(`${API_BASE_URL}/api/logout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`,
    },
  });
  if (!response.ok) {
    // It\'s possible the logout endpoint doesn\'t return JSON on success
    // or even on failure in some cases. Handle potential errors gracefully.
    try {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Logout failed');
    } catch (e) {
      // If parsing JSON fails or it\'s not a JSON response
      throw new Error(`Logout failed with status: ${response.status}`);
    }
  }
  // Logout might not return content, or it might return a confirmation.
  // If no content is expected, you might not need to parse response.json().
  // For now, let\'s assume it might return something or just succeed with 2xx.
  if (response.status === 204 || response.headers.get("content-length") === "0") { // No Content
    return null;
  }
  return response.json(); // Or handle as appropriate for your API
}

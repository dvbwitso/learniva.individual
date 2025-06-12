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
 * @param passwordMain The user\\'s chosen password.
 * @param passwordConfirm The user\\'s confirmed password.
 * @returns The server response, typically containing user details.
 */
export async function registerUser(username: string, email: string, passwordMain: string, passwordConfirm: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/registration/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password1: passwordMain, password2: passwordConfirm }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.error("Full error data from server:", errorData); // Log the full error object
    // Throw an error object that includes the errorData
    throw { message: errorData.detail || 'Registration failed', data: errorData };
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
    const errorData = await response.json().catch(() => ({ detail: "Password reset request failed and could not parse error response." }));
    console.error("Password reset request failed. Server response:", errorData);
    throw { message: errorData.detail || 'Password reset request failed', data: errorData };
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
export async function confirmPasswordReset(uidb64: string, token: string, newPassword1: string) {
  const response = await fetch(`${API_BASE_URL}/auth/password/reset/confirm/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uid: uidb64, token, new_password1: newPassword1, new_password2: newPassword1 }), // Assuming new_password2 is same as newPassword1
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "An unknown error occurred." }));
    throw new Error(errorData.detail || "Failed to confirm password reset.");
  }
  return response.json();
}

/**
 * Changes the user's password.
 * @param oldPassword The user's current password.
 * @param newPassword1 The user's new password.
 * @returns The server response.
 */
export async function changePassword(oldPassword: string, newPassword1: string) {
  const authToken = localStorage.getItem("learniva_token"); // Or however you store the auth token
  if (!authToken) {
    throw new Error("User not authenticated. Please login again.");
  }

  const response = await fetch(`${API_BASE_URL}/auth/password/change/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`, // Or `Token ${authToken}` depending on backend
    },
    body: JSON.stringify({ old_password: oldPassword, new_password1: newPassword1, new_password2: newPassword1 }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "An unknown error occurred during password change." }));
    // Attempt to parse more specific errors if available
    let errorMessage = errorData.detail || "Failed to change password.";
    if (errorData.old_password) errorMessage = `Old password: ${errorData.old_password.join(' ')}`;
    else if (errorData.new_password1) errorMessage = `New password: ${errorData.new_password1.join(' ')}`;
    else if (errorData.new_password2) errorMessage = `Confirm new password: ${errorData.new_password2.join(' ')}`;
    
    const customError = new Error(errorMessage);
    // @ts-ignore
    customError.response = { data: errorData }; // Attach full response data for component to use
    throw customError;
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

// Social Authentication

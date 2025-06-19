// API base URL - consider moving this to an environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'; // Default to localhost if not set

// Profile-related interfaces
export interface UserProfile {
  id?: number;
  pk?: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatar?: string;
  display_name?: string;
  location?: string;
  website?: string;
  created_at?: string;
  full_name?: string;
}

export interface UserPreferences {
  theme?: 'dark' | 'light';
  verbosity?: 'concise' | 'moderate' | 'detailed' | 'narrator';
  teaching_style?: 'direct_technical' | 'supportive_engaging';
  language?: string;
  notifications?: {
    email_notifications?: boolean;
    push_notifications?: boolean;
    marketing_emails?: boolean;
  };
}

export interface ProfileStatistics {
  completedCourses?: number;
  currentStreak?: number;
  totalStudyTime?: number;
  achievementsCount?: number;
  documentsUploaded?: number;
  learningMaterialsCreated?: number;
}

export interface ConnectedAccount {
  provider: string;
  connected: boolean;
  email?: string;
  username?: string;
  account_id?: string;
  connected_at?: string;
}

export interface BillingInfo {
  plan: string;
  plan_type: 'free' | 'pro' | 'enterprise';
  price: string;
  billing_cycle?: string;
  next_billing_date?: string | null;
  payment_method?: string | null;
  payment_type?: string | null;
  status: 'active' | 'inactive' | 'cancelled' | 'past_due';
}

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

/**
 * Gets the complete user profile information.
 * @param authToken The user's authentication token.
 * @returns The server response containing complete profile data.
 */
export async function getUserProfile(authToken: string): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/api/profile/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch user profile');
  }
  const data = await response.json();
  // Handle response format based on API documentation
  return data.data || data;
}

/**
 * Updates the user profile information.
 * @param authToken The user's authentication token.
 * @param profileData The profile data to update.
 * @returns The server response.
 */
export async function updateUserProfile(authToken: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/api/profile/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`,
    },
    body: JSON.stringify(profileData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update profile');
  }
  const data = await response.json();
  return data.data || data;
}

/**
 * Updates basic account details (name, email).
 * @param authToken The user's authentication token.
 * @param accountData The account data to update.
 * @returns The server response.
 */
export async function updateAccountDetails(authToken: string, accountData: {
  first_name?: string;
  last_name?: string;
  email?: string;
}): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/profile/update_account/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`,
    },
    body: JSON.stringify(accountData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update account details');
  }
  const data = await response.json();
  return data.data || data;
}

/**
 * Gets user preferences.
 * @param authToken The user's authentication token.
 * @returns The server response containing user preferences.
 */
export async function getUserPreferences(authToken: string): Promise<UserPreferences> {
  const response = await fetch(`${API_BASE_URL}/api/profile/preferences/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch user preferences');
  }
  const data = await response.json();
  return data.data || data;
}

/**
 * Updates user preferences.
 * @param authToken The user's authentication token.
 * @param preferences The preferences to update.
 * @returns The server response.
 */
export async function updateUserPreferences(authToken: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
  const response = await fetch(`${API_BASE_URL}/api/settings/preferences/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`,
    },
    body: JSON.stringify(preferences),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update preferences');
  }
  const data = await response.json();
  return data.data || data;
}

/**
 * Gets user profile statistics.
 * @param authToken The user's authentication token.
 * @returns The server response containing statistics.
 */
export async function getProfileStatistics(authToken: string): Promise<ProfileStatistics> {
  const response = await fetch(`${API_BASE_URL}/api/profile/statistics/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch profile statistics');
  }
  const data = await response.json();
  return data.data || data;
}

/**
 * Uploads a new avatar image.
 * @param authToken The user's authentication token.
 * @param avatarFile The image file to upload.
 * @returns The server response containing the new avatar URL.
 */
export async function uploadAvatar(authToken: string, avatarFile: File): Promise<{avatar_url: string}> {
  const formData = new FormData();
  formData.append('avatar', avatarFile);

  const response = await fetch(`${API_BASE_URL}/api/profile/upload_avatar/`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${authToken}`,
    },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to upload avatar');
  }
  const data = await response.json();
  return data.data || data;
}

/**
 * Removes the current avatar.
 * @param authToken The user's authentication token.
 * @returns The server response.
 */
export async function removeAvatar(authToken: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/profile/remove_avatar/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${authToken}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to remove avatar');
  }
  return response.status === 204 ? null : response.json();
}

/**
 * Gets the status of cloud integrations.
 * @param authToken The user's authentication token.
 * @param provider The integration provider (google-drive, github, notion).
 * @returns The server response containing integration status.
 */
export async function getIntegrationStatus(authToken: string, provider: string): Promise<ConnectedAccount> {
  const response = await fetch(`${API_BASE_URL}/api/integrations/${provider}/status/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to fetch ${provider} integration status`);
  }
  const data = await response.json();
  return data.data || data;
}

/**
 * Gets the authorization URL for a cloud integration.
 * @param authToken The user's authentication token.
 * @param provider The integration provider (google-drive, github, notion).
 * @returns The server response containing the auth URL.
 */
export async function getIntegrationAuthUrl(authToken: string, provider: string): Promise<{auth_url: string}> {
  const response = await fetch(`${API_BASE_URL}/api/integrations/${provider}/auth_url/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `Failed to get ${provider} auth URL`);
  }
  const data = await response.json();
  return data.data || data;
}

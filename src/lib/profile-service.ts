// Profile-specific API service functions
import { 
  UserProfile, 
  UserPreferences, 
  ProfileStatistics, 
  ConnectedAccount, 
  BillingInfo 
} from '@/lib/auth';
import { API_CONFIG, buildApiUrl, getAuthHeaders, getAuthHeadersForUpload } from '@/lib/api-config';

/**
 * Profile API service class for managing user profile operations
 */
export class ProfileService {
  private authToken: string;

  constructor(authToken: string) {
    this.authToken = authToken;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(buildApiUrl(endpoint), {
      ...options,
      headers: {
        ...getAuthHeaders(this.authToken),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
      // No content response
      return null as T;
    }

    const data = await response.json();
    // Handle different response formats
    return data.data || data;
  }

  /**
   * Get complete profile data including preferences and statistics
   */
  async getCompleteProfile(): Promise<{
    profile: UserProfile;
    preferences: UserPreferences;
    statistics: ProfileStatistics;
    connectedAccounts: ConnectedAccount[];
  }> {
    try {
      const [profile, preferences, statistics] = await Promise.all([
        this.makeRequest<UserProfile>(API_CONFIG.ENDPOINTS.PROFILE),
        this.makeRequest<UserPreferences>(API_CONFIG.ENDPOINTS.PROFILE_PREFERENCES).catch(() => ({})),
        this.makeRequest<ProfileStatistics>(API_CONFIG.ENDPOINTS.PROFILE_STATISTICS).catch(() => ({}))
      ]);

      // Get connected accounts status
      const integrationProviders = ['google-drive', 'github', 'notion'];
      const connectedAccountsPromises = integrationProviders.map(async (provider) => {
        try {
          const endpoint = provider === 'google-drive' 
            ? API_CONFIG.ENDPOINTS.INTEGRATIONS.GOOGLE_DRIVE.STATUS
            : provider === 'github'
            ? API_CONFIG.ENDPOINTS.INTEGRATIONS.GITHUB.STATUS
            : API_CONFIG.ENDPOINTS.INTEGRATIONS.NOTION.STATUS;
          
          const status = await this.makeRequest<ConnectedAccount>(endpoint);
          return { ...status, provider };
        } catch (error) {
          return { provider, connected: false };
        }
      });

      const connectedAccounts = await Promise.all(connectedAccountsPromises);

      return {
        profile,
        preferences: preferences as UserPreferences,
        statistics: statistics as ProfileStatistics,
        connectedAccounts
      };
    } catch (error) {
      console.error('Failed to fetch complete profile:', error);
      throw error;
    }
  }

  /**
   * Update profile information
   */
  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    return this.makeRequest<UserProfile>(API_CONFIG.ENDPOINTS.PROFILE, {
      method: 'PATCH',
      body: JSON.stringify(profileData),
    });
  }

  /**
   * Update account details (name, email)
   */
  async updateAccountDetails(accountData: {
    first_name?: string;
    last_name?: string;
    email?: string;
  }): Promise<any> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.PROFILE_UPDATE_ACCOUNT, {
      method: 'PATCH',
      body: JSON.stringify(accountData),
    });
  }

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    return this.makeRequest<UserPreferences>(API_CONFIG.ENDPOINTS.SETTINGS_PREFERENCES, {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  /**
   * Upload new avatar
   */
  async uploadAvatar(avatarFile: File): Promise<{avatar_url: string}> {
    const formData = new FormData();
    formData.append('avatar', avatarFile);

    return this.makeRequest<{avatar_url: string}>(API_CONFIG.ENDPOINTS.PROFILE_UPLOAD_AVATAR, {
      method: 'POST',
      headers: getAuthHeadersForUpload(this.authToken),
      body: formData,
    });
  }

  /**
   * Remove current avatar
   */
  async removeAvatar(): Promise<void> {
    await this.makeRequest<void>(API_CONFIG.ENDPOINTS.PROFILE_REMOVE_AVATAR, {
      method: 'DELETE',
    });
  }

  /**
   * Change password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<any> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.PASSWORD_CHANGE, {
      method: 'POST',
      body: JSON.stringify({
        old_password: oldPassword,
        new_password1: newPassword,
        new_password2: newPassword,
      }),
    });
  }

  /**
   * Get integration auth URL
   */
  async getIntegrationAuthUrl(provider: string): Promise<{auth_url: string}> {
    const endpoint = provider === 'google-drive' 
      ? API_CONFIG.ENDPOINTS.INTEGRATIONS.GOOGLE_DRIVE.AUTH_URL
      : provider === 'github'
      ? API_CONFIG.ENDPOINTS.INTEGRATIONS.GITHUB.AUTH_URL
      : API_CONFIG.ENDPOINTS.INTEGRATIONS.NOTION.AUTH_URL;
    
    return this.makeRequest<{auth_url: string}>(endpoint);
  }

  /**
   * Disconnect an integration
   */
  async disconnectIntegration(provider: string): Promise<void> {
    const endpoint = provider === 'google-drive' 
      ? API_CONFIG.ENDPOINTS.INTEGRATIONS.GOOGLE_DRIVE.STATUS
      : provider === 'github'
      ? API_CONFIG.ENDPOINTS.INTEGRATIONS.GITHUB.STATUS
      : API_CONFIG.ENDPOINTS.INTEGRATIONS.NOTION.STATUS;
    
    await this.makeRequest<void>(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * Delete account (if available)
   */
  async deleteAccount(): Promise<void> {
    // This endpoint might not be available, but we'll prepare for it
    await this.makeRequest<void>('/api/profile/delete_account/', {
      method: 'DELETE',
    });
  }

  /**
   * Export user data for GDPR compliance
   */
  async exportUserData(): Promise<any> {
    return this.makeRequest('/api/profile/export_data/');
  }

  /**
   * Get user billing information
   */
  async getBillingInfo(): Promise<BillingInfo> {
    return this.makeRequest<BillingInfo>(API_CONFIG.ENDPOINTS.BILLING);
  }

  /**
   * Get available subscription plans
   */
  async getSubscriptionPlans(): Promise<any[]> {
    return this.makeRequest<any[]>(API_CONFIG.ENDPOINTS.BILLING_PLANS);
  }

  /**
   * Update subscription plan
   */
  async updateSubscription(planId: string): Promise<any> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.BILLING_SUBSCRIPTION, {
      method: 'POST',
      body: JSON.stringify({ plan_id: planId }),
    });
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(): Promise<any> {
    return this.makeRequest(API_CONFIG.ENDPOINTS.BILLING_SUBSCRIPTION, {
      method: 'DELETE',
    });
  }
}

/**
 * Utility function to create ProfileService instance
 */
export function createProfileService(authToken: string): ProfileService {
  return new ProfileService(authToken);
}

/**
 * Hook-like function for use in React components
 */
export function useProfileService(): ProfileService | null {
  if (typeof window === 'undefined') return null;
  
  const authToken = localStorage.getItem('learniva_token');
  return authToken ? new ProfileService(authToken) : null;
}

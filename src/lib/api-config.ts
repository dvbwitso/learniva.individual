// Environment configuration for API endpoints
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  ENDPOINTS: {
    // Authentication endpoints
    LOGIN: '/api/login/',
    LOGOUT: '/api/logout/',
    REGISTER: '/api/auth/registration/',
    PASSWORD_RESET: '/api/password/reset/',
    PASSWORD_CHANGE: '/api/auth/password/change/',
    USER_DATA: '/api/auth/user/',
    
    // Profile endpoints
    PROFILE: '/api/profile/',
    PROFILE_UPDATE_ACCOUNT: '/api/profile/update_account/',
    PROFILE_PREFERENCES: '/api/profile/preferences/',
    PROFILE_STATISTICS: '/api/profile/statistics/',
    PROFILE_UPLOAD_AVATAR: '/api/profile/upload_avatar/',
    PROFILE_REMOVE_AVATAR: '/api/profile/remove_avatar/',
    
    // Settings endpoints
    SETTINGS: '/api/settings/',
    SETTINGS_THEME: '/api/settings/theme/',
    SETTINGS_PREFERENCES: '/api/settings/preferences/',
    
    // Billing endpoints
    BILLING: '/api/billing/',
    BILLING_SUBSCRIPTION: '/api/billing/subscription/',
    BILLING_PLANS: '/api/billing/plans/',
    BILLING_PAYMENT_METHODS: '/api/billing/payment-methods/',
    
    // Integration endpoints
    INTEGRATIONS: {
      GOOGLE_DRIVE: {
        STATUS: '/api/integrations/google-drive/status/',
        AUTH_URL: '/api/integrations/google-drive/auth_url/',
        CALLBACK: '/api/integrations/google-drive/callback/',
        FILES: '/api/integrations/google-drive/files/',
      },
      GITHUB: {
        STATUS: '/api/integrations/github/status/',
        AUTH_URL: '/api/integrations/github/auth_url/',
        CALLBACK: '/api/integrations/github/callback/',
        REPOSITORIES: '/api/integrations/github/repositories/',
      },
      NOTION: {
        STATUS: '/api/integrations/notion/status/',
        AUTH_URL: '/api/integrations/notion/auth_url/',
        CALLBACK: '/api/integrations/notion/callback/',
        SEARCH: '/api/integrations/notion/search/',
      }
    }
  }
};

// Helper function to build API URLs
export function buildApiUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Helper function to get auth headers
export function getAuthHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`,
  };
}

// Helper function to get auth headers for file uploads
export function getAuthHeadersForUpload(token: string): HeadersInit {
  return {
    'Authorization': `Token ${token}`,
  };
}

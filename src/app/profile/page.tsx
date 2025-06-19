"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { createProfileService } from '@/lib/profile-service'
import { 
  UserProfile, 
  UserPreferences, 
  ProfileStatistics, 
  ConnectedAccount,
  BillingInfo 
} from '@/lib/auth'
import ProtectedRoute from '@/components/protected-route'
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from '@/components/mode-toggle'
import { 
  SidebarInset, 
  SidebarProvider, 
  SidebarTrigger 
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuGroup,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import {
    User,
    Mail,
    MapPin,
    Calendar,
    Edit3,
    Save,
    Camera,
    Globe,
    Trash2,
    Crown,
    Github,
    Link as LinkIcon,
    CheckCircle,
    CreditCard,
    Settings as SettingsIcon,
    HelpCircle,
    LogOut as LogOutIcon,
    ShieldCheck,
    AlertTriangle,
    Loader2,
    Eye,
    EyeOff,
    Upload,
    ExternalLink,
    FileText
} from "lucide-react"

// Define types for subscription plans
type Plan = {
    name: string;
    price: string;
    priceDetails: string;
    features: string[];
    isCurrent: boolean;
    comingSoon?: boolean;
};

// Loading state interface
interface LoadingStates {
  profile: boolean;
  saving: boolean;
  uploadingAvatar: boolean;
  changingPassword: boolean;
  connecting: { [key: string]: boolean };
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // State management
  const [activeTab, setActiveTab] = useState("profile");
  const [currentDate, setCurrentDate] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState<LoadingStates>({
    profile: true,
    saving: false,
    uploadingAvatar: false,
    changingPassword: false,
    connecting: {}
  });
  
  // Profile data state
  const [profileData, setProfileData] = useState<UserProfile>({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    bio: '',
    display_name: '',
    location: '',
    website: '',
    avatar: '',
    created_at: '',
  });
  
  const [originalProfileData, setOriginalProfileData] = useState<UserProfile>({} as UserProfile);
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [statistics, setStatistics] = useState<ProfileStatistics>({});
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    plan: "Basic",
    plan_type: "free",
    price: "Free",
    billing_cycle: "Forever",
    next_billing_date: null,
    payment_method: null,
    payment_type: null,
    status: "active"
  });
  const [subscriptionPlans, setSubscriptionPlans] = useState<Plan[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
    showPasswords: false
  });



  // Initialize data on component mount
  useEffect(() => {
    const date = new Date();
    setCurrentDate(date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric' 
    }));

    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;

    const token = localStorage.getItem("learniva_token");
    if (!token) {
      logout();
      return;
    }

    setLoading(prev => ({ ...prev, profile: true }));

    try {
      const profileService = createProfileService(token);
      
      // Load core profile data
      const completeProfile = await profileService.getCompleteProfile();
      
      setProfileData(completeProfile.profile);
      setOriginalProfileData(completeProfile.profile);
      setPreferences(completeProfile.preferences);
      setStatistics(completeProfile.statistics);
      setConnectedAccounts(completeProfile.connectedAccounts);

      // Load billing information with proper error handling
      try {
        const billing = await profileService.getBillingInfo();
        setBillingInfo(billing);
        
        // Load subscription plans after we have billing info
        try {
          const plans = await profileService.getSubscriptionPlans();
          // Transform API response to match our Plan interface
          const transformedPlans: Plan[] = plans.map((plan: any) => ({
            name: plan.name || plan.plan_name,
            price: plan.price || plan.monthly_price || "Free",
            priceDetails: plan.billing_cycle || plan.interval || "per month",
            features: plan.features || [],
            isCurrent: billing.plan === (plan.name || plan.plan_name),
            comingSoon: plan.available === false || plan.status === 'coming_soon'
          }));
          setSubscriptionPlans(transformedPlans);
        } catch (plansError) {
          console.warn("Failed to load subscription plans:", plansError);
          // Only show error, don't fall back to mock data
          toast.error("Unable to load subscription plans. Please try again later.");
          setSubscriptionPlans([]);
        }
        
      } catch (billingError) {
        console.warn("Failed to load billing info:", billingError);
        // Only show error, don't fall back to mock data
        toast.error("Unable to load billing information. Please try again later.");
        // Set minimal billing info to prevent UI errors
        setBillingInfo({
          plan: "Unknown",
          plan_type: "free",
          price: "N/A",
          billing_cycle: "N/A",
          next_billing_date: null,
          payment_method: null,
          payment_type: null,
          status: "inactive"
        });
        setSubscriptionPlans([]);
      }
      
    } catch (error: any) {
      console.error("Failed to load profile data:", error);
      toast.error("Failed to load profile data: " + error.message);
      
      // If authentication error, logout user
      if (error.message.includes("Authentication") || error.message.includes("401")) {
        logout();
      }
    } finally {
      setLoading(prev => ({ ...prev, profile: false }));
    }
  };

  const handleProfileSave = async () => {
    const errors = validateProfileForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const token = localStorage.getItem("learniva_token");
    if (!token) return;

    setLoading(prev => ({ ...prev, saving: true }));
    setFormErrors({});

    try {
      const profileService = createProfileService(token);
      
      // Update profile data
      const updatedProfile = await profileService.updateProfile({
        bio: profileData.bio,
        display_name: profileData.display_name,
        location: profileData.location,
        website: profileData.website,
      });

      // Update account details (name) separately - email is readonly
      await profileService.updateAccountDetails({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
      });

      setProfileData(updatedProfile);
      setOriginalProfileData(updatedProfile);
      setIsEditMode(false); // Exit edit mode after successful save
      toast.success("Profile updated successfully!");
      
    } catch (error: any) {
      console.error("Failed to save profile:", error);
      toast.error("Failed to save profile: " + error.message);
      setFormErrors({ general: error.message });
    } finally {
      setLoading(prev => ({ ...prev, saving: false }));
    }
  };

  const handleCancelEdit = () => {
    setProfileData(originalProfileData);
    setFormErrors({});
    setIsEditMode(false);
  };

  const handleEnterEditMode = () => {
    setIsEditMode(true);
    setFormErrors({});
  };

  const validateProfileForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!profileData.username?.trim()) {
      errors.username = "Username is required";
    } else if (!/^[a-zA-Z0-9_]+$/.test(profileData.username)) {
      errors.username = "Username can only contain letters, numbers, and underscores";
    }
    
    if (profileData.website && !/^https?:\/\/.+\..+/.test(profileData.website)) {
      errors.website = "Please enter a valid website URL";
    }

    return errors;
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAvatarUpload = async (file: File) => {
    const token = localStorage.getItem("learniva_token");
    if (!token) return;

    setLoading(prev => ({ ...prev, uploadingAvatar: true }));

    try {
      const profileService = createProfileService(token);
      const result = await profileService.uploadAvatar(file);
      
      setProfileData(prev => ({
        ...prev,
        avatar: result.avatar_url
      }));
      
      toast.success("Avatar uploaded successfully!");
    } catch (error: any) {
      console.error("Failed to upload avatar:", error);
      toast.error("Failed to upload avatar: " + error.message);
    } finally {
      setLoading(prev => ({ ...prev, uploadingAvatar: false }));
    }
  };

  const handleAvatarRemove = async () => {
    const token = localStorage.getItem("learniva_token");
    if (!token) return;

    try {
      const profileService = createProfileService(token);
      await profileService.removeAvatar();
      
      setProfileData(prev => ({
        ...prev,
        avatar: ''
      }));
      
      toast.success("Avatar removed successfully!");
    } catch (error: any) {
      console.error("Failed to remove avatar:", error);
      toast.error("Failed to remove avatar: " + error.message);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordForm.new_password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    const token = localStorage.getItem("learniva_token");
    if (!token) return;

    setLoading(prev => ({ ...prev, changingPassword: true }));

    try {
      const profileService = createProfileService(token);
      await profileService.changePassword(passwordForm.current_password, passwordForm.new_password);
      
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
        showPasswords: false
      });
      
      toast.success("Password changed successfully!");
    } catch (error: any) {
      console.error("Failed to change password:", error);
      toast.error("Failed to change password: " + error.message);
    } finally {
      setLoading(prev => ({ ...prev, changingPassword: false }));
    }
  };

  const handleConnectAccount = async (provider: string) => {
    const token = localStorage.getItem("learniva_token");
    if (!token) return;

    setLoading(prev => ({ 
      ...prev, 
      connecting: { ...prev.connecting, [provider]: true }
    }));

    try {
      const profileService = createProfileService(token);
      const result = await profileService.getIntegrationAuthUrl(provider);
      
      // Open auth URL in new window
      window.open(result.auth_url, '_blank', 'width=600,height=600');
      
      // Refresh connected accounts after a delay
      setTimeout(() => {
        loadProfileData();
      }, 2000);
      
    } catch (error: any) {
      console.error(`Failed to connect ${provider}:`, error);
      toast.error(`Failed to connect ${provider}: ` + error.message);
    } finally {
      setLoading(prev => ({ 
        ...prev, 
        connecting: { ...prev.connecting, [provider]: false }
      }));
    }
  };

  const handleDisconnectAccount = async (provider: string) => {
    const token = localStorage.getItem("learniva_token");
    if (!token) return;

    try {
      const profileService = createProfileService(token);
      await profileService.disconnectIntegration(provider);
      
      // Refresh connected accounts
      loadProfileData();
      toast.success(`Disconnected from ${provider} successfully!`);
      
    } catch (error: any) {
      console.error(`Failed to disconnect ${provider}:`, error);
      toast.error(`Failed to disconnect ${provider}: ` + error.message);
    }
  };

  const handleSubscriptionChange = async (planId: string) => {
    const token = localStorage.getItem("learniva_token");
    if (!token) return;

    try {
      const profileService = createProfileService(token);
      await profileService.updateSubscription(planId);
      
      // Refresh billing info
      loadProfileData();
      toast.success("Subscription updated successfully!");
      
    } catch (error: any) {
      console.error("Failed to update subscription:", error);
      toast.error("Failed to update subscription: " + error.message);
    }
  };

  const getProfileCompletion = () => {
    const fields = [
      profileData.first_name,
      profileData.last_name,
      profileData.bio,
      profileData.location,
      profileData.website,
      profileData.avatar,
      profileData.display_name
    ];
    const completedFields = fields.filter(field => field && field.trim()).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const getUserDisplayName = () => {
    if (profileData.display_name) return profileData.display_name;
    if (profileData.first_name || profileData.last_name) {
      return `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim();
    }
    return profileData.username || 'User';
  };

  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    return displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading.profile) {
    return (
      <ProtectedRoute>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="flex items-center justify-center min-h-screen">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading profile...</span>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Account Settings</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <span className="hidden sm:inline text-sm text-muted-foreground">{currentDate}</span>
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full">
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                      <AvatarImage src={profileData.avatar || "https://placehold.co/40x40"} alt="User Avatar" />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/profile')}>
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/dashboard/help')}>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => {
                    await logout();
                    console.log('Logout clicked');
                  }}>
                    <LogOutIcon className="mr-2 h-4 w-4 text-red-500" />
                    <span className="text-red-500">Log-out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
            <h1 className="text-2xl font-semibold tracking-tight">Account Settings</h1>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Sidebar Navigation */}
              <aside className="w-full md:w-64 space-y-1">
                <div className="pb-2">
                  <h2 className="text-sm font-medium text-muted-foreground px-2">Settings</h2>
                </div>
                <Button
                  variant={activeTab === "profile" ? "default" : "ghost"}
                  className="w-full justify-start text-left px-3 py-2.5 h-auto font-normal"
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="mr-3 h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Profile</span>
                    <span className="text-xs text-muted-foreground">Personal details</span>
                  </div>
                </Button>
                <Button
                  variant={activeTab === "billing" ? "default" : "ghost"}
                  className="w-full justify-start text-left px-3 py-2.5 h-auto font-normal"
                  onClick={() => setActiveTab("billing")}
                >
                  <CreditCard className="mr-3 h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Billing & Plans</span>
                    <span className="text-xs text-muted-foreground">Subscription management</span>
                  </div>
                </Button>
                <Button
                  variant={activeTab === "security" ? "default" : "ghost"}
                  className="w-full justify-start text-left px-3 py-2.5 h-auto font-normal"
                  onClick={() => setActiveTab("security")}
                >
                  <ShieldCheck className="mr-3 h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Security</span>
                    <span className="text-xs text-muted-foreground">Password & accounts</span>
                  </div>
                </Button>
              </aside>

              {/* Main Content */}
              <div className="flex-1 max-w-3xl">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    {/* Profile Information Card */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                              {isEditMode 
                                ? "Update your personal information and public profile." 
                                : "Your personal information and public profile details."
                              }
                            </CardDescription>
                          </div>
                          {!isEditMode && (
                            <Button
                              variant="outline"
                              onClick={handleEnterEditMode}
                              className="flex items-center gap-2"
                            >
                              <Edit3 className="h-4 w-4" />
                              Edit Profile
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Avatar Section */}
                        <div className="flex items-start gap-6 pb-4 border-b">
                          <div className="relative">
                            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                              <AvatarImage 
                                src={profileData.avatar || "https://placehold.co/100x100"} 
                                alt="Profile picture"
                              />
                              <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {getUserInitials()}
                              </AvatarFallback>
                            </Avatar>
                            {isEditMode && (
                              <div className="absolute -bottom-2 -right-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleAvatarUpload(file);
                                  }}
                                  className="hidden"
                                  id="avatar-upload"
                                />
                                <label htmlFor="avatar-upload">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-8 w-8 rounded-full p-0 bg-background border-2 shadow-sm hover:shadow-md" 
                                    title="Change profile picture"
                                    disabled={loading.uploadingAvatar}
                                    asChild
                                  >
                                    <span>
                                      {loading.uploadingAvatar ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Camera className="h-4 w-4" />
                                      )}
                                    </span>
                                  </Button>
                                </label>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-foreground mb-1">Profile Picture</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {isEditMode 
                                ? "Upload a professional photo that represents you well. This will be visible to other users."
                                : "Your profile picture as it appears to other users."
                              }
                            </p>
                            {isEditMode && (
                              <>
                                <div className="flex gap-2">
                                  <label htmlFor="avatar-upload">
                                    <Button variant="outline" size="sm" disabled={loading.uploadingAvatar} asChild>
                                      <span>
                                        <Upload className="mr-2 h-4 w-4" />
                                        {loading.uploadingAvatar ? 'Uploading...' : 'Upload Photo'}
                                      </span>
                                    </Button>
                                  </label>
                                  {profileData.avatar && (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={handleAvatarRemove}
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Remove
                                    </Button>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Recommended: Square image, at least 400×400px. Max file size: 5MB.
                                </p>
                              </>
                            )}
                            {!isEditMode && profileData.created_at && (
                              <div className="space-y-3 mt-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  <span>Member since {new Date(profileData.created_at).toLocaleDateString('en-US', { 
                                    month: 'long', 
                                    year: 'numeric' 
                                  })}</span>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Profile Completion</span>
                                    <span className="font-medium">{getProfileCompletion()}%</span>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300" 
                                      style={{ width: `${getProfileCompletion()}%` }}
                                    />
                                  </div>
                                  {getProfileCompletion() < 100 && (
                                    <p className="text-xs text-muted-foreground">
                                      Complete your profile to unlock all features
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Form Fields */}
                        <div className="grid gap-6">
                          {/* Personal Information */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium text-foreground">Personal Information</h3>
                            
                            {!isEditMode ? (
                              // Read-only view
                              <div className="grid gap-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">First Name</Label>
                                    <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                                      <User className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm">{profileData.first_name || 'Not provided'}</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Last Name</Label>
                                    <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                                      <User className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-sm">{profileData.last_name || 'Not provided'}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-muted-foreground">Username</Label>
                                  <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-mono">@{profileData.username}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                                  <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{profileData.email}</span>
                                    <Badge variant="secondary" className="ml-auto">
                                      <ShieldCheck className="h-3 w-3 mr-1" />
                                      Verified
                                    </Badge>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-muted-foreground">Display Name</Label>
                                  <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{profileData.display_name || getUserDisplayName()}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              // Edit mode
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                  <Label htmlFor="first_name">First Name</Label>
                                  <Input
                                    id="first_name"
                                    placeholder="Enter your first name"
                                    value={profileData.first_name || ''}
                                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                                    className={formErrors.first_name ? "border-destructive" : ""}
                                  />
                                  {formErrors.first_name && (
                                    <p className="text-sm text-destructive">{formErrors.first_name}</p>
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="last_name">Last Name</Label>
                                  <Input
                                    id="last_name"
                                    placeholder="Enter your last name"
                                    value={profileData.last_name || ''}
                                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                                    className={formErrors.last_name ? "border-destructive" : ""}
                                  />
                                  {formErrors.last_name && (
                                    <p className="text-sm text-destructive">{formErrors.last_name}</p>
                                  )}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                  <Label htmlFor="username">Username *</Label>
                                  <Input
                                    id="username"
                                    placeholder="Enter your username"
                                    value={profileData.username || ''}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    className={formErrors.username ? "border-destructive" : ""}
                                  />
                                  {formErrors.username && (
                                    <p className="text-sm text-destructive">{formErrors.username}</p>
                                  )}
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                  <Label htmlFor="email">Email Address (Read-only)</Label>
                                  <Input
                                    id="email"
                                    type="email"
                                    value={profileData.email || ''}
                                    readOnly
                                    className="bg-muted/50 cursor-not-allowed"
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    Email address cannot be changed. Contact support if you need to update your email.
                                  </p>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                  <Label htmlFor="display_name">Display Name</Label>
                                  <Input
                                    id="display_name"
                                    placeholder="How others will see you"
                                    value={profileData.display_name || ''}
                                    onChange={(e) => handleInputChange('display_name', e.target.value)}
                                    className={formErrors.display_name ? "border-destructive" : ""}
                                  />
                                  {formErrors.display_name && (
                                    <p className="text-sm text-destructive">{formErrors.display_name}</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Bio Section */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium text-foreground">About You</h3>
                            
                            {!isEditMode ? (
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-muted-foreground">Bio</Label>
                                <div className="p-4 border rounded-lg bg-muted/50 min-h-[100px]">
                                  {profileData.bio ? (
                                    <p className="text-sm whitespace-pre-wrap">{profileData.bio}</p>
                                  ) : (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                      <div className="text-center">
                                        <FileText className="h-8 w-8 mx-auto mb-2" />
                                        <p className="text-sm">No bio added yet</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <textarea
                                  id="bio"
                                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                  placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                                  value={profileData.bio || ''}
                                  onChange={(e) => handleInputChange('bio', e.target.value)}
                                  maxLength={500}
                                  rows={4}
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Tell us about yourself</span>
                                  <span>{(profileData.bio || '').length}/500</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Contact Information */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium text-foreground">Contact Information</h3>
                            
                            {!isEditMode ? (
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                                  <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{profileData.location || 'Not provided'}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium text-muted-foreground">Website</Label>
                                  <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                    {profileData.website ? (
                                      <a 
                                        href={profileData.website} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                                      >
                                        {profileData.website}
                                      </a>
                                    ) : (
                                      <span className="text-sm">Not provided</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                  <Label htmlFor="location">Location</Label>
                                  <Input
                                    id="location"
                                    placeholder="City, Country"
                                    value={profileData.location || ''}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="website">Website</Label>
                                  <Input
                                    id="website"
                                    type="url"
                                    placeholder="https://yourwebsite.com"
                                    value={profileData.website || ''}
                                    onChange={(e) => handleInputChange('website', e.target.value)}
                                    className={formErrors.website ? "border-destructive" : ""}
                                  />
                                  {formErrors.website && (
                                    <p className="text-sm text-destructive">{formErrors.website}</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditMode && (
                          <div className="flex justify-between items-center pt-6 border-t">
                            <div className="text-sm text-muted-foreground">
                              <span className="text-destructive">*</span> Required fields
                            </div>
                            <div className="flex gap-3">
                              <Button 
                                variant="outline" 
                                onClick={handleCancelEdit}
                                disabled={loading.saving}
                              >
                                Cancel
                              </Button>
                              <Button 
                                onClick={handleProfileSave} 
                                disabled={loading.saving}
                                className="flex items-center gap-2"
                              >
                                {loading.saving ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Save className="h-4 w-4" />
                                )}
                                {loading.saving ? 'Saving...' : 'Save Changes'}
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* General error display */}
                        {formErrors.general && (
                          <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                            <div className="flex items-center gap-2 text-destructive">
                              <AlertTriangle className="h-4 w-4" />
                              <span className="text-sm font-medium">Error saving profile</span>
                            </div>
                            <p className="text-sm text-destructive mt-1">{formErrors.general}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Billing Tab */}
                {activeTab === "billing" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Current Plan Card */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Current Plan</CardTitle>
                          <CardDescription>You are currently on the {billingInfo.plan} plan.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between p-4 border rounded-lg bg-background">
                            <div>
                              <div className="font-semibold flex items-center gap-2">
                                {billingInfo.plan}
                                {billingInfo.plan === 'Basic' && <Crown className="h-4 w-4 text-yellow-500" />}
                              </div>
                              <div className="text-sm text-muted-foreground">{billingInfo.price} {billingInfo.billing_cycle}</div>
                            </div>
                            <Badge variant={billingInfo.status === 'active' ? 'default' : 'destructive'} 
                                   className={billingInfo.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}>
                              {billingInfo.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {billingInfo.next_billing_date ? (
                              <span>Next billing date: {new Date(billingInfo.next_billing_date).toLocaleDateString()}</span>
                            ) : (
                              <span>No billing required for your current plan</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Payment Method Card */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Payment Method</CardTitle>
                          <CardDescription>
                            {billingInfo.plan_type === 'free' 
                              ? 'No payment method required for the free plan.' 
                              : 'Update your payment information.'
                            }
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {billingInfo.plan_type === 'free' ? (
                            <div className="flex items-center justify-center p-8 border rounded-lg bg-muted/50">
                              <div className="text-center">
                                <CreditCard className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">No payment method needed</p>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <CreditCard className="h-5 w-5" />
                                <div>
                                  <div className="font-medium">{billingInfo.payment_method || '•••• •••• •••• ••••'}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {billingInfo.payment_type ? `${billingInfo.payment_type}` : 'No payment method added'}
                                  </div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">Update</Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Pricing Plans */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Choose Your Plan</CardTitle>
                        <CardDescription>Select the plan that best fits your needs.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {subscriptionPlans.length > 0 ? (
                          <div className="grid md:grid-cols-3 gap-6">
                            {subscriptionPlans.map((plan: Plan) => (
                              <Card key={plan.name} className={`flex flex-col relative ${plan.isCurrent ? 'border-primary ring-2 ring-primary' : ''} ${plan.comingSoon ? 'opacity-75' : ''}`}>
                                {plan.comingSoon && (
                                  <div className="absolute top-4 right-4 z-10">
                                    <Badge variant="secondary">Coming Soon</Badge>
                                  </div>
                                )}
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    {plan.name}
                                    {plan.isCurrent && <Badge variant="secondary">Current</Badge>}
                                  </CardTitle>
                                  <div className="text-3xl font-bold">
                                    {plan.price}
                                    {plan.priceDetails && <span className="text-sm font-normal text-muted-foreground">/{plan.priceDetails}</span>}
                                  </div>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col justify-between">
                                  <ul className="space-y-2 mb-6">
                                    {plan.features.map((feature, index) => (
                                      <li key={index} className="flex items-center gap-2 text-sm">
                                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                        {feature}
                                      </li>
                                    ))}
                                  </ul>
                                  <Button 
                                    disabled={plan.isCurrent || plan.comingSoon} 
                                    className="w-full"
                                    onClick={() => plan.name && !plan.isCurrent && !plan.comingSoon && handleSubscriptionChange(plan.name.toLowerCase())}
                                  >
                                    {plan.isCurrent ? 'Current Plan' : plan.comingSoon ? 'Coming Soon' : 'Upgrade'}
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center p-8 border rounded-lg bg-muted/50">
                            <div className="text-center">
                              <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Subscription plans are currently unavailable.</p>
                              <p className="text-xs text-muted-foreground mt-1">Please try again later or contact support.</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    {/* Password Change */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>
                          Ensure your account is secure by using a strong, unique password.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="current_password">Current Password *</Label>
                            <div className="relative">
                              <Input
                                id="current_password"
                                type={passwordForm.showPasswords ? "text" : "password"}
                                placeholder="Enter your current password"
                                value={passwordForm.current_password}
                                onChange={(e) => setPasswordForm(prev => ({
                                  ...prev,
                                  current_password: e.target.value
                                }))}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setPasswordForm(prev => ({
                                  ...prev,
                                  showPasswords: !prev.showPasswords
                                }))}
                              >
                                {passwordForm.showPasswords ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new_password">New Password *</Label>
                            <Input
                              id="new_password"
                              type={passwordForm.showPasswords ? "text" : "password"}
                              placeholder="Enter your new password"
                              value={passwordForm.new_password}
                              onChange={(e) => setPasswordForm(prev => ({
                                ...prev,
                                new_password: e.target.value
                              }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm_password">Confirm New Password *</Label>
                            <Input
                              id="confirm_password"
                              type={passwordForm.showPasswords ? "text" : "password"}
                              placeholder="Confirm your new password"
                              value={passwordForm.confirm_password}
                              onChange={(e) => setPasswordForm(prev => ({
                                ...prev,
                                confirm_password: e.target.value
                              }))}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end pt-4 border-t">
                          <Button 
                            className="flex items-center gap-2"
                            onClick={handlePasswordChange}
                            disabled={loading.changingPassword || !passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password}
                          >
                            {loading.changingPassword ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                            {loading.changingPassword ? 'Updating...' : 'Update Password'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Connected Accounts */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Connected Accounts</CardTitle>
                        <CardDescription>
                          Manage your third-party account connections for easier sign-in and data import.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          {connectedAccounts.map((account) => (
                            <div key={account.provider} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                              <div className="flex items-center gap-3">
                                {account.provider === 'google-drive' && <Mail className="h-5 w-5 text-red-500" />}
                                {account.provider === 'github' && <Github className="h-5 w-5" />}
                                {account.provider === 'notion' && <FileText className="h-5 w-5" />}
                                <div>
                                  <div className="font-medium capitalize">
                                    {account.provider.replace('-', ' ')}
                                  </div>
                                  {account.connected && (account.email || account.username) && (
                                    <div className="text-sm text-muted-foreground">
                                      {account.email || account.username}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {account.connected ? (
                                  <>
                                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                                      <CheckCircle className="mr-1 h-3 w-3" />
                                      Connected
                                    </Badge>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDisconnectAccount(account.provider)}
                                    >
                                      Disconnect
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleConnectAccount(account.provider)}
                                    disabled={loading.connecting[account.provider]}
                                  >
                                    {loading.connecting[account.provider] ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                      <ExternalLink className="mr-2 h-4 w-4" />
                                    )}
                                    Connect
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="border-destructive/50">
                      <CardHeader>
                        <CardTitle className="text-destructive flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          Danger Zone
                        </CardTitle>
                        <CardDescription>
                          These actions are permanent and cannot be undone. Please proceed with caution.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                            <div>
                              <div className="font-medium text-destructive">Delete Account</div>
                              <div className="text-sm text-muted-foreground">
                                Permanently delete your account and all associated data. This action cannot be undone.
                              </div>
                            </div>
                            <Button variant="destructive" size="sm">
                              Delete Account
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}

"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save,
  Camera,
  Award,
  TrendingUp,
  Globe,
  Trash2, // Ensured Trash2 is imported
  Crown,
  Github,
  Link,
  CheckCircle,
  CreditCard,
  Settings as SettingsIcon, // Renamed to avoid conflict if another Settings is imported
  Briefcase, // Added for Billing tab icon
  Download, // Added for Download Receipt button
  HelpCircle, // Added for Dropdown
  MessageSquare, // Added for Dropdown
  ArrowLeft, // Added for Dropdown
  LogOut as LogOutIcon // Added for Dropdown
} from "lucide-react"
import { useState, useEffect } from "react" // Added useEffect
import { useRouter } from "next/navigation"; // Added useRouter
import { getUserData } from "@/lib/auth"; // Added getUserData
import { ModeToggle } from "@/components/mode-toggle"; // Added ModeToggle
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Added DropdownMenu components

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    first_name: "Alex",
    last_name: "Johnson",
    username: "alexjohnson",
    display_name: "Alex Johnson",
    email: "alex.johnson@example.com",
    bio: "Passionate about creating intuitive user experiences and solving complex design challenges. Always learning and growing in the field of UX/UI design.",
    location: "San Francisco, CA",
    website: "https://alexjohnson.dev",
    avatar: "/placeholder-avatar.jpg",
    created_at: "2023-01-15T10:30:00Z"
  })

  const [connectedAccounts, setConnectedAccounts] = useState({
    google: {
      connected: true,
      email: "alex.johnson@gmail.com",
      connected_at: "2023-01-20T10:30:00Z"
    },
    github: {
      connected: true,
      username: "alexjohnson-dev",
      connected_at: "2023-02-15T14:22:00Z"
    },
    notion: {
      connected: false,
      workspace: null,
      connected_at: null
    }
  })

  const [billingInfo, setBillingInfo] = useState({
    plan: "Pro",
    plan_type: "monthly",
    price: "$29",
    billing_cycle: "Monthly",
    next_billing_date: "2025-07-11T00:00:00Z",
    payment_method: "•••• •••• •••• 4242",
    payment_type: "Visa",
    status: "active"
  })

  const [statistics, setStatistics] = useState({
    completedCourses: 12,
    currentStreak: 5
  })
  const router = useRouter(); // Initialize router
  const [userName, setUserName] = useState("User"); // Default username
  const [currentDate, setCurrentDate] = useState(''); // Added for header

  useEffect(() => {
    const date = new Date();
    setCurrentDate(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }));

    const fetchUserData = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const userData = await getUserData(token);
          if (userData.username) {
            setUserName(userData.username);
          }
          // Update profileData with fetched data if necessary
          setProfileData(prev => ({
            ...prev,
            first_name: userData.first_name || prev.first_name,
            last_name: userData.last_name || prev.last_name,
            username: userData.username || prev.username,
            display_name: userData.first_name && userData.last_name ? `${userData.first_name} ${userData.last_name}` : prev.display_name,
            email: userData.email || prev.email,
            // Assuming other fields like bio, location, website, avatar might come from userData too
          }));
        } catch (error: any) {
          console.error("Failed to fetch user data:", error);
          if (error.message.includes("Authentication credentials were not provided") || error.message.includes("Invalid token")) {
            localStorage.removeItem("authToken");
            router.push("/login");
          }
        }
      } else {
        router.push("/login");
      }
    };

    fetchUserData();
  }, [router]);

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to your backend
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleConnectAccount = (provider: string) => {
    // Here you would handle OAuth connection flow
    console.log(`Connecting to ${provider}`)
  }

  const handleDisconnectAccount = (provider: string) => {
    // Here you would handle disconnection
    console.log(`Disconnecting from ${provider}`)
    setConnectedAccounts(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider as keyof typeof prev],
        connected: false,
        connected_at: null
      }
    }))
  }

  return (
    <SidebarProvider>
      <AppSidebar isCollapsed={false} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
          {/* Left Group: Sidebar Trigger & Breadcrumbs */}
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

          {/* Right Group: Date, Theme Toggle, Avatar Dropdown */}
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden sm:inline text-sm text-muted-foreground">{currentDate}</span>
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full">
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                    {/* Use profileData.avatar if available, otherwise fallback */}
                    <AvatarImage src={profileData.avatar !== "/placeholder-avatar.jpg" ? profileData.avatar : "https://placehold.co/40x40"} alt="User Avatar" />
                    <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
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
                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/help')}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => window.open('https://slack.com', '_blank')}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Visit our Slack Channel</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <span>Back to Landing Page</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  localStorage.removeItem("authToken");
                  router.push("/login");
                  console.log('Logout clicked');
                }}>
                  <LogOutIcon className="mr-2 h-4 w-4 text-red-500" />
                  <span className="text-red-500">Log-out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <h1 className="text-2xl font-semibold">Account Settings</h1>
          <Tabs defaultValue="billing" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="billing">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="account-settings">
                <SettingsIcon className="mr-2 h-4 w-4" />
                Account Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              {/* Profile Header */}
              <Card className="mt-6">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profileData.avatar} alt={profileData.display_name} />
                        <AvatarFallback className="text-lg">
                          {profileData.first_name[0]}{profileData.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2 flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 rounded-full p-0"
                          title="Upload new avatar"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                        {profileData.avatar !== "/placeholder-avatar.jpg" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 rounded-full p-0 text-red-500 hover:text-red-600"
                            title="Remove avatar"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <div className="flex flex-col items-center justify-between md:flex-row">
                        <div>
                          <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold">{profileData.display_name}</h1>
                            <Badge variant="success" className="ml-2">
                              Active
                            </Badge>
                            <Badge variant="default" className="flex items-center gap-1">
                              <Crown className="h-3 w-3" />
                              {billingInfo.plan}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">@{profileData.username}</p>
                          <p className="text-sm text-muted-foreground">{profileData.email}</p>
                          {profileData.location && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" />
                              {profileData.location}
                            </p>
                          )}
                          {profileData.website && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              <a href={profileData.website} target="_blank" rel="noopener noreferrer" 
                                 className="hover:underline text-blue-600">
                                {profileData.website}
                              </a>
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1 text-sm">
                              <Award className="h-4 w-4 text-orange-500" />
                              <span>{statistics.completedCourses} courses completed</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              <span>{statistics.currentStreak} day streak</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                          className="mt-4 md:mt-0"
                        >
                          {isEditing ? (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          ) : (
                            <>
                              <Edit3 className="mr-2 h-4 w-4" />
                              Edit Profile
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Information Card - This seems to be general billing info, not the plan selection from screenshot */}
              {/* Keeping this as it might be distinct from the new pricing card */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Billing Information
                  </CardTitle>
                  <CardDescription>
                    Your current plan and billing details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">Current Plan</h3>
                            <Badge variant="default" className="flex items-center gap-1">
                              <Crown className="h-3 w-3" />
                              {billingInfo.plan}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {billingInfo.price}/{billingInfo.plan_type}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Next billing: {new Date(billingInfo.next_billing_date).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Upgrade Plan
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Plan Status</span>
                          <Badge variant={billingInfo.status === 'active' ? 'success' : 'destructive'}>
                            {billingInfo.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Billing Cycle</span>
                          <span className="text-sm">{billingInfo.billing_cycle}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-2">Payment Method</h3>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 text-primary rounded flex items-center justify-center">
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{billingInfo.payment_type}</p>
                            <p className="text-xs text-muted-foreground">{billingInfo.payment_method}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="mt-3 w-full">
                          Update Payment Method
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Link className="mr-2 h-4 w-4" />
                          View Invoices
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="mr-2 h-4 w-4" />
                          Download Receipt
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid gap-6 md:grid-cols-2 mt-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>
                      Your basic profile information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      {isEditing ? (
                        <Input
                          id="first_name"
                          value={profileData.first_name}
                          onChange={(e) => handleInputChange('first_name', e.target.value)}
                        />
                      ) : (
                        <p className="text-sm">{profileData.first_name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      {isEditing ? (
                        <Input
                          id="last_name"
                          value={profileData.last_name}
                          onChange={(e) => handleInputChange('last_name', e.target.value)}
                        />
                      ) : (
                        <p className="text-sm">{profileData.last_name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="display_name">Display Name</Label>
                      {isEditing ? (
                        <Input
                          id="display_name"
                          value={profileData.display_name}
                          onChange={(e) => handleInputChange('display_name', e.target.value)}
                        />
                      ) : (
                        <p className="text-sm">{profileData.display_name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      {isEditing ? (
                        <Input
                          id="username"
                          value={profileData.username}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          placeholder="@username"
                        />
                      ) : (
                        <p className="text-sm">@{profileData.username}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      ) : (
                        <p className="text-sm">{profileData.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Member Since
                      </Label>
                      <p className="text-sm">
                        {new Date(profileData.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Biography</Label>
                      {isEditing ? (
                        <textarea
                          id="bio"
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={profileData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          rows={3}
                          placeholder="Tell us about yourself..."
                          maxLength={500}
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          {profileData.bio || 'No biography provided'}
                        </p>
                      )}
                      {isEditing && (
                        <p className="text-xs text-muted-foreground">
                          {profileData.bio.length}/500 characters
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Additional Information
                    </CardTitle>
                    <CardDescription>
                      Your location and website
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location
                      </Label>
                      {isEditing ? (
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="e.g., San Francisco, CA"
                        />
                      ) : (
                        <p className="text-sm">{profileData.location || 'Not specified'}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website" className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Website
                      </Label>
                      {isEditing ? (
                        <Input
                          id="website"
                          type="url"
                          value={profileData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          placeholder="https://yourwebsite.com"
                        />
                      ) : (
                        <p className="text-sm">
                          {profileData.website ? (
                            <a href={profileData.website} target="_blank" rel="noopener noreferrer" 
                               className="text-blue-600 hover:underline">
                              {profileData.website}
                            </a>
                          ) : (
                            'Not specified'
                          )}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="billing">
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-start-2"> {/* Centering the card for a single plan display */}
                  <Card className="bg-black text-white rounded-lg shadow-xl overflow-hidden">
                    <CardContent className="p-8 flex flex-col items-center text-center">
                      <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">PRO</p>
                      <div className="my-6">
                        <span className="text-6xl font-bold">$400</span>
                        {/* The flower icon is not standard in lucide, using Award as placeholder */}
                        {/* Or you could use an SVG or an image if you have one */}
                        <Award className="h-16 w-16 text-white mx-auto mt-4" /> 
                      </div>
                      <ul className="space-y-3 text-gray-300 mb-8 self-start">
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                          3 prototypes
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                          3 boards
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                          Single user
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                          Normal security
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                          Permissions & workflows
                        </li>
                      </ul>
                      <Button className="w-full bg-white text-black hover:bg-gray-200 py-3 text-lg font-semibold">
                        Choose Plan
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="account-settings">
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>Account settings content goes here. This section is a placeholder.</p>
                  {/* Example setting item */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Language</p>
                      <p className="text-sm text-muted-foreground">English (United States)</p>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Theme</p>
                      <p className="text-sm text-muted-foreground">System Default</p>
                    </div>
                    <Button variant="outline" size="sm">Change</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

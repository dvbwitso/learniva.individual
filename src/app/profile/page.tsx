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
  Settings, // Added for Account Settings tab
  Briefcase // Added for Billing tab icon
} from "lucide-react"
import { useState } from "react"

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
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
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
                <Settings className="mr-2 h-4 w-4" />
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

              {/* Connected Accounts */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    Connected Accounts
                  </CardTitle>
                  <CardDescription>
                    Manage your connected social accounts and integrations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Google Account */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Google</p>
                        {connectedAccounts.google.connected ? (
                          <p className="text-sm text-muted-foreground">{connectedAccounts.google.email}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not connected</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {connectedAccounts.google.connected ? (
                        <>
                          <Badge variant="success" className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Connected
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDisconnectAccount('google')}
                          >
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleConnectAccount('google')}
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* GitHub Account */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Github className="w-5 h-5 text-gray-800" />
                      </div>
                      <div>
                        <p className="font-medium">GitHub</p>
                        {connectedAccounts.github.connected ? (
                          <p className="text-sm text-muted-foreground">@{connectedAccounts.github.username}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not connected</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {connectedAccounts.github.connected ? (
                        <>
                          <Badge variant="success" className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Connected
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDisconnectAccount('github')}
                          >
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleConnectAccount('github')}
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Notion Account */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933l3.222-.187z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Notion</p>
                        {connectedAccounts.notion.connected ? (
                          <p className="text-sm text-muted-foreground">{connectedAccounts.notion.workspace}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not connected</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {connectedAccounts.notion.connected ? (
                        <>
                          <Badge variant="success" className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Connected
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDisconnectAccount('notion')}
                          >
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleConnectAccount('notion')}
                        >
                          Connect
                        </Button>
                      )}
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
                          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-blue-600" />
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

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Invoices
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
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

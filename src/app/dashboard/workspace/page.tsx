// filepath: /Users/dabwitso/learniva-frontend/src/app/dashboard/workspace/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// Updated lucide-react imports
import { UploadCloud, FileText, Brain, Settings as SettingsIcon, HelpCircle as HelpCircleIcon, Sun, Moon, Users, Briefcase, LayoutDashboard, User, ArrowLeft, LogOut as LogOutIcon, MessageSquare } from 'lucide-react'; 
import { ModeToggle } from "@/components/mode-toggle";
import { useRouter } from "next/navigation"; 
import { getUserData } from "@/lib/auth"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; 

export default function WorkspacePage() {
  const [currentDate, setCurrentDate] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userName, setUserName] = useState("User"); 
  const router = useRouter(); 

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

  return (
    <SidebarProvider>
      <AppSidebar isCollapsed={isSidebarCollapsed} />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
            <div className="hidden sm:block">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Workspace</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>

          {/* Right Group: Date, Theme Toggle, Avatar Dropdown */}
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden sm:inline text-sm text-muted-foreground">{currentDate}</span>
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full">
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                    <AvatarImage src="https://placehold.co/40x40" alt="User Avatar" />
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
                    <HelpCircleIcon className="mr-2 h-4 w-4" />
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

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-muted/40">
          <div className="max-w-5xl mx-auto space-y-8">
            
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Your Workspace</h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Manage your documents, connect your tools, and collaborate seamlessly.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* File Upload Section */}
              <Card className="shadow-sm hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <UploadCloud className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl">Upload Files</CardTitle>
                  </div>
                  <CardDescription className="mt-1">
                    Easily upload your documents, PDFs, images, or other files to your Learniva workspace.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg text-center min-h-[200px] bg-background/50">
                    <UploadCloud className="h-12 w-12 text-muted-foreground/70 mb-3" />
                    <p className="text-sm text-muted-foreground mb-1">Drag & drop files here, or</p>
                    <Button variant="outline" size="sm">
                      Browse Files
                    </Button>
                    <p className="text-xs text-muted-foreground mt-3">Max file size: 50MB. Supported types: PDF, DOCX, TXT, PNG, JPG.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground/90">How it works:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Drag and drop your files or click to browse.</li>
                      <li>Files are securely stored and processed.</li>
                      <li>Access your uploaded content anytime.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Notion Integration Section */}
              <Card className="shadow-sm hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <Image src="/globe.svg" alt="Notion Logo" width={32} height={32} className="dark:invert" /> 
                    <CardTitle className="text-2xl">Connect Notion</CardTitle>
                  </div>
                  <CardDescription className="mt-1">
                    Integrate your Notion workspace to bring your notes and documents into Learniva.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg text-center min-h-[200px] bg-background/50">
                     <Image src="/globe.svg" alt="Notion Logo" width={48} height={48} className="mb-3 dark:invert" />
                    <p className="text-sm text-muted-foreground mb-3">Connect your Notion account to sync your pages and databases.</p>
                    <Button variant="default">
                      Connect to Notion
                    </Button>
                     <p className="text-xs text-muted-foreground mt-3">Read-only access. We never store your Notion credentials.</p>
                  </div>
                   <div>
                    <h4 className="font-semibold mb-2 text-foreground/90">Benefits:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Seamlessly import content from Notion.</li>
                      <li>Keep your Learniva workspace synced with Notion.</li>
                      <li>Leverage Learniva's AI on your Notion data.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Information/Tips Section */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Workspace Tips</CardTitle>
                <CardDescription>
                  Get the most out of your Learniva workspace.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3 p-3 bg-background/50 rounded-md">
                  <LayoutDashboard className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h5 className="font-semibold mb-0.5">Organize Your Content</h5>
                    <p className="text-muted-foreground">Use folders and tags (coming soon) to keep your uploaded files and Notion pages organized.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-background/50 rounded-md">
                  <Users className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h5 className="font-semibold mb-0.5">Collaboration (Coming Soon)</h5>
                    <p className="text-muted-foreground">Invite team members to your workspace to collaborate on projects and share knowledge.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-background/50 rounded-md">
                  <Brain className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h5 className="font-semibold mb-0.5">Leverage AI</h5>
                    <p className="text-muted-foreground">Use Learniva's AI tools to analyze documents, generate summaries, and get insights from your content.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-background/50 rounded-md">
                  <HelpCircleIcon className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h5 className="font-semibold mb-0.5">Need Help?</h5>
                    <p className="text-muted-foreground">Visit our <Link href="/dashboard/help" className="text-primary hover:underline">Help Center</Link> or <Link href="/dashboard/bug-report" className="text-primary hover:underline">report an issue</Link>.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

// filepath: /Users/dabwitso/learniva-frontend/src/app/dashboard/join-community/page.tsx
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
import { Sun, Moon, Users, MessageSquare, MessageCircle, Slack, Settings as SettingsIcon, HelpCircle as HelpCircleIcon, ChevronRight, Zap, Rss, Award, ExternalLink, User, ArrowLeft, LogOut as LogOutIcon } from 'lucide-react'; 
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

export default function JoinCommunityPage() {
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
                    <BreadcrumbPage>Join Community</BreadcrumbPage>
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
          <div className="max-w-4xl mx-auto space-y-10">
            
            <div className="text-center mb-12">
              <Users className="h-16 w-16 text-primary mx-auto mb-4" />
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Join Our Early Testers Community</h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Connect with fellow Learniva enthusiasts, share feedback, and get exclusive updates.
              </p>
            </div>

            {/* Slack Community Card */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <CardHeader className="p-6"> {/* Removed bg-primary and text-primary-foreground */}
                    <div className="flex items-center gap-4">
                        {/* Assuming /public/file.svg is a black/dark Slack logo. It will be black in light mode, white in dark mode. */}
                        <Slack className="h-14 w-14 text-[#611f69] dark:text-white bg-white dark:bg-[#611f69] rounded p-2 shadow-md" />
                        <div>
                            <CardTitle className="text-3xl">Learniva Early Testers on Slack</CardTitle> {/* Will use default card title color */}
                            <CardDescription className="mt-1"> {/* Will use default muted foreground color */}
                                The primary hub for our early testers. Get direct access to the team, share insights, and help shape Learniva.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                    <div>
                        <h4 className="font-semibold text-xl mb-3 text-foreground/90">Why Join Our Slack?</h4>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <Zap className="h-5 w-5 text-primary mt-1 shrink-0" />
                                <span><strong>Direct Impact:</strong> Your feedback directly influences product development and future features.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Rss className="h-5 w-5 text-primary mt-1 shrink-0" />
                                <span><strong>Exclusive Updates:</strong> Be the first to know about new features, upcoming changes, and special announcements.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <MessageCircle className="h-5 w-5 text-primary mt-1 shrink-0" />
                                <span><strong>Peer Support:</strong> Connect with other testers, share tips, and discuss best practices.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Award className="h-5 w-5 text-primary mt-1 shrink-0" />
                                <span><strong>Early Access Perks:</strong> Potential for early access to new modules and beta features.</span>
                            </li>
                        </ul>
                    </div>
                    <Button variant="default" size="lg" className="w-full sm:w-auto text-lg py-3 px-6 group"> {/* Applied default variant and removed custom bg colors */}
                        Join Slack Community 
                        <ExternalLink className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">You'll be redirected to Slack to join our private channel.</p>
                </CardContent>
            </Card>

            {/* Other Communities (Coming Soon) */}
            <Card className="shadow-sm border-dashed">
              <CardHeader>
                <CardTitle className="text-xl text-muted-foreground/80">More Communities Coming Soon</CardTitle>
                <CardDescription>
                  We're working on expanding our community presence. Stay tuned for updates on platforms like Discord, Reddit, and more.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We believe in building a strong and diverse community. If you have suggestions for other platforms, please let us know!
                </p>
              </CardContent>
            </Card>

            {/* Code of Conduct Reminder */}
            <div className="text-center text-sm text-muted-foreground">
                <p>By joining our community, you agree to our <Link href="/community-guidelines" className="text-primary hover:underline">Community Guidelines</Link>.</p>
                <p>Let's build something great together!</p>
            </div>

          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

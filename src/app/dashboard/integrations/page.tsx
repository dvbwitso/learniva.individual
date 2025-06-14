"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, Settings as SettingsIcon, Zap, Sun, Moon, Users, Briefcase, LayoutDashboard, Bug, User, ArrowLeft, LogOut as LogOutIcon, MessageSquare, HelpCircle } from "lucide-react"; 
import Link from "next/link";
import { useState, useEffect } from 'react';
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

// Import Breadcrumb components
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";

interface Integration {
  id: string;
  name: string;
  IconComponent: React.ElementType;
  connected: boolean;
  description: string;
  proFeature?: boolean;
  connectLink?: string;
  manageLink?: string;
}

const GoogleIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.75 8.36,4.73 12.19,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.19,2C6.42,2 2.03,6.8 2.03,12C2.03,17.2 6.42,22 12.19,22C17.6,22 21.5,18.33 21.5,12.33C21.5,11.76 21.45,11.43 21.35,11.1Z" /></svg>;
const GitHubIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21V19.21C6.73,19.64 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.83,16.41C14.17,16.72 14.5,17.33 14.5,18.26V21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" /></svg>;
const NotionIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M20.44,12.06c0-4.52-3.65-8.17-8.17-8.17S4.1,7.54,4.1,12.06s3.65,8.17,8.17,8.17S20.44,16.58,20.44,12.06ZM9.71,17.29V6.83h1.74v10.46Zm4.85-5.22h-1.7V6.83h1.7Zm0,1.74h-1.7v3.48h1.7Z" /></svg>;

const integrations: Integration[] = [
  {
    id: "google",
    name: "Google",
    IconComponent: GoogleIcon,
    connected: true,
    description: "Sync your Google Calendar, Drive, and Gmail.",
    proFeature: false,
    manageLink: "/dashboard/integrations/google/settings",
  },
  {
    id: "github",
    name: "GitHub",
    IconComponent: GitHubIcon,
    connected: false,
    description: "Connect repositories, track issues, and automate workflows.",
    proFeature: false,
    connectLink: "/auth/github",
  },
  {
    id: "notion",
    name: "Notion",
    IconComponent: NotionIcon,
    connected: true,
    description: "Embed notes, databases, and wikis directly.",
    proFeature: true,
    manageLink: "/dashboard/integrations/notion/settings",
  },
];

export default function IntegrationsPage() {
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
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
            {/* Breadcrumbs moved here */}
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
                    <BreadcrumbPage>Integrations</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            {/* <img src="/symbol.png" alt="Learniva Logo" className="h-7 w-7 hidden sm:block" /> */}
          </div>
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

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Breadcrumbs removed from here */}
          <div className="container mx-auto py-8 px-4 md:px-6">
            <header className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">Integrations</h1>
              <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">
                Connect your favorite tools to streamline your workflow and boost productivity.
              </p>
            </header>

            <div className="space-y-8">
              {integrations.map((integration) => (
                <Card key={integration.id} className="overflow-hidden border dark:border-neutral-800 dark:bg-neutral-950 transition-colors duration-200">
                  <CardHeader className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border dark:border-neutral-700">
                          {/* <AvatarImage src={`/icons/${integration.id}.svg`} alt={`${integration.name} logo`} /> */}
                          <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                            <integration.IconComponent />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl font-semibold text-black dark:text-white flex items-center">
                            {integration.name}
                            {integration.proFeature && (
                              <Badge variant="outline" className="ml-2 text-xs px-1.5 py-0.5 rounded-full border-neutral-400 text-neutral-600 dark:text-neutral-400 dark:border-neutral-600">
                                Pro
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            {integration.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {integration.connected ? (
                          <>
                            <Badge variant="outline" className="border-neutral-400 text-neutral-700 bg-neutral-100 dark:text-neutral-300 dark:border-neutral-600 dark:bg-neutral-800">
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Connected
                            </Badge>
                            {integration.manageLink && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={integration.manageLink}>
                                  <SettingsIcon className="mr-1 h-4 w-4" /> Manage
                                </a>
                              </Button>
                            )}
                            <Button variant="outline" size="sm" className="text-neutral-700 border-neutral-300 hover:bg-neutral-100 dark:text-neutral-300 dark:border-neutral-700 dark:hover:bg-neutral-800">
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <>
                            <Badge variant="outline" className="border-neutral-300 text-neutral-500 bg-neutral-50 dark:text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800/50">
                              <XCircle className="mr-1 h-4 w-4" />
                              Not Connected
                            </Badge>
                            {integration.connectLink ? (
                              <Button size="sm" asChild className="bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200">
                                 <a href={integration.connectLink}>
                                  <Zap className="mr-1 h-4 w-4" /> Connect
                                </a>
                              </Button>
                            ) : (
                               <Button size="sm" disabled>Connect</Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {/* <CardContent className="p-6 pt-0">
                    <p>Additional details or quick actions for {integration.name}.</p>
                  </CardContent> */}
                </Card>
              ))}
            </div>

            <Separator className="my-12 dark:bg-neutral-800" />

            <section className="p-6 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <h2 className="text-2xl font-semibold text-black dark:text-white mb-3">Looking for more?</h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                We are constantly working on adding new integrations. If you have a specific tool you'd like to see, let us know!
              </p>
              <Button variant="outline">Request an Integration</Button>
            </section>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

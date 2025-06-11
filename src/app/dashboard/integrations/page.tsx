"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, Settings, Zap, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from 'react';

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
  const userName = "User"; // Replace with actual user name logic

  useEffect(() => {
    const date = new Date();
    setCurrentDate(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }));
  }, []);

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
            <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10" onClick={() => console.log('Theme toggle clicked - requires next-themes setup')}>
              <Sun className="h-[1.1rem] w-[1.1rem] sm:h-[1.2rem] sm:w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.1rem] w-[1.1rem] sm:h-[1.2rem] sm:w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Link href="/profile">
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                <AvatarImage src="https://placehold.co/40x40" alt="User Avatar" />
                <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Breadcrumbs removed from here */}
          <div className="container mx-auto py-8 px-4 md:px-6">
            <header className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Integrations</h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Connect your favorite tools to streamline your workflow and boost productivity.
              </p>
            </header>

            <div className="space-y-8">
              {integrations.map((integration) => (
                <Card key={integration.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-gray-800">
                  <CardHeader className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border dark:border-gray-700">
                          {/* <AvatarImage src={`/icons/${integration.id}.svg`} alt={`${integration.name} logo`} /> */}
                          <AvatarFallback className="bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                            <integration.IconComponent />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                            {integration.name}
                            {integration.proFeature && (
                              <Badge variant="default" className="ml-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                                Pro
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {integration.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {integration.connected ? (
                          <>
                            <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50 dark:bg-green-900/50 dark:text-green-400 dark:border-green-700">
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Connected
                            </Badge>
                            {integration.manageLink && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={integration.manageLink}>
                                  <Settings className="mr-1 h-4 w-4" /> Manage
                                </a>
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/50">
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <>
                            <Badge variant="outline" className="border-gray-300 text-gray-500 bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400 dark:border-gray-600">
                              <XCircle className="mr-1 h-4 w-4" />
                              Not Connected
                            </Badge>
                            {integration.connectLink ? (
                              <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700 text-white">
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

            <Separator className="my-12 dark:bg-gray-700" />

            <section className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Looking for more?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
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

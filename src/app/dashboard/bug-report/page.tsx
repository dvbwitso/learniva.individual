'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
import { Textarea } from "@/components/ui/textarea"; // Update this path if your Textarea component is located elsewhere, e.g. "@/components/textarea"
import Link from "next/link";
import { useState, useEffect } from 'react';
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
import { Sun, Moon } from "lucide-react"; // Assuming you might want a theme toggle
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function BugReportPage() {
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
                    <BreadcrumbPage>Report Bug</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
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
          <div className="container mx-auto py-8 px-4 md:px-6">
            <header className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Report a Bug</h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Please provide as much detail as possible to help us understand and fix the bug.
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Bug Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="bug-title">Title</Label>
                      <Input id="bug-title" placeholder="Enter a brief title for the bug" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bug-description">Description</Label>
                      <Textarea id="bug-description" placeholder="Describe the bug in detail" className="min-h-[100px]" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="steps-to-reproduce">Steps to Reproduce</Label>
                      <Textarea id="steps-to-reproduce" placeholder="List the steps to reproduce the bug" className="min-h-[100px]" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expected-behaviour">Expected Behaviour</Label>
                      <Textarea id="expected-behaviour" placeholder="What did you expect to happen?" className="min-h-[80px]" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="actual-behaviour">Actual Behaviour</Label>
                      <Textarea id="actual-behaviour" placeholder="What actually happened?" className="min-h-[80px]" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="bug-severity">Bug Severity</Label>
                        <Select>
                          <SelectTrigger id="bug-severity">
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="browser-versions">Browser(s) & Version(s)</Label>
                        <Input id="browser-versions" placeholder="e.g., Chrome 125, Firefox 124" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="device-type">Device Type</Label>
                        <Input id="device-type" placeholder="e.g., Desktop, iPhone 13, Android Tablet" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="screenshots">Screenshots</Label>
                        <Input id="screenshots" type="file" multiple />
                        <p className="text-sm text-muted-foreground">You can upload multiple images.</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button>Submit Report</Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tips for a Good Bug Report</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>Be clear and concise in your title and description.</li>
                      <li>Provide exact steps to reproduce the bug. If it&apos;s intermittent, describe the conditions under which it occurs.</li>
                      <li>Explain what you expected to happen and what actually happened.</li>
                      <li>Include browser and version, and device information.</li>
                      <li>Attach screenshots or short videos if they help illustrate the problem.</li>
                      <li>Check if the bug has already been reported.</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

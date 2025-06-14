// filepath: /Users/dabwitso/learniva-frontend/src/app/dashboard/help/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sun, Moon, HelpCircle, MessageSquare, Users, Search, BookOpen, LifeBuoy } from 'lucide-react';
import { ModeToggle } from "@/components/mode-toggle";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"

export default function HelpPage() {
  const [currentDate, setCurrentDate] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const userName = "User"; // Replace with actual user name logic
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const date = new Date();
    setCurrentDate(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }));
  }, []);

  const faqData = [
    {
      question: "How do I upload files to my workspace?",
      answer: "You can upload files by dragging and dropping them into the designated area on the Workspace page, or by clicking the 'Browse Files' button. We support various file types like PDF, DOCX, TXT, PNG, and JPG."
    },
    {
      question: "How do I connect my Notion workspace?",
      answer: "Navigate to the Workspace page and click on the 'Connect to Notion' button. You'll be prompted to authorize Learniva to access your Notion data. This is a read-only connection."
    },
    {
      question: "What are the benefits of connecting Notion?",
      answer: "Connecting Notion allows you to seamlessly import your notes and documents into Learniva, keep your content synced, and leverage Learniva's AI capabilities on your Notion data."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security very seriously. Your files are securely stored and processed. Our Notion integration uses read-only access and we never store your Notion credentials."
    },
    {
        question: "How can I reset my password?",
        answer: "If you've forgotten your password, you can reset it by clicking the 'Forgot Password?' link on the login page. You'll receive an email with instructions on how to create a new password."
    },
    {
        question: "How do I report a bug or suggest a feature?",
        answer: "You can report a bug or suggest a new feature by navigating to the 'Report Bug' page from the dashboard sidebar. Please provide as much detail as possible so we can assist you effectively."
    }
  ];

  const filteredFaqs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    <BreadcrumbPage>Help Center</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>

          {/* Right Group: Date, Theme Toggle, Avatar */}
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden sm:inline text-sm text-muted-foreground">{currentDate}</span>
            <ModeToggle />
            <Link href="/profile">
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                <AvatarImage src="https://placehold.co/40x40" alt="User Avatar" />
                <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-muted/40">
          <div className="max-w-5xl mx-auto space-y-10">
            
            <div className="text-center mb-12">
              <HelpCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Help Center</h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Find answers to your questions, learn how to use Learniva, and get support.
              </p>
            </div>

            {/* Search Bar */}
            <div className="mb-10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        type="search" 
                        placeholder="Search FAQs and articles..." 
                        className="w-full pl-10 pr-4 py-3 text-base rounded-lg shadow-sm" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* FAQ Section */}
            <Card className="shadow-sm hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-7 w-7 text-primary" />
                  <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
                </div>
                <CardDescription className="mt-1">
                  Find quick answers to common questions about Learniva.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, index) => (
                    <Collapsible key={index} className="border-b last:border-b-0 py-3">
                        <CollapsibleTrigger className="flex justify-between items-center w-full text-left font-medium hover:text-primary transition-colors">
                        {faq.question}
                        <HelpCircle className="h-4 w-4 text-muted-foreground" /> 
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2 text-sm text-muted-foreground">
                        {faq.answer}
                        </CollapsibleContent>
                    </Collapsible>
                    ))
                ) : (
                    <p className='text-muted-foreground text-center py-4'>No FAQs found matching your search term.</p>
                )}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Contact Support Section */}
              <Card className="shadow-sm hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-7 w-7 text-primary" />
                    <CardTitle className="text-2xl">Contact Support</CardTitle>
                  </div>
                  <CardDescription className="mt-1">
                    Can't find what you're looking for? Our support team is here to help.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    If you have a specific issue or need personalized assistance, please reach out to our support team.
                  </p>
                  <Button asChild className="w-full sm:w-auto">
                    <Link href="/dashboard/bug-report?type=support">Contact Support</Link>
                  </Button>
                  <p className="text-xs text-muted-foreground">We typically respond within 24 hours.</p>
                </CardContent>
              </Card>

              {/* Community Forum Section */}
              <Card className="shadow-sm hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Users className="h-7 w-7 text-primary" />
                    <CardTitle className="text-2xl">Join Our Community</CardTitle>
                  </div>
                  <CardDescription className="mt-1">
                    Connect with other Learniva users, share tips, and get advice.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Our community forum is a great place to learn from others and share your experiences.
                  </p>
                  <Button asChild variant="outline" className="w-full sm:w-auto">
                    <Link href="/dashboard/join-community">Visit Community Forum</Link>
                  </Button>
                   <p className="text-xs text-muted-foreground">Ask questions, share feedback, and help others.</p>
                </CardContent>
              </Card>
            </div>

             {/* Additional Resources */}
             <Card className="shadow-sm">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <LifeBuoy className="h-7 w-7 text-primary" />
                        <CardTitle className="text-2xl">Additional Resources</CardTitle>
                    </div>
                    <CardDescription className="mt-1">
                        Explore more ways to get the most out of Learniva.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-3 p-3 bg-background/50 rounded-md hover:bg-muted/10 transition-colors">
                        <BookOpen className="h-5 w-5 text-primary mt-1 shrink-0" />
                        <div>
                            <h5 className="font-semibold mb-0.5">Documentation</h5>
                            <p className="text-muted-foreground">Dive deeper into Learniva's features and functionalities with our comprehensive documentation. <Link href="#" className="text-primary hover:underline">Read Docs</Link></p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-background/50 rounded-md hover:bg-muted/10 transition-colors">
                        <Users className="h-5 w-5 text-primary mt-1 shrink-0" />
                        <div>
                            <h5 className="font-semibold mb-0.5">Tutorials & Guides</h5>
                            <p className="text-muted-foreground">Watch video tutorials and follow step-by-step guides to master Learniva. <Link href="#" className="text-primary hover:underline">View Tutorials</Link></p>
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

"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Plus, Sun, Moon, Video, BookOpenCheck, FileText, Send, UploadCloud } from "lucide-react"; 
import Link from "next/link";
import Image from "next/image"; 
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect, useRef } from 'react'; 
import { UploadAssignmentModal } from "@/components/ui/upload-assignment-modal"; 
import { getUserData } from "@/lib/auth"; // Import getUserData
import { useRouter } from "next/navigation"; // Import useRouter
import { ModeToggle } from "@/components/mode-toggle";
import ProtectedRoute from "@/components/protected-route";
import { useAuth } from "@/contexts/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Settings as SettingsIcon,
  HelpCircle,
  MessageSquare,
  ArrowLeft,
  LogOut as LogOutIcon
} from "lucide-react";

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'eva';
  timestamp: Date;
}

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false); 
  const [inputValue, setInputValue] = useState(''); 
  const inputRef = useRef<HTMLInputElement>(null); 
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth()
  const router = useRouter()
  
  // Use auth context user data
  const userName = user?.username || "User";
  const userFirstName = user?.email ? user.email.split('@')[0] : "User"; // Extract first part of email as firstname fallback

  useEffect(() => {
    const date = new Date();
    setCurrentDate(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' }));
  }, []);


  // const userName = "Thomas"; // Replaced by state

  const handleFileUploadComplete = (files: File[]) => {
    console.log("Files submitted:", files);
    // Handle the submitted files here (e.g., send to a server)
  };

  const handleCardClick = (promptText: string) => {
    setInputValue(promptText);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputValue('');

    // Simulate Eva's response
    setTimeout(() => {
      const evasResponse: ChatMessage = {
        id: (Date.now() + 1).toString(), // Ensure unique ID
        text: `Eva is thinking about: "${newUserMessage.text}"`, // Simple echo response for now
        sender: 'eva',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, evasResponse]);
    }, 1000);
  };

  // Scroll to bottom of chat when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
          {/* Left Group: Sidebar Trigger & Optional Logo */}
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            {/* <img src="/symbol.png" alt="Learniva Logo" className="h-7 w-7 hidden sm:block" /> */}
          </div>

          {/* Right Group: Date, Theme Toggle, Avatar */}
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden sm:inline text-sm text-muted-foreground">{currentDate}</span>
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full">
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                    <AvatarImage src="https://placehold.co/40x40" alt="User Avatar" />
                    <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback> {/* Uses userName state */}
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
                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}> {/* Assuming a settings page route */}
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

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          
          {/* Chat Messages Display */}
          <div ref={chatContainerRef} className="w-full max-w-4xl flex-1 overflow-y-auto mb-4 space-y-4 p-4 rounded-lg bg-muted/40 scroll-smooth">
            {messages.length === 0 && (
              <div className="w-full max-w-4xl flex flex-col items-center text-center pt-10">
                {/* LearnivaAI Logo */}
                <div className="mb-8">
                  <Image
                    src="/symbol.png" // Path to your logo in the public folder
                    alt="LearnivaAI Logo"
                    width={80} // Adjust width as needed
                    height={80} // Adjust height as needed
                    priority // Prioritize loading for LCP
                  />
                </div>

                {/* Greeting and Prompt */}
                <div className="mb-10 sm:mb-12">
                  <h2 className="text-xl sm:text-2xl font-medium text-muted-foreground mb-1 sm:mb-2">Goodmorning {userFirstName}</h2> {/* Use userFirstName */}
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">How can I assist you today?</p>
                </div>

                {/* Suggestion Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full mb-10 sm:mb-12">
                  {/* Card 1: Generate Video */}
                  <Card 
                    className="p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left bg-card cursor-pointer"
                    onClick={() => handleCardClick("Help Me Generate an engaging animation about...")}
                  >
                    <div className="flex items-center mb-2 sm:mb-3">
                      <Video className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-primary shrink-0" />
                      <CardTitle className="text-base sm:text-lg font-semibold">Generate Engaging Animations</CardTitle>
                    </div>
                    <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                      Transform your notes into dynamic animations to visualize complex concepts.
                    </CardDescription>
                  </Card>

                  {/* Card 2: Create Study Materials */}
                  <Card 
                    className="p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left bg-card cursor-pointer"
                    onClick={() => handleCardClick("Create study materials like flashcards and practice exercises for...")}
                  >
                    <div className="flex items-center mb-2 sm:mb-3">
                      <BookOpenCheck className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-primary shrink-0" />
                      <CardTitle className="text-base sm:text-lg font-semibold">Create Study Materials</CardTitle>
                    </div>
                    <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                      Generate interactive flashcards and custom practice exercises from your documents.
                    </CardDescription>
                  </Card>

                  {/* Card 3: Structure Your Notes */}
                  <Card 
                    className="p-4 sm:p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left bg-card cursor-pointer"
                    onClick={() => handleCardClick("Structure my notes on... and extract key concepts.")}
                  >
                    <div className="flex items-center mb-2 sm:mb-3">
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-primary shrink-0" />
                      <CardTitle className="text-base sm:text-lg font-semibold">Structure Your Notes</CardTitle>
                    </div>
                    <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                      Convert unstructured content into well-organized notes and extract key concepts.
                    </CardDescription>
                  </Card>
                </div>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground shadow-sm'}`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground/80'} text-right">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Input Bar - positioned at the bottom of the main content area */}
          <div className="w-full max-w-2xl lg:max-w-3xl mt-auto sticky bottom-4 sm:bottom-6 px-1">
            <div className="relative flex items-center bg-card p-1.5 sm:p-2 rounded-full shadow-xl border">
              <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted shrink-0" onClick={() => setIsUploadModalOpen(true)}>
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Add attachment</span>
              </Button>
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Ask eva what you'd like to learn today`}
                className="flex-1 h-10 sm:h-12 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm sm:text-base placeholder:text-muted-foreground px-2 sm:px-3"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault(); // Prevent newline in input
                    handleSendMessage();
                  }
                }}
              />
              <Button variant="default" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-foreground text-background hover:bg-foreground/90 shrink-0" onClick={handleSendMessage}>
                <Send className="h-4 w-4 sm:h-5 sm:w-5" /> 
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </main>
      </SidebarInset>
      <UploadAssignmentModal
        isOpen={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onUploadComplete={handleFileUploadComplete}
      />
    </SidebarProvider>
    </ProtectedRoute>
  );
}

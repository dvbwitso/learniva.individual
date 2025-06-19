"use client"

import * as React from "react"
import { useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { useSidebar } from "@/components/ui/sidebar"
import {
    ChevronDown,
    ChevronRight,
    FileText,
    Gem,
    Laptop,
    LogOut,
    Plus,
    Search,
    Slack,
} from "lucide-react"
import { toast } from "sonner"
import clsx from "clsx"

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ModeToggle } from "@/components/mode-toggle"

// --- Constants & Types ---
const SIDEBAR_COLLAPSED_WIDTH = "w-[72px]"

type NoteType = {
    id: number;
    text: string;
    active: boolean;
    href: string;
};

type NavItemType = {
    name: string;
    href: string;
    icon: React.ElementType; // Use React.ElementType for component references
    active: boolean;
};

type WorkspaceType = {
    id: number;
    text: string;
    active: boolean;
    href: string;
};

// Data would typically come from props or a data store
const NOTES_DATA: NoteType[] = [
    { id: 1, text: "Calculus 101", active: true, href: "#" },
    { id: 2, text: "Intro to Physics", active: false, href: "#" },
    { id: 3, text: "Organic Chemistry Notes", active: false, href: "#" },
    { id: 4, text: "History of Ancient Rome", active: false, href: "#" },
    { id: 5, text: "Data Structures & Algorithms", active: false, href: "#" },
];

const WORKSPACES_DATA: WorkspaceType[] = [
    { id: 1, text: "My Personal Workspace", active: false, href: "#" },
    { id: 2, text: "Team Collaboration", active: true, href: "#" },
    { id: 3, text: "Client Project Alpha", active: false, href: "#" },
    { id: 4, text: "Research & Development", active: false, href: "#" },
];

const COLLAPSED_NAV_ITEMS: NavItemType[] = [
    { name: "Workspaces", icon: Laptop, active: false, href: "/workspaces" },
    { name: "Notes", icon: FileText, active: true, href: "/notes" },
];

// --- Memoized, Reusable Sub-components ---

const SidebarLogo = React.memo(({ isCollapsed }: { isCollapsed: boolean }) => (
    <Tooltip>
        <TooltipTrigger asChild>
            <Link href="/dashboard" className={clsx("flex items-center h-16 shrink-0", isCollapsed ? "justify-center" : "justify-start pl-4")}>
                <Image
                    src={isCollapsed ? "/learniva-logo-symbol.svg" : "/learniva-logo-full.svg"}
                    alt={isCollapsed ? "Learniva Symbol" : "Learniva Logo"}
                    width={isCollapsed ? 32 : 150}
                    height={isCollapsed ? 32 : 40}
                    className="dark:brightness-0 dark:invert transition-all duration-300"
                />
            </Link>
        </TooltipTrigger>
        {isCollapsed && (
            <TooltipContent side="right" className="bg-popover text-popover-foreground border-border">
                Learniva Home
            </TooltipContent>
        )}
    </Tooltip>
));
SidebarLogo.displayName = 'SidebarLogo';

const UpgradeCard = React.memo(() => (
    <Card className="bg-card border-border shadow-sm">
        <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base font-semibold text-card-foreground">Upgrade to Pro</CardTitle>
            <CardDescription className="text-xs text-muted-foreground pt-1">
                Unlock all features and get unlimited access.
            </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-2">
            <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Gem className="h-4 w-4 mr-2" />
                Upgrade
            </Button>
        </CardContent>
    </Card>
));
UpgradeCard.displayName = 'UpgradeCard';


// --- Composed Sectional Components ---

const NavItem = ({ item, isCollapsed }: { item: NavItemType, isCollapsed: boolean }) => {
    const Icon = item.icon;
    const commonButtonClasses = "h-10 w-full justify-start transition-colors duration-150";
    const activeClasses = "text-sidebar-accent-foreground bg-sidebar-accent hover:bg-sidebar-accent/80";
    const inactiveClasses = "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground";

    if (isCollapsed) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={item.active ? "secondary" : "ghost"}
                        size="icon"
                        className={clsx("h-10 w-10 shrink-0", item.active ? activeClasses : inactiveClasses)}
                        asChild
                    >
                        <Link href={item.href}><Icon className="h-6 w-6" /></Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-popover text-popover-foreground border-border">
                    {item.name}
                </TooltipContent>
            </Tooltip>
        );
    }

    return (
        <Button
            variant={item.active ? "secondary" : "ghost"}
            className={clsx(commonButtonClasses, "gap-3 px-3", item.active ? activeClasses : inactiveClasses)}
            asChild
        >
            <Link href={item.href}>
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{item.name}</span>
            </Link>
        </Button>
    );
};

const NotesSection = ({ isCollapsed, notes }: { isCollapsed: boolean, notes: NoteType[] }) => {
    const [isOpen, setIsOpen] = React.useState(true);

    if (isCollapsed) return null; // Or render a collapsed version if desired

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-sidebar-accent/50 font-medium text-sm text-sidebar-foreground transition-colors duration-150">
                <span>Notes</span>
                <ChevronDown className={clsx("h-4 w-4 transition-transform text-sidebar-foreground/60", isOpen && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-1 space-y-1">
                <ScrollArea className="h-[200px] w-full pr-2">
                    {notes.map((note) => (
                        <Button
                            key={note.id}
                            variant="ghost"
                            className={clsx(
                                "group flex h-9 items-center gap-3 px-3 py-2 justify-start w-full truncate text-sm transition-colors duration-150",
                                note.active
                                    ? "bg-sidebar-accent/70 font-semibold text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                            )}
                            asChild
                        >
                            <Link href={note.href}>
                                <div className={clsx(
                                    "h-2.5 w-2.5 rounded-full shrink-0 transition-all duration-200", 
                                    note.active 
                                        ? "bg-sidebar-primary shadow-sm" 
                                        : "bg-muted-foreground/30 group-hover:bg-sidebar-primary/60"
                                )} />
                                <span className="flex-1 text-left truncate">{note.text}</span>
                            </Link>
                        </Button>
                    ))}
                </ScrollArea>
            </CollapsibleContent>
        </Collapsible>
    );
};

const WorkspacesSection = ({ isCollapsed, workspaces }: { isCollapsed: boolean, workspaces: WorkspaceType[] }) => {
    const [isOpen, setIsOpen] = React.useState(true);

    if (isCollapsed) return null;

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-md hover:bg-sidebar-accent/50 font-medium text-sm text-sidebar-foreground transition-colors duration-150">
                <span>Workspaces</span>
                <ChevronDown className={clsx("h-4 w-4 transition-transform text-sidebar-foreground/60", isOpen && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-1 space-y-1">
                <ScrollArea className="h-[150px] w-full pr-2">
                    {workspaces.map((workspace) => (
                        <Button
                            key={workspace.id}
                            variant="ghost"
                            className={clsx(
                                "group flex h-9 items-center gap-3 px-3 py-2 justify-start w-full truncate text-sm transition-colors duration-150",
                                workspace.active
                                    ? "bg-sidebar-accent/70 font-semibold text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                            )}
                            asChild
                        >
                            <Link href={workspace.href}>
                                <div className={clsx(
                                    "h-2.5 w-2.5 rounded-full shrink-0 transition-all duration-200", 
                                    workspace.active 
                                        ? "bg-sidebar-primary shadow-sm" 
                                        : "bg-muted-foreground/30 group-hover:bg-sidebar-primary/60"
                                )} />
                                <span className="flex-1 text-left truncate">{workspace.text}</span>
                            </Link>
                        </Button>
                    ))}
                </ScrollArea>
            </CollapsibleContent>
        </Collapsible>
    );
};

// --- Main Sidebar Component ---

export function AppSidebar() {
    const { logout } = useAuth();
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    const handleLogout = useCallback(async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Error logging out. Please try again.");
        }
    }, [logout]);

    return (
        <aside
            className={clsx(
                "flex flex-col h-full bg-sidebar border-r border-sidebar-border text-sidebar-foreground transition-all duration-300",
                isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : "w-64"
            )}
        >
            <header className="border-b border-sidebar-border">
                <SidebarLogo isCollapsed={isCollapsed} />
            </header>

            <div className={clsx("flex flex-col p-3 gap-2 flex-1", isCollapsed ? "items-center" : "")}>
                {isCollapsed ? (
                    <>
                        <NavItem isCollapsed item={{ name: 'Search', href: '#', icon: Search, active: false }} />
                        <NavItem isCollapsed item={{ name: 'New Item', href: '#', icon: Plus, active: false }} />
                        <Separator className="my-2 bg-sidebar-border" />
                    </>
                ) : (
                    <div className="flex items-center gap-2 w-full">
                        <div className="relative flex-grow">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-sidebar-foreground/60" />
                            <Input 
                                placeholder="Search..." 
                                className="pl-8 bg-sidebar-accent/50 border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/60 focus-visible:ring-sidebar-ring focus-visible:border-sidebar-primary" 
                            />
                        </div>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="w-9 h-9 border-sidebar-border text-sidebar-foreground/60 hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50 transition-colors duration-150"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                <nav className={clsx("flex flex-col gap-1 w-full", isCollapsed ? "items-center flex-grow" : "")}>
                    {isCollapsed ? (
                        // Show collapsed navigation items
                        COLLAPSED_NAV_ITEMS.map((item) => (
                            <NavItem key={item.name} item={item} isCollapsed={isCollapsed} />
                        ))
                    ) : (
                        // Show expanded sections
                        <>
                            <WorkspacesSection isCollapsed={isCollapsed} workspaces={WORKSPACES_DATA} />
                            <NotesSection isCollapsed={isCollapsed} notes={NOTES_DATA} />
                        </>
                    )}
                </nav>
            </div>
            
            <footer className="mt-auto border-t border-sidebar-border p-3 space-y-2">
                 {isCollapsed ? (
                     <div className="flex flex-col gap-2">
                         <Tooltip>
                             <TooltipTrigger asChild>
                                 <Button
                                     variant="ghost"
                                     size="icon"
                                     className="h-10 w-10 shrink-0 text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                                     onClick={handleLogout}
                                 >
                                     <LogOut className="h-6 w-6" />
                                 </Button>
                             </TooltipTrigger>
                             <TooltipContent side="right" className="bg-popover text-popover-foreground border-border">
                                 Logout
                             </TooltipContent>
                         </Tooltip>
                     </div>
                 ) : (
                     <>
                        <div className="flex items-center justify-between">
                            <Button variant="ghost" className="flex-1 justify-start gap-3 px-3 text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground" asChild>
                                <Link href="#">
                                    <Slack className="h-4 w-4 text-sidebar-foreground/60" />
                                    <span className="text-sm font-medium">Join our Slack</span>
                                </Link>
                            </Button>
                        </div>
                        <Button variant="ghost" className="w-full justify-start gap-3 text-sm font-medium px-3 text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 text-sidebar-foreground/60" />
                            <span>Logout</span>
                        </Button>
                         <UpgradeCard />
                     </>
                 )}
            </footer>
        </aside>
    );
}
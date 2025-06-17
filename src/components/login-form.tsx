import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        
        try {
            await login(email, password);
            toast.success("Login successful!");
            
            // Small delay to ensure auth state is updated
            setTimeout(() => {
                router.replace("/dashboard");
            }, 100);
        } catch (error: any) {
            toast.error(error.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <>
            {/* Login form section */}
            <Card className="w-full max-w-md border-none shadow-none bg-transparent">
                <CardContent className="p-0 w-full space-y-6">
                    <form onSubmit={handleSubmit} className="w-full space-y-6">
                        {/* Form Fields */}
                        <div className="flex flex-col items-start gap-6 relative self-stretch w-full">
                        {/* Email Field */}
                        <div className="flex flex-col items-start gap-2 self-stretch w-full">
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium text-foreground"
                            >
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="flex flex-col items-start gap-2 self-stretch w-full">
                            <div className="flex justify-between items-center w-full">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Password
                                </Label>
                                <a
                                    href="/forgot-password"
                                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-12 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                                required
                            />
                        </div>

                        {/* Login Button */}
                        <Button 
                            type="submit"
                            disabled={isLoading}
                            className="h-12 w-full bg-white text-black border border-border hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </Button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* OAuth Button */}
                    <Button
                        variant="outline"
                        className="h-12 w-full rounded-xl border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm"
                    >
                        <svg
                            className="mr-2 h-4 w-4"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </Button>

                    {/* Sign Up Link */}
                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <a
                            href="/register"
                            className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                        >
                            Sign up
                        </a>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

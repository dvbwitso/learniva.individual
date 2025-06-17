"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { registerUser } from "@/lib/auth"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [usernameError, setUsernameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const username = (event.currentTarget.elements.namedItem("username") as HTMLInputElement)?.value
    const email = (event.currentTarget.elements.namedItem("email") as HTMLInputElement)?.value
    const password = (event.currentTarget.elements.namedItem("password") as HTMLInputElement)?.value
    const confirmPassword = (event.currentTarget.elements.namedItem("confirm-password") as HTMLInputElement)?.value

    let hasError = false
    // Username validation (basic)
    if (!username) {
      setUsernameError("Username is required.")
      hasError = true
    } else {
      setUsernameError(null)
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid Email. Try again")
      hasError = true
    } else {
      setEmailError(null)
    }

    if (!password) {
      setPasswordError("Password is required.")
      hasError = true
    } else {
      setPasswordError(null)
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match. Try again")
      hasError = true
    } else {
      setConfirmPasswordError(null)
    }

    if (hasError) {
      return
    }

    setIsLoading(true)

    try {
      // Pass both password and confirmPassword to registerUser
      const data = await registerUser(username, email, password, confirmPassword) 
      console.log("Signup successful", data)
      // Redirect to login or dashboard page after successful registration
      router.push("/login") 
    } catch (error: any) {
      console.error("Signup failed:", error)
      // Display a generic error or parse specific errors from `error.message`
      // This example sets a general password error, adjust as needed
      if (error.data) { // Check if error.data exists (the structured error from auth.ts)
        console.error("Server error details:", error.data);
        // Set specific field errors based on the error.data object
        if (error.data.username) {
          setUsernameError(error.data.username.join(", "));
        }
        if (error.data.email) {
          setEmailError(error.data.email.join(", "));
        }
        if (error.data.password) { // Django often uses 'password' or 'non_field_errors'
          setPasswordError(error.data.password.join(", "));
        } else if (error.data.password1) {
          setPasswordError(error.data.password1.join(", "));
        }
        if (error.data.password2) {
          setConfirmPasswordError(error.data.password2.join(", "));
        } 
        // Handle non_field_errors or other general errors if necessary
        if (error.data.non_field_errors) {
            // Display this error in a general error message area if you have one
            // For now, appending to passwordError or creating a new state for general errors
            setPasswordError(prev => prev ? `${prev} ${error.data.non_field_errors.join(", ")}` : error.data.non_field_errors.join(", "));
        }
        // If there's a general message and no specific field errors were caught by the above
        if (!error.data.username && !error.data.email && !error.data.password && !error.data.password1 && !error.data.password2 && error.message) {
            setPasswordError(error.message) // Fallback to the general message
        }

      } else if (error.message) {
        // Log the full error message from the server
        console.error("Server error details:", error.message); 
        setPasswordError(error.message) 
      } else {
        setPasswordError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-8", className)} {...props}>
      {/* Logo */}
      <div className="flex justify-start">
        <div className="text-foreground dark:text-white">
          <Image
            src="/learniva-logo-full.svg"
            alt="Learniva Logo"
            width={180}
            height={54}
            style={{ height: 'auto' }}
            className="dark:brightness-0 dark:invert"
          />
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col items-start gap-2 text-left">
        <h1 className="text-2xl font-bold text-foreground">Create an account</h1>
        <p className="text-muted-foreground text-sm">
          Enter your information below to create your account
        </p>
      </div>

      {/* Form Fields */}
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username" className="text-sm font-medium text-foreground">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            required
            disabled={isLoading}
            className={cn(
              "h-12 rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
              usernameError && "border-destructive focus:ring-destructive"
            )}
          />
          {usernameError && <p className="text-sm text-destructive">{usernameError}</p>}
        </div>

        <div className="grid gap-3">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            disabled={isLoading}
            className={cn(
              "h-12 rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
              emailError && "border-destructive focus:ring-destructive"
            )}
          />
          {emailError && <p className="text-sm text-destructive">{emailError}</p>}
        </div>

        <div className="grid gap-3">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            required
            disabled={isLoading}
            className={cn(
              "h-12 rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
              passwordError && "border-destructive focus:ring-destructive"
            )}
          />
          {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
        </div>

        <div className="grid gap-3">
          <Label htmlFor="confirm-password" className="text-sm font-medium text-foreground">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            required
            disabled={isLoading}
            className={cn(
              "h-12 rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
              confirmPasswordError && "border-destructive focus:ring-destructive"
            )}
          />
          {confirmPasswordError && <p className="text-sm text-destructive">{confirmPasswordError}</p>}
        </div>

        {/* Create Account Button */}
        <Button 
          type="submit" 
          className="h-12 w-full bg-white text-black border border-border hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm" 
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create account"}
        </Button>

      </div>

      {/* Login Link */}
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors duration-200">
          Sign in
        </a>
      </div>
    </form>
  )
}

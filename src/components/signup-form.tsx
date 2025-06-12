"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LearnivaLogo from "@/app/learniva-black.png"
import { useState } from "react"
import { useRouter } from "next/navigation" // Import useRouter
import { registerUser } from "@/lib/auth" // Import registerUser

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [usernameError, setUsernameError] = useState<string | null>(null) // Add state for username
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false) // Add isLoading state
  const router = useRouter() // Initialize useRouter

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const username = (event.currentTarget.elements.namedItem("username") as HTMLInputElement)?.value // Get username
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

    if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
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

    setIsLoading(true) // Set loading state

    try {
      const data = await registerUser(username, email, password)
      console.log("Signup successful", data)
      // Redirect to login or dashboard page after successful registration
      router.push("/login") 
    } catch (error: any) {
      console.error("Signup failed:", error)
      // Display a generic error or parse specific errors from `error.message`
      // This example sets a general password error, adjust as needed
      if (error.message) {
        // You might want to parse the error.message to set specific field errors
        // For now, setting a general error on the password field or a new general error state
        setPasswordError(error.message) 
      } else {
        setPasswordError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false) // Reset loading state
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex justify-start">
        <img src={LearnivaLogo.src ?? LearnivaLogo} alt="Learniva Logo" className="h-9 w-50" />
      </div>
      <div className="flex flex-col items-start gap-2 text-left">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to create your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label> {/* Add Username Field */}
          <Input
            id="username"
            type="text"
            placeholder="yourusername"
            required
            disabled={isLoading}
            className={cn(usernameError && "border-red-500 focus-visible:ring-red-500")}
          />
          {usernameError && <p className="text-sm text-red-500">{usernameError}</p>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            className={cn(emailError && "border-red-500 focus-visible:ring-red-500")}
          />
          {emailError && <p className="text-sm text-red-500">{emailError}</p>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            className={cn(passwordError && "border-red-500 focus-visible:ring-red-500")}
          />
          {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            required
            className={cn(confirmPasswordError && "border-red-500 focus-visible:ring-red-500")}
          />
          {confirmPasswordError && <p className="text-sm text-red-500">{confirmPasswordError}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}> {/* Disable button when loading */}
          {isLoading ? "Creating account..." : "Create account"} {/* Change button text when loading */}
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
          </svg>
          Sign up with GitHub
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </form>
  )
}

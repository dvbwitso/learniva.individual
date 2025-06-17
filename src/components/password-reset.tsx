"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useState } from "react"
import { requestPasswordReset } from "@/lib/auth"

export function PasswordResetForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [emailError, setEmailError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)
    setEmailError(null)
    const email = (event.currentTarget.elements.namedItem("email") as HTMLInputElement)?.value

    let hasError = false
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid Email. Try again")
      hasError = true
    } else {
      setEmailError(null)
    }

    if (hasError) {
      return
    }

    setIsLoading(true)

    try {
      const data = await requestPasswordReset(email)
      console.log("Password reset request successful", data)
      setMessage(data.detail || "If an account with that email exists, a password reset link has been sent.")
    } catch (error: any) {
      console.error("Password reset request failed:", error)
      if (error.message) {
        setEmailError(error.message)
      } else {
        setMessage("An unexpected error occurred. Please try again.")
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
        <h1 className="text-2xl font-bold text-foreground">Forgot your password?</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email below and we'll send you a link to reset your password.
        </p>
      </div>

      {/* Form Fields */}
      <div className="grid gap-6">
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

        {/* Reset Password Button */}
        <Button 
          type="submit" 
          className="h-12 w-full bg-white text-black border border-border hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm" 
          disabled={isLoading}
        >
          {isLoading ? "Sending link..." : "Reset password"}
        </Button>

        {/* Success/Error Message */}
        {message && (
          <div className="p-4 rounded-xl bg-accent/50 border border-border">
            <p className="text-sm text-center text-foreground">{message}</p>
          </div>
        )}
      </div>

      {/* Back to Login Link */}
      <div className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <a href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors duration-200">
          Back to login
        </a>
      </div>
    </form>
  )
}

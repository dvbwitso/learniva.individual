"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LearnivaLogo from "@/app/learniva-black.png"
import { useState } from "react"
import { requestPasswordReset } from "@/lib/auth" // Import requestPasswordReset

export function PasswordResetForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [emailError, setEmailError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false) // Add isLoading state
  const [message, setMessage] = useState<string | null>(null) // State for success/error messages

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null) // Clear previous messages
    setEmailError(null) // Clear previous email error
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
      // Display a success message to the user
      // The actual message from API might vary, adjust `data.detail` if needed
      setMessage(data.detail || "If an account with that email exists, a password reset link has been sent.")
    } catch (error: any) {
      console.error("Password reset request failed:", error)
      // Display error message
      if (error.message) {
        setEmailError(error.message) // Or set a general message using setMessage
      } else {
        setMessage("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex justify-start">
        <img src={LearnivaLogo.src ?? LearnivaLogo} alt="Learniva Logo" className="h-9 w-50" />
      </div>
      <div className="flex flex-col items-start gap-2 text-left">
        <h1 className="text-2xl font-bold">Forgot your password?</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below and we'll send you a link to reset your password.
        </p>
      </div>
      <div className="grid gap-6">
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Sending link..." : "Reset password"}
        </Button>
        {message && <p className="text-sm text-center">{message}</p>} {/* Display success/error message */}
      </div>
      <div className="text-center text-sm">
        Remembered your password?{" "}
        <a href="/login" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </form>
  )
}

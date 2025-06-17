"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { confirmPasswordReset } from "@/lib/auth"

export function ConfirmResetForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  // State for uidb64 and token from URL
  const [uidb64, setUidb64] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const uid = searchParams.get('uidb64')
    const tkn = searchParams.get('token')
    setUidb64(uid)
    setToken(tkn)

    if (!uid || !tkn) {
      setMessage("Invalid password reset link. Please request a new one.")
    }
  }, [searchParams])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage(null)
    setPasswordError(null)
    setConfirmPasswordError(null)

    const newPassword = (event.currentTarget.elements.namedItem("new-password") as HTMLInputElement)?.value
    const confirmPassword = (event.currentTarget.elements.namedItem("confirm-password") as HTMLInputElement)?.value

    let hasError = false
    if (!newPassword) {
      setPasswordError("New password is required.")
      hasError = true
    } else {
      setPasswordError(null)
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match. Try again")
      hasError = true
    } else {
      setConfirmPasswordError(null)
    }

    if (hasError || !uidb64 || !token) {
      return
    }

    setIsLoading(true)

    try {
      const data = await confirmPasswordReset(uidb64, token, newPassword)
      console.log("Password reset successful", data)
      setMessage("Password reset successfully! Redirecting to login...")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error: any) {
      console.error("Password reset failed:", error)
      if (error.message) {
        setPasswordError(error.message)
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
        <h1 className="text-2xl font-bold text-foreground">Set new password</h1>
        <p className="text-muted-foreground text-sm">
          Enter your new password below to complete the reset process.
        </p>
      </div>

      {/* Form Fields */}
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="new-password" className="text-sm font-medium text-foreground">New Password</Label>
          <Input
            id="new-password"
            type="password"
            placeholder="Enter your new password"
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
          <Label htmlFor="confirm-password" className="text-sm font-medium text-foreground">Confirm New Password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm your new password"
            required
            disabled={isLoading}
            className={cn(
              "h-12 rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200",
              confirmPasswordError && "border-destructive focus:ring-destructive"
            )}
          />
          {confirmPasswordError && <p className="text-sm text-destructive">{confirmPasswordError}</p>}
        </div>

        {/* Reset Password Button */}
        <Button 
          type="submit" 
          className="h-12 w-full bg-white text-black border border-border hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm" 
          disabled={isLoading}
        >
          {isLoading ? "Updating password..." : "Update password"}
        </Button>

        {/* Success/Error Message */}
        {message && (
          <div className={cn(
            "p-4 rounded-xl border",
            message.includes("successfully") 
              ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300"
              : "bg-destructive/10 border-destructive/20 text-destructive"
          )}>
            <p className="text-sm text-center">{message}</p>
          </div>
        )}
      </div>

      {/* Back to Login Link */}
      <div className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <a href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors duration-200">
          Back to login
        </a>
      </div>
    </form>
  )
}

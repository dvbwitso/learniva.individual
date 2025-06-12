"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LearnivaLogo from "@/app/learniva-black.png"
import { useState, useEffect } from "react" // Import useEffect
import { useRouter, useSearchParams } from "next/navigation" // Import useRouter and useSearchParams
import { confirmPasswordReset } from "@/lib/auth" // Import confirmPasswordReset

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
    // Extract uidb64 and token from URL query parameters
    // This assumes your route is /reset-password?uidb64=xxx&token=yyy
    // Adjust if your URL structure is different (e.g., /reset-password/[uidb64]/[token])
    const uid = searchParams.get('uidb64')
    const tkn = searchParams.get('token')
    setUidb64(uid)
    setToken(tkn)

    if (!uid || !tkn) {
      setMessage("Invalid password reset link. Please request a new one.")
      // Optionally disable the form or redirect
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
      setPasswordError("Password is required.")
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

    if (hasError) {
      return
    }

    if (!uidb64 || !token) {
      setMessage("Missing reset parameters. Please use the link from your email.")
      return
    }

    setIsLoading(true)

    try {
      const data = await confirmPasswordReset(uidb64, token, newPassword)
      console.log("Password reset successful", data)
      setMessage(data.detail || "Your password has been reset successfully. You can now login.")
      // Optionally redirect to login page after a delay
      setTimeout(() => router.push("/login"), 3000)
    } catch (error: any) {
      console.error("Password reset failed:", error)
      if (error.message) {
        // More specific error handling can be added here if the API provides distinct error codes/messages
        setMessage(error.message)
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
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your new password below to complete the reset process.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="password"
            placeholder="Enter new password"
            required
            className={cn(passwordError && "border-red-500 focus-visible:ring-red-500")}
          />
          {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="confirm-password">Confirm new password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm new password"
            required
            className={cn(confirmPasswordError && "border-red-500 focus-visible:ring-red-500")}
          />
          {confirmPasswordError && <p className="text-sm text-red-500">{confirmPasswordError}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading || !uidb64 || !token}>
          {isLoading ? "Updating password..." : "Update password"}
        </Button>
        {message && <p className="text-sm text-center mt-4">{message}</p>} {/* Display message */}
      </div>
      <div className="text-center text-sm">
        Remember your password?{" "}
        <a href="/login" className="underline underline-offset-4">
          Back to login
        </a>
      </div>
    </form>
  )
}

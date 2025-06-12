"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LearnivaLogo from "@/app/learniva-black.png"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginUser } from "@/lib/auth" // Import the loginUser function

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const email = (event.currentTarget.elements.namedItem("email") as HTMLInputElement)?.value
    const password = (event.currentTarget.elements.namedItem("password") as HTMLInputElement)?.value

    let hasError = false
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Invalid Email. Try again")
      hasError = true
    } else {
      setEmailError(null)
    }

    if (!password) {
      setPasswordError("Wrong Password. Try again")
      hasError = true
    } else {
      setPasswordError(null)
    }

    if (hasError) {
      return
    }

    setIsLoading(true)

    try {
      const responseData = await loginUser(email, password) 

      console.log("Login successful", responseData)
      
      const token = responseData?.data?.token;

      if (token && typeof token === 'string') {
        localStorage.setItem("authToken", token);
        router.push("/dashboard");
      } else {
        console.error("Login response did not contain a valid token at responseData.data.token. Full response:", responseData);
        setPasswordError("Login failed: Authentication token not found or invalid in server response.");
      }
    } catch (error: any) {
      console.error("Login failed:", error)
      // Handle errors based on the error structure from loginUser
      if (error.message) {
        setPasswordError(error.message)
      } else {
        setPasswordError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex justify-start">
        <img src={LearnivaLogo.src } alt="Learniva Logo" className="h-9 w-50" />
      </div>
      <div className="flex flex-col items-start gap-2 text-left">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="mwaka@example.com"
            required
            disabled={isLoading}
            className={cn(emailError && "border-red-500 focus-visible:ring-red-500")}
          />
          {emailError && <p className="text-sm text-red-500">{emailError}</p>}
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            disabled={isLoading}
            className={cn(passwordError && "border-red-500 focus-visible:ring-red-500")}
          />
          {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos; have an account?{" "}
        <a href="/register" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  )
}
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LearnivaLogo from "@/app/learniva-black.png";
import { useState } from "react";
import { changePassword } from "@/lib/auth"; // To be created
import { useRouter } from "next/navigation";

export function ChangePasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [oldPasswordError, setOldPasswordError] = useState<string | null>(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setOldPasswordError(null);
    setNewPasswordError(null);
    setConfirmPasswordError(null);

    const oldPassword = (event.currentTarget.elements.namedItem("old-password") as HTMLInputElement)?.value;
    const newPassword = (event.currentTarget.elements.namedItem("new-password") as HTMLInputElement)?.value;
    const confirmPassword = (event.currentTarget.elements.namedItem("confirm-password") as HTMLInputElement)?.value;

    let hasError = false;
    if (!oldPassword) {
      setOldPasswordError("Old password is required.");
      hasError = true;
    }
    if (!newPassword) {
      setNewPasswordError("New password is required.");
      hasError = true;
    } else if (newPassword.length < 8) {
      setNewPasswordError("Password must be at least 8 characters long.");
      hasError = true;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match. Try again");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setIsLoading(true);

    try {
      const data = await changePassword(oldPassword, newPassword);
      console.log("Password change successful", data);
      setMessage(data.detail || "Your password has been changed successfully.");
      // Optionally redirect or clear form
      // router.push("/profile"); // Example redirect
    } catch (error: any) {
      console.error("Password change failed:", error);
      if (error.response && error.response.data) {
        // Handle specific API errors
        const apiErrors = error.response.data;
        if (apiErrors.old_password) {
          setOldPasswordError(apiErrors.old_password.join(" "));
        }
        if (apiErrors.new_password1) {
          setNewPasswordError(apiErrors.new_password1.join(" "));
        }
        if (apiErrors.new_password2) {
          setConfirmPasswordError(apiErrors.new_password2.join(" "));
        }
        if (apiErrors.detail) {
          setMessage(apiErrors.detail);
        } else if (!apiErrors.old_password && !apiErrors.new_password1 && !apiErrors.new_password2) {
          setMessage("An unexpected error occurred. Please try again.");
        }
      } else if (error.message) {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex justify-start">
        <img src={LearnivaLogo.src ?? LearnivaLogo} alt="Learniva Logo" className="h-9 w-50" />
      </div>
      <div className="flex flex-col items-start gap-2 text-left">
        <h1 className="text-2xl font-bold">Change your password</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your old password and a new password below.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="old-password">Old password</Label>
          <Input
            id="old-password"
            type="password"
            placeholder="Enter old password"
            required
            className={cn(oldPasswordError && "border-red-500 focus-visible:ring-red-500")}
          />
          {oldPasswordError && <p className="text-sm text-red-500">{oldPasswordError}</p>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="password"
            placeholder="Enter new password"
            required
            className={cn(newPasswordError && "border-red-500 focus-visible:ring-red-500")}
          />
          {newPasswordError && <p className="text-sm text-red-500">{newPasswordError}</p>}
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Updating password..." : "Update password"}
        </Button>
        {message && <p className="text-sm text-center mt-4">{message}</p>}
      </div>
      <div className="text-center text-sm">
        Back to{" "}
        <a href="/profile" className="underline underline-offset-4">
          Profile
        </a>
      </div>
    </form>
  );
}

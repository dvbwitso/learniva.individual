import { GalleryVerticalEnd } from "lucide-react"

import { PasswordResetForm  } from "../../components/password-reset"
import { LoginCarousel } from "@/components/login-carousel"; // Added import

export default function PasswordResetPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        {/* Replaced img with LoginCarousel */}
        <LoginCarousel />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <PasswordResetForm />
          </div>
        </div>
      </div>

    </div>
  )
}

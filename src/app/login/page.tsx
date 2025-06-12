import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import Image from "next/image";
import { LoginCarousel } from "@/components/login-carousel";
import learnivaBlackLogo from "../learniva-black.png"; // Import the image

// Import the new Carousel component (we'll create this next)
export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        {/* Carousel Component */}
        <LoginCarousel />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-white dark:bg-gray-950">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs space-y-6">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
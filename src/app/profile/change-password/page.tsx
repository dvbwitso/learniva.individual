import { ChangePasswordForm } from "@/components/change-password-form";
import { AppSidebar } from "@/components/app-sidebar";

export default function ChangePasswordPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-[280px_1fr]">
      <AppSidebar isCollapsed={false} />
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}

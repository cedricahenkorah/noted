import { SignUpForm } from "@/components/signup-form";
import { NotebookText } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-yellow-500 text-primary-foreground">
            <NotebookText className="size-4" />
          </div>
          <span className="text-yellow-500 font-semibold">noted.</span>
        </Link>
        <SignUpForm />
      </div>
    </div>
  );
}

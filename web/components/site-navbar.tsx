import Link from "next/link";
import { NotebookText } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <NotebookText className="h-6 w-6" />
            <span className="font-bold">noted</span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="#features"
              className="transition-colors hover:text-foreground/80"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="transition-colors hover:text-foreground/80"
            >
              Pricing
            </Link>
            <Link
              href="https://github.com/cedricahenkorah/noted"
              className="transition-colors hover:text-foreground/80"
            >
              Docs
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            <Button variant="ghost" asChild>
              <Link href="/auth">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}

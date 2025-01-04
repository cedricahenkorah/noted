import Link from "next/link";
import { NotebookText } from "lucide-react";

const footerLinks = {
  product: [
    { href: "#features", label: "Features" },
    { href: "#pricing", label: "Pricing" },
    { href: "/docs", label: "Documentation" },
    { href: "/changelog", label: "Changelog" },
  ],
  company: [
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/security", label: "Security" },
    { href: "/cookies", label: "Cookies" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto grid gap-8 py-16 md:grid-cols-2 lg:grid-cols-4 px-5 lg:px-0">
        <div className="space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-500 text-primary-foreground">
              <NotebookText className="h-6 w-6" />
            </div>
            <span className="font-bold text-yellow-500">noted</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            The modern note-taking app for capturing your ideas through text,
            voice, and canvas.
          </p>
        </div>

        <nav>
          <h3 className="mb-4 text-sm font-semibold">Product</h3>
          <ul className="space-y-3 text-sm">
            {footerLinks.product.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav>
          <h3 className="mb-4 text-sm font-semibold">Company</h3>
          <ul className="space-y-3 text-sm">
            {footerLinks.company.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav>
          <h3 className="mb-4 text-sm font-semibold">Legal</h3>
          <ul className="space-y-3 text-sm">
            {footerLinks.legal.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t">
        <div className="container mx-auto flex flex-col gap-4 py-6 px-5 lg:px-0 text-center text-sm text-muted-foreground md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} noted. All rights reserved.</p>
          <p>
            Crafted by{" "}
            <Link
              href="https://github.com/cedricahenkorah/"
              className="font-medium underline underline-offset-4"
            >
              @cedricahenkorah
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

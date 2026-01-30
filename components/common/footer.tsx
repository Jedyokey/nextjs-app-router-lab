import Link from "next/link"
import { GithubIcon, MailIcon, SparkleIcon, TwitterIcon } from "lucide-react"

function FooterLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 group w-fit">
      <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
        <SparkleIcon className="size-4 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold">
        i<span className="text-primary">Built</span>This
      </span>
    </Link>
  )
}

function FooterLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </Link>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="wrapper px-12 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3 md:col-span-2">
            <FooterLogo />
            <p className="text-sm text-muted-foreground max-w-md">
              A community platform for builders to share launches, discover new
              products, and get genuine feedback.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="mailto:hello@ibuiltthis.com"
                className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all"
              >
                <MailIcon className="size-4" />
                <span>Contact</span>
              </a>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all"
              >
                Browse products
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="space-y-2">
              <li>
                <FooterLink href="/">Home</FooterLink>
              </li>
              <li>
                <FooterLink href="/products">Products</FooterLink>
              </li>
              <li>
                <FooterLink href="/explore">Explore</FooterLink>
              </li>
              <li>
                <FooterLink href="/submit">Submit a project</FooterLink>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="space-y-2">
              <li>
                <FooterLink href="/how-it-works">How it works</FooterLink>
              </li>
              <li>
                <FooterLink href="/products">Featured</FooterLink>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <GithubIcon className="size-4" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <TwitterIcon className="size-4" />
                  <span>X (Twitter)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} iBuiltThis. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
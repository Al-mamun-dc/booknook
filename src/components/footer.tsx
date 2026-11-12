import Link from "next/link"

import { BookOpenIcon, MailIcon, PhoneIcon } from "lucide-react"

import { cn } from "cn"

const columnHeadings = "text-base font-bold text-white"

const linkClasses =
  "text-sm text-white/85 transition-colors hover:text-white hover:underline"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
  { label: "Add Book", href: "/books/new" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
]

const supportLinks = [
  { label: "Help Center", href: "/help" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
]

// lucide-react no longer ships brand icons, so the social marks are inlined.
const socials = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    label: "GitHub",
    href: "https://github.com",
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
]

function LinkColumns({
  title,
  links,
  className,
}: {
  title: string
  links: { label: string; href: string }[]
  className?: string
}) {
  return (
    <nav aria-label={title} className={cn("px-4 sm:px-6 lg:px-8", className)}>
      <h3 className={columnHeadings}>{title}</h3>
      <ul className="mt-3 space-y-1.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkClasses}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("bg-[#0e2f55] text-white", className)}>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 py-10 sm:px-4 lg:grid lg:grid-cols-4 lg:gap-0 lg:px-6 lg:divide-x lg:divide-white/10 lg:py-12">
        <div className="sm:px-4 lg:pr-8">
          <div className="flex items-center gap-2.5">
            <BookOpenIcon className="size-8" fill="currentColor" />
            <span className="text-2xl font-bold">BookNook</span>
          </div>
          <p className="mt-2.5 text-sm text-white/75">Read more. Learn more.</p>
        </div>

        <LinkColumns title="Quick Links" links={quickLinks} />
        <LinkColumns title="Support" links={supportLinks} />

        <div className="px-4 sm:px-6 lg:pl-8 lg:pr-4">
          <h3 className={columnHeadings}>Contact Us</h3>
          <ul className="mt-3 space-y-2.5">
            <li className="flex items-center gap-2.5 text-sm text-white/85">
              <MailIcon className="size-4 shrink-0" />
              <a href="mailto:booknook@gmail.com" className={linkClasses}>
                booknook@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2.5 text-sm text-white/85">
              <PhoneIcon className="size-4 shrink-0" />
              <a href="tel:+8801234567890" className={linkClasses}>
                +880 1234-567890
              </a>
            </li>
          </ul>

          <div className="mt-4 flex items-center gap-2.5">
            {socials.map(({ label, href, path }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex size-8 items-center justify-center rounded-full bg-white text-[#0e2f55] transition-colors hover:bg-blue-100"
              >
                <svg viewBox="0 0 24 24" aria-hidden className="size-4">
                  <path d={path} fill="currentColor" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 py-4 text-center text-sm text-white/85">
        © 2025 BookNook. All rights reserved.
      </div>
    </footer>
  )
}

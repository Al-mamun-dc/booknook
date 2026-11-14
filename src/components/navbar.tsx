
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, User, Menu, X } from "lucide-react";

import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const links = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/all-books" },
  { label: "Add Book", href: "/add-books", private: true },
  { label: "My Books", href: "/my-books", private: true },
  { label: "My Borrows", href: "/my-borrows", private: true },
];

export function Navbar({ className }: { className?: string }) {
  const { data: session, isPending } = authClient.useSession();

  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await authClient.signOut();
    setOpen(false);
    setMobileOpen(false);
  }

  return (
    <header className={cn("relative z-20 bg-blue-900", className)}>
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/images/booknook-logo.png"
            alt="BookNook"
            width={132}
            height={34}
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="mx-auto hidden items-center gap-7 text-sm lg:flex">
          {links
            .filter((link) => !link.private || session)
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-white/85 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
        </nav>

        {/* Right Side */}
        <div className="ml-auto flex items-center gap-2 lg:ml-0">

          {/* Desktop Login & Signup */}
          {!isPending && !session && (
            <div className="hidden items-center gap-2 lg:flex">
              <Link href="/login">
                <Button className="h-9 bg-blue-600 px-4 text-white hover:bg-blue-700">
                  Login
                </Button>
              </Link>

              <Link
                href="/signup"
                className="flex h-9 items-center rounded-md bg-blue-600 px-4 text-white hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Profile Dropdown */}
          {!isPending && session && (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 rounded-md px-2 py-1 text-white hover:bg-blue-800"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    referrerPolicy="no-referrer"
                    className="h-9 w-9 rounded-full border-2 border-white object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600">
                    <User size={21} />
                  </div>
                )}

                <ChevronDown size={18} />
              </button>

              {open && (
                <div className="absolute right-0 top-12 z-50 w-56 rounded-lg border bg-white p-3 text-gray-800 shadow-lg">

                  <p className="font-semibold">
                    {session.user.name}
                  </p>

                  <p className="mb-3 truncate text-sm text-gray-500">
                    {session.user.email}
                  </p>

                  <hr className="mb-2" />

                  <Link
                    href="/my-profile"
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    My Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-2 text-white hover:bg-blue-800 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={25} /> : <Menu size={25} />}
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="border-t border-blue-700 bg-blue-900 px-4 py-4 lg:hidden">

          <div className="flex flex-col gap-1">

            {links
              .filter((link) => !link.private || session)
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-3 text-sm font-medium text-white hover:bg-blue-800"
                >
                  {link.label}
                </Link>
              ))}

            {/* Mobile Login & Signup */}
            {!isPending && !session && (
              <div className="mt-2 flex gap-2 border-t border-blue-700 pt-3">

                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-md bg-blue-600 py-2 text-center text-white hover:bg-blue-700"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-md bg-blue-600 py-2 text-center text-white hover:bg-blue-700"
                >
                  Sign Up
                </Link>

              </div>
            )}

          </div>
        </nav>
      )}

    </header>
  );
}

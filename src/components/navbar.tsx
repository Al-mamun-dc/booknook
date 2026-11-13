
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, User } from "lucide-react";

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
  console.log("Session Image:", session?.user?.image);
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await authClient.signOut();
    setOpen(false);
  }

  return (
    <header className={cn("relative z-20 bg-blue-900", className)}>
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/images/booknook-logo.png"
            alt="BookNook"
            width={132}
            height={34}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <nav className="mx-auto hidden items-center gap-7 text-sm md:flex">
          {links
            .filter((link) => !link.private || session)
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-white/85 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5 md:ml-0">
          {!isPending && !session && (
            <>
              <Link href="/login">
                <Button className="h-9 rounded-md border border-blue-300/60 bg-blue-600 px-4 text-white hover:bg-blue-700">
                  Login
                </Button>
              </Link>

              <Link
                href="/signup"
                className="inline-flex h-9 items-center justify-center rounded-md bg-blue-600 px-4 text-white hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}

          {!isPending && session && (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 rounded-md px-2 py-1 text-white hover:bg-blue-800"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image || ""}
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
                    className="block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100"
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
        </div>
      </div>
    </header>
  );
}

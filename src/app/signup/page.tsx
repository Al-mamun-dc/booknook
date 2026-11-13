
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const redirectTo = searchParams.get("redirect") || "/";

  const safeRedirect =
    redirectTo.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : "/";

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must contain an uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setPasswordError("Password must contain a lowercase letter.");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    setPasswordError("");
    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: photoURL,
        callbackURL: "/login",
      });

      if (error) {
        toast.error(error.message || "Registration failed!");
        return;
      }

      toast.success("Registration successful!");
      router.push("/login");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: safeRedirect,
      });
    } catch (error) {
      toast.error("Google login failed!");
      console.log(error);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-xl bg-white p-7 shadow-md">
        <h1 className="mb-2 text-center text-3xl font-bold text-blue-950">
          Create Account
        </h1>

        <p className="mb-7 text-center text-gray-500">
          Register to join BookNook
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-md border p-3 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-md border p-3 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Photo URL
            </label>
            <input
              type="url"
              required
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="Enter your photo URL"
              className="w-full rounded-md border p-3 outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
              placeholder="Enter your password"
              className="w-full rounded-md border p-3 outline-none focus:border-blue-600"
            />

            {passwordError && (
              <p className="mt-2 text-sm text-red-600">
                {passwordError}
              </p>
            )}

            <p className="mt-2 text-xs text-gray-500">
              Must contain uppercase, lowercase and at least 6 characters.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200"></div>
          <span className="text-sm text-gray-400">OR</span>
          <div className="h-px flex-1 bg-gray-200"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full rounded-md border border-gray-300 py-3 font-medium hover:bg-gray-50"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}

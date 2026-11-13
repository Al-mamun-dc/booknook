
"use client";

import { authClient } from "@/lib/auth-client";

export default function MyProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="p-10">Loading...</div>;
  }

  if (!session) {
    return <div className="p-10">Please login to view your profile.</div>;
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">My Profile</h1>

      <div className="rounded-lg border p-6 shadow-sm">
        {session.user.image && (
          <img
            src={session.user.image}
            alt="Profile"
            className="mb-4 h-20 w-20 rounded-full object-cover"
          />
        )}

        <p className="mb-2">
          <strong>Name:</strong> {session.user.name}
        </p>

        <p>
          <strong>Email:</strong> {session.user.email}
        </p>
      </div>
    </div>
  );
}

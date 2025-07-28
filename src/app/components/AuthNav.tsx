"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

export default function AuthNav() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="animate-pulse w-24 h-8 bg-gray-200 rounded" />;
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn()}
        className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition"
      >
        Sign In
      </button>
    );
  }

  // Use username if available, else fallback to name/email
  type UserWithUsername = {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
  };
  const user = session.user as UserWithUsername;
  const username = user?.username || user?.name || user?.email || "guest";

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-gray-900/80 shadow-md fixed top-0 left-0 z-50 backdrop-blur-md">
      <Link href="/" className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">LinkUnlocker</Link>
      <div className="flex gap-4 items-center">
        <Link href="/dashboard" className="hover:underline font-medium">Dashboard</Link>
        <Link href={`/profile`} className="hover:underline font-medium">Profile</Link>

        <div className="flex items-center gap-3">
          <Link href={`/public?username=${username}`} className="flex items-center gap-2 hover:underline">
            {session.user?.image && (
              <Image src={session.user.image} alt="avatar" width={32} height={32} className="w-8 h-8 rounded-full border" />
            )}
            <span className="font-medium text-white">{username}</span>
          </Link>
          <button
            onClick={() => signOut()}
            className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
} 
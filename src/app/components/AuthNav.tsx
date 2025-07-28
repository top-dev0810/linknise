"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaChartBar } from "react-icons/fa";

export default function AuthNav() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (status === "loading") {
    return <div className="animate-pulse w-24 h-8 bg-gray-200 rounded" />;
  }

  if (!session) {
    return (
      <nav className="w-full flex items-center justify-between px-4 sm:px-6 py-4 bg-white/80 dark:bg-gray-900/80 shadow-md fixed top-0 left-0 z-50 backdrop-blur-md">
        <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          LinkUnlocker
        </Link>
        <div className="flex items-center">
          <button
            onClick={() => signIn()}
            className="px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition text-sm sm:text-base"
          >
            Sign In
          </button>
        </div>
      </nav>
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
    <nav className="w-full flex items-center justify-between px-4 sm:px-6 py-4 bg-white/80 dark:bg-gray-900/80 shadow-md fixed top-0 left-0 z-50 backdrop-blur-md">
      <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        LinkUnlocker
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-4 items-center">
        <Link href="/dashboard" className="hover:underline font-medium text-sm sm:text-base">Dashboard</Link>
        <Link href={`/profile`} className="hover:underline font-medium text-sm sm:text-base">Profile</Link>

        <div className="flex items-center gap-3">
          <Link href={`/public?username=${username}`} className="flex items-center gap-2 hover:underline">
            {session.user?.image && (
              <Image src={session.user.image} alt="avatar" width={32} height={32} className="w-8 h-8 rounded-full border" />
            )}
            <span className="font-medium text-white text-sm sm:text-base">{username}</span>
          </Link>
          <button
            onClick={() => signOut()}
            className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm sm:text-base"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-t border-gray-200 dark:border-gray-700 md:hidden">
          <div className="px-4 py-6 space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
              <Link href={`/public?username=${username}`} className="flex items-center gap-3 hover:opacity-80 transition">
                {session.user?.image ? (
                  <Image src={session.user.image} alt="avatar" width={40} height={40} className="w-10 h-10 rounded-full border" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <FaUser className="text-gray-600 dark:text-gray-400" />
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{username}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{session.user?.email}</div>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaChartBar className="text-gray-500" />
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaUser className="text-gray-500" />
                Profile
              </Link>
            </div>

            {/* Sign Out Button */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  signOut();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              >
                <FaSignOutAlt />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 
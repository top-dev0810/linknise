"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FaEdit, FaUser, FaEnvelope, FaGlobe, FaCalendar, FaLink } from "react-icons/fa";

interface ExtendedUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  username?: string;
  bio?: string;
  createdAt?: string;
}

function formatMemberSince(date?: string) {
  if (!date) return null;
  const joinDate = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - joinDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  let duration = "";
  if (diffYears > 0) {
    duration = `${diffYears} year${diffYears > 1 ? 's' : ''}`;
  } else if (diffMonths > 0) {
    duration = `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
  } else {
    duration = `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  }

  return {
    date: joinDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long"
    }),
    duration: duration
  };
}

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#10182a] via-[#181f32] to-[#0a0f1c]">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-4">Please sign in to view your profile</h1>
          <Link href="/auth/signin">
            <button className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition text-sm sm:text-base">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const user = session.user as ExtendedUser;

  return (
    <div className="pt-18 min-h-screen bg-gradient-to-br from-[#10182a] via-[#181f32] to-[#0a0f1c] px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Profile</h1>
          <Link href="/profile/edit">
            <button className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-lg hover:from-green-600 hover:to-blue-600 transition flex items-center gap-2 text-sm sm:text-base">
              <FaEdit /> Edit Profile
            </button>
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-[rgba(24,28,27,0.85)] backdrop-blur-xl rounded-2xl border border-[#232b45] p-6 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
            {/* Profile Image */}
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-[#232b45] flex items-center justify-center">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-2xl sm:text-4xl text-gray-500" />
                )}
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-white">{user.name || "Unnamed User"}</h2>
                {user.username && (
                  <p className="text-base sm:text-lg text-gray-400 font-mono">@{user.username}</p>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-gray-400 text-sm sm:text-base" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Email</p>
                    <p className="text-white text-sm sm:text-base">{user.email}</p>
                  </div>
                </div>
                {user.username && (
                  <div className="flex items-center gap-3">
                    <FaGlobe className="text-gray-400 text-sm sm:text-base" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-400">Username</p>
                      <p className="text-white text-sm sm:text-base">@{user.username}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <FaCalendar className="text-gray-400 text-sm sm:text-base" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Member Since</p>
                    {user.createdAt ? (
                      <div className="flex flex-col gap-1">
                        <p className="text-white text-sm sm:text-base">
                          {formatMemberSince(user.createdAt)?.date}
                        </p>
                        <p className="text-green-400 text-xs">
                          Active for {formatMemberSince(user.createdAt)?.duration}
                        </p>
                      </div>
                    ) : (
                      <p className="text-white text-sm sm:text-base">Unknown</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaLink className="text-gray-400 text-sm sm:text-base" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400">Profile URL</p>
                    <Link href={`/public?username=${user.username}`} className="text-blue-400 text-sm sm:text-base">
                      {user.username ? `linkunlocker.vercel.app/public?username=${user.username}` : "Not set"}
                    </Link>
                  </div>
                </div>
              </div>

              {user.bio && (
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 mb-2">Bio</p>
                  <p className="text-white text-sm sm:text-base">{user.bio}</p>
                </div>
              )}

              {!user.bio && (
                <div className="text-gray-400 text-xs sm:text-sm">
                  No bio added yet.{" "}
                  <Link href="/profile/edit" className="text-blue-400 hover:underline">
                    Add one now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link href="/dashboard">
            <div className="bg-[rgba(24,28,27,0.85)] backdrop-blur-xl rounded-2xl border border-[#232b45] p-4 sm:p-6 hover:bg-[#232b45]/20 transition cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <FaLink className="text-xl sm:text-2xl text-blue-400" />
                <h3 className="text-base sm:text-lg font-semibold text-white">My Links</h3>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">Manage your unlock links and view analytics</p>
            </div>
          </Link>

          <Link href="/dashboard/create">
            <div className="bg-[rgba(24,28,27,0.85)] backdrop-blur-xl rounded-2xl border border-[#232b45] p-4 sm:p-6 hover:bg-[#232b45]/20 transition cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <FaEdit className="text-xl sm:text-2xl text-green-400" />
                <h3 className="text-base sm:text-lg font-semibold text-white">Create Link</h3>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">Create a new unlock link to share</p>
            </div>
          </Link>

          <Link href="/profile/edit">
            <div className="bg-[rgba(24,28,27,0.85)] backdrop-blur-xl rounded-2xl border border-[#232b45] p-4 sm:p-6 hover:bg-[#232b45]/20 transition cursor-pointer sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-3">
                <FaUser className="text-xl sm:text-2xl text-purple-400" />
                <h3 className="text-base sm:text-lg font-semibold text-white">Edit Profile</h3>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm">Update your profile information and picture</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 
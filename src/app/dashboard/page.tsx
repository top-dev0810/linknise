import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Please sign in to access your dashboard</h2>
        <Link href="/auth/signin">
          <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition">
            Sign In
          </button>
        </Link>
      </div>
    );
  }

  const user = {
    name: session.user?.name || null,
    email: session.user?.email || null,
    image: session.user?.image || null,
    username: (session.user as { username?: string })?.username || null,
  };

  return (
    <div className="pt-18 min-h-screen bg-gradient-to-br from-[#10182a] via-[#181f32] to-[#0a0f1c]">
      <DashboardClient user={user} />
    </div>
  );
} 
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";

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

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 flex flex-col gap-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Your Links</h1>
        <Link href="/dashboard/create">
          <button className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">
            + New Link
          </button>
        </Link>
      </div>
      {/* Link list will go here */}
      <div className="rounded-xl bg-white/80 dark:bg-gray-900/80 shadow p-6 flex flex-col items-center justify-center min-h-[200px] text-gray-500 dark:text-gray-400">
        <span>No links yet. Click &quot;+ New Link&quot; to create your first unlock page!</span>
      </div>
    </div>
  );
} 
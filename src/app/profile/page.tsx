import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/mongodb";
import { User } from "@/lib/user.model";
import { Link as LinkModel, ILink as ILinkBase } from "@/lib/link.model";
import LinkNext from "next/link";

interface ILink extends ILinkBase {
    createdAt?: Date;
}

function getIdString(id: unknown): string {
    if (typeof id === "string") return id;
    if (id && typeof id === "object" && "toString" in id) return (id as { toString: () => string }).toString();
    return "";
}

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <h2 className="text-2xl font-bold mb-4">Please sign in to view your profile</h2>
                <LinkNext href="/auth/signin">
                    <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition">
                        Sign In
                    </button>
                </LinkNext>
            </div>
        );
    }
    await dbConnect();
    const user = await User.findOne({ email: session.user.email });
    const links: ILink[] = user ? await LinkModel.find({ creator: user._id }).sort({ createdAt: -1 }) : [];
    return (
        <div className="max-w-3xl mx-auto py-10 px-4 flex flex-col gap-8">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                    {user?.name?.[0] || user?.email?.[0] || "U"}
                </div>
                <div>
                    <h1 className="text-2xl font-bold">{user?.name || "Unnamed User"}</h1>
                    <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                    <p className="text-sm text-gray-400 mt-1">{links.length} {links.length === 1 ? "post" : "posts"}</p>
                </div>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-4">Your Unlock Links</h2>
                {links.length === 0 ? (
                    <div className="rounded-xl bg-white/80 dark:bg-gray-900/80 shadow p-6 flex flex-col items-center justify-center min-h-[120px] text-gray-500 dark:text-gray-400">
                        <span>No links yet. <LinkNext href="/dashboard/create" className="text-blue-500 hover:underline">Create one</LinkNext>!</span>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {links.map((link) => {
                            const idStr = getIdString(link._id);
                            return (
                                <li key={idStr} className="rounded-lg bg-white/80 dark:bg-gray-900/80 shadow p-4 flex flex-col gap-1 border border-[#232b45]">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-lg">{link.title}</span>
                                        <LinkNext href={`/unlock/${idStr}`} className="text-blue-500 hover:underline text-sm">View</LinkNext>
                                    </div>
                                    <p className="text-gray-500 text-sm line-clamp-2">{link.description}</p>
                                    <span className="text-xs text-gray-400">Created: {link.createdAt ? new Date(link.createdAt).toLocaleString() : ""}</span>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
} 
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import LinkNext from "next/link";
import Image from "next/image";
import CopyButton from "@/components/CopyButton";
import UsernameGenerator from "@/components/UsernameGenerator";
import { IUser } from "@/lib/user.model";
import { ILink } from "@/lib/link.model";

type SessionUser = {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
};

function getIdString(id: unknown): string {
    if (typeof id === "string") return id;
    if (id && typeof id === "object" && "toString" in id) return (id as { toString: () => string }).toString();
    return "";
}

function formatDate(date?: Date) {
    if (!date) return "";
    return new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function PublicProfilePage({ username }: { username: string }) {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<IUser | null>(null);
    const [links, setLinks] = useState<ILink[]>([]);
    const [error, setError] = useState("");

    // Search/filter/sort state
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState("newest");

    useEffect(() => {
        setLoading(true);
        setError("");
        fetch(`/api/profile/${username}`)
            .then(async (res) => {
                if (!res.ok) throw new Error("User not found");
                const data = await res.json();
                setUser(data.user);
                setLinks(data.links);
                setLoading(false);
            })
            .catch(() => {
                setError("User not found");
                setLoading(false);
            });
    }, [username]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mb-4"></div>
                <div className="text-lg font-semibold">Loading profile...</div>
            </div>
        );
    }
    if (error || !user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
                <div className="text-2xl font-bold mb-2">404</div>
                <div className="text-lg">This user profile could not be found.</div>
            </div>
        );
    }

    // Determine if the current user is the owner
    const isOwner = (session?.user as SessionUser)?.username === user.username || (session?.user as SessionUser)?.email === user.email;

    // Filter/sort links
    let filteredLinks = links.filter((link) =>
        link.title.toLowerCase().includes(search.toLowerCase()) ||
        (link.description && link.description.toLowerCase().includes(search.toLowerCase()))
    );
    if (status !== "all") {
        // Placeholder for status filter
    }
    if (sort === "newest") {
        filteredLinks = filteredLinks.sort((a, b) => (b.createdAt && a.createdAt ? +new Date(b.createdAt) - +new Date(a.createdAt) : 0));
    } else if (sort === "oldest") {
        filteredLinks = filteredLinks.sort((a, b) => (a.createdAt && b.createdAt ? +new Date(a.createdAt) - +new Date(b.createdAt) : 0));
    } else if (sort === "title") {
        filteredLinks = filteredLinks.sort((a, b) => a.title.localeCompare(b.title));
    }

    const joinDate = user?.createdAt ? new Date(user.createdAt).toLocaleString("default", { month: "long", year: "numeric" }) : "";
    const lastActive = links[0]?.createdAt ? formatDate(links[0].createdAt) : joinDate;

    return (
        <>
            {!user?.username && <UsernameGenerator />}
            <div className="pt-18 min-h-screen bg-gradient-to-br from-[#10182a] via-[#181f32] to-[#0a0f1c] px-4 py-10">
                {/* Profile Header */}
                <div className="max-w-4xl mx-auto mb-10">
                    <div className="rounded-2xl bg-[#181c1b] shadow-xl p-8 flex flex-col md:flex-row items-center gap-8 border border-[#232b45] relative overflow-hidden">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-5xl font-bold border-4 border-green-400">
                            {user?.name?.[0] || user?.email?.[0] || "U"}
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                            <h1 className="text-3xl font-bold text-white">{user?.name || "Unnamed User"}</h1>
                            <div className="text-lg text-gray-400 font-mono">@{user.username}</div>
                            <div className="text-gray-400 text-base">{user?.bio || "This user hasn't added a bio yet."}</div>
                            <div className="flex gap-6 text-gray-400 text-sm mt-2">
                                <span>Joined {joinDate}</span>
                                <span>•</span>
                                <span>Last active {lastActive}</span>
                            </div>
                        </div>
                        <div className="absolute top-6 right-6 flex gap-2">
                            <LinkNext href={`/${user.username}`} className="bg-[#232b45] p-2 rounded-lg text-gray-300 hover:text-green-400 transition" title="View public profile">
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            </LinkNext>
                            <CopyButton
                                text={`https://linkunlocker.com/${user.username}`}
                                className="bg-[#232b45] p-2 rounded-lg"
                                title="Copy profile URL"
                            />
                        </div>
                    </div>
                </div>
                {/* Content Section */}
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Content by {user?.name || "User"}</h2>
                            <div className="text-gray-400 text-base">{filteredLinks.length} item{filteredLinks.length !== 1 && "s"}</div>
                        </div>
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                placeholder="Search content..."
                                className="px-4 py-2 rounded-lg bg-[#232b45] text-gray-200 border border-[#232b45] focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <select
                                className="px-4 py-2 rounded-lg bg-[#232b45] text-gray-200 font-semibold border border-[#232b45] focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                {/* Add more status options if you add status to links */}
                            </select>
                            <select
                                className="px-4 py-2 rounded-lg bg-[#232b45] text-gray-200 font-semibold border border-[#232b45] focus:outline-none focus:ring-2 focus:ring-green-500"
                                value={sort}
                                onChange={e => setSort(e.target.value)}
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                                <option value="title">Title</option>
                            </select>
                            <button className="px-3 py-2 rounded-lg bg-[#232b45] text-gray-200 font-semibold"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg></button>
                            <button className="px-3 py-2 rounded-lg bg-[#232b45] text-gray-200 font-semibold"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg></button>
                            {isOwner && (
                                <LinkNext href="/dashboard/create" className="ml-2 px-5 py-2 rounded-full bg-green-500 text-white font-bold text-base shadow hover:bg-green-600 transition flex items-center gap-2"><span>+ Create New Content</span></LinkNext>
                            )}
                        </div>
                    </div>
                    {/* Content Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredLinks.map((link) => {
                            const idStr = getIdString(link._id);
                            return (
                                <div key={idStr} className="rounded-2xl bg-[#181c1b] shadow-lg border border-[#232b45] overflow-hidden flex flex-col">
                                    {link.coverImage && (
                                        <Image src={link.coverImage} alt={link.title} width={400} height={225} className="w-full h-48 object-cover" />
                                    )}
                                    <div className="p-4 flex-1 flex flex-col gap-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg font-bold text-white line-clamp-1">{link.title}</span>
                                        </div>
                                        <p className="text-gray-400 text-sm line-clamp-2">{link.description}</p>
                                        <div className="flex items-center gap-4 mt-auto">
                                            <span className="text-xs text-gray-500">{formatDate(link.createdAt)}</span>
                                            {/* Edit/Delete for owner only */}
                                            {isOwner && (
                                                <>
                                                    <button className="text-xs text-blue-400 hover:underline">Edit</button>
                                                    <button className="text-xs text-red-400 hover:underline ml-2">Delete</button>
                                                </>
                                            )}
                                        </div>
                                        <LinkNext href={`/unlock?id=${idStr}`} className="mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition text-center">Unlock</LinkNext>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
} 
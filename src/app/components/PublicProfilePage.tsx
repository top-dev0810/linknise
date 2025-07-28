"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LinkNext from "next/link";
import Image from "next/image";
import CopyButton from "@/components/CopyButton";
import UsernameGenerator from "@/components/UsernameGenerator";
import { IUser } from "@/lib/user.model";
import { ILink } from "@/lib/link.model";
import { FaSearch, FaFilter, FaEye, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

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
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<IUser | null>(null);
    const [links, setLinks] = useState<ILink[]>([]);
    const [error, setError] = useState("");

    // Search/filter/sort state
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState("newest");
    const [showFilters, setShowFilters] = useState(false);

    // Edit/Delete state
    const [deletingLink, setDeletingLink] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState("");

    // Handle Edit
    const handleEdit = (linkId: string) => {
        router.push(`/dashboard/edit/${linkId}`);
    };

    // Handle Delete
    const handleDelete = async (linkId: string) => {
        if (!confirm("Are you sure you want to delete this link? This action cannot be undone.")) {
            return;
        }

        setDeletingLink(linkId);
        setDeleteError("");

        try {
            const res = await fetch(`/api/links/${linkId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (res.ok) {
                // Remove the link from the local state
                setLinks(prevLinks => prevLinks.filter(link => getIdString(link._id) !== linkId));
            } else {
                const data = await res.json();
                setDeleteError(data.message || "Failed to delete link");
            }
        } catch (err) {
            console.error("Error deleting link:", err);
            setDeleteError("Failed to delete link");
        } finally {
            setDeletingLink(null);
        }
    };

    useEffect(() => {
        setLoading(true);
        setError("");
        fetch(`/api/profile?username=${username}`)
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
    const isOwner = (session?.user as SessionUser)?.username === user?.username || (session?.user as SessionUser)?.email === user?.email;

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
            <div className="pt-18 min-h-screen bg-gradient-to-br from-[#10182a] via-[#181f32] to-[#0a0f1c] px-4 py-6 sm:py-10">
                {/* Profile Header */}
                <div className="max-w-4xl mx-auto mb-6 sm:mb-10">
                    <div className="rounded-2xl bg-[#181c1b] shadow-xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 sm:gap-8 border border-[#232b45] relative overflow-hidden">
                        {/* Profile Image */}
                        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl sm:text-5xl font-bold border-4 border-green-400">
                            {user?.name?.[0] || user?.email?.[0] || "U"}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 flex flex-col gap-2 text-center md:text-left">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white">{user?.name || "Unnamed User"}</h1>
                            <div className="text-base sm:text-lg text-gray-400 font-mono">@{user?.username || "user"}</div>
                            <div className="text-gray-400 text-sm sm:text-base">{user?.bio || "This user hasn't added a bio yet."}</div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-gray-400 text-xs sm:text-sm mt-2">
                                <span>Joined {joinDate}</span>
                                <span className="hidden sm:inline">•</span>
                                <span>Last active {lastActive}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-4 right-4 flex gap-2">
                            <LinkNext href={`/public?username=${user?.username || "user"}`} className="bg-[#232b45] p-2 rounded-lg text-gray-300 hover:text-green-400 transition" title="View public profile">
                                <FaEye size={16} />
                            </LinkNext>
                            <CopyButton
                                text={`https://linkunlocker.com/public?username=${user?.username || "user"}`}
                                className="bg-[#232b45] p-2 rounded-lg"
                                title="Copy profile URL"
                            />
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-6xl mx-auto">
                    {/* Header and Controls */}
                    <div className="flex flex-col gap-4 mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Content by {user?.name || "User"}</h2>
                                <div className="text-gray-400 text-sm sm:text-base">{filteredLinks.length} item{filteredLinks.length !== 1 && "s"}</div>
                            </div>

                            {/* Create Button for Owner */}
                            {isOwner && (
                                <LinkNext href="/dashboard/create" className="px-4 sm:px-5 py-2 sm:py-3 rounded-full bg-green-500 text-white font-bold text-sm sm:text-base shadow hover:bg-green-600 transition flex items-center justify-center gap-2">
                                    <FaPlus size={14} />
                                    <span>Create New Content</span>
                                </LinkNext>
                            )}
                        </div>

                        {/* Search and Filters */}
                        <div className="flex flex-col gap-3">
                            {/* Search Bar */}
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search content..."
                                    className="w-full pl-10 pr-4 py-2 sm:py-3 rounded-lg bg-[#232b45] text-gray-200 border border-[#232b45] focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>

                            {/* Filter Controls */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#232b45] text-gray-200 font-semibold border border-[#232b45] focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                >
                                    <FaFilter size={14} />
                                    Filters
                                </button>

                                {showFilters && (
                                    <div className="flex flex-col sm:flex-row gap-3 sm:ml-4">
                                        <select
                                            className="px-3 sm:px-4 py-2 rounded-lg bg-[#232b45] text-gray-200 font-semibold border border-[#232b45] focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                            value={status}
                                            onChange={e => setStatus(e.target.value)}
                                        >
                                            <option value="all">All Status</option>
                                            {/* Add more status options if you add status to links */}
                                        </select>
                                        <select
                                            className="px-3 sm:px-4 py-2 rounded-lg bg-[#232b45] text-gray-200 font-semibold border border-[#232b45] focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                            value={sort}
                                            onChange={e => setSort(e.target.value)}
                                        >
                                            <option value="newest">Newest</option>
                                            <option value="oldest">Oldest</option>
                                            <option value="title">Title</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Error Display */}
                    {deleteError && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <div className="text-red-400 text-sm font-medium">{deleteError}</div>
                        </div>
                    )}

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {filteredLinks.map((link) => {
                            const idStr = getIdString(link._id);
                            return (
                                <div key={idStr} className="rounded-2xl bg-[#181c1b] shadow-lg border border-[#232b45] overflow-hidden flex flex-col">
                                    {link.coverImage && (
                                        <div className="relative h-40 sm:h-48">
                                            <Image
                                                src={link.coverImage}
                                                alt={link.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-4 flex-1 flex flex-col gap-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-base sm:text-lg font-bold text-white line-clamp-1">{link.title}</span>
                                        </div>
                                        <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">{link.description}</p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-xs text-gray-500">{formatDate(link.createdAt)}</span>
                                            {/* Edit/Delete for owner only */}
                                            {isOwner && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(idStr)}
                                                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                                        title="Edit link"
                                                    >
                                                        <FaEdit size={10} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(idStr)}
                                                        disabled={deletingLink === idStr}
                                                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                                                        title="Delete link"
                                                    >
                                                        <FaTrash size={10} />
                                                        {deletingLink === idStr ? "Deleting..." : "Delete"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <LinkNext
                                            href={`/unlock?id=${idStr}`}
                                            className="mt-2 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition text-center text-sm sm:text-base"
                                        >
                                            Unlock
                                        </LinkNext>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Empty State */}
                    {filteredLinks.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-lg mb-2">No content found</div>
                            <div className="text-gray-500 text-sm">
                                {search ? "Try adjusting your search terms" : "This user hasn't created any content yet"}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
} 
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaPlus, FaChartLine, FaEye, FaUnlock, FaLink, FaTrash, FaEdit, FaCopy, FaExternalLinkAlt, FaCalendar } from "react-icons/fa";
import { ILink } from "@/lib/link.model";

interface DashboardClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
  };
}

interface Analytics {
  totalViews: number;
  totalUnlocks: number;
  totalLinks: number;
  conversionRate: number;
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [links, setLinks] = useState<ILink[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalViews: 0,
    totalUnlocks: 0,
    totalLinks: 0,
    conversionRate: 0,
  });
  const [selectedLink, setSelectedLink] = useState<ILink | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await fetch("/api/links");
      if (response.ok) {
        const data = await response.json();
        setLinks(data.links || []);

        // Calculate analytics
        const totalViews = data.links?.reduce((sum: number, link: ILink) => sum + (link.views || 0), 0) || 0;
        const totalUnlocks = data.links?.reduce((sum: number, link: ILink) => sum + (link.unlocks || 0), 0) || 0;
        const totalLinks = data.links?.length || 0;
        const conversionRate = totalViews > 0 ? ((totalUnlocks / totalViews) * 100) : 0;

        setAnalytics({
          totalViews,
          totalUnlocks,
          totalLinks,
          conversionRate: Math.round(conversionRate * 100) / 100,
        });
      }
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (linkId: string) => {
    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setLinks(links.filter(link => link._id !== linkId));
        setShowDeleteModal(false);
        setSelectedLink(null);
      }
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400 text-sm sm:text-base">Welcome back, {user?.name || user?.email}!</p>
        </div>
        <Link href="/dashboard/create">
          <button className="mt-4 sm:mt-0 px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-lg hover:from-green-600 hover:to-blue-600 transition flex items-center gap-2 text-sm sm:text-base">
            <FaPlus /> Create New Link
          </button>
        </Link>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-[rgba(24,28,27,0.85)] backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-[#232b45]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm font-medium">Total Views</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{analytics.totalViews.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <FaEye className="text-blue-400 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-[rgba(24,28,27,0.85)] backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-[#232b45]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm font-medium">Total Unlocks</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{analytics.totalUnlocks.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <FaUnlock className="text-green-400 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-[rgba(24,28,27,0.85)] backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-[#232b45]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm font-medium">Active Links</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{analytics.totalLinks}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <FaLink className="text-purple-400 text-lg sm:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-[rgba(24,28,27,0.85)] backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-[#232b45]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm font-medium">Conversion Rate</p>
              <p className="text-xl sm:text-2xl font-bold text-white">{analytics.conversionRate}%</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <FaChartLine className="text-orange-400 text-lg sm:text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="bg-[rgba(24,28,27,0.85)] backdrop-blur-xl rounded-2xl border border-[#232b45] overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-[#232b45]">
          <h2 className="text-lg sm:text-xl font-bold text-white">Your Links</h2>
        </div>

        {links.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaLink className="text-gray-400 text-xl sm:text-2xl" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2">No links yet</h3>
            <p className="text-gray-400 text-sm sm:text-base mb-6">Create your first unlock link to start growing your audience</p>
            <Link href="/dashboard/create">
              <button className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-lg hover:from-green-600 hover:to-blue-600 transition flex items-center gap-2 mx-auto text-sm sm:text-base">
                <FaPlus /> Create Your First Link
              </button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#232b45]">
            {links.map((link) => (
              <div key={link._id?.toString()} className="p-4 sm:p-6 hover:bg-[#232b45]/20 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Link Image */}
                  <div className="w-20 h-12 sm:w-24 sm:h-16 bg-[#232b45] rounded-lg overflow-hidden flex-shrink-0">
                    {link.coverImage ? (
                      <Image
                        src={link.coverImage}
                        alt={link.title}
                        width={96}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaLink className="text-gray-500 text-sm sm:text-base" />
                      </div>
                    )}
                  </div>

                  {/* Link Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1 truncate">{link.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm mb-2 line-clamp-2">{link.description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaEye /> {link.views || 0} views
                      </span>
                      <span className="flex items-center gap-1">
                        <FaUnlock /> {link.unlocks || 0} unlocks
                      </span>
                      <span className="flex items-center gap-1">
                        <FaCalendar /> {formatDate(link.createdAt || new Date())}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    <button
                      onClick={() => copyToClipboard(`${window.location.origin}/unlock?id=${link._id}`)}
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-400 transition-colors"
                      title="Copy link"
                    >
                      <FaCopy className="text-sm sm:text-base" />
                    </button>
                    <a
                      href={`/unlock?id=${link._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-green-400 transition-colors"
                      title="View link"
                    >
                      <FaExternalLinkAlt className="text-sm sm:text-base" />
                    </a>
                    <Link href={`/dashboard/edit/${link._id}`}>
                      <button className="p-1.5 sm:p-2 text-gray-400 hover:text-yellow-400 transition-colors" title="Edit link">
                        <FaEdit className="text-sm sm:text-base" />
                      </button>
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedLink(link);
                        setShowDeleteModal(true);
                      }}
                      className="p-1.5 sm:p-2 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete link"
                    >
                      <FaTrash className="text-sm sm:text-base" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && selectedLink && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#181c1b] rounded-2xl p-6 max-w-md w-full mx-4 border border-[#232b45]">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Delete Link</h3>
            <p className="text-gray-400 text-sm sm:text-base mb-6">
              Are you sure you want to delete &quot;{selectedLink.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-3 sm:px-4 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 transition text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedLink._id?.toString() || "")}
                className="flex-1 px-3 sm:px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition text-sm sm:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
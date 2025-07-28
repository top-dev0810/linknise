"use client";
import { FaTimes, FaLock, FaEye, FaShare, FaChartLine } from "react-icons/fa";

interface HowItWorksModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#181c1b] rounded-2xl p-6 max-w-md w-full mx-4 border border-[#232b45] max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">How Unlock Links Work</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Step 1 */}
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            1
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-2">Create Your Content</h3>
                            <p className="text-gray-400 text-sm">
                                Upload your content (videos, files, links) and set up unlock actions like &quot;Subscribe to YouTube&quot; or &quot;Follow on Instagram&quot;.
                            </p>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            2
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-2">Share Your Link</h3>
                            <p className="text-gray-400 text-sm">
                                Share your unique unlock link with your audience. When they visit, they&apos;ll see your content preview.
                            </p>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            3
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-2">Users Complete Actions</h3>
                            <p className="text-gray-400 text-sm">
                                Users complete the unlock actions (subscribe, follow, visit) to access your content.
                            </p>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            4
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-2">Grow Your Audience</h3>
                            <p className="text-gray-400 text-sm">
                                Track your growth with real-time analytics and watch your audience expand organically.
                            </p>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="border-t border-[#232b45] pt-6">
                        <h3 className="text-white font-semibold mb-4">Key Features</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <FaLock className="text-blue-400" />
                                <span className="text-gray-300 text-sm">Content Protection</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaEye className="text-green-400" />
                                <span className="text-gray-300 text-sm">Real-time Analytics</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaShare className="text-purple-400" />
                                <span className="text-gray-300 text-sm">Easy Sharing</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaChartLine className="text-orange-400" />
                                <span className="text-gray-300 text-sm">Growth Tracking</span>
                            </div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="border-t border-[#232b45] pt-6">
                        <h3 className="text-white font-semibold mb-4">Pro Tips</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>• Use compelling preview images to attract clicks</li>
                            <li>• Keep unlock actions simple and relevant</li>
                            <li>• Share your links on multiple platforms</li>
                            <li>• Monitor your analytics regularly</li>
                        </ul>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition"
                >
                    Got It!
                </button>
            </div>
        </div>
    );
} 
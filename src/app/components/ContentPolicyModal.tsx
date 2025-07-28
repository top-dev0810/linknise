"use client";
import { FaTimes, FaExclamationTriangle, FaCheckCircle, FaBan } from "react-icons/fa";

interface ContentPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContentPolicyModal({ isOpen, onClose }: ContentPolicyModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#181c1b] rounded-2xl p-6 max-w-md w-full mx-4 border border-[#232b45] max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Content Policy</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Introduction */}
                    <div>
                        <p className="text-gray-300 text-sm mb-4">
                            LinkUnlocker is committed to maintaining a safe and respectful platform for all users. 
                            Please review our content policy to ensure your content complies with our guidelines.
                        </p>
                    </div>

                    {/* Allowed Content */}
                    <div>
                        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <FaCheckCircle className="text-green-400" />
                            Allowed Content
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>• Educational content and tutorials</li>
                            <li>• Creative works (art, music, videos)</li>
                            <li>• Business and professional content</li>
                            <li>• Entertainment and gaming content</li>
                            <li>• Personal blogs and vlogs</li>
                            <li>• Product reviews and recommendations</li>
                        </ul>
                    </div>

                    {/* Prohibited Content */}
                    <div>
                        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <FaBan className="text-red-400" />
                            Prohibited Content
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>• Illegal activities or content</li>
                            <li>• Hate speech or discrimination</li>
                            <li>• Harassment or bullying</li>
                            <li>• Explicit adult content</li>
                            <li>• Violence or graphic content</li>
                            <li>• Copyright infringement</li>
                            <li>• Spam or misleading content</li>
                            <li>• Personal information without consent</li>
                        </ul>
                    </div>

                    {/* Guidelines */}
                    <div>
                        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                            <FaExclamationTriangle className="text-yellow-400" />
                            Guidelines
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>• Respect intellectual property rights</li>
                            <li>• Be honest about your content</li>
                            <li>• Don&apos;t manipulate or deceive users</li>
                            <li>• Follow platform-specific rules</li>
                            <li>• Report violations when you see them</li>
                        </ul>
                    </div>

                    {/* Enforcement */}
                    <div className="border-t border-[#232b45] pt-6">
                        <h3 className="text-white font-semibold mb-3">Enforcement</h3>
                        <p className="text-gray-400 text-sm">
                            Violations of our content policy may result in:
                        </p>
                        <ul className="space-y-1 text-sm text-gray-400 mt-2">
                            <li>• Content removal</li>
                            <li>• Account warnings</li>
                            <li>• Temporary suspension</li>
                            <li>• Permanent account termination</li>
                        </ul>
                    </div>

                    {/* Reporting */}
                    <div className="border-t border-[#232b45] pt-6">
                        <h3 className="text-white font-semibold mb-3">Reporting Violations</h3>
                        <p className="text-gray-400 text-sm">
                            If you encounter content that violates our policy, please report it immediately. 
                            We review all reports and take appropriate action to maintain a safe platform.
                        </p>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition"
                >
                    I Understand
                </button>
            </div>
        </div>
    );
} 
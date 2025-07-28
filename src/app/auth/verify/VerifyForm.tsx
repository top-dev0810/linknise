"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const emailParam = searchParams?.get("email") || "";
    const [email, setEmail] = useState(emailParam);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [showEmailInput, setShowEmailInput] = useState(!emailParam);
    const [codeSent, setCodeSent] = useState(!!emailParam);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState("");

    useEffect(() => {
        if (emailParam) {
            setEmail(emailParam);
            setShowEmailInput(false);
            setCodeSent(true);
        }
    }, [emailParam]);

    async function handleSendCode(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setResendMessage("");
        // Use signup endpoint to send verification code
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, resend: true }),
        });
        setLoading(false);
        if (res.ok) {
            setCodeSent(true);
            setShowEmailInput(false);
            setResendMessage("Verification code sent to your email.");
        } else {
            const data = await res.json();
            setError(data.message || "Failed to send code");
        }
    }

    async function handleResendCode() {
        setResendLoading(true);
        setResendMessage("");
        setError("");
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, resend: true }),
        });
        setResendLoading(false);
        if (res.ok) {
            setResendMessage("Verification code resent to your email.");
        } else {
            const data = await res.json();
            setError(data.message || "Failed to resend code");
        }
    }

    async function handleVerify(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);
        
        const res = await fetch("/api/auth/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code }),
        });
        
        setLoading(false);
        if (res.ok) {
            setSuccess(true);
            setError("");
            
            // After successful verification, redirect to signin page with success message
            setTimeout(() => {
                router.push(`/auth/signin?verified=success&email=${encodeURIComponent(email)}`);
            }, 1500);
        } else {
            const data = await res.json();
            setError(data.message || "Verification failed");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#10182a] px-4 sm:px-6">
            <form
                onSubmit={codeSent ? handleVerify : handleSendCode}
                className="w-full max-w-sm sm:max-w-md bg-[#181f32] rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col gap-4 sm:gap-6 items-center border border-[#232b45]"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-2">Verify Your Email</h1>
                <p className="text-gray-400 text-center mb-2 text-sm sm:text-base">Enter the verification code sent to your email address.</p>
                {success && <div className="text-green-500 text-xs sm:text-sm font-semibold w-full text-center">Email verified! Redirecting to sign in...</div>}
                {error && <div className="text-red-500 text-xs sm:text-sm font-semibold w-full text-center">{error}</div>}
                {resendMessage && <div className="text-green-500 text-xs sm:text-sm font-semibold w-full text-center">{resendMessage}</div>}
                <div className="w-full flex flex-col gap-3 sm:gap-4">
                    {showEmailInput && (
                        <label className="flex flex-col gap-1 text-xs sm:text-sm text-white font-medium">
                            Email address
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                placeholder="you@email.com"
                                className="w-full px-3 sm:px-4 py-2 rounded-md bg-[#232b45] border border-[#232b45] text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-primary transition text-sm sm:text-base"
                            />
                        </label>
                    )}
                    {codeSent && (
                        <label className="flex flex-col gap-1 text-xs sm:text-sm text-white font-medium">
                            Verification Code
                            <input
                                type="text"
                                value={code}
                                onChange={e => setCode(e.target.value)}
                                required
                                placeholder="6-digit code"
                                className="w-full px-3 sm:px-4 py-2 rounded-md bg-[#232b45] border border-[#232b45] text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-primary transition text-sm sm:text-base"
                            />
                        </label>
                    )}
                </div>
                {!codeSent && (
                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full py-2.5 sm:py-3 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-base sm:text-lg shadow hover:from-purple-500 hover:to-blue-500 transition disabled:opacity-60 mt-2"
                    >
                        {loading ? "Sending..." : "Send Code"}
                    </button>
                )}
                {codeSent && (
                    <>
                        <button
                            type="submit"
                            disabled={loading || !code}
                            className="w-full py-2.5 sm:py-3 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-base sm:text-lg shadow hover:from-purple-500 hover:to-blue-500 transition disabled:opacity-60 mt-2"
                        >
                            {loading ? "Verifying..." : "Verify Email"}
                        </button>
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={resendLoading}
                            className="w-full py-2 rounded-md bg-[#232b45] text-white font-semibold text-sm sm:text-base border border-[#232b45] hover:bg-[#20263a] transition mt-2"
                        >
                            {resendLoading ? "Resending..." : "Resend Code"}
                        </button>
                    </>
                )}
            </form>
        </div>
    );
} 
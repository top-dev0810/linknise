"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { Suspense } from "react";
import Link from "next/link";

function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const params = useSearchParams();
    const signupSuccess = params?.get("signup") === "success";
    const verifiedSuccess = params?.get("verified") === "success";
    const emailParam = params?.get("email") || "";

    useEffect(() => {
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [emailParam]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        setLoading(false);
        if (res?.ok) {
            router.push("/dashboard");
        } else {
            // If the error is about verification, redirect to verify page
            if (res?.error === "Please verify your email before signing in.") {
                router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
                return;
            }
            setError(res?.error || "Invalid email or password");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#10182a] px-4 sm:px-6">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm sm:max-w-md bg-[#181f32] rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col gap-4 sm:gap-6 items-center border border-[#232b45]"
            >
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-white mb-2">Sign In</h1>
                <button
                    type="button"
                    onClick={() => signIn("google")}
                    className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg bg-[#232b45] text-white font-semibold text-sm sm:text-base border border-[#232b45] hover:bg-[#20263a] transition"
                >
                    <FcGoogle className="text-lg sm:text-xl" />
                    Continue with Google
                </button>
                <div className="flex items-center w-full gap-2 my-2">
                    <hr className="flex-1 border-[#232b45]" />
                    <span className="text-[#6b7280] text-xs sm:text-sm">or</span>
                    <hr className="flex-1 border-[#232b45]" />
                </div>
                {signupSuccess && <div className="text-green-500 text-xs sm:text-sm font-semibold w-full text-center">Signup successful! Please sign in.</div>}
                {verifiedSuccess && <div className="text-green-500 text-xs sm:text-sm font-semibold w-full text-center">Email verified successfully! Please sign in with your password.</div>}
                {error && <div className="text-red-500 text-xs sm:text-sm font-semibold w-full text-center">{error}</div>}
                <div className="w-full flex flex-col gap-3 sm:gap-4">
                    <label className="flex flex-col gap-1 text-xs sm:text-sm text-white font-medium">
                        <span className="flex items-center gap-2"><span className="material-icons text-sm sm:text-base">mail</span>Email address</span>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            placeholder="you@email.com"
                            className="w-full px-3 sm:px-4 py-2 rounded-md bg-[#232b45] border border-[#232b45] text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-primary transition text-sm sm:text-base"
                        />
                    </label>
                    <label className="flex flex-col gap-1 text-xs sm:text-sm text-white font-medium relative">
                        <span className="flex items-center gap-2"><span className="material-icons text-sm sm:text-base">vpn_key</span>Password</span>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                            className="w-full px-3 sm:px-4 py-2 rounded-md bg-[#232b45] border border-[#232b45] text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-primary transition pr-10 text-sm sm:text-base"
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowPassword(v => !v)}
                            className="absolute right-3 top-8 sm:top-9 text-[#6b7280] hover:text-primary focus:outline-none"
                            aria-label="Toggle password visibility"
                        >
                            <span className="material-icons text-base sm:text-lg">{showPassword ? "visibility_off" : "visibility"}</span>
                        </button>
                    </label>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 sm:py-3 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-base sm:text-lg shadow hover:from-purple-500 hover:to-blue-500 transition disabled:opacity-60 mt-2"
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>
                <div className="text-center text-[#b0b8d1] mt-2 text-xs sm:text-sm">
                    Don&apos;t have an account? <Link href="/auth/signup" className="text-blue-400 font-semibold hover:underline">Sign Up</Link>
                </div>
                {/* Google Material Icons CDN */}
                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
            </form>
        </div>
    );
}

export default function SignIn() {
    return (
        <Suspense>
            <SignInForm />
        </Suspense>
    );
} 
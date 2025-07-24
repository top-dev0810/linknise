"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setError("");
    } else {
      const data = await res.json();
      setError(data.message || "Request failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#10182a]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#181f32] rounded-2xl shadow-2xl p-8 flex flex-col gap-6 items-center border border-[#232b45]"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-2">Forgot Password</h1>
        <p className="text-gray-400 text-center mb-2">Enter your email to receive a password reset code.</p>
        {success && <div className="text-green-500 text-sm font-semibold w-full text-center">If your email is registered and verified, a reset code has been sent.</div>}
        {error && <div className="text-red-500 text-sm font-semibold w-full text-center">{error}</div>}
        <div className="w-full flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-white font-medium">
            Email address
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@email.com"
              className="w-full px-4 py-2 rounded-md bg-[#232b45] border border-[#232b45] text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg shadow hover:from-purple-500 hover:to-blue-500 transition disabled:opacity-60 mt-2"
        >
          {loading ? "Sending..." : "Send Reset Code"}
        </button>
      </form>
    </div>
  );
} 
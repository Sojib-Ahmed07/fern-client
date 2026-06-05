"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    try {
      // 🎯 Better Auth v1.6+ এর জন্য ফ্রন্টঅ্যান্ড ক্লায়েন্ট মেথড
      // এটি সরাসরি ব্যাকঅ্যান্ডের /api/auth/forget-password এন্ডপয়েন্টে রিকোয়েস্ট পাঠাবে
      const { error } = await (authClient as any).forgetPassword({
        email: email.trim(),
        redirectTo: "/auth/reset-password",
      });

      if (error) {
        setError(error.message || "Something went wrong. Please try again.");
      } else {
        setIsSent(true);
      }
    } catch (err: any) {
      console.error("Forget password error:", err);
      setError("Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200/30 px-4">
      <div className="card w-full max-w-md bg-base-100 border border-base-200 shadow-xl rounded-3xl p-6 md:p-8">
        {/* 🔙 ব্যাক টু লগইন বাটন */}
        <Link
          href="/auth/login"
          className="btn btn-ghost btn-xs gap-1 normal-case text-base-content/60 max-w-max mb-4 rounded-lg"
        >
          <ArrowLeft size={14} /> Back to Login
        </Link>

        {!isSent ? (
          <>
            <h2 className="text-2xl font-black text-base-content tracking-tight">
              Forgot Password?
            </h2>
            <p className="text-xs text-base-content/60 mt-1 mb-6">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            {error && (
              <div className="alert alert-error bg-error/10 text-error border-none text-xs rounded-xl py-3 mb-4 font-medium">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label-text font-medium mb-1 text-sm">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="input input-bordered w-full pl-10 rounded-xl focus:input-primary text-sm"
                  />
                  <Mail className="absolute left-3 top-3.5 text-base-content/40 w-4 h-4" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full text-white font-semibold rounded-xl normal-case mt-2 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Sending
                    Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          </>
        ) : (
          /* ✅ Success State (ইমেইল পাঠানো সফল হলে এটি দেখাবে) */
          <div className="text-center py-4 space-y-4">
            <div className="flex justify-center text-success">
              <CheckCircle2 size={56} className="animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-base-content">
              Check your email
            </h2>
            <p className="text-sm text-base-content/70 max-w-sm mx-auto leading-relaxed">
              We have sent a password reset link to{" "}
              <span className="font-semibold text-base-content">{email}</span>.
              Please check your inbox or spam folder.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
